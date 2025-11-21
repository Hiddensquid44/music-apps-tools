import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginData } from '../../../core/login/login-data';
import { PlaylistService } from './playlist-service';
import { GlobalData } from '../../global-data';
import { Playlist } from '../../models/playlist';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private playlistService: PlaylistService) { }

  private getOptions() {
    return {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + LoginData.accessToken
      })
    };
  }

  public async getCurrentUserInfos(): Promise<User> {
    const user = await this.http.get<User>(`https://api.spotify.com/v1/me`, this.getOptions()).toPromise();
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
    const playlistsResponse = await this.http.get<{ items: Playlist[] }>(`https://api.spotify.com/v1/me/playlists?limit=50&offset=${offset}`, this.getOptions()).toPromise();
    return playlistsResponse!.items;
  }

}
