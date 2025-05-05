import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForestGlobeComponent } from './forest-globe.component';

describe('ForestGlobeComponent', () => {
  let component: ForestGlobeComponent;
  let fixture: ComponentFixture<ForestGlobeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForestGlobeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForestGlobeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
