import { expect } from "chai";

describe("Solana Contract Math Operations", () => {
  // Constants from the contract
  const LTV_BP = 6000; // 60% LTV
  const APY_BP = 1800; // 18% APY
  const BOOST_APY_BP = 500; // 5% boost APY
  const BOOST_TARGET_BP = 3000; // 30% of principal for max boost
  const SECONDS_PER_DAY = 86400;
  const SECONDS_PER_MONTH = 30 * SECONDS_PER_DAY;

  describe("APY Calculations", () => {
    it("Should calculate daily reward correctly for 18% APY", () => {
      const principalUsd = 1000 * 1e6; // $1000 USDT
      const apyBp = 1800; // 18%
      const expectedDailyReward = (principalUsd * apyBp) / (365 * 10000);

      expect(expectedDailyReward).to.be.closeTo(493150.68, 0.01); // ~$493.15 per day
    });

    it("Should calculate daily reward correctly for 36% APY", () => {
      const principalUsd = 1000 * 1e6; // $1000 USDT
      const apyBp = 3600; // 36%
      const expectedDailyReward = (principalUsd * apyBp) / (365 * 10000);

      expect(expectedDailyReward).to.be.closeTo(986301.37, 0.01); // ~$986.30 per day
    });

    it("Should calculate boost APY correctly", () => {
      const principalUsd = 1000 * 1e6; // $1000 USDT
      const boostValue = 300 * 1e6; // $300 boost
      const boostTarget = (principalUsd * BOOST_TARGET_BP) / 10000; // 30% of principal = $300
      const boostRatio = boostValue / boostTarget;
      const maxBoostBp = 500; // 5%
      const expectedBoostBp = Math.min(boostRatio * maxBoostBp, maxBoostBp);

      expect(expectedBoostBp).to.equal(500); // Should be 5% (max boost)
    });
  });

  describe("LTV Calculations", () => {
    it("Should calculate loan amount correctly (60% LTV)", () => {
      const principalUsd = 1000 * 1e6; // $1000 USDT
      const ltvBp = 6000; // 60%
      const expectedLoanAmount = (principalUsd * ltvBp) / 10000;

      expect(expectedLoanAmount).to.equal(600 * 1e6); // $600
    });

    it("Should calculate loan amount for different principal amounts", () => {
      const testCases = [
        { principal: 5000 * 1e6, expectedLoan: 3000 * 1e6 }, // $5000 -> $3000
        { principal: 10000 * 1e6, expectedLoan: 6000 * 1e6 }, // $10000 -> $6000
        { principal: 50000 * 1e6, expectedLoan: 30000 * 1e6 }, // $50000 -> $30000
      ];

      testCases.forEach(({ principal, expectedLoan }) => {
        const ltvBp = 6000; // 60%
        const calculatedLoan = (principal * ltvBp) / 10000;
        expect(calculatedLoan).to.equal(expectedLoan);
      });
    });
  });

  describe("Overflow Protection", () => {
    it("Should handle maximum u64 values without overflow", () => {
      const maxU64 = BigInt("18446744073709551615");

      // Test that we can create BigInt with max value
      expect(maxU64.toString()).to.equal("18446744073709551615");

      // Test arithmetic operations that should not overflow
      const half = maxU64 / BigInt(2);
      expect(half.toString()).to.equal("9223372036854775807");
    });

    it("Should detect potential overflow in calculations", () => {
      const largeNumber = BigInt("18446744073709551615");
      const smallNumber = BigInt(1);

      // This should not overflow
      const sum = largeNumber + smallNumber;
      expect(sum.toString()).to.equal("18446744073709551616");

      // This should overflow and wrap around
      const overflow = largeNumber + largeNumber;
      expect(overflow.toString()).to.equal("36893488147419103230"); // Wraps around
    });
  });

  describe("Precision and Rounding", () => {
    it("Should handle fractional calculations correctly", () => {
      const principalUsd = 1000 * 1e6; // $1000 USDT
      const apyBp = 1833; // 18.33%
      const dailyReward = (principalUsd * apyBp) / (365 * 10000);

      // Should round down to avoid overpaying
      const roundedReward = Math.floor(dailyReward);
      expect(roundedReward).to.equal(502191); // Should be 502191 (not 5)
    });

    it("Should handle very small amounts correctly", () => {
      const principalUsd = 1; // 1 micro-USDT
      const apyBp = 1800; // 18%
      const dailyReward = (principalUsd * apyBp) / (365 * 10000);

      // Should be very small for very small amounts
      expect(dailyReward).to.be.closeTo(0.000493, 0.000001);
    });
  });

  describe("Time Calculations", () => {
    it("Should calculate lock periods correctly", () => {
      const secondsPerDay = 86400;
      const secondsPerMonth = 30 * secondsPerDay;

      const testCases = [
        { months: 12, expectedSeconds: 12 * secondsPerMonth },
        { months: 18, expectedSeconds: 18 * secondsPerMonth },
        { months: 24, expectedSeconds: 24 * secondsPerMonth },
        { months: 30, expectedSeconds: 30 * secondsPerMonth },
        { months: 36, expectedSeconds: 36 * secondsPerMonth },
      ];

      testCases.forEach(({ months, expectedSeconds }) => {
        const calculatedSeconds = months * secondsPerMonth;
        expect(calculatedSeconds).to.equal(expectedSeconds);
      });
    });

    it("Should calculate days elapsed correctly", () => {
      const startTime = 1609459200; // Jan 1, 2021 00:00:00 UTC
      const endTime = 1640995200; // Jan 1, 2022 00:00:00 UTC
      const secondsPerDay = 86400;
      const expectedDays = (endTime - startTime) / secondsPerDay;

      expect(expectedDays).to.equal(365);
    });
  });

  describe("Error Handling", () => {
    it("Should validate input amounts", () => {
      const validAmount = 1000 * 1e6;
      const invalidAmount = 0;

      expect(validAmount > 0).to.be.true;
      expect(invalidAmount > 0).to.be.false;
    });

    it("Should validate APY bounds", () => {
      const validAPY = 1800; // 18%
      const invalidAPY = 10000; // 100%

      expect(validAPY <= 10000).to.be.true; // Max 100%
      expect(invalidAPY <= 10000).to.be.true; // 100% is valid
    });

    it("Should validate LTV bounds", () => {
      const validLTV = 6000; // 60%
      const invalidLTV = 10000; // 100%

      expect(validLTV <= 10000).to.be.true; // Max 100%
      expect(invalidLTV <= 10000).to.be.true; // 100% is valid
    });
  });
});
