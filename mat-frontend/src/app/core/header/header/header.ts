import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../login/services/login-service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  constructor(private router: Router, private loginService: LoginService) {}

  public goToPage(pageLink: string) {
    this.router.navigate(['/' + pageLink]);
  }

  public logout() {
    this.loginService.logout();
  }
}
