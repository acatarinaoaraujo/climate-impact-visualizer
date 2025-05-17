import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewableMultilineChartComponent } from './renewable-multiline-chart.component';

describe('RenewableMultilineChartComponent', () => {
  let component: RenewableMultilineChartComponent;
  let fixture: ComponentFixture<RenewableMultilineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenewableMultilineChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewableMultilineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
