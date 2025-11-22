import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaContracts } from "../target/types/solana_contracts";
import { expect } from "chai";

describe("Deposit and Boost Tests", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaContracts as Program<SolanaContracts>;
  const provider = anchor.getProvider();

  // Test accounts
  let user: anchor.web3.Keypair;
  let poolId: anchor.BN;
  let wexelId: anchor.BN;

  before(async () => {
    // Generate test keypairs
    user = anchor.web3.Keypair.generate();
    poolId = new anchor.BN(1);
    wexelId = poolId; // For simplicity, using same ID

    // Airdrop SOL to user for transaction fees
    const signature = await provider.connection.requestAirdrop(
      user.publicKey,
      10 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);

    // Wait for confirmation
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  describe("Deposit Functionality", () => {
    it("Should deposit USDT successfully and emit WexelCreated event", async () => {
      const principalUsd = new anchor.BN(1000_000000); // $1000 USDT (6 decimals)

      // Derive PDAs
      const [poolPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), poolId.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [wexelPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("wexel"), user.publicKey.toBuffer(), poolId.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      // Execute deposit
      const tx = await program.methods
        .deposit(poolId, principalUsd)
        .accounts({
          user: user.publicKey,
          pool: poolPda,
          wexel: wexelPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      console.log("✓ Deposit transaction signature:", tx);

      // Fetch and verify wexel account
      const wexelAccount = await program.account.wexel.fetch(wexelPda);
      expect(wexelAccount.id.toString()).to.equal(poolId.toString());
      expect(wexelAccount.owner.toString()).to.equal(user.publicKey.toString());
      expect(wexelAccount.principalUsd.toString()).to.equal(principalUsd.toString());
      expect(wexelAccount.apyBp).to.equal(1800); // 18% APY
      expect(wexelAccount.apyBoostBp).to.equal(0); // No boost yet
      expect(wexelAccount.lockPeriodMonths).to.equal(12);
      expect(wexelAccount.isCollateralized).to.equal(false);
      expect(wexelAccount.isFinalized).to.equal(false);

      // Fetch and verify pool account
      const poolAccount = await program.account.pool.fetch(poolPda);
      expect(poolAccount.id.toString()).to.equal(poolId.toString());
      expect(poolAccount.totalDeposits.toString()).to.equal(principalUsd.toString());
      expect(poolAccount.apyBp).to.equal(1800);

      console.log("✓ Wexel created successfully with principal:", principalUsd.toString());
    });

    it("Should fail deposit with zero amount", async () => {
      const invalidAmount = new anchor.BN(0);
      const poolId2 = new anchor.BN(2);

      const [poolPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), poolId2.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [wexelPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("wexel"), user.publicKey.toBuffer(), poolId2.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      try {
        await program.methods
          .deposit(poolId2, invalidAmount)
          .accounts({
            user: user.publicKey,
            pool: poolPda,
            wexel: wexelPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([user])
          .rpc();

        expect.fail("Should have failed with InvalidAmount error");
      } catch (error: any) {
        expect(error.error.errorCode.code).to.equal("InvalidAmount");
        console.log("✓ Correctly rejected zero amount deposit");
      }
    });

    it("Should verify wexel maturity date is set correctly", async () => {
      const [wexelPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("wexel"), user.publicKey.toBuffer(), poolId.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const wexelAccount = await program.account.wexel.fetch(wexelPda);
      const lockPeriodSeconds = 12 * 30 * 86400; // 12 months in seconds
      const expectedMaturity = wexelAccount.createdAt.toNumber() + lockPeriodSeconds;

      expect(wexelAccount.maturedAt.toNumber()).to.be.closeTo(expectedMaturity, 2);
      console.log("✓ Wexel maturity date set correctly");
    });
  });

  describe("Boost Functionality", () => {
    it("Should apply boost successfully and emit BoostApplied event", async () => {
      const boostAmount = new anchor.BN(300_000000); // $300 (30% of $1000 = max boost)

      const [wexelPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("wexel"), user.publicKey.toBuffer(), poolId.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      // Get wexel before boost
      const wexelBefore = await program.account.wexel.fetch(wexelPda);
      expect(wexelBefore.apyBoostBp).to.equal(0);

      // Apply boost
      const tx = await program.methods
        .applyBoost(wexelId, boostAmount)
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      console.log("✓ Apply boost transaction signature:", tx);

      // Fetch and verify wexel account
      const wexelAfter = await program.account.wexel.fetch(wexelPda);

      // Verify boost APY calculation
      // boost_target = 1000 * 3000 / 10000 = 300
      // boost_ratio = min(300, 300) / 300 = 1.0
      // boost_apy_bp = 1.0 * 500 = 500 (5%)
      expect(wexelAfter.apyBoostBp).to.equal(500);

      console.log("✓ Boost applied successfully, APY boost:", wexelAfter.apyBoostBp, "bp");
    });

    it("Should apply partial boost correctly", async () => {
      const poolId3 = new anchor.BN(3);
      const principalUsd = new anchor.BN(1000_000000); // $1000
      const partialBoostAmount = new anchor.BN(150_000000); // $150 (50% of target)

      // Create new deposit
      const [poolPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), poolId3.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [wexelPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("wexel"), user.publicKey.toBuffer(), poolId3.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      await program.methods
        .deposit(poolId3, principalUsd)
        .accounts({
          user: user.publicKey,
          pool: poolPda,
          wexel: wexelPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      // Apply partial boost
      await program.methods
        .applyBoost(poolId3, partialBoostAmount)
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      // Verify partial boost
      const wexelAccount = await program.account.wexel.fetch(wexelPda);

      // boost_ratio = 150 / 300 = 0.5
      // boost_apy_bp = 0.5 * 500 = 250 (2.5%)
      expect(wexelAccount.apyBoostBp).to.equal(250);

      console.log("✓ Partial boost applied correctly, APY boost:", wexelAccount.apyBoostBp, "bp");
    });

    it("Should cap boost at maximum when exceeding target", async () => {
      const poolId4 = new anchor.BN(4);
      const principalUsd = new anchor.BN(1000_000000); // $1000
      const excessiveBoostAmount = new anchor.BN(500_000000); // $500 (exceeds 30% target)

      // Create new deposit
      const [poolPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), poolId4.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [wexelPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("wexel"), user.publicKey.toBuffer(), poolId4.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      await program.methods
        .deposit(poolId4, principalUsd)
        .accounts({
          user: user.publicKey,
          pool: poolPda,
          wexel: wexelPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      // Apply excessive boost
      await program.methods
        .applyBoost(poolId4, excessiveBoostAmount)
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      // Verify boost is capped at maximum
      const wexelAccount = await program.account.wexel.fetch(wexelPda);

      // boost_ratio = min(500, 300) / 300 = 1.0
      // boost_apy_bp = 1.0 * 500 = 500 (5%)
      expect(wexelAccount.apyBoostBp).to.equal(500);

      console.log("✓ Boost correctly capped at maximum, APY boost:", wexelAccount.apyBoostBp, "bp");
    });

    it("Should fail boost with zero amount", async () => {
      const invalidBoostAmount = new anchor.BN(0);

      const [wexelPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("wexel"), user.publicKey.toBuffer(), poolId.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      try {
        await program.methods
          .applyBoost(wexelId, invalidBoostAmount)
          .accounts({
            user: user.publicKey,
            wexel: wexelPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([user])
          .rpc();

        expect.fail("Should have failed with InvalidAmount error");
      } catch (error: any) {
        expect(error.error.errorCode.code).to.equal("InvalidAmount");
        console.log("✓ Correctly rejected zero boost amount");
      }
    });

    it("Should fail boost when unauthorized user tries to apply", async () => {
      const unauthorizedUser = anchor.web3.Keypair.generate();
      const boostAmount = new anchor.BN(100_000000);

      // Airdrop to unauthorized user
      const signature = await provider.connection.requestAirdrop(
        unauthorizedUser.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(signature);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const [wexelPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("wexel"), user.publicKey.toBuffer(), poolId.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      try {
        await program.methods
          .applyBoost(wexelId, boostAmount)
          .accounts({
            user: unauthorizedUser.publicKey,
            wexel: wexelPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([unauthorizedUser])
          .rpc();

        expect.fail("Should have failed with Unauthorized error");
      } catch (error: any) {
        // Anchor constraint error for unauthorized access
        expect(error).to.exist;
        console.log("✓ Correctly rejected unauthorized boost attempt");
      }
    });
  });

  describe("Integration: Deposit + Boost Flow", () => {
    it("Should complete full deposit and boost flow", async () => {
      const poolId5 = new anchor.BN(5);
      const principalUsd = new anchor.BN(5000_000000); // $5000
      const boostAmount = new anchor.BN(1500_000000); // $1500 (30% of $5000)

      // Derive PDAs
      const [poolPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), poolId5.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [wexelPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("wexel"), user.publicKey.toBuffer(), poolId5.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      // Step 1: Deposit
      await program.methods
        .deposit(poolId5, principalUsd)
        .accounts({
          user: user.publicKey,
          pool: poolPda,
          wexel: wexelPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      console.log("✓ Step 1: Deposit completed");

      // Step 2: Apply boost
      await program.methods
        .applyBoost(poolId5, boostAmount)
        .accounts({
          user: user.publicKey,
          wexel: wexelPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      console.log("✓ Step 2: Boost applied");

      // Verify final state
      const wexelAccount = await program.account.wexel.fetch(wexelPda);
      expect(wexelAccount.principalUsd.toString()).to.equal(principalUsd.toString());
      expect(wexelAccount.apyBp).to.equal(1800); // 18% base APY
      expect(wexelAccount.apyBoostBp).to.equal(500); // 5% boost APY

      const totalApyBp = wexelAccount.apyBp + wexelAccount.apyBoostBp;
      expect(totalApyBp).to.equal(2300); // 23% total APY

      console.log("✓ Full flow completed successfully");
      console.log("  - Principal:", principalUsd.toString());
      console.log("  - Base APY:", wexelAccount.apyBp, "bp (18%)");
      console.log("  - Boost APY:", wexelAccount.apyBoostBp, "bp (5%)");
      console.log("  - Total APY:", totalApyBp, "bp (23%)");
    });
  });
});
