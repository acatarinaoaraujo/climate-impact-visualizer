import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { scaleSequentialSqrt } from 'd3-scale';
import { interpolateGreens } from 'd3-scale-chromatic'; 
import { FOREST_TYPE_COLORS,  API_LINKS, API_YEAR_RANGE, GEOJSON_FILE_PATH } from '../../../shared/constants'; 

interface LegendData {
  title: string;
  subtitle: string;
  legendItems: { color: string; label: string }[];
}

@Component({
  selector: 'app-forest-globe',
  standalone: true,
  templateUrl: './forest-globe.component.html',
  styleUrls: ['./forest-globe.component.css'],
  imports: [CommonModule, HttpClientModule],
})


export class ForestGlobeComponent implements OnInit, OnChanges {
  @Input() indicatorType: string = 'Share Of Forest Area';
  @Input() selectedYear: number = API_YEAR_RANGE['forest-carbon'].max;

  indicatorRange: [number, number] | null = null;
  legendGradient: string = '';
  colorScale: any = null;

  public currentUnit: string = '';
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
    if (this.dataLoaded && (changes['indicatorType'] || changes['selectedYear'])) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.updateGlobeVisualization();
      }, 300);
    }
  }
  
  private loadGlobe(): void {
    if (typeof window !== 'undefined') {
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
        this.getForestNumbers(feat, this.indicatorType, this.selectedYear)
      );
      const minVal = Math.min(...values); // Get min value to scale colors correctly
      const maxVal = Math.max(...values); // Get max value to scale colors correctly

      this.currentUnit = this.getUnitForIndicator(this.indicatorType);
  
      this.indicatorRange = [minVal, maxVal];

      const colorScaleFn = FOREST_TYPE_COLORS[this.indicatorType];
  
      this.colorScale = colorScaleFn ? colorScaleFn([minVal, maxVal]) : scaleSequentialSqrt(interpolateGreens).domain([minVal, maxVal]);
      this.legendGradient = this.generateGradientPreview(this.colorScale, minVal, maxVal);


      this.globeInstance
        .polygonsData(this.geoJsonData.features.filter((d: any) => d.properties.ISO_A2 !== 'AQ'))
        .polygonCapColor((feat: any) => this.colorScale(this.getForestNumbers(feat, this.indicatorType, this.selectedYear)))
        .polygonLabel(({ properties: d }: any) => {
          const unit = this.getUnitForIndicator(this.indicatorType); // Get the dynamic unit
          return `
            <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
            ${this.indicatorType} (${this.selectedYear}): <i>${this.getForestNumbers({ properties: d }, this.indicatorType, this.selectedYear)}</i> ${unit}
          `;
        })
        .onPolygonHover((hoverD: any) =>
          this.globeInstance
            .polygonAltitude((d: any) => (d === hoverD ? 0.12 : 0.06))
            .polygonCapColor((d: any) => d === hoverD ? 'yellow' : this.colorScale(this.getForestNumbers(d, this.indicatorType, this.selectedYear)))
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

  private generateGradientPreview(scaleFn: (val: number) => string, min: number, max: number): string {
    const steps = 10;
    const colors = Array.from({ length: steps }, (_, i) => {
      const t = min + (i / (steps - 1)) * (max - min);
      return scaleFn(t);
    });
    return `linear-gradient(to right, ${colors.join(', ')})`;
  }

  
  private getForestNumbers(feature: any, indicators: string, year: number): number {
    const data = feature.properties.aggregatedData;
    if (data) {
      const indicatorData = data.indicators.find((tech: any) => tech.name.trim().toLowerCase() === indicators.trim().toLowerCase());
      if (indicatorData) {
        const value = indicatorData.yearlyData[`F${year}`];
        return value !== undefined ? Math.round(value) : 0;
      }
    }
    return 0;
  }
}
