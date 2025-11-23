import { Injectable } from '@angular/core';
import { LoginData } from '../../../core/login/login-data';
import { HttpHeaders } from '@angular/common/http';
import { Track } from '../../models/track';
import { SpotifyService } from './spotify-service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(private spotifyService: SpotifyService) {}

  private getOptions(responseType: 'json' | 'text' = 'json') {
    return {
        headers: new HttpHeaders({
            'Authorization': 'Bearer ' + LoginData.accessToken
        }),
        responseType: responseType as any
    };
  }

  public async getPlaylistDetails(href: string): Promise<Track[]> {
    const response = await this.spotifyService.getRequest<any>(href, this.getOptions());
    return response!.tracks.items.map((item: any) => item.track as Track);
  }
  
}
