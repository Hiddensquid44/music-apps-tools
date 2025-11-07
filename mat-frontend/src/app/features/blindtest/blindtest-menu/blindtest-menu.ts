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
  public blindtestPlaylists = this.user.playlists
    .filter(playlist => playlist.tracks.total > BlindtestData.MAX_TRACKS + 3);

  constructor(private router: Router) {}

  ngOnInit() {}

  startBlindtest(id: number) {
    BlindtestData.currentPlaylist = this.blindtestPlaylists[id];
    this.router.navigate(['/blindtest-game']);
  }

}
