import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyGlobeComponent } from './energy-globe.component';

describe('EnergyGlobeComponent', () => {
  let component: EnergyGlobeComponent;
  let fixture: ComponentFixture<EnergyGlobeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnergyGlobeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergyGlobeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
