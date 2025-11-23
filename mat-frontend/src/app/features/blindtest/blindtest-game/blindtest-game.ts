import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlindtestData } from '../blindtest-data';
import { BlindtestGameQuizz } from "./components/blindtest-game-quizz/blindtest-game-quizz";
import { Track } from '../../../shared/models/track';
import { Utils } from '../../../shared/utils';
import { GlobalData } from '../../../shared/global-data';
import { GameState } from '../models/game-state';
import { TrackService } from '../../../shared/services/spotify-api/track-service';
import { PlaylistService } from '../../../shared/services/spotify-api/playlist-service';
import { BlindtestService } from '../blindtest-service';
import { PlaybackStateService } from '../../../shared/services/spotify-api/playback-state-service';

@Component({
  selector: 'app-blindtest-game',
  standalone: true,
  imports: [CommonModule, BlindtestGameQuizz],
  providers: [TrackService, PlaylistService, BlindtestService, PlaybackStateService],
  templateUrl: './blindtest-game.html',
  styleUrl: './blindtest-game.css'
})
export class BlindtestGame {

  public readonly BLINDTEST_SIZE = BlindtestData.BLINDTEST_SIZE;
  public gameState = BlindtestData.gameState ?? new GameState();
  public notPlayedTracks: Track[] = [];
  public gameEnded: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private trackService: TrackService,
    private playlistService: PlaylistService,
    private blindtestService: BlindtestService,
    private playbackStateService: PlaybackStateService
  ) {}

  async setupBlindtest(): Promise<void> {
    try {
      const tracks = await this.playlistService.getPlaylistDetails(this.gameState.playlist.href);
      this.gameState.playlistTracks = Utils.shuffleArray(tracks)
        .filter((track) => track.available_markets.includes(GlobalData?.currentUser?.country));
      try {
        for (let i = 0; i < BlindtestData.BLINDTEST_SIZE; i++) {
          console.log('Adding to queue track:', this.gameState.playlistTracks[i].name);
          await this.trackService.addTrackToQueue(this.gameState.playlistTracks[i].uri);
        }
        await this.blindtestService.skipToTrack(this.gameState.playlistTracks[0].href);
        this.gameState.gameStarted = true;
        this.gameState.gameOnGoing = true;
        this.gameEnded = false;
        this.saveGameState();
        this.nextQuizz();
      } catch (error) {
        console.error('Error adding tracks to queue:', error);
      }
    } catch (error) {
      console.error('Error starting blindtest:', error);
      throw error;
    }
  }

  async nextQuizz(): Promise<void> {
    this.gameState.gameOnGoing = false;
    this.gameState.currentTrackIndex++;
    this.notPlayedTracks = this.gameState.playlistTracks.slice(this.gameState.currentTrackIndex + 1, this.gameState.playlistTracks.length);
    console.log('Not played tracks:', this.notPlayedTracks.map(track => track.name));
    if (this.gameState.currentTrackIndex >= BlindtestData.BLINDTEST_SIZE) {
      // Implement end of game logic here
      console.log('Blindtest game ended.');
      this.gameEnded = true;
      this.saveGameState();
      await this.playbackStateService.setRepeatMode('context');
      setTimeout(() => {
        this.gameEnded = false;
        this.cdr.detectChanges();
      }, 2000);
    } else {
      console.log('Current track index:', this.gameState.currentTrackIndex);
      console.log('gameOnGoing set to:', this.gameState.gameOnGoing);
      
      // Shuffle the track names and take the first 3 as wrong proposals
      const shuffledNotPlayedNames = Utils.shuffleArray(this.notPlayedTracks.map(track => track.name));
      this.gameState.wrongTracksNames = shuffledNotPlayedNames.slice(0, Math.min(3, shuffledNotPlayedNames.length));
      if (this.gameState.currentTrackIndex > 0) {
        await this.trackService.playNextTrack();
      }
      await this.playbackStateService.setRepeatMode('track');
      this.gameState.gameOnGoing = true;
      this.saveGameState();
      this.cdr.detectChanges();
    }
  }

  public updatePlayerScore(trackScore: number) {
    BlindtestData.gameState.score += trackScore;
    console.log("Player score: " + BlindtestData.gameState.score);
  }

  private saveGameState(): void {
    try {
      BlindtestData.gameState = this.gameState;
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  }
}
