import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { scaleSequentialSqrt } from 'd3-scale';
import { interpolateGreens } from 'd3-scale-chromatic';
import { API_LINKS, API_YEAR_RANGE, GEOJSON_FILE_PATH, EMISSIONS_TYPE_COLORS } from '../../../shared/constants';


@Component({
  selector: 'app-emission-globe',
  standalone: true,
  templateUrl: './emission-globe.component.html',
  styleUrls: ['./emission-globe.component.css'],
  imports: [CommonModule, HttpClientModule],
})
export class EmissionsGlobeComponent implements OnInit, OnChanges {
  @Input() indicatorType: string = 'Production';
  @Input() selectedYear: number = API_YEAR_RANGE['greenhouse-emissions'].max;

  indicatorRange: [number, number] | null = null;
  legendGradient: string = '';
  colorScale: any = null;

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
        this.globeInstance = new Globe(document.getElementById('emissionGlobe') as HTMLElement)
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
      this.http.get(API_LINKS['greenhouse-emissions']).subscribe((aggregatedData: any) => {
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
        this.getEmissionNumbers(feat, this.indicatorType, this.selectedYear)
      );

      const maxVal = Math.max(...values);
      const minVal = Math.min(...values);
  
      this.indicatorRange = [minVal, maxVal];
  
      const colorScaleFn =  EMISSIONS_TYPE_COLORS[this.indicatorType];
      this.colorScale = colorScaleFn ? colorScaleFn([minVal, maxVal]) : scaleSequentialSqrt(interpolateGreens).domain([minVal, maxVal]);
      this.legendGradient = this.generateGradientPreview(this.colorScale, minVal, maxVal);

      this.globeInstance
        .polygonsData(this.geoJsonData.features.filter((d: any) => d.properties.ISO_A2 !== 'AQ'))
        .polygonCapColor((feat: any) => this.colorScale(this.getEmissionNumbers(feat, this.indicatorType, this.selectedYear)))
        .polygonLabel(({ properties: d }: any) => `
          <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
          ${this.indicatorType} (${this.selectedYear}): <i>${this.getEmissionNumbers({ properties: d }, this.indicatorType, this.selectedYear)}</i> Million Tonnes CO2
        `)
        .onPolygonHover((hoverD: any) =>
          this.globeInstance
            .polygonAltitude((d: any) => (d === hoverD ? 0.12 : 0.06))
            .polygonCapColor((d: any) => d === hoverD ? 'yellow' : this.colorScale(this.getEmissionNumbers(d, this.indicatorType, this.selectedYear)))
        );

      this.globeInstance.redraw();
    }
  }

  private generateGradientPreview(scaleFn: (val: number) => string, min: number, max: number): string {
    const steps = 10;
    const colors = Array.from({ length: steps }, (_, i) => {
      const t = min + (i / (steps - 1)) * (max - min);
      return scaleFn(t);
    });
    return `linear-gradient(to right, ${colors.join(', ')})`;
  }

  private getEmissionNumbers(feature: any, indicators: string, year: number): number {
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
