export type Position = {
  x: number;
  y: number;
};

export type Cell = {
  pos: Position;
  offset?: Position;
  color: string;
};

export type GameMap = {
  cells: Cell[];
  grid: number;
};

export type Settings = {
  autosave?: boolean;
};

export type GameState = {
  lastMap: GameMap;
  settings: Settings;
};
