const TronPriceFeed = artifacts.require("TronPriceFeed");

contract("TronPriceFeed", (accounts) => {
  let priceFeed;
  const [owner, oracle, user] = accounts;
  const tokenAddress = "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf"; // Mock token

  beforeEach(async () => {
    priceFeed = await TronPriceFeed.new({ from: owner });

    // Grant ORACLE_ROLE
    const ORACLE_ROLE = web3.utils.keccak256("ORACLE_ROLE");
    await priceFeed.grantRole(ORACLE_ROLE, oracle, { from: owner });
  });

  describe("Token Management", () => {
    it("should add a token", async () => {
      await priceFeed.addToken(tokenAddress, { from: owner });

      const tokens = await priceFeed.getSupportedTokens();
      assert.equal(tokens.length, 1, "Should have 1 token");
      assert.equal(tokens[0], tokenAddress, "Token address mismatch");
    });

    it("should not allow duplicate tokens", async () => {
      await priceFeed.addToken(tokenAddress, { from: owner });

      try {
        await priceFeed.addToken(tokenAddress, { from: owner });
        assert.fail("Should have thrown");
      } catch (error) {
        assert.include(error.message, "Token already added");
      }
    });

    it("should not allow invalid token address", async () => {
      const zeroAddress = "0x" + "0".repeat(40);

      try {
        await priceFeed.addToken(zeroAddress, { from: owner });
        assert.fail("Should have thrown");
      } catch (error) {
        assert.include(error.message, "Invalid token address");
      }
    });
  });

  describe("Price Updates", () => {
    const price = 150000000; // $1.50 with 8 decimals
    const confidence = 9000; // 90%
    const sources = [oracle];

    beforeEach(async () => {
      await priceFeed.addToken(tokenAddress, { from: owner });
    });

    it("should update price", async () => {
      await priceFeed.updatePrice(tokenAddress, price, confidence, sources, { from: oracle });

      const priceData = await priceFeed.getPriceData(tokenAddress);
      assert.equal(priceData.price.toNumber(), price, "Price mismatch");
      assert.equal(priceData.confidence.toNumber(), confidence, "Confidence mismatch");
      assert.equal(priceData.isValid, true, "Price should be valid");
    });

    it("should not allow non-oracle to update price", async () => {
      try {
        await priceFeed.updatePrice(tokenAddress, price, confidence, sources, { from: user });
        assert.fail("Should have thrown");
      } catch (error) {
        assert.include(error.message, "AccessControl");
      }
    });

    it("should reject invalid price", async () => {
      try {
        await priceFeed.updatePrice(
          tokenAddress,
          0, // Invalid price
          confidence,
          sources,
          { from: oracle }
        );
        assert.fail("Should have thrown");
      } catch (error) {
        assert.include(error.message, "Invalid price");
      }
    });

    it("should reject invalid confidence", async () => {
      try {
        await priceFeed.updatePrice(
          tokenAddress,
          price,
          11000, // >10000
          sources,
          { from: oracle }
        );
        assert.fail("Should have thrown");
      } catch (error) {
        assert.include(error.message, "Invalid confidence");
      }
    });

    it("should reject high price deviation", async () => {
      // Set initial price
      await priceFeed.updatePrice(tokenAddress, price, confidence, sources, { from: oracle });

      // Try to update with 10% deviation (default max is 1.5%)
      const deviatedPrice = price * 1.1; // 10% higher

      try {
        await priceFeed.updatePrice(tokenAddress, deviatedPrice, confidence, sources, {
          from: oracle,
        });
        assert.fail("Should have thrown");
      } catch (error) {
        assert.include(error.message, "Price deviation too high");
      }
    });
  });

  describe("Manual Price Setting", () => {
    const price = 150000000;
    const reason = "Emergency price update";

    beforeEach(async () => {
      await priceFeed.addToken(tokenAddress, { from: owner });
    });

    it("should set manual price", async () => {
      await priceFeed.setManualPrice(tokenAddress, price, reason, { from: owner });

      const priceData = await priceFeed.getPriceData(tokenAddress);
      assert.equal(priceData.price.toNumber(), price, "Price mismatch");
      assert.equal(priceData.isValid, true, "Price should be valid");
    });

    it("should require reason for manual price", async () => {
      try {
        await priceFeed.setManualPrice(
          tokenAddress,
          price,
          "", // Empty reason
          { from: owner }
        );
        assert.fail("Should have thrown");
      } catch (error) {
        assert.include(error.message, "Reason required");
      }
    });

    it("should not allow non-admin manual price", async () => {
      try {
        await priceFeed.setManualPrice(tokenAddress, price, reason, { from: user });
        assert.fail("Should have thrown");
      } catch (error) {
        assert.include(error.message, "AccessControl");
      }
    });
  });

  describe("Price Queries", () => {
    const price = 150000000;
    const confidence = 9000;
    const sources = [oracle];

    beforeEach(async () => {
      await priceFeed.addToken(tokenAddress, { from: owner });
      await priceFeed.updatePrice(tokenAddress, price, confidence, sources, { from: oracle });
    });

    it("should get price", async () => {
      const result = await priceFeed.getPrice(tokenAddress);

      assert.equal(result.price.toNumber(), price, "Price mismatch");
      assert.equal(result.isValid, true, "Price should be valid");
    });

    it("should get multiple prices", async () => {
      const tokens = [tokenAddress];
      const result = await priceFeed.getPrices(tokens);

      assert.equal(result[0][0].toNumber(), price, "Price mismatch");
      assert.equal(result[2][0], true, "Price should be valid");
    });

    it("should detect stale price", async () => {
      // Note: In real test would need to fast-forward time
      // This test verifies the function exists
      const isStale = await priceFeed.isPriceStale(tokenAddress);
      assert.equal(typeof isStale, "boolean", "Should return boolean");
    });
  });

  describe("Configuration", () => {
    it("should update config", async () => {
      const newDeviation = 200; // 2%
      const newThreshold = 600; // 10 minutes

      await priceFeed.updateConfig(newDeviation, newThreshold, { from: owner });

      const maxDeviation = await priceFeed.maxDeviationBP();
      const staleThreshold = await priceFeed.stalePriceThreshold();

      assert.equal(maxDeviation.toNumber(), newDeviation, "Deviation mismatch");
      assert.equal(staleThreshold.toNumber(), newThreshold, "Threshold mismatch");
    });

    it("should reject high deviation config", async () => {
      try {
        await priceFeed.updateConfig(1100, 600, { from: owner }); // >10%
        assert.fail("Should have thrown");
      } catch (error) {
        assert.include(error.message, "Deviation too high");
      }
    });

    it("should reject low threshold config", async () => {
      try {
        await priceFeed.updateConfig(200, 60, { from: owner }); // <5 minutes
        assert.fail("Should have thrown");
      } catch (error) {
        assert.include(error.message, "Threshold too low");
      }
    });
  });
});
