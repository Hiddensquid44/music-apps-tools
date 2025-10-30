import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlindtestGame } from './blindtest-game';

describe('BlindtestGame', () => {
  let component: BlindtestGame;
  let fixture: ComponentFixture<BlindtestGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlindtestGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlindtestGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
