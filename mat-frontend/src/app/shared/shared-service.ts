import { Injectable } from '@angular/core';
import { LoginData } from '../core/login/login-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

    constructor(private http: HttpClient) {}

    private getOptions() {
      return {
          headers: new HttpHeaders({
              'Authorization': 'Bearer ' + LoginData.accessToken
          })
      };
    }

    playPlaylist(playlistUri: string, shuffle?: boolean): void {
      if (shuffle !== undefined) {
          this.toggleShuffle(shuffle);
      }
      this.http.put(`https://api.spotify.com/v1/me/player/play`, { context_uri: playlistUri }, this.getOptions())
        .subscribe(
            () => console.log('Playlist is now playing.')
        );
    }

    toggleShuffle(state: boolean): void {
      this.http.put(`https://api.spotify.com/v1/me/player/shuffle?state=${state}`, {}, this.getOptions())
        .subscribe(response => {
            console.log('Shuffle state changed:', response);
        });
    }
}
