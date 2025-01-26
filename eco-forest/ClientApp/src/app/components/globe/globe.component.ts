import { Component, AfterViewInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { scaleSequentialSqrt } from 'd3-scale';
import { interpolateYlOrRd } from 'd3-scale-chromatic';

@Component({
  selector: 'app-globe',
  standalone: true,
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.css'],
  imports: [HttpClientModule, CommonModule],
})
export class GlobeComponent implements AfterViewInit {

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      import('globe.gl').then((module) => {
        const Globe = module.default;  // Get the default export
        const colorScale = scaleSequentialSqrt(interpolateYlOrRd);

        const getVal = (feat: any) => feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

        this.http.get('../../../assets/datasets/ne_110m_admin_0_countries.geojson').subscribe((countries: any) => {
          const maxVal = Math.max(...countries.features.map(getVal));
          colorScale.domain([0, maxVal]);

          const globeElement = document.getElementById('globeViz');
          if (globeElement) {
            const world = new Globe(globeElement)
              .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
              .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
              .lineHoverPrecision(0)
              .polygonsData(countries.features.filter((d: any) => d.properties.ISO_A2 !== 'AQ'))
              .polygonAltitude(0.06)
              .polygonCapColor((feat: any) => colorScale(getVal(feat)))
              .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
              .polygonStrokeColor(() => '#111')
              .polygonLabel(({ properties: d }: any) => `
                <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
                GDP: <i>${d.GDP_MD_EST}</i> M$<br/>
                Population: <i>${d.POP_EST}</i>
              `)
              .onPolygonHover((hoverD: any) => world
                .polygonAltitude((d: any) => d === hoverD ? 0.12 : 0.06)
                .polygonCapColor((d: any) => d === hoverD ? 'steelblue' : colorScale(getVal(d)))
              )
              .polygonsTransitionDuration(300);
          }
        });
      });
    }
  }
}
