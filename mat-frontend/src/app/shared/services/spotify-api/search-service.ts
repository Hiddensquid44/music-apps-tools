import { Injectable } from '@angular/core';
import { Playlist } from '../../models/playlist';
import { LoginData } from '../../../core/login/login-data';
import { HttpHeaders } from '@angular/common/http';
import { SpotifyService } from './spotify-service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private spotifyService: SpotifyService) {}

  private getOptions(responseType: 'json' | 'text' = 'json') {
    return {
        headers: new HttpHeaders({
            'Authorization': 'Bearer ' + LoginData.accessToken
        }),
        responseType: responseType as any
    };
  }

  public async searchPlaylists(query: string): Promise<Playlist[]> {
    const limit = 5;
    const response = await this.spotifyService.getRequest<any>(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=${limit}`,
       this.getOptions()
      );
    return response?.items;
  }
  
}
