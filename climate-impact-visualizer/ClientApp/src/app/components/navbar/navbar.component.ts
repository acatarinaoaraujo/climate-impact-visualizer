import { Component, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Output() apiTypeChange = new EventEmitter<string>();

  toggleDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
  

  changeApiType(apiType: string) {
    this.apiTypeChange.emit(apiType);
  }
}
