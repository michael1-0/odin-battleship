import Gameboard from "../class/Gameboard";
import Ship from "../class/Ship";

describe("Gameboard object", () => {
  const gameboard = new Gameboard();
  const carrier = new Ship(5);
  test("Place ship at (0, 0) horizontally", () => {
    gameboard.placeShip(carrier, 0, 0, "horizontal");
    for (let i = 0; i < 5; i++) {
      expect(gameboard.board[0][i]).toBe(carrier);
    }
  });
  test("Place ship at (1, 0) vertically", () => {
    const battleship = new Ship(4);
    gameboard.placeShip(battleship, 1, 0, "vertical");
    for (let i = 1; i < 5; i++) {
      expect(gameboard.board[i][0]).toBe(battleship);
    }
  });
  test("Throw error when placed on overlapping ships", () => {
    const cruiser = new Ship(3);
    expect(() => gameboard.placeShip(cruiser, 0, 0, "horizontal")).toThrow(
      "Invalid ship placement: out-of-bound or overlapping other ships",
    );
  });
  test("Throw error when placed out-of-bound", () => {
    const submarine = new Ship(3);
    expect(() => gameboard.placeShip(submarine, 9, 9, "horizontal")).toThrow(
      "Invalid ship placement: out-of-bound or overlapping other ships",
    );
  });
  test("Hit ship works", () => {
    gameboard.receiveAttack([0, 0]);
    expect(gameboard.board[0][1].hits).toBe(carrier.hits);
  });
  test("Report true if all ships have sunk", () => {
    gameboard.receiveAttack([0, 1]);
    gameboard.receiveAttack([0, 2]);
    gameboard.receiveAttack([0, 3]);
    gameboard.receiveAttack([0, 4]);

    gameboard.receiveAttack([1, 0]);
    gameboard.receiveAttack([2, 0]);
    gameboard.receiveAttack([3, 0]);
    gameboard.receiveAttack([4, 0]);

    expect(gameboard.isAllSunk()).toBe(true);
  });
});
