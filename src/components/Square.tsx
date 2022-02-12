import { SquareState } from '../types/game';

type SquareProps = {
  value: SquareState;
  isCurrentHand: boolean;
  isWinningSquare: boolean;
  onClick: () => void;
};

export const Square = (props: SquareProps) => {
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
