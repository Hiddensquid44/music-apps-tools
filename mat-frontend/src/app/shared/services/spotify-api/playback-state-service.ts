import { Injectable } from '@angular/core';
import { LoginData } from '../../../core/login/login-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlaybackState } from '../../models/playback-state';
import { Track } from '../../models/track';
import { SpotifyService } from './spotify-service';

@Injectable({
  providedIn: 'root'
})
export class PlaybackStateService {

  constructor(private http: HttpClient, private spotifyService: SpotifyService) {}

  private getOptions(responseType: 'json' | 'text' = 'json') {
    return {
        headers: new HttpHeaders({
            'Authorization': 'Bearer ' + LoginData.accessToken
        }),
        responseType: responseType as any
    };
  }

  public async startPlayback(): Promise<void> {
    return await this.spotifyService.putRequest(`https://api.spotify.com/v1/me/player/play?market=from_token`, this.getOptions('text'));
  }

  public async pausePlayback(): Promise<void> {
    return await this.spotifyService.putRequest(`https://api.spotify.com/v1/me/player/pause?market=from_token`, this.getOptions('text'));
  }

  public async getCurrentPlaybackState(): Promise<PlaybackState> {
    return await this.spotifyService.getRequest<PlaybackState>(`https://api.spotify.com/v1/me/player`, this.getOptions());
  }

  public async getCurrentPlayingTrack(): Promise<Track | null> {
    const response = await this.spotifyService.getRequest<any>(`https://api.spotify.com/v1/me/player/currently-playing`, this.getOptions());
    return response?.item ?? null;
  }

  public async toggleShuffle(state: boolean): Promise<void> {
    return await this.spotifyService.putRequest(`https://api.spotify.com/v1/me/player/shuffle?state=${state}&market=from_token`, this.getOptions('text'));
  }

  public async setRepeatMode(mode: 'track' | 'context' | 'off'): Promise<void> {
    return await this.spotifyService.putRequest(`https://api.spotify.com/v1/me/player/repeat?state=${mode}`, this.getOptions('text'));
  }
  
}
