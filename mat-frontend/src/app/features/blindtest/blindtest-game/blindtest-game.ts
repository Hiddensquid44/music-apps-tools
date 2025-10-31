import { Component } from '@angular/core';
import { Playlist } from '../../../shared/models/playlist';
import { BlindtestData } from '../blindtest-data';
import { SharedService } from '../../../shared/shared-service';

@Component({
  selector: 'app-blindtest-game',
  imports: [],
  templateUrl: './blindtest-game.html',
  styleUrl: './blindtest-game.css'
})
export class BlindtestGame {

  public playlist = BlindtestData.currentPlaylist ?? new Playlist();

  constructor(private sharedService: SharedService) {}

  playPlaylist(): void {
    this.sharedService.playPlaylist(this.playlist.uri, true);
  }

  shufflePlaylist(state: boolean = true): void {
    this.sharedService.toggleShuffle(state);
  }

}
