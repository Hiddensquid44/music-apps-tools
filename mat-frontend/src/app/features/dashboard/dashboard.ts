import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalData } from '../../shared/global-data';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user';
import { LoginData } from '../../core/login/login-data';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard {
  
  public user = GlobalData.currentUser ?? new User();
  
  constructor(private router: Router) {}
  
  goToBlindtestMenu() {
    this.router.navigate(['/blindtest-menu']);
  }

  logout() {
    LoginData.clearLoginData();
    GlobalData.clearGlobalData();                                                                                                                                                                                                                                                                               
    const spotifyLogoutWindow = window.open('https://accounts.spotify.com/en/logout', 'Spotify Logout', 'width=700,height=500,top=40,left=40');   
    if (spotifyLogoutWindow) {
      setTimeout(() => spotifyLogoutWindow.close(), 2000);
    }
    this.router.navigate(['/login']);
  }
}
