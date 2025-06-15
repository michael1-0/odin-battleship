export default class DOMController {
  constructor(gameController) {
    this.gameController = gameController;
    this.playerBoardElement = document.getElementById("player-board");
    this.enemyBoardElement = document.getElementById("enemy-board");
    this.messageElement = document.getElementById("game-message");
    this.setupControlsElement = document.getElementById("setup-controls");
    this.enemyBoardContainer = document.getElementById("enemy-board-container");
    this.currentShipElement = document.getElementById("current-ship");
    this.initializeBoards();
    this.bindEvents();
  }

  initializeBoards() {
    this.createBoard(this.playerBoardElement, true);
    this.createBoard(this.enemyBoardElement, false);
  }

  createBoard(boardElement, isPlayerBoard) {
    boardElement.innerHTML = "";
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = row;
        cell.dataset.col = col;

        if (isPlayerBoard) {
          cell.addEventListener("click", (e) => {
            this.gameController.handlePlayerBoardClick(row, col);
          });
          cell.addEventListener("mouseenter", (e) => {
            this.gameController.handlePlayerBoardHover(row, col);
          });
          cell.addEventListener("mouseleave", (e) => {
            this.gameController.handlePlayerBoardLeave();
          });
        } else {
          cell.addEventListener("click", (e) => {
            this.gameController.handleEnemyBoardClick(row, col);
          });
        }

        boardElement.appendChild(cell);
      }
    }
  }

  bindEvents() {
    document.getElementById("rotate-btn").addEventListener("click", () => {
      this.gameController.rotateCurrentShip();
    });
    document.getElementById("random-btn").addEventListener("click", () => {
      this.gameController.randomPlacement();
    });
    document.getElementById("start-btn").addEventListener("click", () => {
      this.gameController.startBattle();
    });
    document.getElementById("restart-btn").addEventListener("click", () => {
      this.gameController.restartGame();
    });
  }

  updateCell(boardElement, row, col, type, content = "") {
    const cell = boardElement.children[row * 10 + col];
    cell.className = "cell " + type;
    cell.textContent = content;
  }

  updatePlayerBoard() {
    const board = this.gameController.player.gameboard;
    // Clear board
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const cell = this.playerBoardElement.children[row * 10 + col];
        cell.className = "cell";
        cell.textContent = "";
      }
    }
    // Show ships
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const ship = board.getShipAt(row, col);
        if (ship) {
          this.updateCell(this.playerBoardElement, row, col, "ship");
        }
      }
    }
    // Show hits and misses
    board.hitShots.forEach(([row, col]) => {
      const ship = board.getShipAt(row, col);
      if (ship && ship.isSunk()) {
        this.updateCell(this.playerBoardElement, row, col, "sunk", "💀");
      } else {
        this.updateCell(this.playerBoardElement, row, col, "hit", "💥");
      }
    });
    board.missedShots.forEach(([row, col]) => {
      this.updateCell(this.playerBoardElement, row, col, "miss", "💦");
    });
  }

  updateEnemyBoard() {
    const board = this.gameController.computer.gameboard;

    board.hitShots.forEach(([row, col]) => {
      const ship = board.getShipAt(row, col);
      if (ship && ship.isSunk()) {
        this.updateCell(this.enemyBoardElement, row, col, "sunk", "💀");
      } else {
        this.updateCell(this.enemyBoardElement, row, col, "hit", "💥");
      }
    });

    board.missedShots.forEach(([row, col]) => {
      this.updateCell(this.enemyBoardElement, row, col, "miss", "💦");
    });
  }

  showMessage(message) {
    this.messageElement.textContent = message;
  }

  showSetupPhase() {
    this.setupControlsElement.style.display = "flex";
    this.enemyBoardContainer.style.display = "none";
    document.getElementById("restart-btn").style.display = "none";
  }

  showBattlePhase() {
    this.setupControlsElement.style.display = "none";
    this.enemyBoardContainer.style.display = "block";
    document.getElementById("restart-btn").style.display = "block";
  }

  updateCurrentShip(shipName, length) {
    this.currentShipElement.textContent = `Click to place: ${shipName} (${length} cells)`;
  }

  markShipAsPlaced(shipName) {
    const shipElement = document.getElementById(
      `ship-${shipName.toLowerCase()}`,
    );
    if (shipElement) {
      shipElement.classList.add("placed");
    }
  }

  enableStartButton() {
    document.getElementById("start-btn").disabled = false;
  }

  previewShipPlacement(row, col, length, direction, isValid = true) {
    // Clear previous preview
    this.clearPreview();
    // Show preview
    for (let i = 0; i < length; i++) {
      const r = direction === "horizontal" ? row : row + i;
      const c = direction === "horizontal" ? col + i : col;

      if (r >= 0 && r < 10 && c >= 0 && c < 10) {
        const cell = this.playerBoardElement.children[r * 10 + c];
        if (!cell.classList.contains("ship")) {
          cell.classList.add(isValid ? "preview-valid" : "preview-invalid");
        }
      }
    }
  }

  clearPreview() {
    for (let i = 0; i < 100; i++) {
      const cell = this.playerBoardElement.children[i];
      cell.classList.remove("preview-valid", "preview-invalid");
    }
  }
}
