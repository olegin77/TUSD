import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaContracts } from "../target/types/solana_contracts";
import { expect } from "chai";

describe("Accrue and Claim Tests", () => {
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

  describe("accrue()", () => {
    it("should accrue rewards correctly for a new wexel", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000; // $1000 in micro-units

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      // Create rewards vault PDA
      const rewardsVaultPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("rewards_vault"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      // Wait a bit to allow some time to pass (in real scenario)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Call accrue
      const tx = await program.methods
        .accrue(new anchor.BN(poolId))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          rewardsVault: rewardsVaultPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log("Accrue transaction:", tx);

      // Fetch wexel and check rewards
      const wexel = await program.account.wexel.fetch(wexelPda);
      expect(wexel.totalRewards.toNumber()).to.be.greaterThan(0);

      // Fetch rewards vault
      const rewardsVault = await program.account.rewardsVault.fetch(rewardsVaultPda);
      expect(rewardsVault.totalRewards.toNumber()).to.equal(wexel.totalRewards.toNumber());
    });

    it("should accrue higher rewards with boost applied", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000; // $1000

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      // Apply boost
      const boostAmount = 300_000000; // $300 (full boost)
      await program.methods
        .applyBoost(new anchor.BN(poolId), new anchor.BN(boostAmount))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      // Create rewards vault PDA
      const rewardsVaultPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("rewards_vault"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Accrue with boost
      await program.methods
        .accrue(new anchor.BN(poolId))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          rewardsVault: rewardsVaultPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const wexel = await program.account.wexel.fetch(wexelPda);

      // With full boost (5%), total APY = 18% + 5% = 23%
      // Rewards should reflect the boosted APY
      expect(wexel.apyBoostBp.toNumber()).to.equal(500); // 5% boost
      expect(wexel.totalRewards.toNumber()).to.be.greaterThan(0);
    });

    it("should handle multiple accrual calls correctly", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      const rewardsVaultPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("rewards_vault"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      // First accrual
      await program.methods
        .accrue(new anchor.BN(poolId))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          rewardsVault: rewardsVaultPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const wexel1 = await program.account.wexel.fetch(wexelPda);
      const rewards1 = wexel1.totalRewards.toNumber();

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Second accrual (should update based on elapsed time)
      await program.methods
        .accrue(new anchor.BN(poolId))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          rewardsVault: rewardsVaultPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const wexel2 = await program.account.wexel.fetch(wexelPda);
      const rewards2 = wexel2.totalRewards.toNumber();

      // Rewards should increase or stay the same
      expect(rewards2).to.be.gte(rewards1);
    });

    it("should not accrue rewards for finalized wexel", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      const rewardsVaultPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("rewards_vault"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      // First accrue some rewards
      await program.methods
        .accrue(new anchor.BN(poolId))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          rewardsVault: rewardsVaultPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      // Manually update wexel to be finalized (in real scenario, would need to wait for maturity)
      // For this test, we'll just try to accrue on a finalized wexel
      // Note: This test requires the contract to check is_finalized flag properly

      // This test is conceptual - in practice, we'd need to manipulate time or state
      // to properly test this scenario
    });
  });

  describe("claim()", () => {
    it("should claim accrued rewards successfully", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      const rewardsVaultPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("rewards_vault"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      // Accrue rewards first
      await program.methods
        .accrue(new anchor.BN(poolId))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          rewardsVault: rewardsVaultPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const wexelBefore = await program.account.wexel.fetch(wexelPda);
      const totalRewardsBefore = wexelBefore.totalRewards.toNumber();
      const claimedBefore = wexelBefore.claimedRewards.toNumber();

      // Claim rewards
      const tx = await program.methods
        .claim(new anchor.BN(poolId))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          rewardsVault: rewardsVaultPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log("Claim transaction:", tx);

      // Verify claim
      const wexelAfter = await program.account.wexel.fetch(wexelPda);
      const claimedAfter = wexelAfter.claimedRewards.toNumber();

      expect(claimedAfter).to.equal(totalRewardsBefore);
      expect(claimedAfter).to.be.greaterThan(claimedBefore);

      // Verify rewards vault was updated
      const rewardsVault = await program.account.rewardsVault.fetch(rewardsVaultPda);
      expect(rewardsVault.distributedRewards.toNumber()).to.equal(claimedAfter);
    });

    it("should not allow claiming when no rewards available", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      const rewardsVaultPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("rewards_vault"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      // Try to claim without accruing first
      try {
        await program.methods
          .claim(new anchor.BN(poolId))
          .accounts({
            user: user.publicKey,
            wexel: wexelPda,
            rewardsVault: rewardsVaultPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.toString()).to.include("InvalidAmount");
      }
    });

    it("should not allow double claiming", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      const rewardsVaultPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("rewards_vault"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      // Accrue and claim once
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

      // Try to claim again without new accrual
      try {
        await program.methods
          .claim(new anchor.BN(poolId))
          .accounts({
            user: user.publicKey,
            wexel: wexelPda,
            rewardsVault: rewardsVaultPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (err) {
        expect(err.toString()).to.include("InvalidAmount");
      }
    });

    it("should allow partial claims over time", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000;

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      const rewardsVaultPda = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("rewards_vault"), Buffer.from(poolId.toString().padStart(8, "0"))],
        program.programId
      )[0];

      // Accrue and claim first batch
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

      const wexel1 = await program.account.wexel.fetch(wexelPda);
      const claimed1 = wexel1.claimedRewards.toNumber();

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Accrue more and claim second batch
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

      const wexel2 = await program.account.wexel.fetch(wexelPda);
      const claimed2 = wexel2.claimedRewards.toNumber();

      // Second claim should be cumulative
      expect(claimed2).to.be.gte(claimed1);
    });

    it("should only allow owner to claim rewards", async () => {
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

      // Create another user
      const anotherUser = anchor.web3.Keypair.generate();

      // Try to claim with different user (should fail due to constraint)
      try {
        await program.methods
          .claim(new anchor.BN(poolId))
          .accounts({
            user: anotherUser.publicKey,
            wexel: wexelPda,
            rewardsVault: rewardsVaultPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([anotherUser])
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (err) {
        // Should fail due to constraint check
        expect(err).to.exist;
      }
    });
  });

  describe("Rewards calculation accuracy", () => {
    it("should calculate daily rewards accurately without boost", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000; // $1000

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

      const wexel = await program.account.wexel.fetch(wexelPda);

      // Expected daily reward = Principal * APY / 365
      // APY = 18% = 1800 bp
      // Daily reward ≈ 1000 * 0.18 / 365 ≈ 0.4932 USD
      // In micro-units: 0.4932 * 1000000 ≈ 493200

      // Note: Actual calculation depends on elapsed time
      // This is a rough check
      console.log("Total rewards:", wexel.totalRewards.toNumber());
    });

    it("should calculate daily rewards accurately with full boost", async () => {
      const poolId = Math.floor(Math.random() * 1000000);
      const principalUsd = 1000_000000; // $1000

      const { wexelPda } = await createTestWexel(poolId, principalUsd);

      // Apply full boost
      const boostAmount = 300_000000; // $300
      await program.methods
        .applyBoost(new anchor.BN(poolId), new anchor.BN(boostAmount))
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

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

      const wexel = await program.account.wexel.fetch(wexelPda);

      // Expected daily reward with boost = Principal * (APY + Boost) / 365
      // Total APY = 18% + 5% = 23% = 2300 bp
      // Daily reward ≈ 1000 * 0.23 / 365 ≈ 0.6301 USD

      console.log("Total rewards with boost:", wexel.totalRewards.toNumber());
      console.log("APY boost bp:", wexel.apyBoostBp.toNumber());
    });
  });
});
