import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { scaleSequentialSqrt } from 'd3-scale';
import { interpolateGreens } from 'd3-scale-chromatic';
import { ENERGY_TYPE_COLORS, API_LINKS, GEOJSON_FILE_PATH, API_YEAR_RANGE } from '../../../shared/constants';

@Component({
  selector: 'app-energy-globe',
  standalone: true,
  templateUrl: './energy-globe.component.html',
  styleUrls: ['./energy-globe.component.css'],
  imports: [CommonModule, HttpClientModule],
})
export class EnergyGlobeComponent implements OnInit, OnChanges {
  @Input() energyType: string = 'Fossil Fuels';
  @Input() selectedYear: number = API_YEAR_RANGE['renewable-energy'].max;

  energyRange: [number, number] | null = null;
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
    if (this.dataLoaded && (changes['energyType'] || changes['selectedYear'])) {
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
        this.globeInstance = new Globe(document.getElementById('energyGlobe') as HTMLElement)
          .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
          .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
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
      this.http.get(API_LINKS['renewable-energy']).subscribe((aggregatedData: any) => {
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
    if (!this.globeInstance || !this.geoJsonData) return;

    const values = this.geoJsonData.features.map((feat: any) =>
      this.getEnergyValue(feat, this.energyType, this.selectedYear)
    ).filter((val: number) => val > 0);

    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);

    this.energyRange = [minVal, maxVal];

    const colorScaleFn = ENERGY_TYPE_COLORS[this.energyType];
    this.colorScale = colorScaleFn ? colorScaleFn([minVal, maxVal]) : scaleSequentialSqrt(interpolateGreens).domain([minVal, maxVal]);
    this.legendGradient = this.generateGradientPreview(this.colorScale, minVal, maxVal);

    this.globeInstance
      .polygonsData(this.geoJsonData.features.filter((d: any) => d.properties.ISO_A2 !== 'AQ'))
      .polygonCapColor((feat: any) => this.colorScale(this.getEnergyValue(feat, this.energyType, this.selectedYear)))
      .polygonLabel(({ properties: d }: any) => `
        <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
        ${this.energyType} (${this.selectedYear}): <i>${this.getEnergyValue({ properties: d }, this.energyType, this.selectedYear)}</i> Megawatt (MW)
      `)
      .onPolygonHover((hoverD: any) =>
        this.globeInstance
          .polygonAltitude((d: any) => (d === hoverD ? 0.12 : 0.06))
          .polygonCapColor((d: any) => d === hoverD ? 'yellow' : this.colorScale(this.getEnergyValue(d, this.energyType, this.selectedYear)))
      );
  }

  private generateGradientPreview(scaleFn: (val: number) => string, min: number, max: number): string {
    const steps = 10;
    const colors = Array.from({ length: steps }, (_, i) => {
      const t = min + (i / (steps - 1)) * (max - min);
      return scaleFn(t);
    });
    return `linear-gradient(to right, ${colors.join(', ')})`;
  }

  private getEnergyValue(feature: any, technology: string, year: number): number {
    const data = feature.properties.aggregatedData;
    if (data) {
      const techData = data.technologies.find((tech: any) => tech.name.trim().toLowerCase() === technology.trim().toLowerCase());
      if (techData) {
        const value = techData.yearlyData[`F${year}`];
        return value !== undefined ? Math.round(value) : 0;
      }
    }
    return 0;
  }
}
