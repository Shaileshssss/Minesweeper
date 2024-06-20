const board = document.querySelector('.board');
const restartBtn = document.querySelector('.restart-btn');
const flagsCountDisplay = document.getElementById('flags-count');

const ROWS = 10;
const COLS = 10;
const MINES = 15;

letboardArray = [];
let revealedCells = 0;
let flagsCount = 0;
let isGameOver = false;

// function to create game board
function createBoard() {
    for(let i = 0; i < ROWS; i++) {
        boardArray[i] = [];
        for (let j = 0; j < COLS; j++) {
            const cell = document.createElement("div");
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;

            // Append the cell to the board & update the boardArray
            board.appendChild(cell);
            boardArray[i][j] = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                value: 0,
            }

            // Add event listeners for cell click & right click (context menu)
            cell.addEventListener("click", () => revealeCells(i,j));
            cell.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                toggleFlag(i,j);
            })
        }
    }
}

// Fumction to randomly place mines on the board
function placeMines() {
    let minesPlaced = 0;
    while(minesPlaced < MINES) {
        // Generate random Coordinates
        let row = Math.floor(Math.random() * ROWS);
        let col = Math.floor(Math.random() * COLS);

        // if the cell doesn't already contain a mine, place one & update adjacentcell
        if(!boardArray[row][col].isMine) {
            boardArray[row][col].isMine = true;
            updateAdjacentCells(row,col);
            minesPlaced++;
        }
    }
}

// Function to update values of adjacent cells when a mine is placed
function updateAdjacentCells(row, col) {
    for(let i = Math.max(0, row -1); i <= Math.min(row +1, ROWS -1); i++) {
        for(
            let j = Math.max(0, col -1); j <= Math.min(col +1, COLS -1); j++
        ){
            boardArray[i][j].value++;
        }
    }
}

// function to reveal a cell when clicked
function revealeCells(row, col) {
// check if the game is over or cell is already revealed or flagged
if(
    isGameOver ||
    boardArray[row][col].isRevealed ||
    boardArray[row][col].isFlagged
)
return;

// get the clicked cell
const cell = board.children[row * COLS + col];
// If the cell is a mine, end the game
if(boardArray[row][col].isMine){
    gameOver();
    return;
}

// otherwise reveal the cell & check for the win condition
reveal(row, col);
if (revealeCells === ROWS * COLS - MINES){
    win();
}
}

// Function to recursively reveal cells & their neighbors
function reveal(row, col) {
    const cell = board.children[row * COLS + col];
    if(!boardArray[row][col].isRevealed) {
        revealedCells++;
        boardArray[row][col].isRevealed = true;
        cell.classList.add('revealed');

        // If the cell has no adjacent mines, reveal neighbouring cells recursively
        if(boardArray[row][col].value === 0){
            for(
                let i = Math.max(0, row -1);
                i <= Math.min(row +1, ROWS -1);
                i++
            ){
                for(
                    let j = Math.max(0, col -1);
                    j <= Math.min(col + 1, COLS - 1);
                    j++
                ){
                    reveal(i,j);
                }
            }
        } else {
            // Otherwise display the cells value
            cell.textContent = boardArray[row][col].value;
        }
    }
}

// Function to toggle flag on right click
function toggleFlag(row, col) {
    const cell = board.children[row *COLS + col];
    if(!boardArray[row][col].isRevealed) {
        if(!boardArray[row][col].isFlagged && flagsCount < MINES) {
            boardArray[row][col].isFlagged = true;
            cell.classList.add('flagged');
            cell.innerHTML = "🚩";
            flagsCount++;
        } else if(boardArray[row][col].isFlagged){
            boardArray[row][col].isFlagged = false;
            cell.classList.remove("flagged");
            cell.innerHTML = "";
            flagsCount--;
        }
        flagsCountDisplay.textContent = MINES - flagsCount;
    }
}

// Function to handle Game Over
function gameOver() {
    isGameOver = true;
    // reveal all mines and display game over alert
    for(let i = 0; i < ROWS; i++) {
        for(let j = 0; j < COLS; j++){
            if(boardArray[i][j].isMine) {
                const cell = board.children[i * COLS + j];
                cell.classList.add('revealed', "mine");
                cell.innerHTML = "💣";
            }
        }
    }
    setTimeout(() => {
        alert("Game Over!");
    }, 200)
}

// Function to handle win condition
function win() {
    isGameOver = true;
    alert("Congratulations You Won");
}

// Function to restart the game
function restartGame() {
    // Clear the board & reset variables
    board.innerHTML = "";
    boardArray = []; 
    revealedCells = 0;
    flagsCount = 0;
    isGameOver = false;
    // Recreate the board and place mines
    createBoard();
    placeMines();
    // Update flags count display
    flagsCountDisplay.textContent = MINES;
}

// Add event listener for restart button click
restartBtn.addEventListener("click",restartGame);

// Initialize the game
function init() {
    createBoard();
    placeMines();
    flagsCountDisplay.textContent = MINES;
}

init();  //Start the game
