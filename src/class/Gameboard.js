export default class Gameboard {
  constructor() {
    this.board = this.#initializeGrid();
    this.ships = [];
    this.missedShots = [];
    this.hitShots = [];
  }

  placeShip(ship, row, col, direction = "horizontal") {
    if (!this.canPlaceShip(ship, row, col, direction)) {
      return false;
    }

    const positions = [];
    for (let i = 0; i < ship.length; i++) {
      const r = direction === "horizontal" ? row : row + i;
      const c = direction === "horizontal" ? col + i : col;
      this.board[r][c] = ship;
      positions.push([r, c]);
    }

    this.ships.push({ ship, positions });
    return true;
  }

  canPlaceShip(ship, row, col, direction = "horizontal") {
    // Check bounds
    if (direction === "horizontal") {
      if (col + ship.length > 10) return false;
    } else {
      if (row + ship.length > 10) return false;
    }

    // Check for overlapping ships
    for (let i = 0; i < ship.length; i++) {
      const r = direction === "horizontal" ? row : row + i;
      const c = direction === "horizontal" ? col + i : col;
      if (this.board[r][c] !== null) return false;
    }

    return true;
  }

  receiveAttack(row, col) {
    if (
      this.hitShots.some(([r, c]) => r === row && c === col) ||
      this.missedShots.some(([r, c]) => r === row && c === col)
    ) {
      return "already-hit";
    }

    const ship = this.board[row][col];
    if (ship) {
      ship.hit();
      this.hitShots.push([row, col]);
      return ship.isSunk() ? "sunk" : "hit";
    } else {
      this.missedShots.push([row, col]);
      return "miss";
    }
  }

  isAllSunk() {
    return this.ships.every(({ ship }) => ship.isSunk());
  }

  getShipAt(row, col) {
    return this.board[row][col];
  }

  reset() {
    this.board = this.#initializeGrid();
    this.ships = [];
    this.missedShots = [];
    this.hitShots = [];
  }

  #initializeGrid() {
    const board = [];
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        row.push(null);
      }
      board.push(row);
    }
    return board;
  }
}
