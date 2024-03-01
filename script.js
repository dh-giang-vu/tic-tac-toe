const MARKER_1 = "X";
const MARKER_2 = "O";
const BOARD_DMS = 3;
const boardContainer = document.querySelector(".board-container");


const announcement = document.querySelector(".announcement");
const newRoundBtn = announcement.querySelector("button");
const message = announcement.querySelector("p");
const newGameBtn = document.querySelector("#ng");


// A Player has a score and a marker i.e "X" and "O"
function createPlayer(marker) {
    let score = 0;
    const getScore = () => score;
    const incrementScore = () => score++;
    const resetScore = () => score = 0;
    
    return {marker, getScore, incrementScore, resetScore};
}

// gameBoard has a 3x3 board
// each square in board can be marked by player
const gameBoard = (function() {
    const board = new Array(3).fill(0).map(() => new Array(3).fill(0));
    const getBoard = () => board;
    
    // Return true if board is completely filled out
    const isFull = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === 0) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // 8 ways to win, 3 rows, 3 columns, 2 diagonals
    const winConditionSets = [
        new Set([0,1,2]),
        new Set([3,4,5]),
        new Set([6,7,8]),
        new Set([0,3,6]),
        new Set([1,4,7]),
        new Set([2,5,8]),
        new Set([0,4,8]),
        new Set([2,4,6])
    ]
    
    // Array track sum of the markers on each of the 8 ways to win
    const winChecker = new Array(8).fill(0);
    
    // Mark the board and update winChecker, return true if successful
    // Return false otherwise
    const mark = (i, j, marker) => {
        if (board[i][j] === 0) {
            board[i][j] = marker;
        }
        else {
            return false;
        }

        let index = 3*i+j;
        let markerValue = (marker === MARKER_1) ? 1 : -1;

        for (let i = 0; i < winConditionSets.length; i++) {
            if (!winConditionSets[i].has(index)) {
                continue;
            }
            winChecker[i] += markerValue;
        }
        return true;
    } 

    // Return winner, null if there are no winner
    const getWinner = () => {
        for (let i = 0; i < winChecker.length; i++) {
            if (winChecker[i] === 3) {
                return MARKER_1;
            }
            else if (winChecker[i] === -3) {
                return MARKER_2;
            }
        }

        return null;
    }

    // Clear all markers off of board & clear winChecker
    const clearBoard = () => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                board[i][j] = 0;
            }
        }

        winChecker.fill(0);
    }

    return {mark, getBoard, isFull, getWinner, clearBoard};
})();




const displayController = (function() {
    const squares = boardContainer.children;
    const scoreContainer = document.querySelector(".score-container");

    const updateScoreDisplay = (player) => {
        let playerScoreDiv;
        
        if (player.marker === MARKER_1) {
            playerScoreDiv = scoreContainer.children.item(0);
        }
        else {
            playerScoreDiv = scoreContainer.children.item(1);
        }
        
        playerScoreDiv.querySelector("span").textContent = player.getScore();
    }
    
    const updateBoardDisplay = () => {
        console.log("Update Display");
        
        let board = gameBoard.getBoard();
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                let index = 3*i + j;
                if (board[i][j] === 0) {
                    squares.item(index).textContent = "";
                    continue;
                }
                squares.item(index).textContent = board[i][j];
            }
        }
    }
    
    return {updateBoardDisplay, updateScoreDisplay};
})();




const gameController = (function() {
    let playerX = createPlayer(MARKER_1);
    let playerO = createPlayer(MARKER_2);

    let currentPlayer = playerX;
    let roundWinner = null;

    // Set up new round, keeping player's current score
    const newRound = () => {
        currentPlayer = playerX;
        gameBoard.clearBoard();
        displayController.updateBoardDisplay();

        roundWinner = null;
    }

    // Set up new game, resetting players' score
    const newGame = () => {
        newRound();
        playerX.resetScore();
        playerO.resetScore();
        displayController.updateScoreDisplay(playerX);
        displayController.updateScoreDisplay(playerO);
    }

    // 1 player's turn
    const playTurn = (squareNum) => {
        if (roundWinner !== null) {
            return;
        }

        // Calculate i, j indices base on clicked square's id
        let i = Math.floor(squareNum / BOARD_DMS);
        let j = squareNum % BOARD_DMS;

        const markSuccessful = gameBoard.mark(i, j, currentPlayer.marker);
        // Couldn't mark at chosen location => early return
        if (!markSuccessful) {
            return;
        }
        
        // Update display
        displayController.updateBoardDisplay();

        roundWinner = gameBoard.getWinner();
        if (roundWinner !== null) {
            // Announce winner
            console.log(roundWinner);
            // Increment winner's score
            let pl = (roundWinner === MARKER_1) ? playerX : playerO;
            pl.incrementScore();
            // Update display
            displayController.updateScoreDisplay(pl);
            return;
        }

        // Switch to next player's turn
        currentPlayer = (currentPlayer === playerX) ? playerO : playerX;
    }

    return {newRound, newGame, playTurn, playerX, playerO};
    
})();



boardContainer.addEventListener("click", function(e) {
    if (e.target.className === "square") {
        gameController.playTurn(e.target.id);
    }
})


message.textContent = "";
newRoundBtn.addEventListener("click", () => gameController.newRound());
newGameBtn.addEventListener("click", () => gameController.newGame());