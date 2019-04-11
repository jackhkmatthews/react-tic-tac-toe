import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function getWinningLine(squares) {
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
  let winningLine = null;
  lines.forEach(line => {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winningLine = line;
    }
  });
  return winningLine;
}

function getWinner(squares) {
  const winningLine = getWinningLine(squares);
  return winningLine ? squares[winningLine[0]] : null;
}

function getNewMove(prevSquares, newSquares) {
  let coordinates;
  prevSquares.forEach((square, index) => {
    if (square !== newSquares[index]) {
      const row = Math.floor(index / 3);
      const col = index % 3;
      coordinates = `(col: ${col}, row: ${row})`;
    }
  });
  return coordinates;
}

function Square(props) {
  return (
    <button
      className={`square${props.winner ? " square--winner" : ""}`}
      onClick={props.onClick}
    >
      {props.player}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const { player, winner } = this.props.squares[i];
    return (
      <Square
        player={player}
        winner={winner}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null), newMove: null }],
      xIsNext: true,
      stepNumber: 0
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (getWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    const newMove = getNewMove(current.squares, squares);
    this.setState({
      history: history.concat([{ squares, newMove }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }
  render() {
    const { history, stepNumber } = this.state;
    const current = history[this.state.stepNumber];
    const winningLine = getWinningLine(current.squares);
    const winner = getWinner(current.squares);
    const squares = current.squares.map((square, index) => {
      const newSquare = {
        player: square,
        winner: false
      };
      if (winningLine) {
        if (
          index === winningLine[0] ||
          index === winningLine[1] ||
          index === winningLine[2]
        ) {
          newSquare.winner = true;
        }
      }
      return newSquare;
    });

    const moves = history.map((step, move) => {
      let desc = "Go to game start";
      if (move) {
        desc = `Go to move #${move} ${step.newMove}`;
      }
      return (
        <li key={move}>
          <button
            style={{ fontWeight: move === stepNumber ? "bold" : "normal" }}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
