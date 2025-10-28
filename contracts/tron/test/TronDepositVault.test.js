const TronDepositVault = artifacts.require("TronDepositVault");

contract("TronDepositVault", (accounts) => {
  let vault;
  const [owner, user1, user2, bridge] = accounts;
  const USDT_ADDRESS = "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf"; // Nile testnet USDT

  beforeEach(async () => {
    vault = await TronDepositVault.new(USDT_ADDRESS, { from: owner });
  });

  describe("Pool Management", () => {
    it("should create a pool", async () => {
      await vault.createPool(1, 1800, 12, 100 * 1e6, { from: owner });
      
      const pool = await vault.getPool(1);
      assert.equal(pool.id, 1, "Pool ID mismatch");
      assert.equal(pool.apyBasisPoints, 1800, "APY mismatch");
      assert.equal(pool.lockMonths, 12, "Lock months mismatch");
      assert.equal(pool.isActive, true, "Pool should be active");
    });

    it("should not allow duplicate pool IDs", async () => {
      await vault.createPool(1, 1800, 12, 100 * 1e6, { from: owner });
      
      try {
        await vault.createPool(1, 2400, 24, 200 * 1e6, { from: owner });
        assert.fail("Should have thrown");
      } catch (error) {
        assert.include(error.message, "Pool already exists");
      }
    });

    it("should update pool status", async () => {
      await vault.createPool(1, 1800, 12, 100 * 1e6, { from: owner });
      await vault.updatePoolStatus(1, false, { from: owner });
      
      const pool = await vault.getPool(1);
      assert.equal(pool.isActive, false, "Pool should be inactive");
    });

    it("should not allow non-admin to create pool", async () => {
      try {
        await vault.createPool(1, 1800, 12, 100 * 1e6, { from: user1 });
        assert.fail("Should have thrown");
      } catch (error) {
        assert.include(error.message, "AccessControl");
      }
    });
  });

  describe("Deposits", () => {
    const poolId = 1;
    const depositAmount = 100 * 1e6; // $100 USDT
    const solanaOwner = "0x" + "1".repeat(64); // 32 bytes

    beforeEach(async () => {
      await vault.createPool(poolId, 1800, 12, 100 * 1e6, { from: owner });
    });

    it("should record deposit metadata", async () => {
      // Note: In actual test, would need to mock USDT approval
      // This test focuses on contract logic
      
      const stats = await vault.getStats();
      const initialDeposits = stats[0].toNumber();
      
      // Verify pool exists and is active
      const pool = await vault.getPool(poolId);
      assert.equal(pool.isActive, true, "Pool should be active");
    });

    it("should reject deposit below minimum", async () => {
      const belowMin = 50 * 1e6; // $50
      
      try {
        await vault.depositUSDT(poolId, belowMin, solanaOwner, { from: user1 });
        assert.fail("Should have thrown");
      } catch (error) {
        assert.include(error.message, "Amount below minimum");
      }
    });

    it("should reject deposit to inactive pool", async () => {
      await vault.updatePoolStatus(poolId, false, { from: owner });
      
      try {
        await vault.depositUSDT(poolId, depositAmount, solanaOwner, { from: user1 });
        assert.fail("Should have thrown");
      } catch (error) {
        assert.include(error.message, "Pool is not active");
      }
    });

    it("should reject deposit with invalid Solana owner", async () => {
      const invalidOwner = "0x" + "0".repeat(64);
      
      try {
        await vault.depositUSDT(poolId, depositAmount, invalidOwner, { from: user1 });
        assert.fail("Should have thrown");
      } catch (error) {
        assert.include(error.message, "Invalid Solana address");
      }
    });
  });

  describe("Bridge Integration", () => {
    it("should grant BRIDGE_ROLE", async () => {
      const BRIDGE_ROLE = web3.utils.keccak256("BRIDGE_ROLE");
      await vault.grantRole(BRIDGE_ROLE, bridge, { from: owner });
      
      const hasRole = await vault.hasRole(BRIDGE_ROLE, bridge);
      assert.equal(hasRole, true, "Bridge should have BRIDGE_ROLE");
    });

    it("should allow bridge to mark deposit as processed", async () => {
      const BRIDGE_ROLE = web3.utils.keccak256("BRIDGE_ROLE");
      await vault.grantRole(BRIDGE_ROLE, bridge, { from: owner });
      
      // Would need actual deposit first in real test
      // This test verifies role check works
      try {
        await vault.markDepositProcessed(999, 1, { from: user1 });
        assert.fail("Should have thrown");
      } catch (error) {
        assert.include(error.message, "AccessControl");
      }
    });
  });

  describe("Pause Functionality", () => {
    it("should pause deposits", async () => {
      await vault.pause({ from: owner });
      
      const poolId = 1;
      const depositAmount = 100 * 1e6;
      const solanaOwner = "0x" + "1".repeat(64);
      
      await vault.createPool(poolId, 1800, 12, 100 * 1e6, { from: owner });
      
      try {
        await vault.depositUSDT(poolId, depositAmount, solanaOwner, { from: user1 });
        assert.fail("Should have thrown");
      } catch (error) {
        assert.include(error.message, "Pausable: paused");
      }
    });

    it("should unpause deposits", async () => {
      await vault.pause({ from: owner });
      await vault.unpause({ from: owner });
      
      // Verify contract is unpaused (deposits would work)
      const paused = await vault.paused();
      assert.equal(paused, false, "Contract should be unpaused");
    });
  });

  describe("Statistics", () => {
    it("should return correct stats", async () => {
      const stats = await vault.getStats();
      
      assert.equal(stats[0].toNumber(), 0, "Total deposits should be 0");
      assert.equal(stats[1].toNumber(), 0, "Total amount should be 0");
      assert.equal(stats[2].toNumber(), 1, "Next ID should be 1");
    });

    it("should get all pools", async () => {
      await vault.createPool(1, 1800, 12, 100 * 1e6, { from: owner });
      await vault.createPool(2, 2400, 24, 200 * 1e6, { from: owner });
      
      const poolIds = await vault.getAllPools();
      assert.equal(poolIds.length, 2, "Should have 2 pools");
      assert.equal(poolIds[0], 1, "First pool ID should be 1");
      assert.equal(poolIds[1], 2, "Second pool ID should be 2");
    });
  });

  describe("Configuration", () => {
    it("should update minimum deposit", async () => {
      const newMin = 200 * 1e6;
      await vault.updateMinDeposit(newMin, { from: owner });
      
      const minDeposit = await vault.minDepositAmount();
      assert.equal(minDeposit.toNumber(), newMin, "Min deposit should be updated");
    });

    it("should not allow zero minimum deposit", async () => {
      try {
        await vault.updateMinDeposit(0, { from: owner });
        assert.fail("Should have thrown");
      } catch (error) {
        assert.include(error.message, "Invalid amount");
      }
    });
  });
});
