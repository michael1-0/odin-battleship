import Player from "../class/Player";

describe("Player object", () => {
  test("creates player with name", () => {
    const player = new Player("John");
    expect(player.name).toBe("John");
    expect(player.isComputer).toBe(false);
  });
  test("creates computer player", () => {
    const computer = new Player("AI", true);
    expect(computer.name).toBe("AI");
    expect(computer.isComputer).toBe(true);
  });
  test("has gameboard and empty shots", () => {
    const player = new Player("Test");
    expect(player.gameboard).toBeDefined();
    expect(player.previousShots).toEqual([]);
  });
  test("makeRandomShot returns valid coordinates", () => {
    const player = new Player("Test");
    const shot = player.makeRandomShot();

    expect(shot.row).toBeGreaterThanOrEqual(0);
    expect(shot.row).toBeLessThan(10);
    expect(shot.col).toBeGreaterThanOrEqual(0);
    expect(shot.col).toBeLessThan(10);
  });
  test("makeRandomShot adds to previousShots", () => {
    const player = new Player("Test");
    const shot = player.makeRandomShot();

    expect(player.previousShots).toHaveLength(1);
    expect(player.previousShots[0]).toEqual([shot.row, shot.col]);
  });
  test("reset clears previousShots", () => {
    const player = new Player("Test");
    player.makeRandomShot();
    player.makeRandomShot();

    expect(player.previousShots).toHaveLength(2);

    player.reset();
    expect(player.previousShots).toEqual([]);
  });
});
