console.log("tic-tac-toe.js loaded");

// Player factory
const Player = (name, mark) => {
  return { name, mark };
};

// Gameboard module
const Gameboard = (() => {
  let board = Array(9).fill("");

  const getBoard = () => board;

  const setMark = (index, mark) => {
    if (board[index] === "") {
      board[index] = mark;
      return true;
    }
    return false;
  };

  const reset = () => {
    board = Array(9).fill("");
  };

  return { getBoard, setMark, reset };
})();

// Game controller module
const GameController = (() => {
  let player1, player2, currentPlayer, winner = null;
  let isGameOver = false;

  const start = (name1, name2) => {
    player1 = Player(name1 || "Player 1", "X");
    player2 = Player(name2 || "Player 2", "O");
    currentPlayer = player1;
    Gameboard.reset();
    isGameOver = false;
    winner = null;
    DisplayController.render();
    DisplayController.setMessage(`${currentPlayer.name}'s turn`);
  };

  const playTurn = (index) => {
    if (isGameOver) return;
    if (Gameboard.setMark(index, currentPlayer.mark)) {
      DisplayController.render();
      if (checkWin(currentPlayer.mark)) {
        isGameOver = true;
        winner = currentPlayer;
        DisplayController.setMessage(`${winner.name} wins!`);
      } else if (Gameboard.getBoard().every(cell => cell !== "")) {
        isGameOver = true;
        DisplayController.setMessage("It's a tie!");
      } else {
        switchPlayer();
        DisplayController.setMessage(`${currentPlayer.name}'s turn`);
      }
    }
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWin = (mark) => {
    const winCombos = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return winCombos.some(combo => 
      combo.every(index => Gameboard.getBoard()[index] === mark)
    );
  };

  const restart = () => {
    start(player1.name, player2.name);
  };

  return { start, playTurn, restart };
})();

// Display controller module
const DisplayController = (() => {
  const boardDiv = document.getElementById("gameboard");
  const messageP = document.getElementById("message");

  const render = () => {
    boardDiv.innerHTML = "";
    Gameboard.getBoard().forEach((cell, index) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.textContent = cell;
      cellDiv.addEventListener("click", () => {
        GameController.playTurn(index);
      });
      boardDiv.appendChild(cellDiv);
    });
  };

  const setMessage = (msg) => {
    messageP.textContent = msg;
  };

  return { render, setMessage };
})();

// Event listeners
document.getElementById("start").addEventListener("click", () => {
  const name1 = document.getElementById("player1").value;
  const name2 = document.getElementById("player2").value;
  GameController.start(name1, name2);
});

document.getElementById("restart").addEventListener("click", () => {
  GameController.restart();
});