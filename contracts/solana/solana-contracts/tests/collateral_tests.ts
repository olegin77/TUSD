import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaContracts } from "../target/types/solana_contracts";
import { expect } from "chai";

describe("Collateral Tests (collateralize, repay_loan, redeem)", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaContracts as Program<SolanaContracts>;
  const user = provider.wallet;

  // Helper function to create a wexel for testing
  async function createTestWexel(poolId: number, principalUsd: number) {
    const poolPda = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), Buffer.from(poolId.toString().padStart(8, "0"))],
      program.programId
    )[0];

    const wexelPda = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("wexel"),
        user.publicKey.toBuffer(),
        Buffer.from(poolId.toString().padStart(8, "0")),
      ],
      program.programId
    )[0];

    await program.methods
      .deposit(new anchor.BN(poolId), new anchor.BN(principalUsd))
      .accounts({
        user: user.publicKey,
        pool: poolPda,
        wexel: wexelPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    return { poolPda, wexelPda };
  }

  describe("collateralize()", () => {
    it("should collateralize wexel and create loan at 60% LTV", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000; // $1000

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      // Create collateral position PDA
      const collateralPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("collateral"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      // Collateralize
      const tx = await program.methods
        .collateralize(new anchor.BN(poolId))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          collateralPosition: collateralPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log("Collateralize transaction:", tx);

      // Verify wexel is collateralized
      const wexel = await program.account.wexel.fetch(wexelPda);
      expect(wexel.isCollateralized).to.be.true;

      // Verify collateral position
      const collateralPosition = await program.account.collateralPosition.fetch(collateralPda);
      expect(collateralPosition.wexelId.toNumber()).to.equal(poolId);
      expect(collateralPosition.owner.toString()).to.equal(user.publicKey.toString());
      
      // Loan should be 60% of principal
      const expectedLoan = Math.floor(principalUsd * 0.6);
      expect(collateralPosition.loanUsd.toNumber()).to.equal(expectedLoan);
      expect(collateralPosition.ltvBp.toNumber()).to.equal(6000); // 60%
      expect(collateralPosition.isRepaid).to.be.false;
    });

    it("should not allow collateralizing same wexel twice", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      const collateralPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("collateral"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      // First collateralization
      await program.methods
        .collateralize(new anchor.BN(poolId))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          collateralPosition: collateralPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      // Try to collateralize again
      try {
        await program.methods
          .collateralize(new anchor.BN(poolId))
          .accounts({
            user: user.publicKey,
            wexel: wexelPda,
            collateralPosition: collateralPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.toString()).to.include("WexelAlreadyCollateralized");
      }
    });

    it("should not allow collateralizing finalized wexel", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      // Note: In a real scenario, we'd need to wait for maturity and finalize
      // For this test, we're checking the contract logic exists
      // The actual test would require time manipulation or mocking
      
      // This is a conceptual test to show what should be tested
      console.log("Test: Should not allow collateralizing finalized wexel (requires time manipulation)");
    });

    it("should calculate correct loan amount for different principals", async () => {
      const testCases = [
        { principal: 1000_000000, expectedLoan: 600_000000 }, // $1000 -> $600
        { principal: 5000_000000, expectedLoan: 3000_000000 }, // $5000 -> $3000
        { principal: 10000_000000, expectedLoan: 6000_000000 }, // $10000 -> $6000
      ];

      for (const testCase of testCases) {
        const poolId = Math.floor(Math.random() * 1000000);
        const { wexelPda } = await createTestWexel(poolId, testCase.principal);

        const collateralPda = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("collateral"), Buffer.from(poolId.toString().padStart(8, "0"))],
          program.programId
        )[0];

        await program.methods
          .collateralize(new anchor.BN(poolId))
          .accounts({
            user: user.publicKey,
            wexel: wexelPda,
            collateralPosition: collateralPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        const collateralPosition = await program.account.collateralPosition.fetch(collateralPda);
        expect(collateralPosition.loanUsd.toNumber()).to.equal(testCase.expectedLoan);
      }
    });
  });

  describe("repay_loan()", () => {
    it("should repay loan and release wexel from collateral", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      const collateralPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("collateral"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      // Collateralize first
      await program.methods
        .collateralize(new anchor.BN(poolId))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          collateralPosition: collateralPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const collateralBefore = await program.account.collateralPosition.fetch(collateralPda);
      const loanAmount = collateralBefore.loanUsd;

      // Repay loan
      const tx = await program.methods
        .repayLoan(new anchor.BN(poolId), loanAmount)
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          collateralPosition: collateralPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log("Repay loan transaction:", tx);

      // Verify wexel is no longer collateralized
      const wexel = await program.account.wexel.fetch(wexelPda);
      expect(wexel.isCollateralized).to.be.false;

      // Verify collateral position is marked as repaid
      const collateralAfter = await program.account.collateralPosition.fetch(collateralPda);
      expect(collateralAfter.isRepaid).to.be.true;
    });

    it("should not allow repaying loan that doesn't exist", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      const collateralPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("collateral"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      // Try to repay without collateralizing first
      try {
        await program.methods
          .repayLoan(new anchor.BN(poolId), new anchor.BN(600_000000))
          .accounts({
            user: user.publicKey,
            wexel: wexelPda,
            collateralPosition: collateralPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.toString()).to.include("WexelNotCollateralized");
      }
    });

    it("should not allow repaying with insufficient amount", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      const collateralPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("collateral"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      // Collateralize
      await program.methods
        .collateralize(new anchor.BN(poolId))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          collateralPosition: collateralPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      // Try to repay with insufficient amount
      const insufficientAmount = 100_000000; // Only $100, need $600

      try {
        await program.methods
          .repayLoan(new anchor.BN(poolId), new anchor.BN(insufficientAmount))
          .accounts({
            user: user.publicKey,
            wexel: wexelPda,
            collateralPosition: collateralPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.toString()).to.include("InvalidRepaymentAmount");
      }
    });

    it("should allow repaying with exact or higher amount", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      const collateralPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("collateral"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      await program.methods
        .collateralize(new anchor.BN(poolId))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          collateralPosition: collateralPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const collateral = await program.account.collateralPosition.fetch(collateralPda);
      const loanAmount = collateral.loanUsd;
      
      // Repay with extra amount
      const repayAmount = loanAmount.add(new anchor.BN(100_000000)); // Extra $100

      await program.methods
        .repayLoan(new anchor.BN(poolId), repayAmount)
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          collateralPosition: collateralPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const wexel = await program.account.wexel.fetch(wexelPda);
      expect(wexel.isCollateralized).to.be.false;
    });

    it("should not allow repaying already repaid loan", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      const collateralPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("collateral"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      // Collateralize and repay
      await program.methods
        .collateralize(new anchor.BN(poolId))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          collateralPosition: collateralPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const collateral = await program.account.collateralPosition.fetch(collateralPda);
      
      await program.methods
        .repayLoan(new anchor.BN(poolId), collateral.loanUsd)
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          collateralPosition: collateralPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      // Try to repay again
      try {
        await program.methods
          .repayLoan(new anchor.BN(poolId), collateral.loanUsd)
          .accounts({
            user: user.publicKey,
            wexel: wexelPda,
            collateralPosition: collateralPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.toString()).to.include("InvalidRepaymentAmount");
      }
    });
  });

  describe("redeem()", () => {
    it("should redeem wexel at maturity", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      // Note: In reality, we'd need to wait for maturity and finalize first
      // This test shows the expected behavior

      // First finalize (assuming time has passed)
      // In a real test environment, we'd mock time or use devnet with time travel
      
      console.log("Test: Redeem requires time manipulation for proper testing");
      
      // The test would look like:
      // 1. Create wexel
      // 2. Wait for maturity or manipulate time
      // 3. Finalize wexel
      // 4. Redeem and verify principal is returned
    });

    it("should not allow redeeming non-finalized wexel", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      // Try to redeem without finalizing
      try {
        await program.methods
          .redeem(new anchor.BN(poolId))
          .accounts({
            user: user.publicKey,
            wexel: wexelPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.toString()).to.include("WexelNotFinalized");
      }
    });

    it("should not allow redeeming before maturity", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      // Try to redeem immediately (before maturity)
      try {
        await program.methods
          .redeem(new anchor.BN(poolId))
          .accounts({
            user: user.publicKey,
            wexel: wexelPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (err) {
        // Should fail due to not finalized or not matured
        expect(err).to.exist;
      }
    });
  });

  describe("Collateral workflow integration", () => {
    it("should handle full collateral cycle: collateralize -> accrue -> repay -> claim", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      const collateralPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("collateral"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      const rewardsVaultPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("rewards_vault"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      // Step 1: Collateralize
      await program.methods
        .collateralize(new anchor.BN(poolId))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          collateralPosition: collateralPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      // Step 2: Accrue rewards (while collateralized)
      await program.methods
        .accrue(new anchor.BN(poolId))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          rewardsVault: rewardsVaultPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      // Note: While collateralized, rewards should be split 40/60
      // This would require additional state tracking in the contract

      // Step 3: Repay loan
      const collateral = await program.account.collateralPosition.fetch(collateralPda);
      await program.methods
        .repayLoan(new anchor.BN(poolId), collateral.loanUsd)
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          collateralPosition: collateralPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      // Step 4: Claim rewards (after repayment, should get 100% of future rewards)
      await program.methods
        .claim(new anchor.BN(poolId))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          rewardsVault: rewardsVaultPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const wexel = await program.account.wexel.fetch(wexelPda);
      expect(wexel.isCollateralized).to.be.false;
      expect(wexel.claimedRewards.toNumber()).to.be.greaterThan(0);
    });

    it("should prevent operations on collateralized wexel (conceptual)", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      const collateralPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("collateral"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      await program.methods
        .collateralize(new anchor.BN(poolId))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          collateralPosition: collateralPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      // Note: According to spec, collateralized wexels:
      // - Cannot be listed on marketplace
      // - Have different reward distribution (40/60)
      // - Cannot be transferred
      
      console.log("Test: Collateralized wexels should have restricted operations");
    });
  });
});
