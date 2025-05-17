import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { scaleSequentialSqrt } from 'd3-scale';
import { interpolateGreens } from 'd3-scale-chromatic';
import {
  API_LINKS,
  API_YEAR_RANGE,
  GEOJSON_FILE_PATH,
  INCOME_TYPE_COLORS,
} from '../../../shared/constants';
import { transformData, generateGradientPreview } from '../../../utils/helpers';

@Component({
  selector: 'app-income-globe',
  standalone: true,
  templateUrl: './income-globe.component.html',
  styleUrls: ['./income-globe.component.css'],
  imports: [CommonModule, HttpClientModule],
})
export class IncomeGlobeComponent implements OnChanges, OnInit {
  @Input() variableType: string = 'Acute Climate Damages';
  @Input() selectedYear: number = API_YEAR_RANGE['income-loss'].max;

  variableRange: [number, number] | null = null;
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
    if (
      this.dataLoaded &&
      (changes['variableType'] || changes['selectedYear'])
    ) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.reinitializeGlobe();
      }, 300);
    }
  }

  private loadGlobe(): void {
    if (typeof window !== 'undefined') {
      import('globe.gl')
        .then((module) => {
          const Globe = module.default;
          this.globeInstance = new Globe(
            document.getElementById('incomeGlobe') as HTMLElement
          )
            .globeImageUrl(
              '//unpkg.com/three-globe/example/img/earth-night.jpg'
            )
            .backgroundImageUrl(
              '//unpkg.com/three-globe/example/img/night-sky.png'
            )
            .lineHoverPrecision(0)
            .polygonAltitude(0.06)
            .polygonSideColor(() => 'rgba(0, 100, 0, 0.35)')
            .polygonStrokeColor(() => '#111')
            .polygonsTransitionDuration(300);

          this.fetchData();
        })
        .catch((err) => {
          console.error('Globe loading failed:', err);
        });
    }
  }

  private fetchData(): void {
    console.log('Fetching data...');
    this.http.get(GEOJSON_FILE_PATH).subscribe((geoJsonData: any) => {
      this.http
        .get(API_LINKS['income-loss'])
        .subscribe((aggregatedData: any) => {
          this.geoJsonData = transformData(geoJsonData, aggregatedData);
          this.aggregatedData = aggregatedData;
          this.dataLoaded = true;
          this.updateGlobeVisualization();
        });
    });
  }

  private updateGlobeVisualization(): void {
    if (!this.globeInstance || !this.geoJsonData) return;

    const values = this.geoJsonData.features
      .map((feat: any) =>
        this.getIncomeLosses(feat, this.variableType, this.selectedYear)
      )
      .filter((val: number) => !isNaN(val));

    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);

    this.variableRange = [minVal, maxVal];

    const colorScaleFn = INCOME_TYPE_COLORS[this.variableType];
    this.colorScale = colorScaleFn
      ? colorScaleFn([minVal, maxVal])
      : scaleSequentialSqrt(interpolateGreens).domain([minVal, maxVal]);
    this.legendGradient = generateGradientPreview(
      this.colorScale,
      minVal,
      maxVal
    );

    this.globeInstance
      .polygonsData(
        this.geoJsonData.features.filter(
          (d: any) => d.properties.ISO_A2 !== 'AQ'
        )
      )
      .polygonCapColor((feat: any) =>
        this.colorScale(
          this.getIncomeLosses(feat, this.variableType, this.selectedYear)
        )
      )
      .polygonLabel(
        ({ properties: d }: any) => `
        <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
        ${this.variableType} (${this.selectedYear}): <i>${this.getIncomeLosses(
          { properties: d },
          this.variableType,
          this.selectedYear
        )}</i> % of GDP 
      `
      )
      .onPolygonHover((hoverD: any) =>
        this.globeInstance
          .polygonAltitude((d: any) => (d === hoverD ? 0.12 : 0.06))
          .polygonCapColor((d: any) =>
            d === hoverD
              ? 'yellow'
              : this.colorScale(
                  this.getIncomeLosses(d, this.variableType, this.selectedYear)
                )
          )
      );
  }

  private getIncomeLosses(
    feature: any,
    variables: string,
    year: number
  ): number {
    const data = feature.properties.aggregatedData;
    if (data) {
      const indicatorData = data.variables.find(
        (variable: any) =>
          variable.name.trim().toLowerCase() === variables.trim().toLowerCase()
      );
      if (indicatorData) {
        const value = indicatorData.yearlyData[`F${year}`];
        return value !== undefined ? value.toFixed(3) : 0;
      }
    }
    return 0;
  }

  private reinitializeGlobe(): void {
    if (this.globeInstance) {
      this.globeInstance = null;
    }

    this.loadGlobe();
  }
}
