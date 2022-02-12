export type SquareState = 'O' | 'X' | null;

export type Hand = { row: number | null; col: number | null };

export type Line = [number, number, number];

export type BoardState = SquareState[];

export type Step = {
  squares: BoardState;
  hand: Hand;
  hander: SquareState;
  stepNumber: number;
};

export type GameState = {
  readonly history: Step[];
  readonly stepNumber: number;
  readonly xIsNext: boolean;
  readonly isHistoryOrderAsc: boolean;
};
