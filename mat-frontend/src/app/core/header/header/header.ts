import { Component } from '@angular/core';
import { LoginData } from '../../login/login-data';
import { GlobalData } from '../../../shared/global-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  constructor(private router: Router) {}

  public logout() {
    LoginData.clearLoginData();
    GlobalData.clearGlobalData();                                                                                                                                                                                                                                                                               
    const spotifyLogoutWindow = window.open('https://accounts.spotify.com/en/logout', 'Spotify Logout', 'width=700,height=500,top=40,left=40');   
    if (spotifyLogoutWindow) {
      setTimeout(() => spotifyLogoutWindow.close(), 2000);
    }
    this.router.navigate(['/login']);
  }
}
