import { ChangeDetectorRef, Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  public gameStarted: boolean = false;
  public gameOnGoing: boolean = false;

  private readonly STORAGE_KEY = 'blindtest_gameState';
  private readonly isBrowser: boolean;

  constructor(
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    if (this.isBrowser) {
      this.restoreGameState();
    }
  }

  async setupBlindtest(): Promise<void> {
    this.gameStarted = true;
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
            this.saveGameState();
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
      this.saveGameState();
      this.cdr.detectChanges();
    } else {
      // Implement end of game logic here
      console.log('Blindtest game ended.');
    }
  }

  private saveGameState(): void {
    if (!this.isBrowser) return;

    const gameState = {
      playlist: this.playlist,
      playlistTracks: this.playlistTracks,
      currentTrackIndex: this.currentTrackIndex,
      wrongTracksNames: this.wrongTracksNames,
      gameOnGoing: this.gameOnGoing,
      gameStarted: this.gameStarted
    };
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(gameState));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  }

  private restoreGameState(): void {
    if (!this.isBrowser) return;

    try {
      const savedState = localStorage.getItem(this.STORAGE_KEY);
      if (savedState) {
        const gameState = JSON.parse(savedState);
        this.playlist = gameState.playlist;
        this.playlistTracks = gameState.playlistTracks;
        this.currentTrackIndex = gameState.currentTrackIndex;
        this.wrongTracksNames = gameState.wrongTracksNames;
        this.gameOnGoing = gameState.gameOnGoing;
        this.gameStarted = gameState.gameStarted;
      
        // Recalculate notPlayedTracks based on currentTrackIndex
        this.notPlayedTracks = this.playlistTracks.slice(this.currentTrackIndex + 1, this.playlistTracks.length);
      } 
    } catch (error) {
      console.error('Error restoring game state:', error);
    }
  }
}
