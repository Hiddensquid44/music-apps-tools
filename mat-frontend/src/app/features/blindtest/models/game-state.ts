import { Playlist } from "../../../shared/models/playlist";
import { Track } from "../../../shared/models/track";

export class GameState {
  playlist: Playlist;
  playlistTracks: Track[];
  currentTrackIndex: number;
  wrongTracksNames: string[];
  gameStarted: boolean;
  gameOnGoing: boolean;
  gameEnded: boolean;
  score: number;

  constructor() {
    this.playlist = new Playlist();
    this.playlistTracks = [];
    this.currentTrackIndex = -1;
    this.wrongTracksNames = [];
    this.gameStarted = false;
    this.gameOnGoing = false;
    this.gameEnded = false;
    this.score = 0;
  }
}