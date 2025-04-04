import { Component, Input, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { scaleSequentialSqrt } from 'd3-scale';
import { interpolateGreens } from 'd3-scale-chromatic';


@Component({
  selector: 'app-forest-globe',
  standalone: true,
  templateUrl: './forest-globe.component.html',
  styleUrls: ['./forest-globe.component.css'],
  imports: [CommonModule, HttpClientModule],
})
export class ForestGlobeComponent implements OnChanges {
  @Input() indicatorType: string = 'Forest Area';
  @Input() startYear: number = 1992;
  @Input() endYear: number = 2022;

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
        this.globeInstance = new Globe(document.getElementById('forestGlobe') as HTMLElement)
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
      this.http.get('http://localhost:5085/api/forestcarbon/aggregated').subscribe((aggregatedData: any) => {
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
        this.getForestNumbers(feat, this.indicatorType, this.startYear, this.endYear)
      );
      const maxVal = Math.max(...values); // Get max value to scale colors correctly
  
      const colorScale = scaleSequentialSqrt(interpolateGreens).domain([0, maxVal]); // FIX: Define domain
  
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
    }
  }
  
  private getUnitForIndicator(indicatorType: string): string {
    const unitMapping: { [key: string]: string } = {
      'Carbon Stocks In Forests': '(Million Tonnes)',
      'Forest Area': '(1000 Hectares)',
      'Index Of Carbon Stocks in forests': '(Index)',
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
        return total;
      }
    }
    return 0;
  }
}
