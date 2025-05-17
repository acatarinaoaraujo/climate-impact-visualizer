import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForestCarbonTreemapComponent } from './forest-carbon-treemap.component';

describe('ForestCarbonTreemapComponent', () => {
  let component: ForestCarbonTreemapComponent;
  let fixture: ComponentFixture<ForestCarbonTreemapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForestCarbonTreemapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForestCarbonTreemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
