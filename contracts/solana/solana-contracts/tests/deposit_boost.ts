import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaContracts } from "../target/types/solana_contracts";
import { expect } from "chai";

describe("Deposit and Boost", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaContracts as Program<SolanaContracts>;
  const provider = anchor.getProvider();

  // Test accounts
  let user: anchor.web3.Keypair;
  let pool: anchor.web3.Keypair;
  let wexel: anchor.web3.Keypair;

  before(async () => {
    // Generate test keypairs
    user = anchor.web3.Keypair.generate();
    pool = anchor.web3.Keypair.generate();
    wexel = anchor.web3.Keypair.generate();

    // Airdrop SOL to user for transaction fees
    await provider.connection.requestAirdrop(user.publicKey, anchor.web3.LAMPORTS_PER_SOL);
  });

  it("Should deposit USDT", async () => {
    const poolId = 1;
    const principalUsd = new anchor.BN(1000 * 1e6); // $1000 USDT (6 decimals)

    try {
      const tx = await program.methods
        .deposit(poolId, principalUsd)
        .accounts({
          user: user.publicKey,
          pool: pool.publicKey,
          wexel: wexel.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user, pool, wexel])
        .rpc();

      console.log("Deposit transaction signature:", tx);

      // Verify the transaction was successful
      const txInfo = await provider.connection.getTransaction(tx);
      expect(txInfo?.meta?.err).to.be.null;
    } catch (error) {
      console.error("Deposit test failed:", error);
      throw error;
    }
  });

  it("Should apply boost", async () => {
    const wexelId = new anchor.BN(1);
    const tokenMint = anchor.web3.Keypair.generate().publicKey;
    const amount = new anchor.BN(300 * 1e6); // $300 boost tokens

    try {
      const tx = await program.methods
        .applyBoost(wexelId, tokenMint, amount)
        .accounts({
          user: user.publicKey,
          wexel: wexel.publicKey,
          tokenMint: tokenMint,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      console.log("Apply boost transaction signature:", tx);

      // Verify the transaction was successful
      const txInfo = await provider.connection.getTransaction(tx);
      expect(txInfo?.meta?.err).to.be.null;
    } catch (error) {
      console.error("Apply boost test failed:", error);
      throw error;
    }
  });

  it("Should handle deposit validation", async () => {
    const poolId = 1;
    const insufficientAmount = new anchor.BN(100); // Too small amount

    try {
      await program.methods
        .deposit(poolId, insufficientAmount)
        .accounts({
          user: user.publicKey,
          pool: pool.publicKey,
          wexel: wexel.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user, pool, wexel])
        .rpc();

      // If we reach here, the test should fail
      expect.fail("Should have failed with insufficient deposit amount");
    } catch (error) {
      // Expected to fail due to insufficient amount
      expect(error.message).to.include("InsufficientDeposit");
    }
  });

  it("Should handle boost validation", async () => {
    const wexelId = new anchor.BN(1);
    const tokenMint = anchor.web3.Keypair.generate().publicKey;
    const excessiveAmount = new anchor.BN(1000 * 1e6); // Too much boost

    try {
      await program.methods
        .applyBoost(wexelId, tokenMint, excessiveAmount)
        .accounts({
          user: user.publicKey,
          wexel: wexel.publicKey,
          tokenMint: tokenMint,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      // If we reach here, the test should fail
      expect.fail("Should have failed with excessive boost amount");
    } catch (error) {
      // Expected to fail due to excessive boost
      expect(error.message).to.include("BoostTargetExceeded");
    }
  });
});
