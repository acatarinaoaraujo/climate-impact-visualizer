import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';

/**
 * @title Autosize sidenav
 */
@Component({
  selector: 'sidebar',
  standalone: true,
  templateUrl: 'sidebar.component.html',
  styleUrl: 'sidebar.component.css',
  imports: [MatSidenavModule, MatButtonModule],
})
export class SidebarComponent {
  showFiller = false;
}