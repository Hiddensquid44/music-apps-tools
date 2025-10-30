import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalData } from '../../shared/global-data';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard implements OnInit {

  public user = GlobalData.currentUser ?? new User();

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('Dashboard initialized for user:', this.user);
  }

  goToBlindtestMenu() {
    this.router.navigate(['/blindtest-menu']);
  }
}
