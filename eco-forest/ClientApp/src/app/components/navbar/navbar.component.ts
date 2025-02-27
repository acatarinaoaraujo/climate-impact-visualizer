import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Output() apiTypeChange = new EventEmitter<string>();

  changeApiType(apiType: string) {
    this.apiTypeChange.emit(apiType);
  }
}
