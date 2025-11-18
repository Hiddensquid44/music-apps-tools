import { Injectable } from '@angular/core';
import { LoginData } from '../core/login/login-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Track } from './models/track';
import { PlaybackState } from './models/playback-state';
import { Playlist } from './models/playlist';

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

  async getCurrentUserPlaylists(offset: number): Promise<Playlist[]> {
      const playlistsResponse = await this.http.get<{ items: Playlist[] }>(`https://api.spotify.com/v1/me/playlists?limit=50&offset=${offset}`, this.getOptions()).toPromise();
      return playlistsResponse!.items;
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

  public async getPlaylistDetails(href: string): Promise<Track[]> {
    const response = await this.http.get<any>(href, this.getOptions()).toPromise();
    return response!.tracks.items.map((item: any) => item.track as Track);
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

  public async skipToTrack(trackHref: string): Promise<void> {
    try {
      let queueEmpty = false;
      while (!queueEmpty) {
        await new Promise(res => setTimeout(res, 500));
        const track = await this.getCurrentPlayingTrack();
        console.log('Currently playing track:', track?.href);
        console.log('Target track to skip to:', trackHref);
        if (track?.href === trackHref) {
          queueEmpty = true;
        } else {
          // Skip the currently playing track
          await this.playNextTrack();
        }
      }
      console.log('User queue cleared.');
    } catch (error) {
      console.error('Error clearing user queue:', error);
      throw error;
    }
  }
}