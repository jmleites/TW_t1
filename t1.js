document.addEventListener("DOMContentLoaded", function () {
    const gameBoard = document.getElementById("game-board");
    const numRows = 5;
    const numCols = 6;

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.id = `cell-${row * numCols + col + 1}`;
            gameBoard.appendChild(cell);
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Create 12 white pieces
    const whitePieces = createPieces('white', 12);

    // Create 12 black pieces
    const blackPieces = createPieces('black', 12);

    // Append the white pieces to the left container
    const whitePiecesContainer = document.querySelector('.white-pieces');
    whitePieces.forEach((piece) => whitePiecesContainer.appendChild(piece));

    // Append the black pieces to the right container
    const blackPiecesContainer = document.querySelector('.black-pieces');
    blackPieces.forEach((piece) => blackPiecesContainer.appendChild(piece));
});

document.addEventListener("DOMContentLoaded", function () {
    var iniciarJogoButton = document.querySelector(".top-button button");
    var topButtons = document.getElementById("top-buttons");
    var botButtons = document.getElementById("bottom-buttons");
    var gameBoard = document.getElementById("game-board");
    let pieceCount = 0;

    iniciarJogoButton.addEventListener("click", function () {
            topButtons.style.display = "none";
            botButtons.style.display = "none";
            gameBoard.style.opacity = 0.9;
            initializeGame();
    });

    function initializeGame() {
        boardCells.forEach(function (cell) {
            cell.innerHTML = '';
        });
        currentPlayer = 1;
        startPlayerTurn('white', pieceCount);
    }

    function startPlayerTurn(pieceColor) {
        function clickHandler(cell) {
            return function(event) {
                if (currentPlayer === 1 && !cell.querySelector('.piece') && pieceCount < 12 && !blockedCellsForWhite().has(cell)) {
                    cell.innerHTML = `<div class="piece ${pieceColor}"></div>`;
                    blockedCellsForWhite().forEach((blockedCell) => blockedCell.classList.remove('blocked'));
                    currentPlayer = 2; // Switch to the other player
                    cell.removeEventListener("click", clickHandler(cell));
                    setTimeout(() => simulateAITurn(), 1);
                }
            }
        }
        boardCells.forEach(function (cell) {
            cell.removeEventListener("click", clickHandler(cell));
            cell.classList.remove('blocked');
        });
    
        blockedCellsForWhite().forEach((blockedCell) => blockedCell.classList.add('blocked'));
    
        boardCells.forEach(function (cell) {
            cell.addEventListener("click", clickHandler(cell));
        });
    }

    function simulateAITurn() {
            pieceCount++;
            placePieceRandomly('black', pieceCount);
            currentPlayer = 1;
        }

    function placePieceRandomly(pieceColor, pieceCount) {
        if (pieceCount <= 12) {
            const blockedCells = blockedCellsForBlack();
            const emptyCells = [...boardCells].filter((cell) => !cell.querySelector(".piece") && !blockedCells.has(cell));
            if (emptyCells.length > 0) {
                const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                randomCell.innerHTML = `<div class="piece ${pieceColor}"></div>`;
            }
            if (pieceCount < 12) {
                startPlayerTurn('white');  
            }
        }
        if (pieceCount == 12) {
            placePieceOver();
        }
    }

    function placePieceOver() {
        currentPlayer = 1;
        addClickToWhitePieces();
    }

    let selectedPiece = null;

    function addClickToWhitePieces() {
        clearHighlightedCells();
        boardCells.forEach((cell) => {
            cell.removeEventListener('click', handleWhitePieceClick);
            const piece = cell.querySelector('.piece.white');
            if (piece) {
                cell.addEventListener('click', handleWhitePieceClick);
            }
        });
    }
    
    function handleWhitePieceClick(event) {
        clearHighlightedCells();
        const cell = event.currentTarget;
        const piece = cell.querySelector('.piece.white');
        cell.removeEventListener('click', handleWhitePieceClick);
        if (currentPlayer === 1) {
            // Deselect the previously selected piece
            if (selectedPiece) {
                selectedPiece.classList.remove('selected-white');
            }
    
            // Select the new piece for movement
            selectedPiece = piece;
            selectedPiece.classList.add('selected-white'); // Add the "selected" class
            highlightAvailableMoves(cell);
            // Add a click listener to the selected piece
        }
    }
    
    function highlightAvailableMoves(cell) {
        const cellId = cell.id;
        const cellNumber = parseInt(cellId.split("-")[1], 10);
    
        // Define the possible move directions
        const directions = [
            { class: 'highlight-up', row: -1, col: 0 },
            { class: 'highlight-down', row: 1, col: 0 },
            { class: 'highlight-left', row: 0, col: -1 },
            { class: 'highlight-right', row: 0, col: 1 },
        ];
    
        directions.forEach((direction) => {
            const newRow = Math.floor((cellNumber - 1) / 5) + direction.row;
            const newCol = ((cellNumber - 1) % 5) + direction.col;
    
            // Check if the new cell is within the board boundaries (5x6) and doesn't have a piece
            if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 5) {
                const newCellNumberId = newRow * 5 + newCol + 1;
                const newCell = document.getElementById(`cell-${newCellNumberId}`);
                if (!newCell.querySelector('.piece')) {
                    newCell.classList.add(direction.class);
                    newCell.addEventListener('click', () => {
                        // Call a function to handle the move in the selected direction
                        handleMoveInDirection(direction);
                    });  
                }
            }
        });
    }

    let previousCellId = null;
    let previousPiece = null;
    
    function handleMoveInDirection(direction) {
        // Define the current cell and its ID
        const currentCell = selectedPiece.parentElement;
        const currentCellId = currentCell.id;
        const currentCellNumber = parseInt(currentCellId.split("-")[1], 10);
        // Calculate the new cell's ID and position
        const newRow = Math.floor((currentCellNumber - 1) / 5) + direction.row;
        const newCol = ((currentCellNumber - 1) % 5) + direction.col;
        const newCellNumberId = newRow * 5 + newCol + 1;
        const newCell = document.getElementById(`cell-${newCellNumberId}`);
        const newPiece = currentCell.querySelector(".piece");
        logCellsWithPieces();
    
        // Check if the new cell is within the board boundaries (5x6) and doesn't have a piece
        if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 5 && !newCell.querySelector('.piece') && (previousCellId !== newCellNumberId || previousPiece != newPiece)) {
            previousCellId = currentCellNumber;
            // Move the piece to the new cell
            newCell.appendChild(selectedPiece);
            previousPiece = newCell.querySelector(".piece");
            currentCell.innerHTML = '';
            clearHighlightedCells(); // Clear the highlights
            selectedPiece.classList.remove('selected-white');
            const upThreeInARow = checkForThreeInARow(newCell, { row: -1, col: 0 });
            const downThreeInARow = checkForThreeInARow(newCell, { row: 1, col: 0 });
            const leftThreeInARow = checkForThreeInARow(newCell, { row: 0, col: -1 });
            const rightThreeInARow = checkForThreeInARow(newCell, { row: 0, col: 1 });
            if (upThreeInARow || downThreeInARow || leftThreeInARow || rightThreeInARow) {
                addClickToOpponentPieces();
            }
            else {
                currentPlayer = 2;
                moveBlackPiece();
            }
        }
    }

    function addClickToOpponentPieces() {
        boardCells.forEach((cell) => {
            const opponentPiece = cell.querySelector('.piece.black'); // Assuming opponent's pieces have the class 'piece.black'
            if (opponentPiece) {
                cell.addEventListener('click', removeOpponentPiece);
            }
        });
    }
    
    function removeOpponentPiece(event) {
        if (selectedPiece) {
            const cell = event.currentTarget;
            const opponentPiece = cell.querySelector('.piece.black');
            if (opponentPiece) {
                cell.removeEventListener('click', removeOpponentPiece);
                cell.removeChild(opponentPiece);
                currentPlayer = 2;
                moveBlackPiece();
                // Add your logic for further game actions, like updating the game state
            }
        }
    }
    

    function checkForThreeInARow(cell, direction) {
        const cellId = cell.id;
        const cellNumber = parseInt(cellId.split("-")[1], 10);
        
        const playerPiece = currentPlayer === 1 ? '.piece.white' : '.piece.black';
    
        // Initialize variables for the three cells
        let firstCell = cell;
        let secondCell, thirdCell, forthCell;
    
        // Calculate the positions of the three cells based on the direction
        var newRow = Math.floor((cellNumber - 1) / 5) + direction.row;
        var newCol = ((cellNumber - 1) % 5) + direction.col;
        var newCellNumber = newRow * 5 + newCol + 1;
        
        if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 5) {
            secondCell = document.getElementById(`cell-${newCellNumber}`);
        }
    
        newRow = newRow + direction.row;
        newCol = newCol + direction.col;
        newCellNumber = newRow * 5 + newCol + 1;
        
        if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 5) {
            thirdCell = document.getElementById(`cell-${newCellNumber}`);
        }

        newRow = newRow - 3 * direction.row;
        newCol = newCol - 3 * direction.col;
        newCellNumber = newRow * 5 + newCol + 1;

        if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 5) {
            forthCell = document.getElementById(`cell-${newCellNumber}`);
        }
        // Check if three consecutive cells contain the same player's pieces
        return ((
            firstCell.querySelector(`${playerPiece}`) &&
            secondCell && secondCell.querySelector(`${playerPiece}`) &&
            thirdCell && thirdCell.querySelector(`${playerPiece}`)) || (
            firstCell.querySelector(`${playerPiece}`) &&
            secondCell && secondCell.querySelector(`${playerPiece}`) &&
            forthCell && forthCell.querySelector(`${playerPiece}`))
        );
    }
    
    
    
    

    // Clear all highlight classes and click event listeners
    function clearHighlightedCells() {
        boardCells.forEach((cell) => {
            cell.classList.remove('highlight-up', 'highlight-down', 'highlight-left', 'highlight-right');
            cell.removeEventListener('click', handleMoveInDirection);
        });
    }
    
    function logCellsWithPieces() {
        const cellsWithPieces = [];
        boardCells.forEach((cell) => {
            const piece = cell.querySelector('.piece');
            if (piece) {
                cellsWithPieces.push(cell.id); // You can store cell information as needed
            }
        });
    }

    let previousBPiece = null;
    let previousBCellId = null;
    
    function moveBlackPiece() {
        // Get all black pieces on the board
        var blackPieces = document.querySelectorAll('.piece.black');
    
        if (blackPieces.length === 0) {
            // No black pieces left, end the game or take appropriate action
            return;
        }
    
        // Shuffle the black pieces for a random selection
        shuffleArray(blackPieces);
    
        let validMoveFound = false;

        for (let i = 0; i < blackPieces.length; i++) {
            var randomNumber = getRandomInt(blackPieces.length);
            const piece = blackPieces[randomNumber];
            const selectedCell = piece.parentElement;
            const cellId = selectedCell.id;
            const cellNumber = parseInt(cellId.split("-")[1], 10);
            const newPiece = selectedCell.querySelector(".piece");
            // Define the possible move directions
            const directions = [
                { row: -1, col: 0 }, // Up
                { row: 1, col: 0 },  // Down
                { row: 0, col: -1 }, // Left
                { row: 0, col: 1 }   // Right
            ];
    
            let newDirection, newRow, newCol, newCellNumberId, newCell;
    
            // Shuffle the directions for random order
            shuffleArray(directions);
    
            for (const direction of directions) {
                newRow = Math.floor((cellNumber - 1) / 5) + direction.row;
                newCol = ((cellNumber - 1) % 5) + direction.col;
                newCellNumberId = newRow * 5 + newCol + 1;
                newCell = document.getElementById(`cell-${newCellNumberId}`);
                if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 5 && !newCell.querySelector('.piece') && (previousBCellId !== newCellNumberId || previousBPiece != newPiece)) {
                    previousBCellId = cellNumber;
                    newCell.appendChild(piece);
                    previousBPiece = newCell.querySelector('.piece');
                    selectedCell.innerHTML = '';
                    const upThreeInARow = checkForThreeInARow(newCell, { row: -1, col: 0 });
                    const downThreeInARow = checkForThreeInARow(newCell, { row: 1, col: 0 });
                    const leftThreeInARow = checkForThreeInARow(newCell, { row: 0, col: -1 });
                    const rightThreeInARow = checkForThreeInARow(newCell, { row: 0, col: 1 });
                    if (upThreeInARow || downThreeInARow || leftThreeInARow || rightThreeInARow) {
                        removeRandomWhitePiece();
                    }
                    validMoveFound = true;
                    currentPlayer = 1;
                    selectedPiece = null;
                    addClickToWhitePieces();
                    break;
                    }
                }
            
    
            if (validMoveFound) {
                break;
            }
        }
    
        if (!validMoveFound) {
            return;
        }
    }

    function removeRandomWhitePiece() {
        const whitePieces = document.querySelectorAll('.piece.white');
        if (whitePieces.length === 0) {
            return;
        }
        const randomIndex = Math.floor(Math.random() * whitePieces.length);
        const pieceToRemove = whitePieces[randomIndex];
        const cell = pieceToRemove.parentElement;
        cell.removeChild(pieceToRemove);
    }
    
    function shuffleArray(array) {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex > 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }  

    const boardCells = document.querySelectorAll(".cell");

    function checkConsecutivePieces(cell, pieceColor) {
        const cellId = cell.id;
        const cellNumber = parseInt(cellId.split("-")[1], 10) - 1;
        var row = Math.floor(cellNumber / 5);
        var col = cellNumber % 5;
    
        const directions = [
            { row: -1, col: 0 }, // Above
            { row: 1, col: 0 },  // Below
            { row: 0, col: -1 }, // Left
            { row: 0, col: 1 }   // Right
        ];
    
        for (const direction of directions) {
            let count = 1;
            let currentRow = row;
            let currentCol = col;
            
    
            for (let i = 0; i < 3; i++) {
                currentRow += direction.row;
                currentCol += direction.col;
    
                if (currentRow >= 0 && currentRow < 6 && currentCol >= 0 && currentCol < 5) {
                    const adjacentCellId = `cell-${currentRow  * 5 + currentCol + 1}`;
                    const adjacentCell = document.getElementById(adjacentCellId);
                    if (adjacentCell && adjacentCell.querySelector('.piece') && adjacentCell.querySelector('.piece').classList.contains(pieceColor)) {
                        count++;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
    
            if (count >= 4) {
                return false; // More than three consecutive pieces in this direction
            }
        }
        // Check for pieces to the left and right
    const leftPieces = [];
    const rightPieces = [];

    // Check to the left
    for (let i = 1; i <= 3; i++) {
        const leftCellNumber = cellNumber - i;
        if (leftCellNumber >= 0 && Math.floor(leftCellNumber / 5) === row) {
            const leftCellId = `cell-${leftCellNumber + 1}`;
            const leftCell = document.getElementById(leftCellId);
            if (leftCell && leftCell.querySelector('.piece') && leftCell.querySelector('.piece').classList.contains(pieceColor)) {
                leftPieces.push(leftCell);
            } else {
                break;
            }
        } else {
            break;
        }
    }

    // Check to the right
    for (let i = 1; i <= 3; i++) {
        const rightCellNumber = cellNumber + i;
        if (rightCellNumber < 30 && Math.floor(rightCellNumber / 5) === row) {
            const rightCellId = `cell-${rightCellNumber + 1}`;
            const rightCell = document.getElementById(rightCellId);
            if (rightCell && rightCell.querySelector('.piece') && rightCell.querySelector('.piece').classList.contains(pieceColor)) {
                rightPieces.push(rightCell);
            } else {
                break;
            }
        } else {
            break;
        }
    }

    // If there are at least two pieces on one side and a potential third piece on the other side, return true
    if ((leftPieces.length + rightPieces.length) >= 3) {
        return false;
    }
            // Check for pieces above and below
    const abovePieces = [];
    const belowPieces = [];

    // Check above
    for (let i = 1; i <= 3; i++) {
        const aboveCellNumber = cellNumber - i * 5;
        if (aboveCellNumber >= 0) {
            const aboveCellId = `cell-${aboveCellNumber + 1}`;
            const aboveCell = document.getElementById(aboveCellId);
            if (aboveCell && aboveCell.querySelector('.piece') && aboveCell.querySelector('.piece').classList.contains(pieceColor)) {
                abovePieces.push(aboveCell);
            } else {
                break;
            }
        } else {
            break;
        }
    }

    // Check below
    for (let i = 1; i <= 3; i++) {
        const belowCellNumber = cellNumber + i * 5;
        if (belowCellNumber < 30) {
            const belowCellId = `cell-${belowCellNumber + 1}`;
            const belowCell = document.getElementById(belowCellId);
            if (belowCell && belowCell.querySelector('.piece') && belowCell.querySelector('.piece').classList.contains(pieceColor)) {
                belowPieces.push(belowCell);
            } else {
                break;
            }
        } else {
            break;
        }
    }

    // If there are at least two pieces above or below and a potential third piece in the opposite direction, return true
    if ((abovePieces.length + belowPieces.length) >= 3) {
        return false;
    }
        
        return true; // It's valid to place a piece here
    }
    

    function blockedCellsForWhite() {
        const blockedCells = new Set();
    
        boardCells.forEach(function (cell) {
            if (cell.querySelector('.piece')) {
                // Skip cells that already have pieces
                return;
            }
            if (!checkConsecutivePieces(cell, 'white')) {
                blockedCells.add(cell);
            }
        });
    
        boardCells.forEach(function (cell) {
            if (!blockedCells.has(cell)) {
                cell.classList.remove('blocked');
            }
        });
    
        return blockedCells;
    }
    function blockedCellsForBlack() {
        const blockedCells = new Set();
    
        boardCells.forEach(function (cell) {
            if (cell.querySelector('.piece')) {
                // Skip cells that already have pieces
                return;
            }
            if (!checkConsecutivePieces(cell, 'black')) {
                blockedCells.add(cell);
            }
        });
    
        boardCells.forEach(function (cell) {
            if (!blockedCells.has(cell)) {
                cell.classList.remove('blocked');
            }
        });
    
        return blockedCells;
    }
});

// Function to create pieces
function createPieces(color, count) {
    const pieces = [];
    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.classList.add('dec-pieces', color);
        pieces.push(piece);
    }
    return pieces;
}

// Initialize the board cells
const boardCells = document.querySelectorAll(".cell");
