import { Injectable } from '@angular/core';
import { LoginData } from '../../../core/login/login-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  public async getPlaylistDetails(href: string): Promise<Track[]> {
    const response = await this.http.get<any>(href, this.getOptions()).toPromise();
    return response!.tracks.items.map((item: any) => item.track as Track);
  }
  
}
