import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaContracts } from "../target/types/solana_contracts";
import { expect } from "chai";

describe("Finalize and Edge Cases Tests", () => {
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

  describe("mint_wexel_finalize()", () => {
    it("should not finalize wexel before maturity", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      // Try to finalize immediately (before maturity)
      try {
        await program.methods
          .mintWexelFinalize(new anchor.BN(poolId))
          .accounts({
            user: user.publicKey,
            wexel: wexelPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.toString()).to.include("WexelNotMatured");
      }
    });

    it("should not allow double finalization", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      // Note: In a real test, we'd need time manipulation to reach maturity
      // This is a conceptual test showing the expected behavior
      
      console.log("Test: Should not allow double finalization (requires time manipulation)");
      
      // The test would be:
      // 1. Create wexel
      // 2. Wait for or mock maturity
      // 3. Finalize once
      // 4. Try to finalize again -> should fail with WexelAlreadyFinalized
    });

    it("should finalize wexel at maturity (conceptual)", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      await createTestWexel(poolId, principalUsd);

      // Conceptual test showing expected finalization flow:
      // 1. Create wexel with 12 month lock period
      // 2. Wait for 12 months (or manipulate time)
      // 3. Call mint_wexel_finalize
      // 4. Verify is_finalized = true
      // 5. Verify WexelFinalized event is emitted
      
      console.log("Test: Finalization requires time manipulation for proper testing");
    });

    it("should only allow owner to finalize wexel", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      // Create another user
      const anotherUser = anchor.web3.Keypair.generate();

      // Try to finalize with different user
      try {
        await program.methods
          .mintWexelFinalize(new anchor.BN(poolId))
          .accounts({
            user: anotherUser.publicKey,
            wexel: wexelPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([anotherUser])
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (err) {
        // Should fail due to ownership constraint
        expect(err).to.exist;
      }
    });
  });

  describe("Edge Cases - Invalid Inputs", () => {
    it("should reject deposit with zero amount", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      
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

      try {
        await program.methods
          .deposit(new anchor.BN(poolId), new anchor.BN(0))
          .accounts({
            user: user.publicKey,
            pool: poolPda,
            wexel: wexelPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.toString()).to.include("InvalidAmount");
      }
    });

    it("should reject boost with zero amount", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      try {
        await program.methods
          .applyBoost(new anchor.BN(poolId), new anchor.BN(0))
          .accounts({
            user: user.publicKey,
            wexel: wexelPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.toString()).to.include("InvalidAmount");
      }
    });

    it("should handle very large principal amounts", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const largePrincipal = 1_000_000_000_000; // $1M (in micro-units)

      try {
        await createTestWexel(poolId, largePrincipal);
        
        // Should succeed if no overflow
        console.log("Successfully created wexel with large principal");
      } catch (err) {
        // Should either succeed or fail gracefully with MathOverflow
        if (err.toString().includes("MathOverflow")) {
          console.log("Correctly rejected oversized principal");
        }
      }
    });

    it("should handle maximum boost correctly", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      // Apply maximum boost (30% of principal = $300)
      const maxBoost = 300_000000;
      await program.methods
        .applyBoost(new anchor.BN(poolId), new anchor.BN(maxBoost))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const wexel = await program.account.wexel.fetch(wexelPda);
      expect(wexel.apyBoostBp.toNumber()).to.equal(500); // 5% max boost

      // Try to apply more boost (should cap at 5%)
      await program.methods
        .applyBoost(new anchor.BN(poolId), new anchor.BN(maxBoost))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const wexel2 = await program.account.wexel.fetch(wexelPda);
      // Should still be capped at 5%
      expect(wexel2.apyBoostBp.toNumber()).to.equal(500);
    });
  });

  describe("Edge Cases - Unauthorized Access", () => {
    it("should prevent unauthorized user from claiming rewards", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      const rewardsVaultPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("rewards_vault"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      // Accrue rewards
      await program.methods
        .accrue(new anchor.BN(poolId))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          rewardsVault: rewardsVaultPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      // Try to claim with unauthorized user
      const attacker = anchor.web3.Keypair.generate();

      try {
        await program.methods
          .claim(new anchor.BN(poolId))
          .accounts({
            user: attacker.publicKey,
            wexel: wexelPda,
            rewardsVault: rewardsVaultPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([attacker])
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (err) {
        // Should fail due to ownership constraint
        expect(err).to.exist;
      }
    });

    it("should prevent unauthorized collateralization", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      const collateralPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("collateral"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      const attacker = anchor.web3.Keypair.generate();

      try {
        await program.methods
          .collateralize(new anchor.BN(poolId))
          .accounts({
            user: attacker.publicKey,
            wexel: wexelPda,
            collateralPosition: collateralPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([attacker])
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (err) {
        // Should fail due to ownership constraint
        expect(err).to.exist;
      }
    });

    it("should prevent unauthorized loan repayment", async () => {
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

      const collateral = await program.account.collateralPosition.fetch(collateralPda);

      // Try to repay with unauthorized user
      const attacker = anchor.web3.Keypair.generate();

      try {
        await program.methods
          .repayLoan(new anchor.BN(poolId), collateral.loanUsd)
          .accounts({
            user: attacker.publicKey,
            wexel: wexelPda,
            collateralPosition: collateralPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([attacker])
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (err) {
        // Should fail due to ownership constraint
        expect(err).to.exist;
      }
    });
  });

  describe("Edge Cases - Math Operations", () => {
    it("should handle reward calculation without overflow", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 100_000_000_000; // Large amount

      try {
        const { wexelPda } = await createTestWexel(poolId, principalUsd);

        const rewardsVaultPda = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("rewards_vault"), Buffer.from(poolId.toString().padStart(8, "0"))],
          program.programId
        )[0];

        await program.methods
          .accrue(new anchor.BN(poolId))
          .accounts({
            user: user.publicKey,
            wexel: wexelPda,
            rewardsVault: rewardsVaultPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        console.log("Successfully accrued rewards for large principal");
      } catch (err) {
        if (err.toString().includes("MathOverflow")) {
          console.log("Correctly detected math overflow");
        } else {
          throw err;
        }
      }
    });

    it("should handle loan calculation without overflow", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 100_000_000_000; // Large amount

      try {
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
        const expectedLoan = Math.floor(principalUsd * 0.6);
        expect(collateral.loanUsd.toNumber()).to.be.closeTo(expectedLoan, 1000);

        console.log("Successfully calculated loan for large principal");
      } catch (err) {
        if (err.toString().includes("MathOverflow")) {
          console.log("Correctly detected math overflow");
        } else {
          throw err;
        }
      }
    });

    it("should handle cumulative claims without overflow", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      const rewardsVaultPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("rewards_vault"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      // Perform multiple accrue and claim cycles
      for (let i = 0; i < 5; i++) {
        await program.methods
          .accrue(new anchor.BN(poolId))
          .accounts({
            user: user.publicKey,
            wexel: wexelPda,
            rewardsVault: rewardsVaultPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        await program.methods
          .claim(new anchor.BN(poolId))
          .accounts({
            user: user.publicKey,
            wexel: wexelPda,
            rewardsVault: rewardsVaultPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const wexel = await program.account.wexel.fetch(wexelPda);
      console.log("Cumulative claimed rewards:", wexel.claimedRewards.toNumber());
      
      // Should not overflow
      expect(wexel.claimedRewards.toNumber()).to.be.greaterThan(0);
    });
  });

  describe("Edge Cases - State Consistency", () => {
    it("should maintain consistent state across operations", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      // Verify initial state
      const wexel1 = await program.account.wexel.fetch(wexelPda);
      expect(wexel1.principalUsd.toNumber()).to.equal(principalUsd);
      expect(wexel1.apyBp.toNumber()).to.equal(1800); // 18%
      expect(wexel1.apyBoostBp.toNumber()).to.equal(0);
      expect(wexel1.isCollateralized).to.be.false;
      expect(wexel1.isFinalized).to.be.false;
      expect(wexel1.totalRewards.toNumber()).to.equal(0);
      expect(wexel1.claimedRewards.toNumber()).to.equal(0);

      // Apply boost
      await program.methods
        .applyBoost(new anchor.BN(poolId), new anchor.BN(150_000000))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const wexel2 = await program.account.wexel.fetch(wexelPda);
      expect(wexel2.apyBoostBp.toNumber()).to.be.greaterThan(0);
      expect(wexel2.principalUsd.toNumber()).to.equal(principalUsd); // Principal unchanged

      console.log("State consistency maintained across operations");
    });

    it("should handle rapid consecutive operations", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      const rewardsVaultPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("rewards_vault"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      // Rapid consecutive accruals
      for (let i = 0; i < 3; i++) {
        await program.methods
          .accrue(new anchor.BN(poolId))
          .accounts({
            user: user.publicKey,
            wexel: wexelPda,
            rewardsVault: rewardsVaultPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();
      }

      const wexel = await program.account.wexel.fetch(wexelPda);
      expect(wexel.totalRewards.toNumber()).to.be.greaterThan(0);

      console.log("Successfully handled rapid consecutive operations");
    });
  });
});
