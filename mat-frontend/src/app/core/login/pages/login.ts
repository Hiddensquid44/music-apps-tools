import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GlobalData } from '../../../shared/global-data';
import { User } from '../../../shared/models/user';
import { LoginService } from '../services/login.service';
import { LoginData } from '../login-data';
import { Playlist } from '../../../shared/models/playlist';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  private readonly loginService = inject(LoginService);

  async ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

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
    return new Promise<void>((resolve, reject) => {
      this.loginService.getCurrentUserInfos().subscribe({
        next: (user: User) => {
          GlobalData.currentUser = user;
          resolve();
        },
        error: (error) => {
          console.error('Error retrieving user info:', error);
          this.refreshToken();
          reject(error);
        }
      });
    });
  }

  private async getCurrentUserPlaylists() {
    let offset = 0;
    let playlists: any[] = [];
    
    try {
      while (true) {
        const newPlaylists = await new Promise((resolve, reject) => {
          this.loginService.getCurrentUserPlaylists(offset).subscribe({
            next: (result) => resolve(result),
            error: (error) => reject(error)
          });
        }) as Playlist[];
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

  private async getToken(code: string) {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: LoginData.redirectUriLogin
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        // Use a helper that works both in browser and (if needed) server-side environments.
        'Authorization': 'Basic ' + this.encodeBase64(LoginData.clientId + ':' + LoginData.clientSecret),
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
        'Authorization': 'Basic ' + this.encodeBase64(LoginData.clientId + ':' + LoginData.clientSecret),
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
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = 'https://accounts.spotify.com/authorize?' + params.toString();
    } else {
      // In an SSR context we can't perform a redirect. Log and no-op.
      console.warn('retrieveCode called in non-browser environment; redirect skipped.');
    }
  }

  /**
   * Base64 encoder that prefers the browser's btoa when available, otherwise uses Node Buffer.
   * This keeps the code safe for SSR builds while still working in the browser.
   */
  private encodeBase64(input: string): string {
    if (typeof btoa !== 'undefined') {
      return btoa(input);
    }
    // Fallback for server-side (Node) environments where Buffer is available.
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(input, 'utf8').toString('base64');
    }
    // Last-resort: rudimentary base64 (shouldn't be reached in normal environments)
    try {
      return globalThis.btoa(input);
    } catch (e) {
      console.warn('Base64 encoding fallback used; output may be incorrect.', e);
      return '';
    }
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