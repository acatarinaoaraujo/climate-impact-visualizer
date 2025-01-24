import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobeComponent } from './components/globe/globe.component';  // Import GlobeComponent

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobeComponent],  // Keep RouterOutlet and add GlobeComponent
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client-app';
}
