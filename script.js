const MARKER_1 = "X";
const MARKER_2 = "O";


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

    return {mark, getBoard, isFull, getWinner};
})();



const gameController = (function() {
    let playerX = createPlayer(MARKER_1);
    let playerO = createPlayer(MARKER_2);


    
})();