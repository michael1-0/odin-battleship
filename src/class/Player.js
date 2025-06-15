export default class Player {
  constructor(type, gameboard) {
    this.type = type;
    this.gameboard = gameboard;
    this.previousAttacks = [];
  }

  attack(opponent, coordinates = null) {
    let move;
    switch (this.type) {
      case "human":
        if (!coordinates) {
          throw new Error("Human player must provide coordinates");
        }
        if (this.#hasAttacked(coordinates)) {
          throw new Error(`Cell [${coordinates}] has already been attacked`);
        }
        move = coordinates;
        break;
      case "computer":
        move = this.#getRandomMove();
        break;
      default:
        throw new Error("Unknown player type");
    }
    this.previousAttacks.push(move.toString());
    return opponent.gameboard.receiveAttack(move);
  }

  #getRandomMove() {
    let row, col, move;
    do {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
      move = [row, col];
    } while (this.#hasAttacked(move));
    return move;
  }

  #hasAttacked(coordinates) {
    return this.previousAttacks.includes(coordinates.toString());
  }
}
