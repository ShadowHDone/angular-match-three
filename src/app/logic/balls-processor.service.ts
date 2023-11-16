import { Injectable } from '@angular/core';
import { Cell, GameMap, Position } from '../app.interfaces';

type MachedLine = { pos: Position; count: number };

type MachedObject = [MachedLine, MachedLine];

// @Injectable()
export class BallsProcessorService {
  private machedVertical: MachedLine[];
  private machedHorizontal: MachedLine[];

  constructor(private grid: number, private cells: Cell[]) {}

  public detectMaches(): BallsProcessorService {
    this.machedVertical = [];
    this.machedHorizontal = [];

    const addMachedHorizontal = (count: number, lastPos: Position) => {
      if (count >= 3) {
        const { x, y } = lastPos;
        this.machedHorizontal.push({
          pos: { x, y: y - count + 1 },
          count,
        });
      }
    };

    const addMachedVertical = (count: number, lastPos: Position) => {
      if (count >= 3) {
        const { x, y } = lastPos;
        this.machedVertical.push({
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

    return this;
  }

  public move(from: Position, to: Position): BallsProcessorService {
    const line: keyof Position = from.x === to.x ? 'y' : 'x';
    const selectedCellIndex = from.x * this.grid + from.y;
    const offset = {
      x: to.x - from.x,
      y: to.y - from.y,
    };
    this.cells[selectedCellIndex].offset = offset;

    const start = from[line] < to[line] ? from : to;
    const end = from[line] < to[line] ? to : from;

    if (offset[line] > 0) {
      for (let i = 1; i <= offset[line]; i++) {
        const pos: Position = { ...from };
        pos[line] += i;
        const index = pos.x * this.grid + pos.y;
        const cell = this.cells[index];
        cell.offset = { x: 0, y: 0 };
        cell.offset[line] -= 1;
      }

      return this;
    }

    for (let i = -1; i >= offset[line]; i--) {
      const pos: Position = { ...from };
      pos[line] += i;
      const index = pos.x * this.grid + pos.y;
      const cell = this.cells[index];
      cell.offset = { x: 0, y: 0 };
      cell.offset[line] += 1;
    }

    return this;
  }

  public applyMovements(): BallsProcessorService {
    this.cells.forEach((cell) => {
      if (!cell.offset) return;
      const swopBallIndex =
        (cell.pos.x + cell.offset.x) * this.grid + cell.pos.y + cell.offset.y;
      const swopBallColor = this.cells[swopBallIndex].color;
      this.cells[swopBallIndex].color = cell.color;
      cell.color = swopBallColor;
      delete cell.offset;
      delete this.cells[swopBallIndex].offset;
    });
    return this;
  }

  public colorMaches(): BallsProcessorService {
    this.machedHorizontal.forEach((boll) => {
      const index = boll.pos.x * this.grid + boll.pos.y;
      for (let i = 0; i < boll.count; i++) {
        this.cells[index + i].color = '';
      }
    });

    this.machedVertical.forEach((boll) => {
      const index = boll.pos.x * this.grid + boll.pos.y;
      for (let i = 0; i < boll.count; i++) {
        this.cells[index + i * this.grid].color = '';
      }
    });

    return this;
  }
}
