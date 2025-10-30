import { Component } from '@angular/core';
import { Playlist } from '../../../shared/models/playlist';
import { BlindtestData } from '../blindtest-data';

@Component({
  selector: 'app-blindtest-game',
  imports: [],
  templateUrl: './blindtest-game.html',
  styleUrl: './blindtest-game.css'
})
export class BlindtestGame {

  public playlist = BlindtestData.currentPlaylist ?? new Playlist();

  constructor() {
    console.log('Blindtest Game initialized');
  }

}
