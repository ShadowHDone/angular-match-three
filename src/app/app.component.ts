import { Component, OnInit, VERSION } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Cell, GameMap, GameState } from './app.interfaces';
import { StorageService } from './storage/storage.service';

type Color =
  | 'blue'
  | 'aquamarine'
  | 'greenyellow'
  | 'crimson'
  | 'blueviolet'
  | '#0077FF'
  | 'darkorange';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  map: GameMap;
  mapForReload: string = '';
  count: number;
  name = 'Angular ' + VERSION.major;
  colors: Color[] = [
    'aquamarine',
    'greenyellow',
    'crimson',
    'blueviolet',
    'darkorange',
    '#0077FF',
  ];
  gridControl = new FormControl<number>(7);

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    this.loadGame();
  }

  saveGame(): void {
    this.storageService.saveMap(this.map);
    this.loadGame();
  }

  loadGame(): void {
    const state = this.storageService.loadState();
    if (state) {
      this.map = state.lastMap;
      this.gridControl.patchValue(state.lastMap.grid);
      this.mapForReload = JSON.stringify(this.map);
    }
  }

  newGame(): void {
    const grid = this.gridControl.value || 10;
    const cells = this.generateMap(grid);
    this.map = { grid, cells };
  }

  clearGame(): void {
    delete this.map;
  }

  reloadMap(): void {
    this.map = JSON.parse(this.mapForReload);
  }

  addCustom(): void {
    this.map.cells = this.generateMap(this.count);
    this.setColor(0, 1, 'greenyellow');
    this.setColor(1, 1, 'greenyellow');
    this.setColor(0, 2, 'blue');
    this.setColor(1, 2, 'blue');
    this.setColor(2, 2, 'crimson');
    this.setColor(3, 2, 'blue');
    this.setColor(4, 2, 'crimson');
    this.setColor(0, 3, 'greenyellow');
    this.setColor(1, 3, 'greenyellow');

    this.setColor(2, 0, 'blue');
    this.setColor(2, 4, 'blue');

    this.setColor(2, 1, 'blue');
    this.setColor(2, 3, 'blue');

    // this.setColor(2,0, 'blueviolet');
    // this.setColor(2,4, 'blueviolet');

    this.setColor(2, 5, 'blueviolet');
  }

  private generateMap(count: number): Cell[] {
    return Array(count * count)
      .fill({})
      .map((val, index) => ({
        pos: { x: Math.floor(index / count), y: index % count },
        color: this.colors[(this.colors.length * Math.random()) | 0],
      }));
  }

  private setColor(x: number, y: number, color: Color): void {
    this.map[x * this.count + y].color = color;
  }
}
