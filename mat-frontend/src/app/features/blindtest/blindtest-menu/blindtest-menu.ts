import { Component } from '@angular/core';
import { GlobalData } from '../../../shared/global-data';
import { User } from '../../../shared/models/user';
import { Router } from '@angular/router';
import { BlindtestData } from '../blindtest-data';

@Component({
  selector: 'app-blindtest-menu',
  imports: [],
  templateUrl: './blindtest-menu.html',
  styleUrl: './blindtest-menu.css'
})
export class BlindtestMenu {
  
  public user = GlobalData.currentUser ?? new User();

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('Blindtest Menu initialized for user:', this.user);
  }

  startBlindtest(id: number) {
    BlindtestData.currentPlaylist = this.user.playlists[id];
    this.router.navigate(['/blindtest-game']);
  }

}
