import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalData } from '../../shared/global-data';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard {
  
  public user = GlobalData.currentUser ?? new User();
  
  constructor(private router: Router) {}
  
  goToBlindtestMenu() {
    this.router.navigate(['/blindtest-menu']);
  }
}
