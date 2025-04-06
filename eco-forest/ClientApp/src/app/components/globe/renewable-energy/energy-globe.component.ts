import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { scaleSequentialSqrt } from 'd3-scale';
import { interpolateGreens, interpolateInferno, interpolateWarm, interpolateYlOrRd } from 'd3-scale-chromatic';

@Component({
  selector: 'app-energy-globe',
  templateUrl: './energy-globe.component.html',
  styleUrls: ['./energy-globe.component.css'],
  imports: [CommonModule],
})
export class EnergyGlobeComponent implements OnInit, OnChanges {
  @Input() energyType: string = 'Fossil Fuels';
  @Input() startYear: number = 2000;
  @Input() endYear: number = 2025;

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
    if (this.dataLoaded && (changes['energyType'] || changes['startYear'] || changes['endYear'])) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        console.log('Updating globe visualization...');
        this.updateGlobeVisualization();
      }, 300);
    }
  }
  
  
  private resetGlobe() {
    // Destroy and reinitialize globe instance if necessary
    if (this.globeInstance) {
      this.globeInstance = null;
    }
    this.loadGlobe();
  }
  
  private loadGlobe(): void {
    if (typeof window !== 'undefined') {
      console.log('Loading globe...');
      import('globe.gl').then((module) => {
        const Globe = module.default;
        this.globeInstance = new Globe(document.getElementById('energyGlobe') as HTMLElement)
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
    this.http.get('../../../assets/datasets/ne_110m_admin_0_countries.geojson').subscribe((geoJsonData: any) => {
      console.log('GeoJson Data:', geoJsonData);
      this.http.get('http://localhost:5085/api/renewableenergy/aggregated').subscribe((aggregatedData: any) => {
        console.log('Aggregated Data:', aggregatedData);
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
        this.getEnergyValue(feat, this.energyType, this.startYear, this.endYear)
      );
      const maxVal = Math.max(...values); // Get max value to scale colors correctly
  
      let colorScale: any;
      if (this.energyType === 'Fossil Fuels') {
        // Use orange to red scale for Fossil Fuels
        colorScale = scaleSequentialSqrt(interpolateYlOrRd).domain([0, maxVal]); // You can choose interpolateOranges or a custom scale
      } else {
        // Use green scale for other energy types
        colorScale = scaleSequentialSqrt(interpolateGreens).domain([0, maxVal]);
      }
  
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
  
      // Set polygon side color depending on energy type
      this.globeInstance
        .polygonSideColor((feat: any) => {
          if (this.energyType === 'Fossil Fuels') {
            return 'rgba(255, 69, 0, 0.35)'; // Orange color for Fossil Fuels
          } else {
            return 'rgba(0, 100, 0, 0.35)'; // Green color for other energy types
          }
        });
    }
  }
  

  private getEnergyValue(feature: any, technology: string, startYear: number, endYear: number): number {
    const data = feature.properties.aggregatedData;
    if (data) {
      const techData = data.technologies.find((tech: any) => tech.name.trim().toLowerCase() === technology.trim().toLowerCase());
      if (techData) {
        let total = 0;
        for (let year = startYear; year <= endYear; year++) {
          if (techData.yearlyData[`F${year}`] !== undefined) {
            total += techData.yearlyData[`F${year}`];
          }
        }
        total = Math.round(total * 100) / 100;
        return total;
      }
    }
    return 0;
  }
}
