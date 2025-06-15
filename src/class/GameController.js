import Player from "./Player";
import Ship from "./Ship";
import DOMController from "./DOMController";

export default class GameController {
  constructor() {
    this.player = new Player("Human");
    this.computer = new Player("Computer", true);
    this.currentPlayer = this.player;
    this.gameState = "setup";
    this.shipDirection = "horizontal";
    this.ships = [
      { name: "Carrier", length: 5 },
      { name: "Battleship", length: 4 },
      { name: "Cruiser", length: 3 },
      { name: "Submarine", length: 3 },
      { name: "Destroyer", length: 2 },
    ];
    this.currentShipIndex = 0;
    this.domController = new DOMController(this);
    this.setupComputerShips();
    this.updateCurrentShipDisplay();
  }

  setupComputerShips() {
    this.ships.forEach((shipData) => {
      const ship = new Ship(shipData.length, shipData.name);
      let placed = false;
      while (!placed) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
        if (this.computer.gameboard.placeShip(ship, row, col, direction)) {
          placed = true;
        }
      }
    });
  }

  handlePlayerBoardClick(row, col) {
    if (this.gameState !== "setup") return;
    const currentShip = this.ships[this.currentShipIndex];
    if (!currentShip) return;
    const ship = new Ship(currentShip.length, currentShip.name);
    if (this.player.gameboard.placeShip(ship, row, col, this.shipDirection)) {
      this.domController.markShipAsPlaced(currentShip.name);
      this.currentShipIndex++;

      if (this.currentShipIndex >= this.ships.length) {
        this.domController.showMessage("All ships placed! Ready for battle!");
        this.domController.enableStartButton();
        this.domController.currentShipElement.textContent = "All ships placed!";
      } else {
        this.updateCurrentShipDisplay();
      }
      this.domController.updatePlayerBoard();
      this.domController.clearPreview();
    } else {
      this.domController.showMessage(
        "Cannot place ship here! Try another position.",
      );
    }
  }

  handlePlayerBoardHover(row, col) {
    if (this.gameState !== "setup") return;
    const currentShip = this.ships[this.currentShipIndex];
    if (!currentShip) return;
    // Check if ship can be placed at this position
    const tempShip = new Ship(currentShip.length, currentShip.name);
    const canPlace = this.player.gameboard.canPlaceShip(
      tempShip,
      row,
      col,
      this.shipDirection,
    );
    // Show preview with appropriate color
    this.domController.previewShipPlacement(
      row,
      col,
      currentShip.length,
      this.shipDirection,
      canPlace,
    );
  }

  handlePlayerBoardLeave() {
    if (this.gameState !== "setup") return;
    this.domController.clearPreview();
  }

  handleEnemyBoardClick(row, col) {
    if (this.gameState !== "playing" || this.currentPlayer !== this.player)
      return;
    const result = this.computer.gameboard.receiveAttack(row, col);
    if (result === "already-hit") {
      this.domController.showMessage(
        "You already shot there! Try another position.",
      );
      return;
    }

    this.processAttackResult(result, "player");
    this.domController.updateEnemyBoard();

    if (this.computer.gameboard.isAllSunk()) {
      this.endGame("player");
      return;
    }
    if (result === "miss") {
      this.currentPlayer = this.computer;
      setTimeout(() => this.executeComputerTurn(), 1000);
    }
  }

  executeComputerTurn() {
    if (this.currentPlayer !== this.computer) return;

    const { row, col } = this.computer.makeRandomShot();
    const result = this.player.gameboard.receiveAttack(row, col);
    this.processAttackResult(result, "computer");
    this.domController.updatePlayerBoard();
    if (this.player.gameboard.isAllSunk()) {
      this.endGame("computer");
      return;
    }
    if (result === "miss") {
      this.currentPlayer = this.player;
      this.domController.showMessage(
        "Your turn! Click on enemy waters to attack.",
      );
    } else {
      setTimeout(() => this.executeComputerTurn(), 1500);
    }
  }

  processAttackResult(result, attacker) {
    const isPlayer = attacker === "player";
    switch (result) {
      case "hit":
        this.domController.showMessage(
          isPlayer ? "Direct hit! Fire again!" : "Enemy hit your ship!",
        );
        break;
      case "sunk":
        this.domController.showMessage(
          isPlayer
            ? "Enemy ship destroyed! Fire again!"
            : "Your ship was destroyed!",
        );
        break;
      case "miss":
        this.domController.showMessage(
          isPlayer ? "Miss! Enemy's turn." : "Enemy missed! Your turn!",
        );
        break;
    }
  }

  rotateCurrentShip() {
    this.shipDirection =
      this.shipDirection === "horizontal" ? "vertical" : "horizontal";
    this.domController.showMessage(`Ship direction: ${this.shipDirection}`);
  }

  randomPlacement() {
    this.player.gameboard.reset();
    this.currentShipIndex = 0;

    this.ships.forEach((shipData) => {
      const ship = new Ship(shipData.length, shipData.name);
      let placed = false;

      while (!placed) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        const direction = Math.random() < 0.5 ? "horizontal" : "vertical";

        if (this.player.gameboard.placeShip(ship, row, col, direction)) {
          placed = true;
          this.domController.markShipAsPlaced(shipData.name);
        }
      }
    });

    this.currentShipIndex = this.ships.length;
    this.domController.updatePlayerBoard();
    this.domController.showMessage("Ships randomly placed! Ready for battle!");
    this.domController.enableStartButton();
    this.domController.currentShipElement.textContent = "All ships placed!";
  }

  startBattle() {
    this.gameState = "playing";
    this.currentPlayer = this.player;
    this.domController.showBattlePhase();
    this.domController.showMessage(
      "Battle begins! Click on enemy waters to attack!",
    );
  }

  endGame(winner) {
    this.gameState = "gameOver";
    const message =
      winner === "player"
        ? "🎉 Victory 🎉"
        : "💀 Defeat 💀 ";
    this.domController.showMessage(message);
  }

  restartGame() {
    this.player.reset();
    this.computer.reset();
    this.gameState = "setup";
    this.currentShipIndex = 0;
    this.shipDirection = "horizontal";
    this.setupComputerShips();
    this.updateCurrentShipDisplay();
    this.domController.showSetupPhase();
    this.domController.createBoard(this.domController.playerBoardElement, true);
    this.domController.createBoard(this.domController.enemyBoardElement, false);
    this.domController.showMessage("Place your ships to start the battle!");
    // Reset ship placement indicators
    document.querySelectorAll(".ship-item").forEach((item) => {
      item.classList.remove("placed");
    });
    document.getElementById("start-btn").disabled = true;
  }

  updateCurrentShipDisplay() {
    if (this.currentShipIndex < this.ships.length) {
      const currentShip = this.ships[this.currentShipIndex];
      this.domController.updateCurrentShip(
        currentShip.name,
        currentShip.length,
      );
    }
  }
}
