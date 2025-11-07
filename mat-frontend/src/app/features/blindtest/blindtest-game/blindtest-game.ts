import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Playlist } from '../../../shared/models/playlist';
import { BlindtestData } from '../blindtest-data';
import { SharedService } from '../../../shared/shared-service';
import { BlindtestGameQuizz } from "./components/blindtest-game-quizz/blindtest-game-quizz";
import { Track } from '../../../shared/models/track';
import { Utils } from '../../../shared/utils';
import { GlobalData } from '../../../shared/global-data';

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
  public playlistTracks: Track[] = [];

  public currentTrackIndex: number = -1;
  public wrongTracksNames: string[] = [];
  public gameOnGoing: boolean = false;

  constructor(
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  async setupBlindtest(): Promise<void> {
    this.currentTrackIndex = -1;
    try {
      await this.sharedService.getPlaylistDetails(this.playlist.href).subscribe({
        next: async (tracks) => {
          this.playlistTracks = Utils.shuffleArray(tracks)
            .filter((track) => track.available_markets.includes(GlobalData?.currentUser?.country));
          try {
            for (let i = 0; i < BlindtestData.MAX_TRACKS; i++) {
              console.log('Adding to queue track:', this.playlistTracks[i].name);
              await this.sharedService.addTrackToQueue(this.playlistTracks[i].uri);
            }
            setTimeout(() => {
              this.nextQuizz();
            }, 0);
          } catch (error) {
            console.error('Error adding tracks to queue:', error);
          }
        },
        error: (error) => {
          console.error('Error retrieving playlist tracks:', error);
        }
      });
    } catch (error) {
      console.error('Error starting blindtest:', error);
      throw error;
    }
  }

  async nextQuizz(): Promise<void> {
    this.gameOnGoing = false;
    this.currentTrackIndex++;
    this.notPlayedTracks = this.playlistTracks.slice(this.currentTrackIndex + 1, this.playlistTracks.length);
    console.log('Not played tracks:', this.notPlayedTracks.map(track => track.name));
    if (this.currentTrackIndex < BlindtestData.MAX_TRACKS) {
      console.log('Current track index:', this.currentTrackIndex);
      console.log('gameOnGoing set to:', this.gameOnGoing);
      
      // Shuffle the track names and take the first 3 as wrong proposals
      const shuffledNotPlayedNames = Utils.shuffleArray(this.notPlayedTracks.map(track => track.name));
      this.wrongTracksNames = shuffledNotPlayedNames.slice(0, Math.min(3, shuffledNotPlayedNames.length));
      await this.sharedService.playNextTrack();
      this.gameOnGoing = true;
      this.cdr.detectChanges();
    } else {
      // Implement end of game logic here
      console.log('Blindtest game ended.');
    }
  }
}
