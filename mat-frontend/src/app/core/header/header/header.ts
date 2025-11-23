import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../login/services/login-service';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [Menubar, ButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  constructor(private router: Router, private loginService: LoginService) {}

  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        command: () => { this.goToPage('dashboard') }
      },
      {
        label: 'Blindtest menu',
        icon: 'pi pi-volume-up',
        command: () => { this.goToPage('blindtest-menu') }
      }
    ]
  }

  public goToPage(pageLink: string) {
    this.router.navigate(['/' + pageLink]);
  }

  public logout() {
    this.loginService.logout();
  }
}
