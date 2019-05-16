import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={"square-" + i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(arr) {
    const squares = arr.map(idx => this.renderSquare(idx));
    return (
      <div key={"row-" + arr} className="board-row">
        {squares}
      </div>
    )
  }

  render() {
    const rows = [0, 1, 2].map(row => {
      const start = 3 * row;
      return this.renderRow([start, start + 1, start + 2]);
    })

    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      winningLine: null,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (this.state.winningLine || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      winningLine: this.winningLine(squares),
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      winningLine: this.winningLine(this.round(step).squares),
    });
  }

  movesLeft() {
    const current_squares = this.current_round().squares;
    // The filter here gets rid of null elements
    return 9 - current_squares.filter(el => el).length;
  }

  winningLine(squares) {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ];
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return lines[i];
        }
      }
      return null;
  }

  current_round() {
    return this.round(this.state.stepNumber);
  }

  round(step) {
    return this.state.history[step];
  }

  winner() {
    if (this.state.winningLine) {
      return this.current_round().squares[this.state.winningLine[0]]
    }
    return null;
  }

  moveHistory() {
    return this.state.history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={"move-" + move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
  }

  gameStatus() {
    const winner = this.winner();

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (this.movesLeft() === 0) {
      status = "No one wins; Womp Womp";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return status;
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={this.current_round().squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{this.gameStatus()}</div>
          <ol>{this.moveHistory()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
