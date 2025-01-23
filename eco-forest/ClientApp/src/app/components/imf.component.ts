import { Component, OnInit } from '@angular/core';
import { ImfService } from '../services/imf.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-imf',
  templateUrl: './imf.component.html',
  standalone: true,
  imports: [CommonModule]  // Ensure CommonModule is imported
})
export class ImfComponent implements OnInit {
  data: any;

  constructor(private imfService: ImfService) {}

  ngOnInit(): void {
    this.imfService.getData().subscribe((response) => {
      this.data = response;
    });
  }
}
