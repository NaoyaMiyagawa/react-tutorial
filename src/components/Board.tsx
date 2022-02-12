import { checkIsHandSame, convertToHand } from '../functions/game';
import { BoardState, Hand, Line } from '../types/game';
import { Square } from './Square';

type BoardProps = {
  squares: BoardState;
  currentHand: Hand;
  winningLine: Line | null;
  onClick: (i: number) => void;
};

export const Board = (props: BoardProps) => {
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
