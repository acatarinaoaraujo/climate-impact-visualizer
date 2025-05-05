import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeGlobeComponent } from './income-globe.component';

describe('IncomeGlobeComponent', () => {
  let component: IncomeGlobeComponent;
  let fixture: ComponentFixture<IncomeGlobeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeGlobeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeGlobeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
