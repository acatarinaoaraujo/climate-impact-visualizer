import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { scaleSequentialSqrt } from 'd3-scale';
import { interpolateGreens } from 'd3-scale-chromatic';

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.css'],
  imports: [CommonModule],
})
export class GlobeComponent implements OnChanges {
  @Input() energyType: string = 'Fossil fuels';
  @Input() startYear: number = 2000;
  @Input() endYear: number = 2025;

  private globeInstance: any;
  private geoJsonData: any;

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['energyType'] || changes['startYear'] || changes['endYear']) {
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
      this.http.get('http://localhost:5085/api/renewableenergy/aggregated').subscribe((aggregatedData: any) => {
        this.geoJsonData = this.transformData(geoJsonData, aggregatedData);
        this.updateGlobeVisualization();
      });
    });
  }

  private transformData(geoJsonData: any, aggregatedData: any): any {
    const countryMapping: { [key: string]: string } = {
      'united states of america': 'united states',
      'russia': 'russian federation',
      'dominican republic': 'dominican rep.',
      'hong kong': 'china, p.r.: hong kong',
      'china': 'china, p.r.: mainland',
      'taiwan': 'taiwan province of china',
      'laos': 'lao people\'s dem. rep.',
      'south korea': 'korea, dem. people\'s rep. of',
      'north korea': 'korea, rep. of',
      //  Timor-Leste, Dem. Rep. of
      'east timor': 'timor-leste, dem. rep. of',
      'brunei': 'brunei darussalam',
      'fiji': 'fiji, rep. of',
      'kazakhstan': 'kazakhstan, rep. of',
      'kyrgyzstan': 'kyrgyz rep.',
      'uzbekistan': 'uzbekistan, rep. of',
      'tajikistan': 'tajikistan, rep. of',
      'afghanistan': 'afghanistan, islamic rep. of',
      'azerbaijan': 'azerbaijan, rep. of',
      'iran': 'iran, islamic rep. of',
      'syria': 'syrian arab rep.',
      'turkey': 'türkiye, rep. of',
      'egypt': 'egypt, arab rep. of',
      'armenia': 'armenia, rep. of',
      'yemen': 'yemen, rep. of',
      'ethiopia': 'ethiopia, the federal dem. rep. of',
      'eritrea': 'eritrea, the state of',
      'tanzania': 'tanzania, united rep. of',
      'democratic republic of the congo': 'congo, dem. rep. of the',
      'central african republic': 'central african rep.',
      'republic of the congo': 'congo, rep. of',
      'mauritius': 'mauritius, islamic rep. of',
      'madagascar': 'madagascar, rep. of',
      'mozambique': 'mozambique, rep. of',
      'equatorial guinea': 'equatorial guinea, rep. of',
      'united republic of tanzania': 'tanzania, united rep. of',
      'south sudan': 'south sudan, rep. of',
      'mauritania': 'mauritania, islamic rep. of',
      'gambia': 'gambia, the',
      'lesotho': 'lesotho, kingdom of',
      'estonia': 'estonia, rep. of',
      'belarus': 'belarus, rep. of',
      'poland': 'poland, rep. of',
      'netherlands': 'netherlands, the',
      'czechia': 'czech rep.',
      'slovakia': 'slovak rep.',
      'slovenia': 'slovenia, rep. of',
      'croatia': 'croatia, rep. of',
      'moldova': 'moldova, rep. of',
      'republic of serbia': 'serbia, rep. of',
      'kosovo': 'kosovo, republic of',
      'macedonia': 'north macedonia, republic of',
      'venezuela': 'venezuela, rep. bolivariana de',
      'the bahamas': 'bahamas, the',
      'falkland islands': 'falkland islands (malvinas)',

    };

    const dataMap = new Map();
    aggregatedData.forEach((item: any) => {
      const normalizedCountry = item.country.trim().toLowerCase();
      dataMap.set(normalizedCountry, item);
    });

    geoJsonData.features.forEach((feature: any) => {
      let geoCountryName = feature.properties.ADMIN.trim().toLowerCase();
      if (countryMapping[geoCountryName]) {
        geoCountryName = countryMapping[geoCountryName]; // Map GeoJSON name to API name
      }
      if (dataMap.has(geoCountryName)) {
        feature.properties.aggregatedData = dataMap.get(geoCountryName);
      }
    });


    return geoJsonData;
  }


  private updateGlobeVisualization(): void {
    if (this.globeInstance && this.geoJsonData) {
      const values = this.geoJsonData.features.map((feat: any) =>
        this.getEnergyValue(feat, this.energyType, this.startYear, this.endYear)
      );
      const maxVal = Math.max(...values); // Get max value to scale colors correctly

      const colorScale = scaleSequentialSqrt(interpolateGreens).domain([0, maxVal]); // FIX: Define domain

      this.globeInstance
        .polygonsData(this.geoJsonData.features.filter((d: any) => d.properties.ISO_A2 !== 'AQ'))
        .polygonCapColor((feat: any) => colorScale(this.getEnergyValue(feat, this.energyType, this.startYear, this.endYear)))
        .polygonLabel(({ properties: d }: any) => `
          <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
          ${this.energyType} (${this.startYear}-${this.endYear}): <i>${this.getEnergyValue({ properties: d }, this.energyType, this.startYear, this.endYear)}</i> GWh
        `)
        .onPolygonHover((hoverD: any) =>
          this.globeInstance
            .polygonAltitude((d: any) => (d === hoverD ? 0.12 : 0.06))
            .polygonCapColor((d: any) => d === hoverD ? 'yellow' : colorScale(this.getEnergyValue(d, this.energyType, this.startYear, this.endYear)))
        );
    }
  }


  private getEnergyValue(feature: any, technology: string, startYear: number, endYear: number): number {
    const data = feature.properties.aggregatedData;
    if (data) {
      const techData = data.technologies.find((tech: any) => tech.technology.trim().toLowerCase() === technology.trim().toLowerCase());
      if (techData) {
        let total = 0;
        for (let year = startYear; year <= endYear; year++) {
          if (techData.yearlyData[`F${year}`] !== undefined) {
            total += techData.yearlyData[`F${year}`];
          }
        }
        return total;
      }
    }
    return 0;
  }
}
