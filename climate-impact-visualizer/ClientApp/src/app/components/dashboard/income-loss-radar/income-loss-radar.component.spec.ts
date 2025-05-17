import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeLossRadarComponent } from './income-loss-radar.component';

describe('IncomeLossRadarComponent', () => {
  let component: IncomeLossRadarComponent;
  let fixture: ComponentFixture<IncomeLossRadarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeLossRadarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeLossRadarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
