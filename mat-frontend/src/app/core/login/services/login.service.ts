import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
        return {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + LoginData.accessToken
            })
        };
    }

    getCurrentUserInfos(): Observable<User> {
        return this.http.get<User>(`https://api.spotify.com/v1/me`, this.getOptions());
    }

    getCurrentUserPlaylists(offset: number): Observable<Playlist[]> {
        return this.http.get<Playlist[]>(`https://api.spotify.com/v1/me/playlists?limit=50&offset=${offset}`, this.getOptions());
    }
}