import { Component, Input, OnInit } from '@angular/core';
import { Cell, Position, Settings } from '../app.interfaces';
import { BallsProcessorService } from '../logic/balls-processor.service';
import { StorageService } from '../storage/storage.service';

type MachedLine = { pos: Position; count: number };

type MachedObject = [MachedLine, MachedLine];

@Component({
  selector: 'app-battlefield',
  templateUrl: './battlefield.component.html',
  styleUrls: ['./battlefield.component.scss'],
})
export class BattlefieldComponent implements OnInit {
  @Input() cells: Cell[];
  @Input() grid: number;

  settings: Settings;
  selected: Position;

  constructor(private storageService: StorageService) {}

  ngOnInit() {}

  click(pos: Position): void {
    // add prevention if there is animation state
    if (this.selected) {
      this.moveCheck(pos);
      delete this.selected;
      return;
    }
    this.selected = pos;
  }

  moveCell(cell: Cell): string {
    if (!cell.offset) return '';
    return `translate(${cell.offset.y}00%, ${cell.offset.x}00%)`;
  }

  private moveCheck(pos: Position): void {
    if (pos.x != this.selected.x && pos.y != this.selected.y) return;

    this.processing(pos);

    this.saveState();
  }

  private saveState(): void {
    if (this.storageService.loadState()?.settings?.autosave)
      this.storageService.saveMap({ cells: this.cells, grid: this.grid });
  }

  private processing(pos: Position): void {
    const processor = new BallsProcessorService(this.grid, this.cells).move(
      this.selected,
      pos
    );
    setTimeout(() => {
      processor.applyMovements().detectMaches().colorMaches();
    }, 400);
  }

  private processing_old(): void {
    const machedVertical: MachedLine[] = [];
    const machedHorizontal: MachedLine[] = [];

    const addMachedHorizontal = (count: number, lastPos: Position) => {
      if (count >= 3) {
        const { x, y } = lastPos;
        machedHorizontal.push({
          pos: { x, y: y - count + 1 },
          count,
        });
      }
    };

    const addMachedVertical = (count: number, lastPos: Position) => {
      if (count >= 3) {
        const { x, y } = lastPos;
        machedVertical.push({
          pos: { x: x - count + 1, y },
          count,
        });
      }
    };

    for (let i = 0; i < this.grid; i++) {
      let colorHorizontal = null;
      let machesHorizontal = 0;
      let colorVertical = null;
      let machesVertical = 0;
      for (let j = 0; j < this.grid; j++) {
        const cellHorizontal = this.cells[i * this.grid + j];
        const cellVertical = this.cells[j * this.grid + i];

        if (colorHorizontal === cellHorizontal.color) {
          machesHorizontal++;
        } else {
          addMachedHorizontal(machesHorizontal, { x: i, y: j - 1 });
          colorHorizontal = cellHorizontal.color;
          machesHorizontal = 1;
        }

        if (colorVertical === cellVertical.color) {
          machesVertical++;
        } else {
          addMachedVertical(machesVertical, { x: j - 1, y: i });
          colorVertical = cellVertical.color;
          machesVertical = 1;
        }
      }
      addMachedHorizontal(
        machesHorizontal,
        this.cells[i * this.grid + this.grid - 1].pos
      );
      // this.cells.length - (this.grid - i) лайфхак,
      // т.к. известно, что для vertical это всегда последний ряд
      addMachedVertical(
        machesVertical,
        this.cells[this.cells.length - (this.grid - i)].pos
      );
    }

    machedHorizontal.forEach((boll) => {
      const index = boll.pos.x * this.grid + boll.pos.y;
      for (let i = 0; i < boll.count; i++) {
        this.cells[index + i].color = '';
      }
    });

    machedVertical.forEach((boll) => {
      const index = boll.pos.x * this.grid + boll.pos.y;
      for (let i = 0; i < boll.count; i++) {
        this.cells[index + i * this.grid].color = '';
      }
    });
  }
}
