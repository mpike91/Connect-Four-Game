/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let gameOver = false;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
  for (let y = 0; y < HEIGHT; y++) {
    board.push([]);
    for (let x = 0; x < WIDTH; x++) {
      board[y][x] = null;
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  htmlBoard = document.getElementById("board");

  // create "top" row element, assign id "column-top", and add event listener with handleClick function
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.classList.add(`red`);
  top.addEventListener("click", handleClick);

  // create td elements (according to WIDTH value) with ascending numbered id's, and append to the "top" tr element, and lastly append the "top" element to htmlBoard
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // create each "row" as a "tr" element according to the HEIGHT value, and for each row create each "cell" as a "td" element according to the WIDTH value; set each cell "id" attribute as the row#(y)-column#(x) and append each cell to that "row" element; finally, append each "row" to the htmlBoard
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

const findSpotForCol = x => {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) return y;
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

const placeInTable = (y, x) => {
  const td = document.getElementById(`${y}-${x}`);
  const div = document.createElement("div");
  div.classList.add("piece", `p${currPlayer}`, `row${y}`);
  div.style.transform = `translate(${td.offsetLeft+15}px, ${td.offsetTop+15}px)`;
  td.append(div);
}

/** endGame: announce game end */

const endGame = val => {
  gameOver = true;
  setTimeout(()=> {
    if (val === 0) return alert("Tie Game");
    val === 1 ? alert("Red player wins!") : alert("Blue player wins!");
  },500)
}

/** handleClick: handle click of column top to play piece */

const handleClick = evt => {
  // if game is over, return
  if (gameOver) return;

  // get x from ID of clicked cell
  let x = evt.target.id;

  // get next spot in column (if none, ignore click by returning)
  let y = findSpotForCol(x);
  if (y === null) return;

  // place piece in board and add to HTML table
  placeInTable(y, x);

  // update in-memory board
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) return endGame(currPlayer);

  // check for tie
  if (checkForTie()) return endGame(0);

  // switch players
  switchPlayers();
}

// switchPlayers: when called, simply switch currPlayer value from 1 to 2 or from 2 to 1
const switchPlayers = () => {
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
  document.getElementById("column-top").classList.toggle(`red`);
}

// checkForTie: check board row-by-row using .every array method to see if every space is "filled"; if not, return false; if every space in every row is filled ("true" from .every method), return true to indicate tie game
const checkForTie = () => {
  for (let y = 0; y < HEIGHT; y++) {
    if (!(board[y].every(val => val))) return false;
  }
  return true;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
  const _win = cells => {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates (within the bounds of the game board) & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // Begin looping over each row of cells, starting at y = 0 and going up to HEIGHT
  for (let y = 0; y < HEIGHT; y++) {
    // For each row (y), loop over each element (x up to WIDTH) and check the three horizontal, vertical, diagonalRight, and diagonalLeft cells in relation to each cell [y][x]
    for (let x = 0; x < WIDTH; x++) {
      // array of each cell value [y, x] and its three horizontal neighbors
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      // array of each cell value [y, x] and its three vertical neighbors
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      // array of each cell value [y, x] and its three diagonal-right neighbors
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      // array of each cell value [y, x] and its three diagonal left neighbors
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // For each cell, check if the array contains legal coordinates and all match currPlayer by calling _win function on each array created above, and if any return true, then return true to indicate the currPlayer is the winner
      if (_win(horiz)) {
        return winBGColor(horiz);
      }
      if (_win(vert)) {
        return winBGColor(vert);

      }
      if (_win(diagDR)) {
        return winBGColor(diagDR);

      }
      if (_win(diagDL)) {
        return winBGColor(diagDL);
      }
    }
  }
}

// Receives the "winning" array of cell positions, and sets the background color of each cell to green to "highlight" the position of the winning pieces
const winBGColor = winner => {
  for (let td of winner) {
    document.getElementById(`${td[0]}-${td[1]}`).style.backgroundColor = "rgb(0, 255, 0)";
  };
  return true;
}

makeBoard();
makeHtmlBoard();