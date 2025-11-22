import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaContracts } from "../target/types/solana_contracts";
import { expect } from "chai";

describe("Event Emission Tests", () => {
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
    user = anchor.web3.Keypair.generate();
    pool = anchor.web3.Keypair.generate();
    wexel = anchor.web3.Keypair.generate();
    collateralPosition = anchor.web3.Keypair.generate();
    rewardsVault = anchor.web3.Keypair.generate();
    tokenMint = anchor.web3.Keypair.generate();

    // Airdrop SOL to user for transaction fees
    await provider.connection.requestAirdrop(user.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
  });

  describe("WexelCreated Event", () => {
    it("Should emit WexelCreated event on deposit", async () => {
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

      // Create wexel account
      const wexelSpace = 88; // Wexel::LEN
      const wexelRent = await provider.connection.getMinimumBalanceForRentExemption(wexelSpace);

      const createWexelTx = new anchor.web3.Transaction().add(
        anchor.web3.SystemProgram.createAccount({
          fromPubkey: user.publicKey,
          newAccountPubkey: wexel.publicKey,
          lamports: wexelRent,
          space: wexelSpace,
          programId: program.programId,
        })
      );

      await provider.sendAndConfirm(createWexelTx, [user, wexel]);

      // Listen for events
      const eventListener = program.addEventListener("WexelCreated", (event) => {
        expect(event.id).to.be.a("number");
        expect(event.owner.toString()).to.equal(user.publicKey.toString());
        expect(event.principalUsd.toString()).to.equal(principalUsd.toString());
      });

      // Perform deposit
      const tx = await program.methods
        .deposit(poolId, principalUsd)
        .accounts({
          user: user.publicKey,
          pool: pool.publicKey,
          wexel: wexel.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      console.log("Deposit transaction signature:", tx);

      // Clean up event listener
      program.removeEventListener(eventListener);
    });
  });

  describe("BoostApplied Event", () => {
    it("Should emit BoostApplied event on boost application", async () => {
      const wexelId = new anchor.BN(1);
      const amount = new anchor.BN(300 * 1e6); // $300 boost tokens

      // Listen for events
      const eventListener = program.addEventListener("BoostApplied", (event) => {
        expect(event.wexelId.toString()).to.equal(wexelId.toString());
        expect(event.apyBoostBp).to.be.a("number");
        expect(event.valueUsd.toString()).to.equal(amount.toString());
      });

      // Perform boost application
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

      // Clean up event listener
      program.removeEventListener(eventListener);
    });
  });

  describe("Accrued Event", () => {
    it("Should emit Accrued event on reward accrual", async () => {
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

      // Listen for events
      const eventListener = program.addEventListener("Accrued", (event) => {
        expect(event.wexelId.toString()).to.equal(wexelId.toString());
        expect(event.rewardUsd).to.be.a("number");
        expect(event.rewardUsd).to.be.greaterThan(0);
      });

      // Perform accrual
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

      // Clean up event listener
      program.removeEventListener(eventListener);
    });
  });

  describe("Claimed Event", () => {
    it("Should emit Claimed event on reward claim", async () => {
      const wexelId = new anchor.BN(1);

      // Listen for events
      const eventListener = program.addEventListener("Claimed", (event) => {
        expect(event.wexelId.toString()).to.equal(wexelId.toString());
        expect(event.to.toString()).to.equal(user.publicKey.toString());
        expect(event.amountUsd).to.be.a("number");
      });

      // Perform claim
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

      // Clean up event listener
      program.removeEventListener(eventListener);
    });
  });

  describe("Collateralized Event", () => {
    it("Should emit Collateralized event on wexel collateralization", async () => {
      const wexelId = new anchor.BN(1);

      // Listen for events
      const eventListener = program.addEventListener("Collateralized", (event) => {
        expect(event.wexelId.toString()).to.equal(wexelId.toString());
        expect(event.loanUsd).to.be.a("number");
        expect(event.loanUsd).to.be.greaterThan(0);
      });

      // Perform collateralization
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

      // Clean up event listener
      program.removeEventListener(eventListener);
    });
  });

  describe("LoanRepaid Event", () => {
    it("Should emit LoanRepaid event on loan repayment", async () => {
      const wexelId = new anchor.BN(1);
      const repayAmount = new anchor.BN(600 * 1e6); // $600 (60% of $1000)

      // Listen for events
      const eventListener = program.addEventListener("LoanRepaid", (event) => {
        expect(event.wexelId.toString()).to.equal(wexelId.toString());
      });

      // Perform loan repayment
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

      // Clean up event listener
      program.removeEventListener(eventListener);
    });
  });

  describe("Redeemed Event", () => {
    it("Should emit Redeemed event on wexel redemption", async () => {
      const wexelId = new anchor.BN(1);

      // Listen for events
      const eventListener = program.addEventListener("Redeemed", (event) => {
        expect(event.wexelId.toString()).to.equal(wexelId.toString());
        expect(event.principalUsd).to.be.a("number");
        expect(event.principalUsd).to.be.greaterThan(0);
      });

      // Perform redemption (this will likely fail due to wexel not being matured)
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
      } catch (error) {
        // Expected to fail if wexel hasn't matured yet
        expect(error.message).to.include("WexelNotMatured");
      }

      // Clean up event listener
      program.removeEventListener(eventListener);
    });
  });

  describe("WexelFinalized Event", () => {
    it("Should emit WexelFinalized event on wexel finalization", async () => {
      const wexelId = new anchor.BN(1);

      // Listen for events
      const eventListener = program.addEventListener("WexelFinalized", (event) => {
        expect(event.wexelId.toString()).to.equal(wexelId.toString());
      });

      // Perform wexel finalization
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

      // Clean up event listener
      program.removeEventListener(eventListener);
    });
  });
});
