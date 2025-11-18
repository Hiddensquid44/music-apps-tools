import { Injectable } from '@angular/core';
import { User } from '../../../shared/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginData } from '../login-data';

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

    async getCurrentUserInfos(): Promise<User> {
        const user = await this.http.get<User>(`https://api.spotify.com/v1/me`, this.getOptions()).toPromise();
        return user!;
    }
}