import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
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
}

class Board extends React.Component {
  renderSquare(i) {
    const hand = convertToHand(i);
    const isCurrentHand = this.props.currentHand && checkIsHandSame(hand, this.props.currentHand);
    const isWinningSquare = this.props.winningLine && this.props.winningLine.includes(i);

    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        isCurrentHand={isCurrentHand}
        isWinningSquare={isWinningSquare}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(rowIndex) {
    const squaresInRow = Array(3)
      .fill(0)
      .map((value, colIndex) => {
        return this.renderSquare(rowIndex * 3 + colIndex);
      });

    return (
      <div key={rowIndex} className='board-row'>
        {squaresInRow}
      </div>
    );
  }

  render() {
    const board = Array(3)
      .fill(0)
      .map((value, rowIndex) => this.renderRow(rowIndex));

    return <div>{board}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null), hand: { col: null, row: null }, stepNumber: 0 }],
      stepNumber: 0,
      xIsNext: true,
      isHistoryOrderAsc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const hand = convertToHand(i);
    this.setState({
      history: history.concat([
        {
          squares: squares,
          hand: hand,
          hander: this.state.xIsNext ? 'X' : 'O',
          stepNumber: history.length,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    let history = this.state.history.slice();
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const winningLine = getWinningLine(current.squares, winner);

    if (!this.state.isHistoryOrderAsc) {
      history = history.reverse();
    }

    const moves = history.map((step, move) => {
      const desc = step.stepNumber === 0 ? 'Go to game start' : `Go to move #${step.stepNumber}`;
      const hand = step.stepNumber === 0 ? '' : `${step.hander}: (${step.hand.col}, ${step.hand.row})`;

      return (
        <li key={step.stepNumber}>
          <button onClick={() => this.jumpTo(step.stepNumber)}>{`${desc} ${hand}`}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (this.state.stepNumber === 9) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    const historyOrderToggleBtn = (
      <button onClick={() => this.setState({ isHistoryOrderAsc: !this.state.isHistoryOrderAsc })}>Toggle Order</button>
    );

    return (
      <div className='game'>
        <div className='game-board'>
          <Board
            squares={current.squares}
            currentHand={current.hand}
            winningLine={winningLine}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <div>{historyOrderToggleBtn}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares) {
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

function getWinningLine(squares, mark) {
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

function convertToHand(squareIdx) {
  const hand = { row: Math.floor(squareIdx / 3) + 1, col: (squareIdx % 3) + 1 };

  return hand;
}

function checkIsHandSame(hand1, hand2) {
  return hand1.row === hand2.row && hand1.col === hand2.col;
}
