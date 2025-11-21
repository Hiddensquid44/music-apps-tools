import { Injectable } from '@angular/core';
import { LoginData } from '../../../core/login/login-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlaybackState } from '../../models/playback-state';

@Injectable({
  providedIn: 'root'
})
export class PlaybackStateService {

  constructor(private http: HttpClient) {}

  private getOptions(responseType: 'json' | 'text' = 'json') {
    return {
        headers: new HttpHeaders({
            'Authorization': 'Bearer ' + LoginData.accessToken
        }),
        responseType: responseType as any
    };
  }

  public toggleShuffle(state: boolean): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.put(`https://api.spotify.com/v1/me/player/shuffle?state=${state}&market=from_token`, 
        null, 
        this.getOptions('text'))
        .subscribe({
          next: () => {
            console.log('Shuffle state changed:', state);
            resolve();
          },
          error: (error) => {
            console.error('Error toggling shuffle:', error);
            reject(error);
          }
        });
    });
  }

  public async startPlayback(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.put(`https://api.spotify.com/v1/me/player/play?market=from_token`,
        null,
        this.getOptions('text'))
        .subscribe({
          next: () => {
            console.log('Playback started.');
            resolve();
          },
          error: (error) => {
            console.error('Error starting playback:', error);
            reject(error);
          }
        });
    });
  }

  public async pausePlayback(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.put(`https://api.spotify.com/v1/me/player/pause?market=from_token`,
        null,
        this.getOptions('text'))
        .subscribe({
          next: () => {
            console.log('Playback paused.');
            resolve();
          },
          error: (error) => {
            console.error('Error pausing playback:', error);
            reject(error);
          }
        });
    });
  }

  public async getCurrentPlaybackState(): Promise<PlaybackState> {
    return new Promise<PlaybackState>((resolve, reject) => {
      this.http.get<PlaybackState>(`https://api.spotify.com/v1/me/player`, this.getOptions())
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (error) => {
            console.error('Error retrieving current playback state:', error);
            reject(error);
          }
        });
    });
  }
  
}
