import { Injectable } from '@angular/core';
import { LoginData } from '../../../core/login/login-data';
import { HttpHeaders } from '@angular/common/http';
import { SpotifyService } from './spotify-service';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  constructor(private spotifyService: SpotifyService) {}

  private getOptions(responseType: 'json' | 'text' = 'json') {
    return {
        headers: new HttpHeaders({
            'Authorization': 'Bearer ' + LoginData.accessToken
        }),
        responseType: responseType as any
    };
  }

  public async playNextTrack(): Promise<void> {
    return await this.spotifyService.postRequest(`https://api.spotify.com/v1/me/player/next?market=from_token`, this.getOptions('text'));
  }
  public async addTrackToQueue(trackUri: string): Promise<void> {
    return await this.spotifyService.postRequest(`https://api.spotify.com/v1/me/player/queue?uri=${trackUri}`, this.getOptions('text'));
  }
  
}
