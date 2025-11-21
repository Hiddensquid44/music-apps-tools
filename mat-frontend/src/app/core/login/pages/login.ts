import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalData } from '../../../shared/global-data';
import { User } from '../../../shared/models/user';
import { LoginService } from '../services/login-service';
import { UserService } from '../../../shared/services/spotify-api/user-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  providers: [LoginService],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor(
    private router: Router,
    private loginService: LoginService,
    private userService: UserService) { }

  async ngOnInit() {
    if (!this.loginService.isBrowser()) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      await this.loginService.getToken(code);
      GlobalData.currentUser = new User();
      await this.getCurrentUserInfos();
      await this.userService.saveAllCurrentUserPlaylists();
      this.router.navigate(['/dashboard']);
    }
  }

  public async login() {
    await this.loginService.retrieveCode();
  }

  private async getCurrentUserInfos() {
    const user = await this.userService.getCurrentUserInfos();
    GlobalData.currentUser = user;
  }

}