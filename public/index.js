document.addEventListener("DOMContentLoaded", function () {
    const playerPieces = createPieces('white', 12);
    const robotPieces = createPieces('black', 12);
    let numRows = 5;
    let numCols = 6;
    let currentPlayer = 1;

    const playerPiecesContainer = document.querySelector('.white-pieces');
    playerPieces.forEach((piece) => playerPiecesContainer.appendChild(piece));

    const robotPiecesContainer = document.querySelector('.black-pieces');
    robotPieces.forEach((piece) => robotPiecesContainer.appendChild(piece));

    var iniciarJogoButton = document.querySelector(".top-button button");
    var topButtons = document.getElementById("top-buttons");
    var botButtons = document.getElementById("bottom-buttons");
    var gameBoard = document.getElementById("game-board");
    let pieceCount = 0;
    let counter = 0;
    let multiplayer = 0;

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.id = `cell-${row * numCols + col + 1}`;
            counter = counter + 1;
            gameBoard.appendChild(cell);
        }
    }

    iniciarJogoButton.addEventListener("click", function () {
            topButtons.style.display = "none";
            botButtons.style.display = "none";
            gameBoard.style.opacity = 0.9;
            initializeGamevsBot();
    });

    let playerColor ='white';
    let robotColor = 'black';
    let botDif = 'easy';

    function updateMessage(message) {
        const messageArea = document.getElementById("message-area");
        messageArea.textContent = message;
    }
  
    function getSelectedColor() {
        const radioButtons = document.getElementsByName("peças");
        for (const radioButton of radioButtons) {
            if (radioButton.checked) {
                playerColor = radioButton.value;
                return radioButton.value;
            }
        }
        return 'white';
    }

    function getSelectedSize() {
        const sizeButtons = document.getElementsByName("tamanho");
        for (const sizeButton of sizeButtons) {
            if (sizeButton.checked) {
                size = sizeButton.value;
                return sizeButton.value;
            }
        }
        return '5 6';
    }

    function getSelectedBot() {
        const botButtons = document.getElementsByName("dificuldade");
        for (const botButton of botButtons) {
            if (botButton.checked) {
                botDif = botButton.value;
                return botButton.value;
            }
        }
        return 'easy';
    }

    function changeBoard() {
        const oddCells = document.querySelectorAll('.cell:nth-child(12n+1), .cell:nth-child(12n+3), .cell:nth-child(12n+5), .cell:nth-child(12n+8), .cell:nth-child(12n+10), .cell:nth-child(12n+12)');
        const evenCells = document.querySelectorAll('.cell:nth-child(12n+2), .cell:nth-child(12n+4), .cell:nth-child(12n+6), .cell:nth-child(12n+7), .cell:nth-child(12n+9), .cell:nth-child(12n+11)');
        const blackDec = document.querySelectorAll('.dec-pieces.black');
        if (numRows == 6){
            gameBoard.style.gridTemplateColumns = 'repeat(6, 1fr)';
            gameBoard.style.gridTemplateRows = 'repeat(6, 1fr)';
            oddCells.forEach(cell => {
                cell.style.backgroundColor = 'rgb(131, 70, 0)';
            });
            evenCells.forEach(cell => {
                cell.style.backgroundColor = '#f59f1f';
            });
            blackDec.forEach(piece => {
                piece.style.marginLeft = '90px';
              });
        }
    }

    function initializeGamevsBot() {
        boardCells.forEach(function (cell) {
            cell.innerHTML = '';
        });
        currentPlayer = 1;
        playerColor = getSelectedColor();
        botDif = getSelectedBot();
        size = getSelectedSize();
        [numRows, numCols] = size.split(' ').map(Number);
        changeBoard();
        if (playerColor == 'white') {
            robotColor = 'black';
            startPlayerTurn();
        }
        else if (playerColor == 'black') {
            robotColor = 'white';
            simulateAITurn();
        }
    }

    function initializeGamevsPlayer() {
        boardCells.forEach(function (cell) {
            cell.innerHTML = '';
        });
        [numRows, numCols] = tamanho.split(' ').map(Number);
        changeBoard();
        if (playerColor == 'white') {
            currentPlayer = 1;
            startPlayerTurn();
        }
    }

    function startPlayerTurn() {
        updateMessage("É o teu turno");
        function clickHandler(cell) {
            return function(event) {
                if (currentPlayer === 1 && !cell.querySelector('.piece') && (pieceCount <= 12 && playerColor == 'black' || pieceCount < 12 && playerColor == 'white') && !blockedCellsForPlayer(playerColor).has(cell)) {
                    updateMessage("");
                    updateBoard;
                    cell.innerHTML = `<div class="piece ${playerColor}"></div>`;
                    blockedCellsForPlayer().forEach((blockedCell) => blockedCell.classList.remove('blocked'));
                    currentPlayer = 2;
                    cell.removeEventListener("click", clickHandler(cell));
                    if (multiplayer == 0) {
                        setTimeout(() => simulateAITurn(), 300);
                    }
                    else if (multiplayer == 1) {
                        const cellId = cell.id;
                        const cellNumber = parseInt(cellId.split("-")[1], 10);
                        const row = Math.floor((cellNumber - 1) / (numCols-1));
                        const column = ((cellNumber - 1) % (numCols-1));
                        move = {row, column};
                        currentPlayer = 1;
                        notify(move);
                    }
                }
            }
        }
        if (playerColor == 'black') {
            pieceCount++;
        }
        boardCells.forEach(function (cell) {
            cell.removeEventListener("click", clickHandler(cell));
            cell.classList.remove('blocked');
        });
    
        blockedCellsForPlayer().forEach((blockedCell) => blockedCell.classList.add('blocked'));
    
        boardCells.forEach(function (cell) {
            cell.addEventListener("click", clickHandler(cell));
        });
        if (pieceCount == 13 && playerColor == 'black') {
            placePieceOver();
        }
    }

    function simulateAITurn() {
        if (playerColor == 'white') {
            pieceCount++;
        } 
        if (botDif == 'easy') {
            placePieceRandomly();
        }
        else if (botDif == 'hard') {
            placePieceSmart();
        }
        currentPlayer = 1;
        }

    function placePieceRandomly() {
        if (pieceCount <= 12) {
            const blockedCells = blockedCellsForRobot(robotColor);
            const emptyCells = [...boardCells].filter((cell) => !cell.querySelector(".piece") && !blockedCells.has(cell));
            if (emptyCells.length > 0) {
                const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                randomCell.innerHTML = `<div class="piece ${robotColor}"></div>`;
            }
            if (pieceCount < 12 && playerColor == 'white') {
                startPlayerTurn();  
            }
            else if (pieceCount <= 12 && playerColor == 'black') {
                startPlayerTurn();  
            }
        }
        if (pieceCount == 12 && playerColor == 'white') {
            placePieceOver();
        }
    }

    function placePieceSmart() {
        if (pieceCount <= 12) {
            const blockedCells = blockedCellsForRobot(robotColor);
            const emptyCells = [...boardCells].filter((cell) => !cell.querySelector(".piece") && !blockedCells.has(cell));
            let moveMade = false;
            shuffleArray(emptyCells);
            for (const cell of emptyCells) {
                if (checkConsecutivePieces(cell, robotColor, 2, direction, cellId)) {
                    cell.innerHTML = `<div class="piece ${robotColor}"></div>`;
                    moveMade = true;
                    break;
                }
            }
            if (!moveMade) {
                const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                randomCell.innerHTML = `<div class="piece ${robotColor}"></div>`;
            }
            if (pieceCount < 12 && playerColor == 'white') {
                startPlayerTurn();  
            }
            else if (pieceCount <= 12 && playerColor == 'black') {
                startPlayerTurn();  
            }
        }
        if (pieceCount == 12 && playerColor == 'white') {
            placePieceOver();
        }
    }
    

    function placePieceOver() {
        if (playerColor == 'white') {
            currentPlayer = 1;
            addClickToPlayer();
        }
        else if (playerColor == 'black'){
            currentPlayer = 2;
            if (botDif == 'easy') {
                moveRobotPiece();
            }
            else if (botDif == 'hard') {
                moveRobotPieceSmart();
            }
        }
    }

    let selectedPiece = null;

    function addClickToPlayer() {
        updateMessage("Seleciona uma peça");
        clearHighlightedCells();
        boardCells.forEach((cell) => {
            const piece = cell.querySelector(`.piece.${playerColor}`);
            if (piece) {
                cell.addEventListener('click', handlePlayerPieceClick);
            }
        });
    }
    
    function handlePlayerPieceClick(event) {
        clearHighlightedCells();
        const cell = event.currentTarget;
        const piece = cell.querySelector(`.piece.${playerColor}`);
        cell.removeEventListener('click', handlePlayerPieceClick);
        if (currentPlayer === 1) {
            if (selectedPiece) {
                selectedPiece.classList.remove('selected-white');
            }
            selectedPiece = piece;
            selectedPiece.classList.add('selected-white');
            if (multiplayer == 1) {
                const cellId = cell.id;
                const cellNumber = parseInt(cellId.split("-")[1], 10);
                const row = Math.floor((cellNumber - 1) / (numCols-1));
                const column = ((cellNumber - 1) % (numCols-1));
                move = {row, column};
                currentPlayer = 1;
                notify(move);
            }
            if (multiplayer == 0) highlightAvailableMoves(cell);
        }
    }

    const directions = [
            { class: 'highlight-up', row: -1, col: 0 },
            { class: 'highlight-down', row: 1, col: 0 },
            { class: 'highlight-left', row: 0, col: -1 },
            { class: 'highlight-right', row: 0, col: 1 },
        ];

    function highlightAvailableMoves(cell) {
        updateMessage("Seleciona uma celula");
        if (multiplayer == 1) cell.addEventListener('click', () => {
            handleMoveInDirection("stay");
        }); 
        const cellId = cell.id;
        const cellNumber = parseInt(cellId.split("-")[1], 10);
        directions.forEach((direction) => {
            const row = Math.floor((cellNumber - 1) / numRows);
            const col = ((cellNumber - 1) % numRows);
            const newRow = Math.floor((cellNumber - 1) / numRows) + direction.row;
            const newCol = ((cellNumber - 1) % numRows) + direction.col;
            if (newRow >= 0 && newRow < numCols && newCol >= 0 && newCol < numRows) {
                const newCellNumberId = newRow * numRows + newCol + 1;
                const newCell = document.getElementById(`cell-${newCellNumberId}`);
                if (!newCell.querySelector('.piece') && checkConsecutivePieces(newCell, playerColor, 3, direction, cellId)) {
                    if (Math.abs(newRow - row) === 1 || Math.abs(newCol - col) === 1) {
                    newCell.classList.add(direction.class);
                    newCell.addEventListener('click', () => {
                        handleMoveInDirection(direction);
                    });  
                    }
                }
            }
        });
    }

    let previousCellId = null;
    let previousPiece = null;
    let previousPieceId = null;
    
    function handleMoveInDirection(direction) {
        const currentCell = selectedPiece.parentElement;
        const currentCellId = currentCell.id;
        const currentCellNumber = parseInt(currentCellId.split("-")[1], 10);
        if (direction == "stay" && multiplayer == 1) {
            let row = Math.floor((currentCellNumber - 1) / numRows);
            let column = (currentCellNumber - 1) % numRows;
            let move = {row, column};
            currentPlayer = 1;
            notify(move);
            updateBoard;
        }
        const newRow = Math.floor((currentCellNumber - 1) / numRows) + direction.row;
        const newCol = ((currentCellNumber - 1) % numRows) + direction.col;
        const newCellNumberId = newRow * numRows + newCol + 1;
        const newCell = document.getElementById(`cell-${newCellNumberId}`);
        const newPiece = currentCell.querySelector(".piece");
        const newPieceId = newPiece ? newPiece.parentElement.id : null;
        logCellsWithPieces();
        if (newRow >= 0 && newRow < numCols && checkConsecutivePieces(newCell, playerColor, 3, direction, currentCellId) && newCol >= 0 && newCol < numRows && !newCell.querySelector('.piece') && (previousCellId !== newCellNumberId || previousPieceId != newPieceId)) {
            previousCellId = currentCellNumber;
            newCell.appendChild(selectedPiece);
            previousPiece = newCell.querySelector(".piece");
            previousPieceId = previousPiece ? previousPiece.parentElement.id : null;
            currentCell.innerHTML = '';
            clearHighlightedCells();
            newCell.removeEventListener('click', () => {
                handleMoveInDirection(direction);
            });  
            selectedPiece.classList.remove('selected-white');
            if (multiplayer == 1) {
                row = newRow;
                column = newCol;
                move = {row, column};
                currentPlayer = 1;
                notify(move);
                updateBoard;
            }
            if (multiplayer == 0) {
            const upThreeInARow = checkForThreeInARow(newCell, { row: -1, col: 0 });
            const downThreeInARow = checkForThreeInARow(newCell, { row: 1, col: 0 });
            const leftThreeInARow = checkForThreeInARow(newCell, { row: 0, col: -1 });
            const rightThreeInARow = checkForThreeInARow(newCell, { row: 0, col: 1 });
            if (upThreeInARow || downThreeInARow || leftThreeInARow || rightThreeInARow) {
                updateMessage("Remove uma peça");
                addClickToRobotPieces();
            }
            else {
                currentPlayer = 2;
                if (botDif == 'easy') {
                    moveRobotPiece();
                }
                else if (botDif == 'hard') {
                    moveRobotPieceSmart();
                }
            }
        }
        }
        else {
            handleMoveInDirection();
        }
    }

    function addClickToRobotPieces() {
        boardCells.forEach((cell) => {
            const opponentPiece = cell.querySelector(`.piece.${robotColor}`);
            if (opponentPiece) {
                cell.addEventListener('click', removeRobotPiece);
            }
        });
    }
    
    function removeRobotPiece(event) {
            const cell = event.currentTarget;
            const opponentPiece = cell.querySelector(`.piece.${robotColor}`);
            if (opponentPiece) {
                cell.removeEventListener('click', removeRobotPiece);
                cell.removeChild(opponentPiece);
                if (multiplayer == 0) {
                currentPlayer = 2;
                if (botDif == 'easy' && !checkWinCondition(robotColor)) {
                    moveRobotPiece();
                }
                else if (botDif == 'hard' && !checkWinCondition(robotColor)) {
                    moveRobotPieceSmart();
                }
            }
            if (multiplayer == 1) {
                const cellId = cell.id;
                const cellNumber = parseInt(cellId.split("-")[1], 10);
                const row = Math.floor((cellNumber - 1) / (numCols-1));
                const column = ((cellNumber - 1) % (numCols-1));
                move = {row, column};
                currentPlayer = 1;
                notify(move);
            }
        }
    }

    function checkForThreeInARow(cell, direction) {
        const cellId = cell.id;
        const cellNumber = parseInt(cellId.split("-")[1], 10);
        const playerPiece = currentPlayer === 1 ? `.piece.${playerColor}` : `.piece.${robotColor}`;
        let firstCell = cell;
        let secondCell, thirdCell, forthCell;
        var newRow = Math.floor((cellNumber - 1) / numRows) + direction.row;
        var newCol = ((cellNumber - 1) % numRows) + direction.col;
        var newCellNumber = newRow * numRows + newCol + 1;
        
        if (newRow >= 0 && newRow < numCols && newCol >= 0 && newCol < numRows) {
            secondCell = document.getElementById(`cell-${newCellNumber}`);
        }
    
        newRow = newRow + direction.row;
        newCol = newCol + direction.col;
        newCellNumber = newRow * numRows + newCol + 1;
        
        if (newRow >= 0 && newRow < numCols && newCol >= 0 && newCol < numRows) {
            thirdCell = document.getElementById(`cell-${newCellNumber}`);
        }

        newRow = newRow - 3 * direction.row;
        newCol = newCol - 3 * direction.col;
        newCellNumber = newRow * numRows + newCol + 1;

        if (newRow >= 0 && newRow < numCols && newCol >= 0 && newCol < numRows) {
            forthCell = document.getElementById(`cell-${newCellNumber}`);
        }
        return ((
            firstCell.querySelector(`${playerPiece}`) &&
            secondCell && secondCell.querySelector(`${playerPiece}`) &&
            thirdCell && thirdCell.querySelector(`${playerPiece}`)) || (
            firstCell.querySelector(`${playerPiece}`) &&
            secondCell && secondCell.querySelector(`${playerPiece}`) &&
            forthCell && forthCell.querySelector(`${playerPiece}`))
        );
    }
    
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
                cellsWithPieces.push(cell.id);
            }
        });
    }

    let previousBPiece = null;
    let previousBCellId = null;
    
    function moveRobotPiece() {
        var robotPieces = document.querySelectorAll(`.piece.${robotColor}`);
        let validMoveFound = false;

        if (robotPieces.length === 0) {
            return;
        }
        shuffleArray(robotPieces);

        for (let i = 0; i < robotPieces.length; i++) {
            var randomNumber = getRandomInt(robotPieces.length);
            const piece = robotPieces[randomNumber];
            const selectedCell = piece.parentElement;
            const cellId = selectedCell.id;
            const cellNumber = parseInt(cellId.split("-")[1], 10);
            const newPiece = selectedCell.querySelector(".piece");
            const directions = [
                { row: -1, col: 0 },
                { row: 1, col: 0 },
                { row: 0, col: -1 },
                { row: 0, col: 1 }
            ];
    
            let newRow, newCol, newCellNumberId, newCell;
            shuffleArray(directions);
    
            for (const direction of directions) {
                newRow = Math.floor((cellNumber - 1) / numRows) + direction.row;
                newCol = ((cellNumber - 1) % numRows) + direction.col;
                newCellNumberId = newRow * numRows + newCol + 1;
                newCell = document.getElementById(`cell-${newCellNumberId}`);
                if (newRow >= 0 && newRow < numCols && newCol >= 0 && newCol < numRows && !newCell.querySelector('.piece') && (previousBCellId !== newCellNumberId || previousBPiece != newPiece)) {
                    previousBCellId = cellNumber;
                    newCell.appendChild(piece);
                    previousBPiece = newCell.querySelector('.piece');
                    selectedCell.innerHTML = '';
                    const upThreeInARow = checkForThreeInARow(newCell, { row: -1, col: 0 });
                    const downThreeInARow = checkForThreeInARow(newCell, { row: 1, col: 0 });
                    const leftThreeInARow = checkForThreeInARow(newCell, { row: 0, col: -1 });
                    const rightThreeInARow = checkForThreeInARow(newCell, { row: 0, col: 1 });
                    if (upThreeInARow || downThreeInARow || leftThreeInARow || rightThreeInARow) {
                        removeRandomPlayerPiece();
                    }
                    validMoveFound = true;
                    currentPlayer = 1;
                    selectedPiece = null;
                    clearHighlightedCells();
                    if (!checkWinCondition(playerColor)) {
                        addClickToPlayer();
                    }
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

    function removeRandomPlayerPiece() {
        const playerPieces = document.querySelectorAll(`.piece.${playerColor}`);
        if (playerPieces.length === 0) {
            return;
        }
        const randomIndex = Math.floor(Math.random() * playerPieces.length);
        const pieceToRemove = playerPieces[randomIndex];
        const cell = pieceToRemove.parentElement;
        cell.removeChild(pieceToRemove);
    }

    function moveRobotPieceSmart() {
        var robotPieces = document.querySelectorAll(`.piece.${robotColor}`);
    
        if (robotPieces.length === 0) {
            return;
        }

        let validMoveFound = false;

        for (let i = 0; i < robotPieces.length; i++) {
            const piece = robotPieces[i];
            const selectedCell = piece.parentElement;
            const cellId = selectedCell.id;
            const cellNumber = parseInt(cellId.split("-")[1], 10);
            const newPiece = selectedCell.querySelector(".piece");
            const directions = [
                { row: -1, col: 0 },
                { row: 1, col: 0 },
                { row: 0, col: -1 },
                { row: 0, col: 1 }
            ];
    
            let newRow, newCol, newCellNumberId, newCell;
    
            for (const direction of directions) {
                newRow = Math.floor((cellNumber - 1) / numRows) + direction.row;
                newCol = ((cellNumber - 1) % numRows) + direction.col;
                newCellNumberId = newRow * numRows + newCol + 1;
                newCell = document.getElementById(`cell-${newCellNumberId}`);
                if (newRow >= 0 && newRow < numCols && newCol >= 0 && newCol < numRows && !newCell.querySelector('.piece') && (previousBCellId !== newCellNumberId || previousBPiece != newPiece)) {
                    newCell.appendChild(piece);
                    const upThreeInARow = checkForThreeInARow(newCell, { row: -1, col: 0 });
                    const downThreeInARow = checkForThreeInARow(newCell, { row: 1, col: 0 });
                    const leftThreeInARow = checkForThreeInARow(newCell, { row: 0, col: -1 });
                    const rightThreeInARow = checkForThreeInARow(newCell, { row: 0, col: 1 });
                    if (upThreeInARow || downThreeInARow || leftThreeInARow || rightThreeInARow) {
                        validMoveFound = true;
                        currentPlayer = 1;
                        previousBCellId = cellNumber;
                        previousBPiece = newCell.querySelector('.piece');
                        selectedCell.innerHTML = '';
                        removeRandomPlayerPiece();
                        if (!checkWinCondition(playerColor)) {
                            addClickToPlayer();
                        }
                        break;
                    }
                    if (newCell.contains(piece)) {
                        newCell.removeChild(piece);
                        selectedCell.appendChild(piece);
                    }
                }        
            }
            if (validMoveFound) {
                break;
            }
        }
        if (!validMoveFound) {
            moveRobotPiece();
        }
    }
    
    function shuffleArray(array) {
        let currentIndex = array.length,  randomIndex;
        while (currentIndex > 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }  

    let boardCells = document.querySelectorAll(".cell");

    function checkWinCondition(color) {
        const pieces = document.querySelectorAll(`.piece.${color}`);
        if (pieces.length <= 2) {
            displayGameOverMessage(color);
            return true;
        }
        return false;
    }

    function displayGameOverMessage(winnerColor) {
        if (winnerColor == 'white' ) {
            winnerColor = 'preto'
        }
        if (winnerColor == 'black' ) {
            winnerColor = 'branco'
        }
        const gameOverModal = document.createElement("div");
        gameOverModal.className = "game-over-modal";
        gameOverModal.innerHTML = `<p>Jogador ${winnerColor} ganhou o jogo!</p>`;
        document.body.appendChild(gameOverModal);
    
        const restartButton = document.createElement("button");
        restartButton.className = "restartButton";
        restartButton.textContent = "Começar outro jogo";
        restartButton.addEventListener("click", restartGame);
        gameOverModal.appendChild(restartButton);
    }
    
    function checkConsecutivePieces(cell, pieceColor, n, direction, originalCell) {
        const cellId = cell.id;
        const cellNumber = parseInt(cellId.split("-")[1], 10) - 1;
        var row = Math.floor(cellNumber / numRows);
        var col = cellNumber % numRows;
        const directions = [
            { row: -1, col: 0 },
            { row: 1, col: 0 },
            { row: 0, col: -1 },
            { row: 0, col: 1 }
        ];
    
        for (const direction of directions) {
            let count = 1;
            let currentRow = row;
            let currentCol = col;
            
    
            for (let i = 0; i < n; i++) {
                currentRow += direction.row;
                currentCol += direction.col;
    
                if (currentRow >= 0 && currentRow < numCols && currentCol >= 0 && currentCol < numRows) {
                    const adjacentCellId = `cell-${currentRow  * numRows + currentCol + 1}`;
                    const adjacentCell = document.getElementById(adjacentCellId);
                    if (adjacentCell && adjacentCell.querySelector('.piece') && adjacentCell.querySelector('.piece').classList.contains(pieceColor)) {
                        count++;
                        if (adjacentCellId == originalCell) count--;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
    
            if (count >= n+1) {
                return false;
            }
        }
    const leftPieces = [];
    const rightPieces = [];

    for (let i = 1; i <= n; i++) {
        const leftCellNumber = cellNumber - i;
        if (leftCellNumber >= 0 && Math.floor(leftCellNumber / numRows) === row) {
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

    for (let i = 1; i <= n; i++) {
        const rightCellNumber = cellNumber + i;
        if (rightCellNumber < 30 && Math.floor(rightCellNumber / numRows) === row) {
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
    if (direction != undefined && direction['class'] == 'highlight-right') leftPieces.pop();
    if (direction != undefined && direction['class'] == 'highlight-left') rightPieces.pop();
    if ((leftPieces.length + rightPieces.length) >= n) {
        return false;
    }
    const abovePieces = [];
    const belowPieces = [];

    for (let i = 1; i <= n; i++) {
        const aboveCellNumber = cellNumber - i * numRows;
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

    for (let i = 1; i <= n; i++) {
        const belowCellNumber = cellNumber + i * numRows;
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
    if (direction != undefined && direction['class'] == 'highlight-down') abovePieces.pop();
    if (direction != undefined && direction['class'] == 'highlight-up') belowPieces.pop();
    if ((abovePieces.length + belowPieces.length) >= n) {
        return false;
    }
        return true;
    }

    function blockedCellsForPlayer() {
        const blockedCells = new Set();
    
        boardCells.forEach(function (cell) {
            if (cell.querySelector('.piece')) {
                return;
            }
            if (!checkConsecutivePieces(cell, playerColor, 3)) {
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

    function blockedCellsForRobot() {
        const blockedCells = new Set();
        boardCells.forEach(function (cell) {
            if (cell.querySelector('.piece')) {
                return;
            }
            if (!checkConsecutivePieces(cell, robotColor, 3)) {
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

    function restartGame() {
        window.location.reload();
    }
  
    function createPieces(color, count) {
        const pieces = [];
        for (let i = 0; i < count; i++) {
            const piece = document.createElement('div');
            piece.classList.add('dec-pieces', color);
            pieces.push(piece);
        }
        return pieces;
    }

    let nick = '';
    let nickOpo = '';
    let password = '';
    let playerNicks = [];
    let playerColors = [];
    let game = '';
    let rows = 5;
    let columns = 6;
    let size = {rows, columns};;
    let group = '27';
    let move = '';
    let tamanho = getSelectedSize();
    let board = [];
    let dontUpdate = 0;
    let gameStarted = 0;
    let state = 'info';
    ranking();

    document.getElementById('showRegister').addEventListener('click', function() {
      document.getElementById('registerFields').style.display = 'block';
      document.getElementById('showRegister').style.display = 'none';
    });
  
    document.getElementById('registerButton').addEventListener('click', function() {
      nick = document.getElementById('registerUsername').value;
      password = document.getElementById('registerPassword').value;
      registerOrLoginUser();
    });

    async function registerOrLoginUser() {
      try {
        const registerResponse = await fetch('http://localhost:8127/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nick, password }),
          });

        if (registerResponse.ok) {
          console.log('User registered successfully.');
          document.getElementById('registerFields').style.display = 'none';
          document.getElementById('multiplayer').style.display = 'block';
          document.getElementById('leave').style.display = 'block';
        } else {
            const errorData = await registerResponse.json();
            console.error('Error:', errorData.error);
          }
      } catch (error) {
        console.error('Error:', error);
      }
      try {
        const registerResponse = await fetch('http://twserver.alunos.dcc.fc.up.pt:8008/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nick, password }),
          });
      } catch (error) {
        console.error('Error:', error);
      }
    }

    document.getElementById('multiplayer').addEventListener('click', function() {
        tamanho = getSelectedSize();
        [rows, columns] = tamanho.split(' ').map(Number);
        let rowp = rows;
        rows = columns;
        columns = rowp;
        size = {rows, columns};
        join();
      });

    document.getElementById('leave').addEventListener('click', function() {
        leave();
      });

    async function join() {
        state = 'game';
        if (!group || !nick || !password) {
          throw new Error('Invalid arguments.');
        }
        try {            
            console.log(size, nick, password, group)
            const response = await fetch(`http://twserver.alunos.dcc.fc.up.pt:8008/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },        
            body: JSON.stringify({size, nick, password, group}),
            });
            response
            .json() 
            .then(data => {
                const responseData = data;
                game = responseData.game;
                if (responseData != undefined) {
                    update();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
        catch (error) {
          throw new Error('Authentication failed or player not registered.');
        }
      }

      async function leave() {  
        try {            
            const response = await fetch(`http://twserver.alunos.dcc.fc.up.pt:8008/leave`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },        
            body: JSON.stringify({nick, password, game}),
            });
        }
        catch (error) {
          throw new Error(error);
        }
      }

      async function setUpGame() {
        ranking(nick);
        gameStarted = 1;
        topButtons.style.display = "none";
        botButtons.style.display = "none";
        gameBoard.style.opacity = 1;
        document.getElementById('multiplayer').style.display = 'none';
        if (playerNicks[0] == nick) {
            playerColor = 'white';
            robotColor = 'black';
            nickOpo = playerNicks[1];
          }
          else if (playerNicks[1] == nick) {
            playerColor = 'black';
            robotColor = 'white';
            nickOpo = playerNicks[0];
          }
          initializeGamevsPlayer();
      }

      async function update(){
        const eventSource = new EventSource(`http://twserver.alunos.dcc.fc.up.pt:8008/update?nick=${encodeURIComponent(nick)}&game=${encodeURIComponent(game)}`);

        eventSource.addEventListener('message', event => {
            multiplayer = 1;
            const eventData = JSON.parse(event.data);
            console.log('Received event:', event.data);
            const players = eventData.players;
            board = eventData.board;
            phase = eventData.phase;
            step = eventData.step;
            move = eventData.move;
            updateBoard();
            for (const playerNick in players) {
                if (Object.prototype.hasOwnProperty.call(players, playerNick)) {
                  const playerColor = players[playerNick];
                  playerNicks.push(playerNick);
                  playerColors.push(playerColor);
                }
            }
            if (eventData.turn == nick && dontUpdate != 0 && phase == 'drop') {
                startPlayerTurn();
                }
            if (dontUpdate == 0) {
                setUpGame();
              }
            if (eventData.turn == nick && dontUpdate != 0 && phase == 'move' && step == 'from') {
                addClickToPlayer();
                }
            if (eventData.turn == nick && dontUpdate != 0 && phase == 'move' && step == 'take') {
                addClickToRobotPieces();
                }
            if (eventData.move != undefined) {
                    row = move.row;
                    column = move.column; 
                    cellNumber =  row * (numCols-1) + column + 1;
                    cell = document.getElementById(`cell-${cellNumber}`);
                }
            if (eventData.turn == nick && dontUpdate != 0 && phase == 'move' && step == 'to') {
                highlightAvailableMoves(cell);
                }
            dontUpdate = 1;
            if (eventData.winner != undefined && eventData.winner != nick && eventData.winner != null) {
                eventSource.close();
                state = 'end';
                ranking(nickOpo);
                displayGameOverMessage(playerColor)
                console.log('EventSource closed at the end of the game.');
            }
            else if (eventData.winner == nick){
                eventSource.close();
                state = 'end';
                ranking(nick);
                displayGameOverMessage(robotColor)
                console.log('EventSource closed at the end of the game.'); 
            }
        });
        eventSource.onerror = error => {
            console.error('Error with EventSource:', error);
            eventSource.close();
        };
        }

        async function notify(move) {
            try {
                const response = await fetch(`http://twserver.alunos.dcc.fc.up.pt:8008/notify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },        
                body: JSON.stringify({nick, password, game, move}),
                });
            }         
            catch (error) {
                throw new Error('Authentication failed or player not registered.');
              }
            }

            async function ranking(nick) {
                try {
                  const response = await fetch(`http://localhost:8127/ranking`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },        
                    body: JSON.stringify({ group, size, state, nick }),
                  });
              
                  if (response.ok) {
                    const data = await response.json();
                    const rankingData = {
                        nickList: data.ranking[0].users.map(entry => entry.nick),
                        games: data.ranking[0].users.map(entry => entry.games_played),
                        victories: data.ranking[0].users.map(entry => entry.victories)
                    };
                    const winnersList = document.getElementById('stats-list');
                    winnersList.innerHTML = '';
                    for (let i = 0; i < rankingData.nickList.length; i++) {
                        const listItem = document.createElement('li');
                        listItem.textContent = `Nome: ${rankingData.nickList[i]} | Jogos: ${rankingData.games[i]} | Vitórias: ${Math.ceil(rankingData.victories[i] / 2)}`;
                        winnersList.appendChild(listItem);
                    }
                }
                } catch (error) {
                  console.error('Error:', error);
                }
              }
              

        async function updateStatsList(nickList, games, victories) {
            const statsList = document.getElementById('stats-list');
          
            statsList.innerHTML = '';
          
            for (let i = 0; i < nickList.length; i++) {
              const listItem = document.createElement('li');
              listItem.textContent = `Nome: ${nickList[i]} | Jogos: ${games[i]} | Vitórias: ${victories[i]}`;
              statsList.appendChild(listItem);
            }
          }
      
        async function updateBoard(){
            if (board == undefined) {
                for (let row = 0; row < numRows; row++) {
                    for (let col = 0; col < numCols; col++) {
                        const cell = document.createElement("div");
                        cell.className = "cell";
                        cell.id = `cell-${row * numCols + col + 1}`;
                        counter = counter + 1;
                        gameBoard.appendChild(cell);
                    }
            }
        }
            else if (board != undefined) {
            gameBoard.innerHTML = '';
            boardCells = '';
            let col = -1;
            let rowC = -1;
            board.forEach(row => {
                rowC = rowC + 1;
                col = -1;
                row.forEach(cellValue => {
                col = col + 1;
                  cell = document.createElement('div');
                  cell.className = "cell";
                  cell.id = `cell-${rowC * (numCols-1) + col + 1}`;
                  cell.classList.add('cell');
                  if (cellValue == 'empty') {
                    cell.innerHTML = '';
                  } 
                  else if (cellValue == 'white') {
                    cell.innerHTML = `<div class="piece white"></div>`;
                  } 
                  else if (cellValue == 'black') {
                    cell.innerHTML = `<div class="piece black"></div>`;
                  } 

                  gameBoard.appendChild(cell);
                });
              });
              boardCells = document.querySelectorAll(".cell");
            }
        }
  });
