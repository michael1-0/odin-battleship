import Player from "../class/Player";

const createDummyGameboard = () => {
  return {
    receiveAttack: jest.fn().mockImplementation((coords) => {
      return `Attack received at [${coords}]`;
    }),
  };
};
describe("Player object", () => {
  let humanGameboard, computerGameboard, human, computer;
  beforeEach(() => {
    humanGameboard = createDummyGameboard();
    computerGameboard = createDummyGameboard();
    human = new Player("human", humanGameboard);
    computer = new Player("computer", computerGameboard);
  });
  test("Human player provides coordinates", () => {
    expect(() => {
      human.attack(computer);
    }).toThrow("Human player must provide coordinates");

    const attackResult = human.attack(computer, [0, 0]);
    expect(attackResult).toBe("Attack received at [0,0]");
    expect(computerGameboard.receiveAttack).toHaveBeenCalledWith([0, 0]);
  });
  test("Human player cannot attack the same coordinate more than once", () => {
    human.attack(computer, [1, 0]);
    expect(() => {
      human.attack(computer, [1, 0]);
    }).toThrow("Cell [1,0] has already been attacked");
  });
  test("Computer player generate unique moves", () => {
    const firstResult = computer.attack(human);
    const secondResult =  computer.attack(human);
    expect(computer.previousAttacks.length).toBe(2);
    expect(computer.previousAttacks[0]).not.toBe(computer.previousAttacks[1]);
    expect(humanGameboard.receiveAttack).toHaveBeenCalledTimes(2);
  })
});
