import { Device } from "./models/device";
import { User } from "./models/user";

export class GlobalData {
  private static _currentUser: User;

  public static get currentUser(): User {
    return this._currentUser;
  }

  public static set currentUser(value: User) {
    this._currentUser = value;
    this.saveGlobalData();
  }

  private static saveGlobalData() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(this._currentUser));
    }
  }

  public static loadGlobalData() {
    if (typeof window !== 'undefined') {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser && currentUser !== 'undefined') {
        this._currentUser = JSON.parse(currentUser);
      }
    }
  }
}
