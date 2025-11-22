import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData } from '../../login/login-data';
import { GlobalData } from '../../../shared/global-data';

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
    window.open('https://accounts.spotify.com/en/logout', 'Spotify Logout', 'width=700,height=500,top=40,left=40');
  }

  public goToPage(pageLink: string) {
    this.router.navigate(['/' + pageLink]);
  }
}
