import { expect } from "chai";

describe("Simple Math Tests", () => {
  it("Should add numbers correctly", () => {
    expect(2 + 2).to.equal(4);
  });

  it("Should multiply numbers correctly", () => {
    expect(3 * 4).to.equal(12);
  });

  it("Should calculate APY correctly", () => {
    const principal = 1000;
    const apy = 18; // 18%
    const expected = (principal * apy) / 100;
    expect(expected).to.equal(180);
  });

  it("Should calculate LTV correctly", () => {
    const principal = 1000;
    const ltv = 60; // 60%
    const expected = (principal * ltv) / 100;
    expect(expected).to.equal(600);
  });
});
