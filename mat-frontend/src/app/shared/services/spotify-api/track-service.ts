import { Injectable } from '@angular/core';
import { LoginData } from '../../../core/login/login-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Track } from '../../models/track';
import { PlaybackStateService } from './playback-state-service';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  constructor(private http: HttpClient, private playbackStateService: PlaybackStateService) {}

  private getOptions(responseType: 'json' | 'text' = 'json') {
    return {
        headers: new HttpHeaders({
            'Authorization': 'Bearer ' + LoginData.accessToken
        }),
        responseType: responseType as any
    };
  }

  public async playTracks(trackUris: string | string[], shuffle?: boolean): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (shuffle !== undefined) {
          this.playbackStateService.toggleShuffle(shuffle);
      }
      this.http.put(`https://api.spotify.com/v1/me/player/play?market=from_token`, 
        { uris: Array.isArray(trackUris) ? trackUris : [trackUris] }, 
        this.getOptions('text'))
        .subscribe({
            next: () => console.log('Track is now playing.'),
            error: (error) => console.error('Error playing track:', error)
        });
    });
  }

  public async playNextTrack(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.post(`https://api.spotify.com/v1/me/player/next?market=from_token`,
        null,
        this.getOptions('text'))
        .subscribe({
            next: () => {
                console.log('Skipped to next track.');
                resolve();
            },
            error: (error) => {
                console.error('Error skipping to next track:', error);
                reject(error);
            }
        });
    });
  }

  public async getCurrentPlayingTrack(): Promise<Track | null> {
    return new Promise<Track | null>((resolve) => {
      this.http.get<any>(`https://api.spotify.com/v1/me/player/currently-playing`, this.getOptions())
        .subscribe({
          next: (response) => {
            resolve(response?.item || null);
          },
          error: (error) => {
            console.error('Error retrieving current playing track:', error);
            resolve(null);
          }
        });
    });
  }

  public async addTrackToQueue(trackUri: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.post(`https://api.spotify.com/v1/me/player/queue?uri=${trackUri}`,
        null,
        this.getOptions('text'))
        .subscribe({
          next: () => {
            console.log('Track added to queue:', trackUri);
            resolve();
          },
          error: (error) => {
            console.error('Error adding track to queue:', error);
            reject(error);
          }
        });
    });
  }
  
}
