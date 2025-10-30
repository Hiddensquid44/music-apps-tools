import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../../shared/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginData } from '../login-data';
import { Playlist } from '../../../shared/models/playlist';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private http: HttpClient) {}

    private getOptions() {
        console.log('Creating HTTP options with Authorization header.');
        console.log('Access Token:', LoginData.accessToken);
        console.log('Authorization Header:', 'Bearer ' + LoginData.accessToken);
        return {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + LoginData.accessToken
            })
        };
    }

    getCurrentUserInfos(): Observable<User> {
        console.log('Fetching current user info.');
        console.log('Get User Infos : ', this.http.get<User>(`https://api.spotify.com/v1/me`, this.getOptions()));
        return this.http.get<User>(`https://api.spotify.com/v1/me`, this.getOptions());
    }
    getCurrentUserPlaylists(offset: number): Observable<Playlist[]> {
        console.log('Fetching current user playlists.');
        const playlistsResponse$ = this.http.get<{ items: Playlist[] }>(`https://api.spotify.com/v1/me/playlists?limit=50&offset=${offset}`, this.getOptions());
        console.log('Get User Playlists : ', playlistsResponse$);
        return playlistsResponse$.pipe(map(response => response.items));
    }
}