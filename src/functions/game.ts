import { Hand, Line, SquareState } from '../types/game';

const straightLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const calculateWinner = (squares: SquareState[]): SquareState | null => {
  for (let i = 0; i < straightLines.length; i++) {
    const [a, b, c] = straightLines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export const getWinningLine = (squares: SquareState[], mark: SquareState): Line | null => {
  for (let i = 0; i < straightLines.length; i++) {
    const [a, b, c] = straightLines[i];
    if (squares[a] === mark && squares[b] === mark && squares[c] === mark) {
      return [a, b, c];
    }
  }
  return null;
};

export const convertToHand = (squareIdx: number) => {
  return { row: Math.floor(squareIdx / 3) + 1, col: (squareIdx % 3) + 1 };
};

export const checkIsHandSame = (hand1: Hand, hand2: Hand) => {
  return hand1.row === hand2.row && hand1.col === hand2.col;
};
