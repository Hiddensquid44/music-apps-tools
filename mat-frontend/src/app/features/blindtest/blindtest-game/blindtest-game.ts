import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Playlist } from '../../../shared/models/playlist';
import { BlindtestData } from '../blindtest-data';
import { SharedService } from '../../../shared/shared-service';
import { BlindtestGameQuizz } from "./components/blindtest-game-quizz/blindtest-game-quizz";
import { Track } from '../../../shared/models/track';
import { Utils } from '../../../shared/utils';

@Component({
  selector: 'app-blindtest-game',
  standalone: true,
  imports: [CommonModule, BlindtestGameQuizz],
  providers: [SharedService],
  templateUrl: './blindtest-game.html',
  styleUrl: './blindtest-game.css'
})
export class BlindtestGame {

  public playlist = BlindtestData.currentPlaylist ?? new Playlist();
  public notPlayedTracks: Track[] = [];
  public blindtestTracks: Track[] = [];

  public currentTrackIndex: number = -1;
  public wrongTracksNames: string[] = [];
  public gameOnGoing: boolean = false;

  constructor(
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  async setupBlindtest(): Promise<void> {
    try {
      await this.sharedService.playPlaylist(this.playlist.uri, true);
      this.sharedService.getUserQueue().subscribe({
        next: (queue) => {
          console.log('Blindtest queue:', queue);
          this.notPlayedTracks = queue;
          console.log('Playlist tracks for blindtest:', this.notPlayedTracks);
          this.blindtestTracks = queue.slice(0, 10);
          console.log('Blindtest tracks:', this.blindtestTracks);
          
          // Ensure we're running in the next tick
          setTimeout(() => {
            this.nextQuizz(true);
            this.cdr.detectChanges();
          }, 0);
        },
        error: (error) => {
          console.error('Error retrieving blindtest queue:', error);
        }
      });
    } catch (error) {
      console.error('Error starting blindtest:', error);
      throw error;
    }
  }

  async nextQuizz(firstTrack: boolean): Promise<void> {
    this.gameOnGoing = false;
    this.notPlayedTracks = this.notPlayedTracks.filter((_, index) => index != this.currentTrackIndex - 1);
    this.currentTrackIndex++;
    if (this.currentTrackIndex < this.blindtestTracks.length) {
      if (!firstTrack) {
        await this.sharedService.playNextTrack();
      }
      console.log('Starting quizz for track:', this.blindtestTracks[this.currentTrackIndex].name);
      console.log('Current track index:', this.currentTrackIndex);
      this.gameOnGoing = true;
      console.log('gameOnGoing set to:', this.gameOnGoing);
      
      // Shuffle the track names and take the first 3 as wrong proposals
      const shuffledNames = Utils.shuffleArray(this.notPlayedTracks.map(track => track.name));
      this.wrongTracksNames = shuffledNames.slice(0, Math.min(3, shuffledNames.length));
      this.cdr.detectChanges();
    } else {
      // Implement end of game logic here
      this.gameOnGoing = false;
      console.log('Blindtest game ended.');
    }
  }
}
