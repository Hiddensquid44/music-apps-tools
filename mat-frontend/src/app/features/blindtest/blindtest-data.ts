import { Playlist } from "../../shared/models/playlist";
import { Track } from "../../shared/models/track";

export class BlindtestData {

  public static readonly MAX_TRACKS = 10;

  private static _currentPlaylist: Playlist;
  private static _currentTrack: Track;

  public static get currentPlaylist(): Playlist {
    return this._currentPlaylist;
  }

  public static get currentTrack(): Track {
    return this._currentTrack;
  }

  public static set currentPlaylist(playlist: Playlist) {
    this._currentPlaylist = playlist;
    this.saveBlindtestData();
  }

  public static set currentTrack(track: Track) {
    this._currentTrack = track;
    this.saveBlindtestData();
  }

  public static saveBlindtestData() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('blindtest_currentPlaylist', JSON.stringify(this.currentPlaylist));
      localStorage.setItem('blindtest_currentTrack', JSON.stringify(this.currentTrack));
    }
  }

  public static loadBlindtestData() {
    if (typeof window !== 'undefined') {
      const playlist = localStorage.getItem('blindtest_currentPlaylist');
      if (playlist && playlist !== 'undefined') {
        this.currentPlaylist = JSON.parse(playlist);
      }
      const track = localStorage.getItem('blindtest_currentTrack');
      if (track && track !== 'undefined') {
        this.currentTrack = JSON.parse(track);
      }
    }
  }
}