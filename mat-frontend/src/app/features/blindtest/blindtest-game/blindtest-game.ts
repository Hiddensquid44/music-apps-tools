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
  public static readonly MAX_TRACKS = 10;

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
        next: (tracks) => {
          this.playlistTracks = Utils.shuffleArray(tracks);
        },
        error: (error) => {
          console.error('Error retrieving playlist tracks:', error);
        }
      });
      for (let i = 0; i < BlindtestGame.MAX_TRACKS; i++) {
        console.log('Adding to queue track:', this.playlistTracks[i].name);
        await this.sharedService.addTrackToQueue(this.playlistTracks[i].uri).catch((error) => {
          console.error('Error adding track to queue:', error);
        });
      }
      setTimeout(() => {
        this.nextQuizz(true);
      }, 0);
      /*await this.sharedService.playPlaylist(this.playlist.uri, true);
      this.sharedService.getUserQueue().subscribe({
        next: (queue) => {
          console.log('Blindtest queue:', queue);
          //this.playlistTracks = queue;
          console.log('Blindtest tracks:', this.playlistTracks.slice(0, BlindtestGame.MAX_TRACKS));
          console.log('Playlist tracks :', this.playlistTracks.map(track => track.name));
          
          // Ensure we're running in the next tick
          setTimeout(() => {
            this.nextQuizz(true);
          }, 0);
        },
        error: (error) => {
          console.error('Error retrieving blindtest queue:', error);
        }
      });*/
    } catch (error) {
      console.error('Error starting blindtest:', error);
      throw error;
    }
  }

  async nextQuizz(firstTrack: boolean): Promise<void> {
    this.gameOnGoing = false;
    this.currentTrackIndex++;
    this.notPlayedTracks = this.playlistTracks.slice(this.currentTrackIndex + 1, this.playlistTracks.length);
    console.log('Not played tracks:', this.notPlayedTracks.map(track => track.name));
    if (this.currentTrackIndex < BlindtestGame.MAX_TRACKS) {
      if (!firstTrack) {
        await this.sharedService.playNextTrack();
      }
      this.gameOnGoing = true;
      console.log('Current track index:', this.currentTrackIndex);
      console.log('gameOnGoing set to:', this.gameOnGoing);
      
      // Shuffle the track names and take the first 3 as wrong proposals
      const shuffledNotPlayedNames = Utils.shuffleArray(this.notPlayedTracks.map(track => track.name));
      this.wrongTracksNames = shuffledNotPlayedNames.slice(0, Math.min(3, shuffledNotPlayedNames.length));
      this.cdr.detectChanges();
    } else {
      // Implement end of game logic here
      console.log('Blindtest game ended.');
    }
  }
}
