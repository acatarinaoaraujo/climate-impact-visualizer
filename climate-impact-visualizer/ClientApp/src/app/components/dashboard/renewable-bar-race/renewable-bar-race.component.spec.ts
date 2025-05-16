import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewableBarRaceComponent } from './renewable-bar-race.component';

describe('RenewableBarRaceComponent', () => {
  let component: RenewableBarRaceComponent;
  let fixture: ComponentFixture<RenewableBarRaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenewableBarRaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewableBarRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
