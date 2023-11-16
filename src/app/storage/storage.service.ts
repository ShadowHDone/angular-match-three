import { Injectable } from '@angular/core';
import { GameMap, GameState, Settings } from '../app.interfaces';

const GAME_STATE_TOCKEN = 'game-state';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private state: GameState;

  loadState(): GameState {
    if (this.state) return this.state;
    const state = JSON.parse(localStorage.getItem(GAME_STATE_TOCKEN));
    if (state) this.state = state as GameState;
    return state;
  }

  saveMap(map: GameMap): void {
    this.state.lastMap = map;
    this.saveState(this.state);
  }

  saveSettings(settings: Settings): void {
    this.state.settings = settings;
    this.saveState(this.state);
  }

  saveState(state: GameState): void {
    console.log('saved state');
    localStorage.setItem(GAME_STATE_TOCKEN, JSON.stringify(state));
  }
}
