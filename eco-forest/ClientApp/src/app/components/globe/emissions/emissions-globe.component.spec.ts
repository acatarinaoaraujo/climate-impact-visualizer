import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionGlobeComponent } from './emissions-globe.component';

describe('EmissionGlobeComponent', () => {
  let component: EmissionGlobeComponent;
  let fixture: ComponentFixture<EmissionGlobeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmissionGlobeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmissionGlobeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
