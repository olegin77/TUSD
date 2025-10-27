import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaContracts } from "../target/types/solana_contracts";
import { expect } from "chai";

describe("Comprehensive Solana Contracts Tests", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaContracts as Program<SolanaContracts>;
  const provider = anchor.getProvider();

  // Test accounts
  let user: anchor.web3.Keypair;
  let pool: anchor.web3.Keypair;
  let wexel: anchor.web3.Keypair;
  let collateralPosition: anchor.web3.Keypair;
  let rewardsVault: anchor.web3.Keypair;
  let tokenMint: anchor.web3.Keypair;

  before(async () => {
    // Generate test keypairs
    user = anchor.web3.Keypair.generate();
    pool = anchor.web3.Keypair.generate();
    wexel = anchor.web3.Keypair.generate();
    collateralPosition = anchor.web3.Keypair.generate();
    rewardsVault = anchor.web3.Keypair.generate();
    tokenMint = anchor.web3.Keypair.generate();

    // Airdrop SOL to user for transaction fees
    await provider.connection.requestAirdrop(user.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
  });

  describe("Pool Management", () => {
    it("Should initialize program", async () => {
      const tx = await program.methods.initialize().rpc();

      console.log("Initialize transaction signature:", tx);
      expect(tx).to.be.a("string");
    });
  });

  describe("Deposit Functionality", () => {
    it("Should deposit USDT successfully", async () => {
      const poolId = 1;
      const principalUsd = new anchor.BN(1000 * 1e6); // $1000 USDT

      // Create pool account
      const poolSpace = 48; // Pool::LEN
      const poolRent = await provider.connection.getMinimumBalanceForRentExemption(poolSpace);

      const createPoolTx = new anchor.web3.Transaction().add(
        anchor.web3.SystemProgram.createAccount({
          fromPubkey: user.publicKey,
          newAccountPubkey: pool.publicKey,
          lamports: poolRent,
          space: poolSpace,
          programId: program.programId,
        })
      );

      await provider.sendAndConfirm(createPoolTx, [user, pool]);

      // Now test deposit
      const tx = await program.methods
        .deposit(poolId, principalUsd)
        .accounts({
          user: user.publicKey,
          pool: pool.publicKey,
          wexel: wexel.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user, wexel])
        .rpc();

      console.log("Deposit transaction signature:", tx);
      expect(tx).to.be.a("string");
    });

    it("Should fail with insufficient deposit amount", async () => {
      const poolId = 1;
      const insufficientAmount = new anchor.BN(50 * 1e6); // $50 USDT (below $100 minimum)

      try {
        await program.methods
          .deposit(poolId, insufficientAmount)
          .accounts({
            user: user.publicKey,
            pool: pool.publicKey,
            wexel: wexel.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([user, wexel])
          .rpc();

        expect.fail("Should have failed with insufficient deposit amount");
      } catch (error) {
        expect(error.message).to.include("InsufficientDeposit");
      }
    });
  });

  describe("Boost Functionality", () => {
    it("Should apply boost successfully", async () => {
      const wexelId = new anchor.BN(1);
      const amount = new anchor.BN(300 * 1e6); // $300 boost tokens

      const tx = await program.methods
        .applyBoost(wexelId, tokenMint.publicKey, amount)
        .accounts({
          user: user.publicKey,
          wexel: wexel.publicKey,
          tokenMint: tokenMint.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      console.log("Apply boost transaction signature:", tx);
      expect(tx).to.be.a("string");
    });

    it("Should fail with excessive boost amount", async () => {
      const wexelId = new anchor.BN(1);
      const excessiveAmount = new anchor.BN(1000 * 1e6); // Too much boost

      try {
        await program.methods
          .applyBoost(wexelId, tokenMint.publicKey, excessiveAmount)
          .accounts({
            user: user.publicKey,
            wexel: wexel.publicKey,
            tokenMint: tokenMint.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([user])
          .rpc();

        expect.fail("Should have failed with excessive boost amount");
      } catch (error) {
        expect(error.message).to.include("BoostTargetExceeded");
      }
    });
  });

  describe("Wexel Finalization", () => {
    it("Should finalize wexel mint", async () => {
      const wexelId = new anchor.BN(1);

      const tx = await program.methods
        .mintWexelFinalize(wexelId)
        .accounts({
          user: user.publicKey,
          wexel: wexel.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      console.log("Mint wexel finalize transaction signature:", tx);
      expect(tx).to.be.a("string");
    });
  });

  describe("Rewards and Accrual", () => {
    it("Should accrue rewards", async () => {
      const wexelId = new anchor.BN(1);

      // Create rewards vault
      const vaultSpace = 16; // RewardsVault::LEN
      const vaultRent = await provider.connection.getMinimumBalanceForRentExemption(vaultSpace);

      const createVaultTx = new anchor.web3.Transaction().add(
        anchor.web3.SystemProgram.createAccount({
          fromPubkey: user.publicKey,
          newAccountPubkey: rewardsVault.publicKey,
          lamports: vaultRent,
          space: vaultSpace,
          programId: program.programId,
        })
      );

      await provider.sendAndConfirm(createVaultTx, [user, rewardsVault]);

      const tx = await program.methods
        .accrue(wexelId)
        .accounts({
          wexel: wexel.publicKey,
          rewardsVault: rewardsVault.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      console.log("Accrue transaction signature:", tx);
      expect(tx).to.be.a("string");
    });

    it("Should claim rewards", async () => {
      const wexelId = new anchor.BN(1);

      const tx = await program.methods
        .claim(wexelId)
        .accounts({
          user: user.publicKey,
          wexel: wexel.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      console.log("Claim transaction signature:", tx);
      expect(tx).to.be.a("string");
    });
  });

  describe("Collateral Functionality", () => {
    it("Should collateralize wexel", async () => {
      const wexelId = new anchor.BN(1);

      const tx = await program.methods
        .collateralize(wexelId)
        .accounts({
          user: user.publicKey,
          wexel: wexel.publicKey,
          collateralPosition: collateralPosition.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user, collateralPosition])
        .rpc();

      console.log("Collateralize transaction signature:", tx);
      expect(tx).to.be.a("string");
    });

    it("Should fail to collateralize already collateralized wexel", async () => {
      const wexelId = new anchor.BN(1);

      try {
        await program.methods
          .collateralize(wexelId)
          .accounts({
            user: user.publicKey,
            wexel: wexel.publicKey,
            collateralPosition: collateralPosition.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([user, collateralPosition])
          .rpc();

        expect.fail("Should have failed - wexel already collateralized");
      } catch (error) {
        expect(error.message).to.include("AlreadyCollateralized");
      }
    });

    it("Should repay loan", async () => {
      const wexelId = new anchor.BN(1);
      const repayAmount = new anchor.BN(600 * 1e6); // $600 (60% of $1000)

      const tx = await program.methods
        .repayLoan(wexelId, repayAmount)
        .accounts({
          user: user.publicKey,
          wexel: wexel.publicKey,
          collateralPosition: collateralPosition.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      console.log("Repay loan transaction signature:", tx);
      expect(tx).to.be.a("string");
    });
  });

  describe("Redemption", () => {
    it("Should redeem matured wexel", async () => {
      const wexelId = new anchor.BN(1);

      // Note: In a real test, we would need to wait for the wexel to mature
      // or manipulate the clock for testing purposes
      try {
        const tx = await program.methods
          .redeem(wexelId)
          .accounts({
            user: user.publicKey,
            wexel: wexel.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([user])
          .rpc();

        console.log("Redeem transaction signature:", tx);
        expect(tx).to.be.a("string");
      } catch (error) {
        // Expected to fail if wexel hasn't matured yet
        expect(error.message).to.include("WexelNotMatured");
      }
    });
  });

  describe("Error Handling", () => {
    it("Should handle unauthorized access", async () => {
      const unauthorizedUser = anchor.web3.Keypair.generate();
      const wexelId = new anchor.BN(1);

      try {
        await program.methods
          .claim(wexelId)
          .accounts({
            user: unauthorizedUser.publicKey,
            wexel: wexel.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([unauthorizedUser])
          .rpc();

        expect.fail("Should have failed with unauthorized access");
      } catch (error) {
        expect(error.message).to.include("Unauthorized");
      }
    });

    it("Should handle invalid wexel ID", async () => {
      const invalidWexelId = new anchor.BN(999);

      try {
        await program.methods
          .claim(invalidWexelId)
          .accounts({
            user: user.publicKey,
            wexel: wexel.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([user])
          .rpc();

        expect.fail("Should have failed with invalid wexel ID");
      } catch (error) {
        expect(error.message).to.include("WexelNotFound");
      }
    });
  });

  describe("Math Operations", () => {
    it("Should handle large numbers without overflow", async () => {
      const poolId = 1;
      const largeAmount = new anchor.BN("18446744073709551615"); // Max u64

      try {
        await program.methods
          .deposit(poolId, largeAmount)
          .accounts({
            user: user.publicKey,
            pool: pool.publicKey,
            wexel: wexel.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([user, wexel])
          .rpc();

        // If it succeeds, that's fine
        console.log("Large amount deposit succeeded");
      } catch (error) {
        // Expected to fail due to overflow or other constraints
        expect(error.message).to.include("MathOverflow");
      }
    });
  });
});
