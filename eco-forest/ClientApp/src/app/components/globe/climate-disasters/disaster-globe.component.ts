import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { scaleSequentialSqrt } from 'd3-scale';
import { interpolateGreens } from 'd3-scale-chromatic';
import { API_LINKS, API_YEAR_RANGE, DISASTER_TYPE_COLORS, GEOJSON_FILE_PATH } from '../../../shared/constants'; // Adjust the import path as needed


@Component({
  selector: 'app-disaster-globe',
  standalone: true,
  templateUrl: './disaster-globe.component.html',
  styleUrls: ['./disaster-globe.component.css'],
  imports: [CommonModule, HttpClientModule],
})
export class DisasterGlobeComponent implements OnInit, OnChanges {
  @Input() indicatorType: string = 'Drought';
  @Input() selectedYear: number = API_YEAR_RANGE['climate-disasters'].max;

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
    if (this.dataLoaded && (changes['indicatorType'] || changes['selectedYaer'])) {
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
        this.globeInstance = new Globe(document.getElementById('disasterGlobe') as HTMLElement)
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
      this.http.get(API_LINKS['climate-disasters']).subscribe((aggregatedData: any) => {
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
        this.getDisasterNumbers(feat, this.indicatorType, this.selectedYear)
      );

      const minVal = Math.min(...values); 
      const maxVal = Math.max(...values); 

      this.indicatorRange = [minVal, maxVal];

      const colorScaleFn = DISASTER_TYPE_COLORS[this.indicatorType];
      this.colorScale = colorScaleFn ? colorScaleFn([minVal, maxVal]) : scaleSequentialSqrt(interpolateGreens).domain([minVal, maxVal]);
      this.legendGradient = this.generateGradientPreview(this.colorScale, minVal, maxVal);

      this.globeInstance
        .polygonsData(this.geoJsonData.features.filter((d: any) => d.properties.ISO_A2 !== 'AQ'))
        .polygonCapColor((feat: any) => this.colorScale(this.getDisasterNumbers(feat, this.indicatorType, this.selectedYear)))
        .polygonLabel(({ properties: d }: any) => `
          <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
          ${this.indicatorType} (${this.selectedYear}): <i>${this.getDisasterNumbers({ properties: d }, this.indicatorType, this.selectedYear)} </i> 
        `)
        .onPolygonHover((hoverD: any) =>
          this.globeInstance
            .polygonAltitude((d: any) => (d === hoverD ? 0.12 : 0.06))
            .polygonCapColor((d: any) => d === hoverD ? 'yellow' : this.colorScale(this.getDisasterNumbers(d, this.indicatorType, this.selectedYear)))
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

  private getDisasterNumbers(feature: any, indicators: string, year: number): number {
    const data = feature.properties.aggregatedData;
    if (data) {
      const indicatorData = data.indicators.find((tech: any) => tech.name.trim().toLowerCase() === indicators.trim().toLowerCase());
      if (indicatorData) {
        const value = indicatorData.yearlyData[`F${year}`];
        return value !== undefined ? value : 0;
      }
    }
    return 0;
  }
}
