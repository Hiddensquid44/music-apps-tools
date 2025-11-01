import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Track } from '../../../../../shared/models/track';

@Component({
  selector: 'app-blindtest-game-quizz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blindtest-game-quizz.html',
  styleUrl: './blindtest-game-quizz.css'
})
export class BlindtestGameQuizz implements OnInit {

  @Input() track: Track = new Track();
  @Input() playlistTracks: Track[] = [];

  proposals: string[] = [];

  constructor() {
    console.log('BlindtestGameQuizz constructor called');
  }

  ngOnInit() {
    console.log('BlindtestGameQuizz ngOnInit called');
    console.log('Current track:', this.track);
    console.log('Playlist tracks:', this.playlistTracks);
    const currentTrackPlaylistIndex = this.playlistTracks.findIndex(t => t.id === this.track.id);
    const notPlayedTracks = this.playlistTracks.filter((_, index) => index > currentTrackPlaylistIndex - 1);
    
    // Shuffle the track names and take the first 4
    const shuffledNames = this.shuffleArray(notPlayedTracks.map(track => track.name));
    const selectedNames = shuffledNames.slice(0, Math.min(4, shuffledNames.length));
    
    // Add the selected track names to proposals
    this.proposals.push(...selectedNames);
    
    // Add the correct track name and shuffle all proposals
    this.proposals.push(this.track.name);
    this.proposals = this.shuffleArray(this.proposals);
  }

  shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  selectProposal(index: number): void {
    const selectedProposal = this.proposals[index];
    console.log('Selected proposal:', selectedProposal);
    if (selectedProposal === this.track.name) {
      console.log('Correct answer!');
    } else {
      console.log('Wrong answer. The correct answer was:', this.track.name);
    }
  }
}
