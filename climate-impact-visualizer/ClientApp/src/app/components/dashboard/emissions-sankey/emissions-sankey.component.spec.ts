import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionsSankeyComponent } from './emissions-sankey.component';

describe('EmissionsSankeyComponent', () => {
  let component: EmissionsSankeyComponent;
  let fixture: ComponentFixture<EmissionsSankeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmissionsSankeyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmissionsSankeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
