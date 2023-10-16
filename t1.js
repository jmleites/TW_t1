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
        if (pieceCount < 12) {
            const blockedCells = blockedCellsForBlack();
            const emptyCells = [...boardCells].filter((cell) => !cell.querySelector(".piece") && !blockedCells.has(cell));
            if (emptyCells.length > 0) {
                const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                randomCell.innerHTML = `<div class="piece ${pieceColor}"></div>`;
            }
            startPlayerTurn('white');
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
        boardCells.forEach((cell) => {
            cell.removeEventListener('click', handleWhitePieceClick);
            const piece = cell.querySelector('.piece.white');
            console.log("piece selected: ", piece)
            if (piece) {
                cell.addEventListener('click', handleWhitePieceClick);
            }
        });
    }
    
    function handleWhitePieceClick(event) {
        const cell = event.currentTarget;
        const piece = cell.querySelector('.piece.white');
        console.log("current piece, cell", piece, cell)
        console.log("previous piece", selectedPiece)
        if (currentPlayer === 1) {
            if (selectedPiece === piece) {
                // Deselect the piece
                clearHighlightedCells();
                selectedPiece = null;
            } else {
                if (selectedPiece) {
                    // Deselect the previously selected piece
                    clearHighlightedCells();
                }
                // Select the new piece for movement
                selectedPiece = piece;
                highlightAvailableMoves(cell);
            }
        }
    }
    
    function highlightAvailableMoves(cell) {
        clearHighlightedCells(); // Clear existing event listeners first
    
        const cellId = cell.id;
        const cellNumber = parseInt(cellId.split("-")[1], 10);
        console.log(cellId, cellNumber);
    
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
                newCell.classList.add(direction.class);
                newCell.addEventListener('click', () => {
                    // Call a function to handle the move in the selected direction
                    handleMoveInDirection(direction);
                });
            }
        });
    }
    
    function handleMoveInDirection(direction) {
        console.log(direction)
        // Define the current cell and its ID
        const currentCell = selectedPiece.parentElement;
        const currentCellId = currentCell.id;
        const currentCellNumber = parseInt(currentCellId.split("-")[1], 10);
    
        // Calculate the new cell's ID and position
        const newRow = Math.floor((currentCellNumber - 1) / 5) + direction.row;
        const newCol = ((currentCellNumber - 1) % 5) + direction.col;
        const newCellNumberId = newRow * 5 + newCol + 1;
        const newCell = document.getElementById(`cell-${newCellNumberId}`);
    
        // Check if the new cell is within the board boundaries (5x6) and doesn't have a piece
        if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 5 && !newCell.querySelector('.piece')) {
            // Move the piece to the new cell
            newCell.appendChild(selectedPiece);
            currentCell.innerHTML = '';
            clearHighlightedCells(); // Clear the highlights
    
            // Update the game state here if needed
            // Allow the AI turn to proceed
            currentPlayer = 2;
            moveBlackPiece();
    
            // Add your logic to check for a win condition here (if needed)
            // Call the AI move function or handle other game-specific logic
        }
    }
    
    // Clear all highlight classes and click event listeners
    function clearHighlightedCells() {
        boardCells.forEach((cell) => {
            cell.classList.remove('highlight-up', 'highlight-down', 'highlight-left', 'highlight-right');
            cell.removeEventListener('click', () => {});
        });
    }
    
    

    
    function moveBlackPiece() {
        // Get all black pieces on the board
        const blackPieces = document.querySelectorAll('.piece.black');
    
        if (blackPieces.length === 0) {
            // No black pieces left, end the game or take appropriate action
            return;
        }
    
        // Select a random black piece
        const randomIndex = Math.floor(Math.random() * blackPieces.length);
        const piece = blackPieces[randomIndex];
    
        // Get the current cell of the piece
        const selectedCell = piece.parentElement;
        const cellId = selectedCell.id;
        const cellNumber = parseInt(cellId.split("-")[1], 10);
    
        // Define the possible move directions
        const directions = [
            { row: -1, col: 0 }, // Up
            { row: 1, col: 0 },  // Down
            { row: 0, col: -1 }, // Left
            { row: 0, col: 1 }   // Right
        ];
    
        let newDirection, newRow, newCol, newCellNumberId, newCell;
    
        // Try random directions until a legal move is found
        do {
            // Generate a random direction (0 for up, 1 for down, 2 for left, 3 for right)
            const randomDirection = Math.floor(Math.random() * 4);
    
            // Calculate the new position based on the random direction
            newDirection = directions[randomDirection];
            newRow = Math.floor((cellNumber - 1) / 5) + newDirection.row;
            newCol = ((cellNumber - 1) % 5) + newDirection.col;
            newCellNumberId = newRow * 5 + newCol + 1;
    
            // Get the new cell
            newCell = document.getElementById(`cell-${newCellNumberId}`);
        } while (newRow < 0 || newRow >= 6 || newCol < 0 || newCol >= 5 || newCell.querySelector('.piece'));
    
        // Move the piece to the new cell
        newCell.appendChild(piece);
        selectedCell.innerHTML = '';
        currentPlayer = 1;
        addClickToWhitePieces();
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
