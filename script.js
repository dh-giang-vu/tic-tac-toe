const MARKER_1 = "X";
const MARKER_2 = "O";
const boardContainer = document.querySelector(".board-container");


function createPlayer(marker) {
    let score = 0;
    const getScore = () => score;
    const incrementScore = () => score++;
    
    return {marker, getScore, incrementScore};
}

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

    const clearBoard = () => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                board[i][j] = 0;
            }
        }
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

    const playTurn = (squareNum) => {
        let i = Math.floor(squareNum / 3);
        let j = squareNum % 3;

        if (gameBoard.mark(i, j, currentPlayer.marker)) {
            displayController.updateBoardDisplay();
            currentPlayer = (currentPlayer === playerX) ? playerO : playerX;
        }
        else {
            return;
        }

        let winnerMarker = gameBoard.getWinner();
        if (winnerMarker !== null) {
            winner = (winnerMarker === MARKER_1) ? playerX : playerO;
            winner.incrementScore();
            displayController.updateScoreDisplay(winner);

            gameBoard.clearBoard();
            displayController.updateBoardDisplay();
        }
        else if (gameBoard.isFull()){
            console.log("Draw");
        }
    }

    return {playTurn}
    
})();




boardContainer.addEventListener("click", function(e) {
    if (e.target.className === "square") {
        gameController.playTurn(e.target.id);
    }
})
