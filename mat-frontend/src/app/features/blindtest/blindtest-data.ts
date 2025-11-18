import { inject, Injectable, OnInit, PLATFORM_ID } from "@angular/core";
import { GameState } from "./models/game-state";
import { isPlatformBrowser } from "@angular/common";

@Injectable({ providedIn: 'root' })
export class BlindtestData implements OnInit {

  public static readonly BLINDTEST_SIZE = 10;

  private static readonly STORAGE_KEY = 'blindtest_gameState';
  
  private static _gameState: GameState;

  public static get gameState(): GameState {
    return this._gameState;
  }

  public static set gameState(gameState: GameState) {
    this._gameState = gameState;
    this.saveBlindtestData();
  }

  public ngOnInit() {
    BlindtestData.loadBlindtestData();
  }

  public static saveBlindtestData() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._gameState));
    }
  }

  public static loadBlindtestData() {
    const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    if (typeof window !== 'undefined' && isBrowser) {
      const gameState = localStorage.getItem(this.STORAGE_KEY);
      if (gameState && gameState !== 'undefined') {
        this._gameState = JSON.parse(gameState);
      } else {
        this._gameState = new GameState();
      }
    }
  }
}