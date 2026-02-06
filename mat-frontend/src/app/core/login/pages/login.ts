import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalData } from '../../../shared/global-data';
import { User } from '../../../shared/models/user';
import { LoginService } from '../services/login-service';
import { UserService } from '../../../shared/services/spotify-api/user-service';
import { LoginData } from '../login-data';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  providers: [LoginService],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login implements OnInit {
  constructor(
    private router: Router,
    private loginService: LoginService,
    private userService: UserService,
    private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    if (!this.loginService.isBrowser()) {
      return;
    }

    // If we already have an access token, navigate to dashboard
    if (LoginData.accessToken) {
      await this.router.navigate(['/dashboard']);
      return;
    }

    // If we have a refresh token, attempt to refresh and navigate if successful
    if (LoginData.refreshToken) {
      try {
        const refreshed = await this.loginService.refreshToken();
        if (refreshed) {
          GlobalData.currentUser = new User();
          await this.getCurrentUserInfos();
          await this.userService.saveAllCurrentUserPlaylists();
          this.cdr.detectChanges();
          await this.router.navigate(['/dashboard']);
          return;
        }
      } catch (err) {
        console.error('Error attempting refresh in ngOnInit:', err);
      }
    }

    // Continue existing logic: check if an authorization code is present in the URL
    if (LoginData.accessToken === '') {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        await this.loginService.getToken(code);
        GlobalData.currentUser = new User();
        await this.getCurrentUserInfos();
        await this.userService.saveAllCurrentUserPlaylists();
        this.cdr.detectChanges();
        await this.router.navigate(['/dashboard']);
      }
    }
  }

  public async login() {
    await this.loginService.retrieveCode();
  }

  private async getCurrentUserInfos() {
    GlobalData.currentUser = await this.userService.getCurrentUserInfos();
  }

}
