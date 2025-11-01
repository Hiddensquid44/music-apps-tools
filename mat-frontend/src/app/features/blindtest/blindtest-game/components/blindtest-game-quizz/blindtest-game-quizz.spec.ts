import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlindtestGameQuizz } from './blindtest-game-quizz';

describe('BlindtestGameQuizz', () => {
  let component: BlindtestGameQuizz;
  let fixture: ComponentFixture<BlindtestGameQuizz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlindtestGameQuizz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlindtestGameQuizz);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
