import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { scaleSequentialSqrt } from 'd3-scale';
import { interpolateGreens } from 'd3-scale-chromatic';
import { API_LINKS, API_YEAR_RANGE, GEOJSON_FILE_PATH, INCOME_TYPE_COLORS } from '../../../shared/constants';

@Component({
  selector: 'app-income-globe',
  standalone: true,
  templateUrl: './income-globe.component.html',
  styleUrls: ['./income-globe.component.css'],
  imports: [CommonModule, HttpClientModule],
})
export class IncomeGlobeComponent implements OnChanges, OnInit {
  @Input() variableType: string = 'Acute Climate Damages';
  @Input() startYear: number = API_YEAR_RANGE['income-loss'].min;
  @Input() endYear: number = API_YEAR_RANGE['income-loss'].max;

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
    if (this.dataLoaded && (changes['variableType'] || changes['startYear'] || changes['endYear'])) {
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
        this.globeInstance = new Globe(document.getElementById('incomeGlobe') as HTMLElement)
          .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
          .lineHoverPrecision(0)
          .polygonAltitude(0.06)
          .polygonSideColor(() => 'rgba(0, 100, 0, 0.35)')
          .polygonStrokeColor(() => '#111')
          .polygonsTransitionDuration(300);
          
        this.fetchData(); // Ensure data is fetched initially
      }).catch(err => {
        console.error('Globe loading failed:', err);
      });
    }
  }

  private fetchData(): void {
    console.log('Fetching data...');
    this.http.get(GEOJSON_FILE_PATH).subscribe((geoJsonData: any) => {
      this.http.get(API_LINKS['income-loss']).subscribe((aggregatedData: any) => {
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
        this.getIncomeLosses(feat, this.variableType, this.startYear, this.endYear)
      );
      const minVal = Math.min(...values); // Get min value to scale colors correctly
      const maxVal = Math.max(...values); // Get max value to scale colors correctly

      const colorScaleFn = INCOME_TYPE_COLORS[this.variableType];
      const colorScale = colorScaleFn ? colorScaleFn([minVal, maxVal]) : scaleSequentialSqrt(interpolateGreens).domain([minVal, maxVal]);

      this.globeInstance
        .polygonsData(this.geoJsonData.features.filter((d: any) => d.properties.ISO_A2 !== 'AQ'))
        .polygonCapColor((feat: any) => colorScale(this.getIncomeLosses(feat, this.variableType, this.startYear, this.endYear)))
        .polygonLabel(({ properties: d }: any) => `
          <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
          ${this.variableType} (${this.startYear}-${this.endYear}): <i>${this.getIncomeLosses({ properties: d }, this.variableType, this.startYear, this.endYear)}</i> $USD
        `)
        .onPolygonHover((hoverD: any) =>
          this.globeInstance
            .polygonAltitude((d: any) => (d === hoverD ? 0.12 : 0.06))
            .polygonCapColor((d: any) => d === hoverD ? 'yellow' : colorScale(this.getIncomeLosses(d, this.variableType, this.startYear, this.endYear)))
        );

        this.globeInstance.redraw();
    }
  }

  private getIncomeLosses(feature: any, variables: string, startYear: number, endYear: number): number {
    const data = feature.properties.aggregatedData;
    if (data) {
      const indicatorData = data.variables.find((tech: any) => tech.name.trim().toLowerCase() === variables.trim().toLowerCase());
      if (indicatorData) {
        let total = 0;
        for (let year = startYear; year <= endYear; year++) {
          if (indicatorData.yearlyData[`F${year}`] !== undefined) {
            total += indicatorData.yearlyData[`F${year}`];
          }
        }
        
        total = Math.round(total * 100) / 100;
        return total;
      }
    }
    return 0;
  }
}
