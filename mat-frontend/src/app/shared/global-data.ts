import { PlaybackState } from "./models/playback-state";
import { User } from "./models/user";

export class GlobalData {
  private static _currentUser: User;
  private static _playbackState: PlaybackState;

  public static get currentUser(): User {
    return this._currentUser;
  }

  public static set currentUser(value: User) {
    this._currentUser = value;
    this.saveGlobalData();
  }

  public static get playbackState(): PlaybackState {
    return this._playbackState;
  }

  public static set playbackState(value: PlaybackState) {
    this._playbackState = value;
    this.saveGlobalData();
  }

  public static clearGlobalData() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('playbackState');
    }
  }

  public static saveGlobalData() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(this._currentUser));
      localStorage.setItem('playbackState', JSON.stringify(this._playbackState));
    }
  }

  public static loadGlobalData() {
    if (typeof window !== 'undefined') {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser && currentUser !== 'undefined') {
        this._currentUser = JSON.parse(currentUser);
      }
      const playbackState = localStorage.getItem('playbackState');
      if (playbackState && playbackState !== 'undefined') {
        this._playbackState = JSON.parse(playbackState);
      }
    }
  }
}
