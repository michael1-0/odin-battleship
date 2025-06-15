import Gameboard from "./Gameboard";

export default class Player {
  constructor(name, isComputer = false) {
    this.name = name;
    this.isComputer = isComputer;
    this.gameboard = new Gameboard();
    this.previousShots = [];
  }

  makeRandomShot() {
    let row, col;
    do {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
    } while (this.previousShots.some(([r, c]) => r === row && c === col));
    this.previousShots.push([row, col]);
    return { row, col };
  }

  reset() {
    this.gameboard.reset();
    this.previousShots = [];
  }
}
