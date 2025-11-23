import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { HttpHeaders } from '@angular/common/http';
import { LoginData } from '../../../core/login/login-data';
import { GlobalData } from '../../global-data';
import { Playlist } from '../../models/playlist';
import { SpotifyService } from './spotify-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private spotifyService: SpotifyService) { }

  private getOptions() {
    return {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + LoginData.accessToken
      })
    };
  }

  public async getCurrentUserInfos(): Promise<User> {
    const user = await this.spotifyService.getRequest<User>(`https://api.spotify.com/v1/me`, this.getOptions());
    return user!;
  }

  public async saveAllCurrentUserPlaylists() {
    let offset = 0;
    let playlists: any[] = [];

    try {
      while (true) {
        const newPlaylists = await this.getCurrentUserPlaylists(offset);
        if (!newPlaylists) {
          break;
        }
        playlists = playlists.concat(newPlaylists);
        if (newPlaylists.length < 50) {
          break;
        }
        offset += 50;
      }
      const user = GlobalData.currentUser;
      if (user) {
        user.playlists = playlists;
        GlobalData.currentUser = user;
      }
    } catch (error) {
      console.error('Error retrieving user playlists:', error);
      throw error;
    }
  }

  public async getCurrentUserPlaylists(offset: number): Promise<Playlist[]> {
    const playlistsResponse = await this.spotifyService.getRequest<{ items: Playlist[] }>(`https://api.spotify.com/v1/me/playlists?limit=50&offset=${offset}`, this.getOptions());
    return playlistsResponse!.items;
  }

}
