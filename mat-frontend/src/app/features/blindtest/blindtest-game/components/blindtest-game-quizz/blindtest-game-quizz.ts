import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Track } from '../../../../../shared/models/track';
import { interval } from 'rxjs';
import { Utils } from '../../../../../shared/utils';

@Component({
  selector: 'app-blindtest-game-quizz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blindtest-game-quizz.html',
  styleUrl: './blindtest-game-quizz.css'
})
export class BlindtestGameQuizz implements OnInit {

  @Input() goodTrack: Track = new Track();
  @Input() wrongTracksName: string[] = [];

  @Output() trackScore: EventEmitter<number> = new EventEmitter<number>();

  proposals: string[] = [];
  score = 100;
  intervalId: NodeJS.Timeout | undefined;

  constructor() {
    console.log('BlindtestGameQuizz constructor called');
  }

  ngOnInit() {
    console.log('BlindtestGameQuizz ngOnInit called');

    // Add the wrong and good track names to proposals
    this.proposals.push(...this.wrongTracksName);
    this.proposals.push(this.goodTrack.name);
    this.proposals = Utils.shuffleArray(this.proposals);
    this.countScoreDown();
  }

  async countScoreDown() {
    this.intervalId ??= setInterval(() => {
      this.score--;
      if (this.score === 0) {
        clearInterval(this.intervalId);
        return;
      }
    }, 100);
  }
  
  selectProposal(index: number): void {
    const selectedProposal = this.proposals[index];
    console.log('Selected proposal:', selectedProposal);
    if (selectedProposal === this.goodTrack.name) {
      console.log('Correct answer!');
      console.log(this.score);
      clearInterval(this.intervalId);
      this.trackScore.emit(this.score);
    } else {
      console.log('Wrong answer.');
    }
  }
}
