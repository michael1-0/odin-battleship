import Ship from "../class/Ship";

describe("Ship object", () => {
  const carrier = new Ship(5);
  test("Throw an error when instantiated with numbers less than or equal to 0", () => {
    expect(() => new Ship(0)).toThrow("Ship length must be greater than 0");
    expect(() => new Ship(-5)).toThrow("Ship length must be greater than 0");
  });
  test("Increment hit counter when hit", () => {
    carrier.hit();
    expect(carrier.hits).toBe(1);
  });
  test("Return false for isSunk() if hits are less than length", () => {
    expect(carrier.isSunk()).toBe(false);
  });
  test("Return true for isSunk after hitting all parts", () => {
    for (let i = 0; i < 4; i++) {
      carrier.hit();
    }
    expect(carrier.isSunk()).toBe(true);
  });
  test("Does not increment hits anymore after ship is sunk", () => {
    carrier.hit();
    expect(carrier.hits).toBe(5);
  });
});
