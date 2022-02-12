import { useState } from 'react';
import { calculateWinner, convertToHand, getWinningLine } from '../functions/game';
import { GameState } from '../types/game';
import { Board } from './Board';

export const Game = () => {
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
