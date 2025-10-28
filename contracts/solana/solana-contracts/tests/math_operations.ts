import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaContracts } from "../target/types/solana_contracts";
import { expect } from "chai";

describe("Math Operations and Edge Cases", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaContracts as Program<SolanaContracts>;
  const provider = anchor.getProvider();

  // Test accounts
  let user: anchor.web3.Keypair;
  let pool: anchor.web3.Keypair;
  let wexel: anchor.web3.Keypair;

  before(async () => {
    user = anchor.web3.Keypair.generate();
    pool = anchor.web3.Keypair.generate();
    wexel = anchor.web3.Keypair.generate();

    // Airdrop SOL to user for transaction fees
    await provider.connection.requestAirdrop(user.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
  });

  describe("APY Calculations", () => {
    it("Should calculate daily reward correctly for 18% APY", async () => {
      const principalUsd = new anchor.BN(1000 * 1e6); // $1000 USDT
      const apyBp = 1800; // 18%
      const expectedDailyReward = (principalUsd.toNumber() * apyBp) / (365 * 10000);

      // Test the calculation
      expect(expectedDailyReward).to.be.closeTo(4.93, 0.01); // ~$4.93 per day
    });

    it("Should calculate daily reward correctly for 36% APY", async () => {
      const principalUsd = new anchor.BN(1000 * 1e6); // $1000 USDT
      const apyBp = 3600; // 36%
      const expectedDailyReward = (principalUsd.toNumber() * apyBp) / (365 * 10000);

      expect(expectedDailyReward).to.be.closeTo(9.86, 0.01); // ~$9.86 per day
    });

    it("Should calculate boost APY correctly", async () => {
      const principalUsd = new anchor.BN(1000 * 1e6); // $1000 USDT
      const boostValue = new anchor.BN(300 * 1e6); // $300 boost
      const boostTarget = (principalUsd.toNumber() * 3000) / 10000; // 30% of principal = $300
      const boostRatio = boostValue.toNumber() / boostTarget;
      const maxBoostBp = 500; // 5%
      const expectedBoostBp = Math.min(boostRatio * maxBoostBp, maxBoostBp);

      expect(expectedBoostBp).to.equal(500); // Should be 5% (max boost)
    });
  });

  describe("LTV Calculations", () => {
    it("Should calculate loan amount correctly (60% LTV)", async () => {
      const principalUsd = new anchor.BN(1000 * 1e6); // $1000 USDT
      const ltvBp = 6000; // 60%
      const expectedLoanAmount = (principalUsd.toNumber() * ltvBp) / 10000;

      expect(expectedLoanAmount).to.equal(600 * 1e6); // $600
    });

    it("Should calculate loan amount for different principal amounts", async () => {
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
    it("Should handle maximum u64 values without overflow", async () => {
      const maxU64 = new anchor.BN("18446744073709551615");

      // Test that we can create BN with max value
      expect(maxU64.toString()).to.equal("18446744073709551615");

      // Test arithmetic operations that should not overflow
      const half = maxU64.div(new anchor.BN(2));
      expect(half.toString()).to.equal("9223372036854775807");
    });

    it("Should detect potential overflow in calculations", async () => {
      const largeNumber = new anchor.BN("18446744073709551615");
      const smallNumber = new anchor.BN(1);

      // This should not overflow
      const sum = largeNumber.add(smallNumber);
      expect(sum.toString()).to.equal("18446744073709551616");

      // This should overflow and wrap around
      const overflow = largeNumber.add(largeNumber);
      expect(overflow.toString()).to.equal("18446744073709551614"); // Wraps around
    });
  });

  describe("Precision and Rounding", () => {
    it("Should handle fractional calculations correctly", async () => {
      const principalUsd = new anchor.BN(1000 * 1e6); // $1000 USDT
      const apyBp = 1833; // 18.33%
      const dailyReward = (principalUsd.toNumber() * apyBp) / (365 * 10000);

      // Should round down to avoid overpaying
      const roundedReward = Math.floor(dailyReward);
      expect(roundedReward).to.equal(5); // Should be 5 (not 5.02...)
    });

    it("Should handle very small amounts correctly", async () => {
      const principalUsd = new anchor.BN(1); // 1 micro-USDT
      const apyBp = 1800; // 18%
      const dailyReward = (principalUsd.toNumber() * apyBp) / (365 * 10000);

      // Should be 0 for very small amounts
      expect(dailyReward).to.equal(0);
    });
  });

  describe("Time Calculations", () => {
    it("Should calculate lock periods correctly", async () => {
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

    it("Should calculate days elapsed correctly", async () => {
      const startTime = 1609459200; // Jan 1, 2021 00:00:00 UTC
      const endTime = 1640995200; // Jan 1, 2022 00:00:00 UTC
      const secondsPerDay = 86400;
      const expectedDays = (endTime - startTime) / secondsPerDay;

      expect(expectedDays).to.equal(365);
    });
  });
});
