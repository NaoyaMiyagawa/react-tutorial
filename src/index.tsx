import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

type SquareState = 'O' | 'X' | null;
type SquareProps = {
  value: SquareState;
  isCurrentHand: boolean;
  isWinningSquare: boolean;
  onClick: () => void;
};

const Square = (props: SquareProps) => {
  return (
    <button
      className={`
      square
      ${props.isCurrentHand ? 'square__current' : ''}
      ${props.isWinningSquare ? 'square__winning' : ''}
      `}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
};

type Hand = { row: number | null; col: number | null };
type Line = [number, number, number];
type BoardState = SquareState[];
type BoardProps = {
  squares: BoardState;
  currentHand: Hand;
  winningLine: Line | null;
  onClick: (i: number) => void;
};

const Board = (props: BoardProps) => {
  const renderSquare = (i: number) => {
    const hand = convertToHand(i);
    const isCurrentHand = props.currentHand && checkIsHandSame(hand, props.currentHand);
    const isWinningSquare = !!props.winningLine && props.winningLine.includes(i);

    return (
      <Square
        key={i}
        value={props.squares[i]}
        isCurrentHand={isCurrentHand}
        isWinningSquare={isWinningSquare}
        onClick={() => props.onClick(i)}
      />
    );
  };

  const renderRow = (rowIndex: number) => {
    const squaresInRow = Array(3)
      .fill(0)
      .map((value, colIndex) => {
        return renderSquare(rowIndex * 3 + colIndex);
      });

    return (
      <div key={rowIndex} className='board-row'>
        {squaresInRow}
      </div>
    );
  };

  const board = Array(3)
    .fill(0)
    .map((value, rowIndex) => renderRow(rowIndex));

  return <div>{board}</div>;
};

type Step = {
  squares: BoardState;
  hand: Hand;
  hander: SquareState;
  stepNumber: number;
};
type GameState = {
  readonly history: Step[];
  readonly stepNumber: number;
  readonly xIsNext: boolean;
  readonly isHistoryOrderAsc: boolean;
};
const Game = () => {
  const [state, setState] = useState<GameState>({
    history: [
      {
        squares: Array(9).fill(null),
        hand: { col: null, row: null },
        hander: null,
        stepNumber: 0,
      },
    ],
    stepNumber: 0,
    xIsNext: true,
    isHistoryOrderAsc: true,
  });

  const handleClick = (i: number) => {
    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = state.xIsNext ? 'X' : 'O';
    const hand = convertToHand(i);
    setState((prev) => ({
      ...prev,
      history: history.concat([
        {
          squares,
          hand,
          hander: state.xIsNext ? 'X' : 'O',
          stepNumber: history.length,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !state.xIsNext,
    }));
  };

  const jumpTo = (step: number) => {
    setState((prev) => ({
      ...prev,
      stepNumber: step,
      xIsNext: step % 2 === 0,
    }));
  };

  let history = state.history.slice();
  const current = history[state.stepNumber];
  const winner = calculateWinner(current.squares);
  const winningLine = getWinningLine(current.squares, winner);

  if (!state.isHistoryOrderAsc) {
    history = history.reverse();
  }

  const moves = history.map((step, move) => {
    const desc = step.stepNumber === 0 ? 'Go to game start' : `Go to move #${step.stepNumber}`;
    const hand = step.stepNumber === 0 ? '' : `${step.hander}: (${step.hand.col}, ${step.hand.row})`;

    return (
      <li key={step.stepNumber}>
        <button onClick={() => jumpTo(step.stepNumber)}>{`${desc} ${hand}`}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (state.stepNumber === 9) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (state.xIsNext ? 'X' : 'O');
  }
  const historyOrderToggleBtn = (
    <button onClick={() => setState((prev) => ({ ...prev, isHistoryOrderAsc: !state.isHistoryOrderAsc }))}>
      Toggle Order
    </button>
  );

  return (
    <div className='game'>
      <div className='game-board'>
        <Board
          squares={current.squares}
          currentHand={current.hand}
          winningLine={winningLine}
          onClick={(i) => handleClick(i)}
        />
      </div>
      <div className='game-info'>
        <div>{status}</div>
        <div>{historyOrderToggleBtn}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares: SquareState[]): SquareState | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getWinningLine(squares: SquareState[], mark: SquareState): Line | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] === mark && squares[b] === mark && squares[c] === mark) {
      return [a, b, c];
    }
  }
  return null;
}

function convertToHand(squareIdx: number) {
  const hand = { row: Math.floor(squareIdx / 3) + 1, col: (squareIdx % 3) + 1 };

  return hand;
}

function checkIsHandSame(hand1: Hand, hand2: Hand) {
  return hand1.row === hand2.row && hand1.col === hand2.col;
}
