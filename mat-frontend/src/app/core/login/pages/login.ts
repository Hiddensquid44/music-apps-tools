import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalData } from '../../../shared/global-data';
import { User } from '../../../shared/models/user';
import { LoginService } from '../services/login.service';
import { LoginData } from '../login-data';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor(private router: Router) {}

  private readonly loginService = inject(LoginService);

  async ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      await this.getToken(code);
      GlobalData.currentUser = new User();
      await this.getCurrentUserInfos();
      await this.getCurrentUserPlaylists();
      this.router.navigate(['/dashboard']);
    }
  }

  private async getCurrentUserInfos() {

    this.loginService.getCurrentUserInfos().subscribe({
      next: (user: User) => {
        GlobalData.currentUser = user;
      },
      error: (error) => {
        console.error('Error retrieving user info:', error);
        this.refreshToken();
      }
    });

  }

  private async getCurrentUserPlaylists() {
    
    let offset = 0;
    let stopLoop = false;
    let playlists: any[] = [];
    while (!stopLoop) {
      this.loginService.getCurrentUserPlaylists(offset).subscribe({
        next: (newPlaylists) => {
          console.log('Retrieved playlists:', newPlaylists);
          if (newPlaylists) {
            playlists = playlists.concat(newPlaylists);
            if (newPlaylists.length === 50) {
              offset += 50;
            } else {
              stopLoop = true;
              GlobalData.currentUser.playlists = playlists;
            }
            stopLoop = true;
          }
        },
        error: (error) => {
          console.error('Error retrieving user playlists:', error);
          stopLoop = true;
        }
      });
    }

  }

  private async getToken(code: string) {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: LoginData.redirectUriLogin
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(LoginData.clientId + ':' + LoginData.clientSecret),
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    const data = await response.json();
    LoginData.accessToken = data.access_token;
    LoginData.refreshToken = data.refresh_token;
  }

  private async refreshToken() {
    if (LoginData.accessToken === '') {
      console.error('No access token available for refresh.');
      return;
    }

    // Implement token refresh logic if needed
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: LoginData.refreshToken
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(LoginData.clientId + ':' + LoginData.clientSecret),
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    const data = await response.json();
    LoginData.accessToken = data.access_token;
    LoginData.refreshToken = data.refresh_token;
  }

  public async retrieveCode() {
    const state = this.generateRandomString(16);
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: LoginData.clientId,
      scope: LoginData.scope,
      redirect_uri: LoginData.redirectUriLogin,
      state: state
    });
    window.location.href = 'https://accounts.spotify.com/authorize?' + params.toString();
  }

  private generateRandomString(length: number): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

}