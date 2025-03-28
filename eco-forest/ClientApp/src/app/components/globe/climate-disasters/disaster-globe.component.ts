import { Component, Input, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { scaleSequentialSqrt } from 'd3-scale';
import { interpolateGreens } from 'd3-scale-chromatic';


@Component({
  selector: 'app-disaster-globe',
  standalone: true,
  templateUrl: './disaster-globe.component.html',
  styleUrls: ['./disaster-globe.component.css'],
  imports: [CommonModule, HttpClientModule],
})
export class DisasterGlobeComponent implements OnChanges {
  @Input() indicatorType: string = 'Climate related disasters frequency, Number of Disasters: Landslide';
  @Input() startYear: number = 1980;
  @Input() endYear: number = 2024;

  private globeInstance: any;
  private geoJsonData: any;

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['indicatorType'] || changes['startYear'] || changes['endYear']) {
      this.updateGlobeVisualization();
    }
  }

  ngAfterViewInit(): void {
    this.loadGlobe();
  }

  private loadGlobe(): void {
    if (typeof window !== 'undefined') {
      import('globe.gl').then((module) => {
        const Globe = module.default;
        this.globeInstance = new Globe(document.getElementById('globeViz') as HTMLElement)
          .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
          .lineHoverPrecision(0)
          .polygonAltitude(0.06)
          .polygonSideColor(() => 'rgba(0, 100, 0, 0.35)')
          .polygonStrokeColor(() => '#111')
          .polygonsTransitionDuration(300);

        this.fetchData();
      });
    }
  }

  private fetchData(): void {
    this.http.get('../../../assets/datasets/ne_110m_admin_0_countries.geojson').subscribe((geoJsonData: any) => {
      this.http.get('http://localhost:5085/api/climatedisasters/aggregated').subscribe((aggregatedData: any) => {
        this.geoJsonData = this.transformData(geoJsonData, aggregatedData);
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
        this.getDisasterNumbers(feat, this.indicatorType, this.startYear, this.endYear)
      );
      const maxVal = Math.max(...values); // Get max value to scale colors correctly

      const colorScale = scaleSequentialSqrt(interpolateGreens).domain([0, maxVal]); // FIX: Define domain

      this.globeInstance
        .polygonsData(this.geoJsonData.features.filter((d: any) => d.properties.ISO_A2 !== 'AQ'))
        .polygonCapColor((feat: any) => colorScale(this.getDisasterNumbers(feat, this.indicatorType, this.startYear, this.endYear)))
        .polygonLabel(({ properties: d }: any) => `
          <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
          ${this.indicatorType} (${this.startYear}-${this.endYear}): <i>${this.getDisasterNumbers({ properties: d }, this.indicatorType, this.startYear, this.endYear)}</i> GWh
        `)
        .onPolygonHover((hoverD: any) =>
          this.globeInstance
            .polygonAltitude((d: any) => (d === hoverD ? 0.12 : 0.06))
            .polygonCapColor((d: any) => d === hoverD ? 'yellow' : colorScale(this.getDisasterNumbers(d, this.indicatorType, this.startYear, this.endYear)))
        );
    }
  }

  private getDisasterNumbers(feature: any, indicators: string, startYear: number, endYear: number): number {
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
        return total;
      }
    }
    return 0;
  }
}
