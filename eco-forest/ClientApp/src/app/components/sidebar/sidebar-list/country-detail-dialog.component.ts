import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-country-detail-dialog',
  template: `
    <h1 mat-dialog-title>{{ data.name }}</h1>
    <div mat-dialog-content>
      <!-- Display country details here -->
      <p>Value: {{ data.value }} GWh</p>
      <p>Change: {{ data.rateChange }}%</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="closeDialog()">Close</button>
    </div>
  `,
})
export class CountryDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CountryDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
