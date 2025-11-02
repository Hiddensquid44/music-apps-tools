import { Injectable } from '@angular/core';
import { LoginData } from '../core/login/login-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Track } from './models/track';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient) {}

  private getOptions(responseType: 'json' | 'text' = 'json') {
    return {
        headers: new HttpHeaders({
            'Authorization': 'Bearer ' + LoginData.accessToken
        }),
        responseType: responseType as any
    };
  }

  public playTracks(trackUris: string | string[], shuffle?: boolean): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (shuffle !== undefined) {
          this.toggleShuffle(shuffle);
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

  public playNextTrack(): Promise<void> {
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

  public async playPlaylist(playlistUri: string, shuffle?: boolean): Promise<void> {
    try {
      if (shuffle !== undefined) {
          await this.toggleShuffle(shuffle);
      }
      await new Promise<void>((resolve, reject) => {
        this.http.put(`https://api.spotify.com/v1/me/player/play?market=from_token`, 
          { context_uri: playlistUri }, 
          this.getOptions('text'))
          .subscribe({
              next: () => {
                  console.log('Playlist is now playing.');
                  // Add a small delay to ensure the queue is updated
                  setTimeout(resolve, 1000);
              },
              error: (error) => {
                  console.error('Error playing playlist:', error);
                  reject(error);
              }
          });
      });
    } catch (error) {
      console.error('Error in playPlaylist:', error);
      throw error;
    }
  }

  public getUserQueue(): Observable<Track[]> {
    const queue$ = this.http.get<{ currently_playing: Track, queue: Track[] }>(`https://api.spotify.com/v1/me/player/queue`, 
      this.getOptions()).pipe(
        map(response => [response.currently_playing, ...response.queue])
      );
    return queue$;
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
}
