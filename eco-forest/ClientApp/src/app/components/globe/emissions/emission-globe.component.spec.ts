import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionsGlobeComponent } from './emission-globe.component';

describe('EmissionGlobeComponent', () => {
  let component: EmissionsGlobeComponent;
  let fixture: ComponentFixture<EmissionsGlobeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmissionsGlobeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmissionsGlobeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
