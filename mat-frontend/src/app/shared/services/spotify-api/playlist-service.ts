import { Injectable } from '@angular/core';
import { LoginData } from '../../../core/login/login-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Playlist } from '../../models/playlist';
import { Track } from '../../models/track';
import { PlaybackStateService } from './playback-state-service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(private http: HttpClient, private playbackStateService: PlaybackStateService) {}

  private getOptions(responseType: 'json' | 'text' = 'json') {
    return {
        headers: new HttpHeaders({
            'Authorization': 'Bearer ' + LoginData.accessToken
        }),
        responseType: responseType as any
    };
  }
  
  public async getCurrentUserPlaylists(offset: number): Promise<Playlist[]> {
      const playlistsResponse = await this.http.get<{ items: Playlist[] }>(`https://api.spotify.com/v1/me/playlists?limit=50&offset=${offset}`, this.getOptions()).toPromise();
      return playlistsResponse!.items;
  }
  
  public async playPlaylist(playlistUri: string, shuffle?: boolean): Promise<void> {
    try {
      if (shuffle !== undefined) {
          await this.playbackStateService.toggleShuffle(shuffle);
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

  public async getPlaylistDetails(href: string): Promise<Track[]> {
    const response = await this.http.get<any>(href, this.getOptions()).toPromise();
    return response!.tracks.items.map((item: any) => item.track as Track);
  }
  
}
