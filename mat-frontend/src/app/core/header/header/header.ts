import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../login/services/login-service';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TieredMenu } from 'primeng/tieredmenu';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { GlobalData } from '../../../shared/global-data';

@Component({
  selector: 'app-header',
  imports: [Menubar, ButtonModule, TieredMenu, IconFieldModule, InputIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  constructor(private router: Router, private loginService: LoginService) {}

  items: MenuItem[] | undefined;
  loginMenuItems: MenuItem[] | undefined;

  userName: string = GlobalData.currentUser?.display_name ?? '';

  ngOnInit(): void {
    console.log('Logged in user:', this.userName);
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

    if (GlobalData.currentUser !== undefined && GlobalData.currentUser.display_name !== undefined && GlobalData.currentUser.display_name !== '') {
      this.userName = GlobalData.currentUser.display_name;
    }

    this.loginMenuItems = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => { /*this.goToPage('profile')*/ }
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        command: () => { /*this.goToPage('settings')*/ }
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => { this.logout() }
      }
    ];
  }

  public goToPage(pageLink: string) {
    this.router.navigate(['/' + pageLink]);
  }

  public logout() {
    this.loginService.logout();
  }
}
