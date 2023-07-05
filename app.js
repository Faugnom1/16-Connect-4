const board = document.getElementById("board");
const rows = 6;
const columns = 7;
const resetButton = document.getElementById("resetButton");
const player1ScoreElement = document.getElementById("player1Score");
const player2ScoreElement = document.getElementById("player2Score");
let currentPlayer = "player1";
let gameBoard = Array(rows)
  .fill()
  .map(() => Array(columns));
let player1Score = 0;
let player2Score = 0;

// Retrieve scores from local storage
if (localStorage.getItem("player1score")) {
  player1score = parseInt(localStorage.getItem("player1score"));
}
if (localStorage.getItem("player2score")) {
  player2score = parseInt(localStorage.getItem("player2score"));
}

// Update the score tracker elements
player1ScoreElement.textContent = `${player1Score}`;
player2ScoreElement.textContent = `${player2Score}`;

//Create game board
for (let i = 0; i < rows; i++) {
  const row = document.createElement("div");
  row.classList.add("row");

  for (let j = 0; j < columns; j++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.id = i + " " + j;
    row.appendChild(cell);
  }
  board.appendChild(row);
}

resetButton.addEventListener("click", resetGame);

// Remove class from each cell and redraw the game board
function resetGame() {
  cells.forEach((cell) => {
    cell.classList.remove("player1", "player2", "occupied");
  });
  currentPlayer = "player1";
  gameBoard = Array(rows)
    .fill()
    .map(() => Array(columns));
}

// Add event listener to each cell
const cells = document.querySelectorAll(".cell");
cells.forEach((cell) => {
  cell.addEventListener("click", handleClick);
});

function handleClick() {
  const clickedCell = this;
  if (clickedCell.classList.contains("occupied")) {
    return;
  }

  // Find the column index of the clicked cell
  const columnIndex = Number(
    Array.from(clickedCell.parentNode.children).indexOf(clickedCell)
  );

  // Find the bottommost unoccupied cell in the column
  const columnCells = document.querySelectorAll(
    `.row:nth-child(n+1) .cell:nth-child(${columnIndex + 1})`
  );
  const bottomCell = [...columnCells]
    .reverse()
    .find((cell) => !cell.classList.contains("occupied"));

  // Find the row index of the clicked cell
  const rowIndex = Number(bottomCell.id.split(" ")[0]);

  gameBoard[rowIndex][columnIndex] = currentPlayer;

  // Assign color to the cell based on the current player
  bottomCell.classList.add(currentPlayer);

  // Mark the cell as occupied
  bottomCell.classList.add("occupied");

  const playerWon = checkWin(rowIndex, columnIndex, currentPlayer);

  // Switch to the other player
  currentPlayer = currentPlayer === "player1" ? "player2" : "player1";
}

function checkWin(rowIndex, columnIndex, currentPlayer) {
  let playerWon = false;
  let count = 0;

  // Check horizontal
  for (let i = 0; i < columns; i++) {
    if (gameBoard[rowIndex][i] === currentPlayer) {
      count++;
    } else {
      count = 0;
    }
    if (count === 4) {
      playerWon = true;
      break;
    }
  }

  // Check vertical
  if (!playerWon) {
    count = 0;
    for (let i = 0; i < rows; i++) {
      if (gameBoard[i][columnIndex] === currentPlayer) {
        count++;
      } else {
        count = 0;
      }
      if (count === 4) {
        playerWon = true;
        break;
      }
    }
  }

  // Check diagonal (top-left to bottom-right)
  if (!playerWon) {
    count = 0;
    let startRow = rowIndex;
    let startColumn = columnIndex;
    while (startRow > 0 && startColumn > 0) {
      startRow--;
      startColumn--;
    }
    while (startRow < rows && startColumn < columns) {
      if (gameBoard[startRow][startColumn] === currentPlayer) {
        count++;
      } else {
        count = 0;
      }
      if (count === 4) {
        playerWon = true;
        break;
      }
      startRow++;
      startColumn++;
    }
  }

  // Check diagonal (top-right to bottom-left)
  if (!playerWon) {
    count = 0;
    let startRow = rowIndex;
    let startColumn = columnIndex;
    while (startRow > 0 && startColumn < columns - 1) {
      startRow--;
      startColumn++;
    }
    while (startRow < rows && startColumn >= 0) {
      if (gameBoard[startRow][startColumn] === currentPlayer) {
        count++;
      } else {
        count = 0;
      }
      if (count === 4) {
        playerWon = true;
        break;
      }
      startRow++;
      startColumn--;
    }
  }

  if (playerWon) {
    // Increment the score and update the score tracker elements
    if (currentPlayer === "player1") {
      player1Score++;
      player1ScoreElement.textContent = `${player1Score}`;
      // Update the player1Score in local storage
      localStorage.setItem("player1score", player1Score);
    } else {
      player2Score++;
      player2ScoreElement.textContent = `${player2Score}`;
      // Update the player2Score in local storage
      localStorage.setItem("player2score", player2Score);
    }
    setTimeout(() => {
      alert(`${currentPlayer} has won!`);
      resetGame();
    }, 50);
  }

  return playerWon;
}