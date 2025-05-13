export default class Gameboard {
  constructor() {
    this.board = this.#initializeGrid();
    this.shipPartMiss = -1;
    this.ships = [];
  }

  placeShip(ship, startRow, startCol, orientation = "horizontal") {
    const coordinates = this.#calculateShipCoordinates(
      startRow,
      startCol,
      ship.length,
      orientation,
    );

    if (!this.#validateShipCoordinates(this.board, coordinates)) {
      throw new Error(
        "Invalid ship placement: out-of-bound or overlapping other ships",
      );
    }

    coordinates.forEach(({ row, col }) => {
      this.board[row][col] = ship;
    });

    this.ships.push(ship);
    return coordinates;
  }

  receiveAttack(coordinates) {
    const [row, col] = coordinates;
    if (
      row >= this.board.length ||
      row < 0 ||
      col >= this.board[0].length ||
      col < 0
    ) {
      throw new Error("Invalid attack placement: out-of-bound");
    }

    const cell = this.board[row][col];
    if (cell) {
      cell.hit();
      return true;
    } else {
      this.board[row][col] = this.shipPartMiss;
      return false;
    }
  }

  isAllSunk() {
    for (const element of this.ships) {
      if (element.hits !== element.length) {
        return false;
      }
    }
    return true;
  }

  #validateShipCoordinates(board, coordinates) {
    const rows = board.length;
    const cols = board[0].length;
    for (const { row, col } of coordinates) {
      if (row < 0 || row >= rows || col < 0 || col >= cols) {
        return false;
      }
      if (board[row][col] !== 0) {
        return false;
      }
    }
    return true;
  }

  #calculateShipCoordinates(startRow, startCol, length, orientation) {
    const coordinates = [];
    for (let i = 0; i < length; i++) {
      if (orientation === "horizontal") {
        coordinates.push({ row: startRow, col: startCol + i });
      } else if (orientation === "vertical") {
        coordinates.push({ row: startRow + i, col: startCol });
      } else {
        throw new Error("Orientation must be horizontal or vertical");
      }
    }
    return coordinates;
  }

  #initializeGrid() {
    const board = [];
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        row.push(0);
      }
      board.push(row);
    }
    return board;
  }
}
