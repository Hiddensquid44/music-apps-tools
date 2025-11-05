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

  @Output() goodAnswerSelected: EventEmitter<boolean> = new EventEmitter<boolean>();

  proposals: string[] = [];

  constructor() {
    console.log('BlindtestGameQuizz constructor called');
  }

  ngOnInit() {
    console.log('BlindtestGameQuizz ngOnInit called');

    // Add the wrong and good track names to proposals
    this.proposals.push(...this.wrongTracksName);
    this.proposals.push(this.goodTrack.name);
    this.proposals = Utils.shuffleArray(this.proposals);
  }

  selectProposal(index: number): void {
    const selectedProposal = this.proposals[index];
    console.log('Selected proposal:', selectedProposal);
    if (selectedProposal === this.goodTrack.name) {
      console.log('Correct answer!');
      console.log('Proceeding to next track...');
      interval(500).subscribe(() => {
        this.goodAnswerSelected.emit(true);
      });
    } else {
      console.log('Wrong answer.');
    }
  }
}
