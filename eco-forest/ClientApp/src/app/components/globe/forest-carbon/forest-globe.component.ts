import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { scaleSequentialSqrt } from 'd3-scale';
import { interpolateGreens } from 'd3-scale-chromatic'; 
import { FOREST_TYPE_COLORS,  API_LINKS, API_YEAR_RANGE, GEOJSON_FILE_PATH } from '../../../shared/constants'; 

@Component({
  selector: 'app-forest-globe',
  standalone: true,
  templateUrl: './forest-globe.component.html',
  styleUrls: ['./forest-globe.component.css'],
  imports: [CommonModule, HttpClientModule],
})
export class ForestGlobeComponent implements OnInit, OnChanges {
  @Input() indicatorType: string = 'Share Of Forest Area';
  @Input() startYear: number = API_YEAR_RANGE['forest-carbon'].min;
  @Input() endYear: number = API_YEAR_RANGE['forest-carbon'].max;

  private globeInstance: any;
  private geoJsonData: any;
  private aggregatedData: any;
  private dataLoaded = false;
  private debounceTimeout: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadGlobe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes detected:', changes);
    if (this.dataLoaded && (changes['indicatorType'] || changes['startYear'] || changes['endYear'])) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        console.log('Updating globe visualization...');
        this.updateGlobeVisualization();
      }, 300);
    }
  }
  
  private loadGlobe(): void {
    if (typeof window !== 'undefined') {
      console.log('Loading globe...');
      import('globe.gl').then((module) => {
        const Globe = module.default;
        this.globeInstance = new Globe(document.getElementById('forestGlobe') as HTMLElement)
          .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
          .lineHoverPrecision(0)
          .polygonAltitude(0.06)
          .polygonSideColor(() => 'rgba(0, 100, 0, 0.35)')
          .polygonStrokeColor(() => '#111')
          .polygonsTransitionDuration(300);
          
        this.fetchData(); 
      }).catch(err => {
        console.error('Globe loading failed:', err);
      });
    }
  }

  private fetchData(): void {
    console.log('Fetching data...');
    this.http.get(GEOJSON_FILE_PATH).subscribe((geoJsonData: any) => {
      this.http.get(API_LINKS['forest-carbon']).subscribe((aggregatedData: any) => {
        this.geoJsonData = this.transformData(geoJsonData, aggregatedData);
        this.aggregatedData = aggregatedData;
        this.dataLoaded = true;
        this.updateGlobeVisualization();
      });
    });
  }

  private transformData(geoJsonData: any, aggregatedData: any): any {
    const dataMap = new Map();
    aggregatedData.forEach((item: any) => {

      const normalizedIso2 = item.isO2.trim().toLowerCase();
      dataMap.set(normalizedIso2, item);
    });

    geoJsonData.features.forEach((feature: any) => {
      const geoIso2 = feature.properties.ISO_A2.trim().toLowerCase();
      if (dataMap.has(geoIso2)) {
        feature.properties.aggregatedData = dataMap.get(geoIso2);
      }
    });

    return geoJsonData;
  }

  private updateGlobeVisualization(): void {
    if (this.globeInstance && this.geoJsonData) {
      const values = this.geoJsonData.features.map((feat: any) =>
        this.getForestNumbers(feat, this.indicatorType, this.startYear, this.endYear)
      );
      const maxVal = Math.max(...values); // Get max value to scale colors correctly
  
            const colorScaleFn = FOREST_TYPE_COLORS[this.indicatorType];
            console.log(colorScaleFn);
            const colorScale = colorScaleFn ? colorScaleFn([0, maxVal]) : scaleSequentialSqrt(interpolateGreens).domain([0, maxVal]);
  
      this.globeInstance
        .polygonsData(this.geoJsonData.features.filter((d: any) => d.properties.ISO_A2 !== 'AQ'))
        .polygonCapColor((feat: any) => colorScale(this.getForestNumbers(feat, this.indicatorType, this.startYear, this.endYear)))
        .polygonLabel(({ properties: d }: any) => {
          const unit = this.getUnitForIndicator(this.indicatorType); // Get the dynamic unit
          return `
            <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
            ${this.indicatorType} (${this.startYear}-${this.endYear}): <i>${this.getForestNumbers({ properties: d }, this.indicatorType, this.startYear, this.endYear)}</i> ${unit}
          `;
        })
        .onPolygonHover((hoverD: any) =>
          this.globeInstance
            .polygonAltitude((d: any) => (d === hoverD ? 0.12 : 0.06))
            .polygonCapColor((d: any) => d === hoverD ? 'yellow' : colorScale(this.getForestNumbers(d, this.indicatorType, this.startYear, this.endYear)))
        );

      this.globeInstance.redraw();
    }
  }
  
  private getUnitForIndicator(indicatorType: string): string {
    const unitMapping: { [key: string]: string } = {
      'Carbon Stocks In Forests': '(Million Tonnes)',
      'Forest Area': '(1000 Hectares)',
      'Index Of Carbon Stocks In Forests': '(Index)',
      'Index Of Forest Extent': '(Index)',
      'Land Area': '1000 Hectares',
      'Share Of Forest Area': '%'
    };
  
    return unitMapping[indicatorType] || ''; // Default to empty string if no match
  }
  
  private getForestNumbers(feature: any, indicators: string, startYear: number, endYear: number): number {
    const data = feature.properties.aggregatedData;
    if (data) {
      const indicatorData = data.indicators.find((tech: any) => tech.name.trim().toLowerCase() === indicators.trim().toLowerCase());
      if (indicatorData) {
        let total = 0;
        for (let year = startYear; year <= endYear; year++) {
          if (indicatorData.yearlyData[`F${year}`] !== undefined) {
            total += indicatorData.yearlyData[`F${year}`];
          }
        }

        total = indicators === 'Share Of Forest Area' ? total : Math.round(total * 100) / 100;
        return total;
      }
    }
    return 0;
  }
}
