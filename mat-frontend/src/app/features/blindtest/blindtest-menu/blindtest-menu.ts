import { Component } from '@angular/core';
import { GlobalData } from '../../../shared/global-data';
import { User } from '../../../shared/models/user';
import { Router } from '@angular/router';
import { BlindtestData } from '../blindtest-data';
import { GameState } from '../models/game-state';
import { Card } from "primeng/card";
import { Playlist } from '../../../shared/models/playlist';

@Component({
  selector: 'app-blindtest-menu',
  imports: [Card],
  templateUrl: './blindtest-menu.html',
  styleUrl: './blindtest-menu.css'
})
export class BlindtestMenu {

  public user = GlobalData.currentUser ?? new User();
  public blindtestPlaylists: Playlist[];

  constructor(private router: Router) {
    this.blindtestPlaylists = this.user.playlists
      .filter(playlist => playlist.tracks.total > BlindtestData.BLINDTEST_SIZE + 3);
  }

  startBlindtest(id: number) {
    const gameState = new GameState();
    gameState.playlist = this.blindtestPlaylists[id];
    BlindtestData.gameState = gameState;
    this.router.navigate(['/blindtest-game']);
  }

}
