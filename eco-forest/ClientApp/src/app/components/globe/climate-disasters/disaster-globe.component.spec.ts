import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisasterGlobeComponent } from './disaster-globe.component';

describe('DisasterGlobeComponent', () => {
  let component: DisasterGlobeComponent;
  let fixture: ComponentFixture<DisasterGlobeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisasterGlobeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisasterGlobeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
