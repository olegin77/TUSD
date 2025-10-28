const TronDepositVault = artifacts.require("TronDepositVault");
const TronPriceFeed = artifacts.require("TronPriceFeed");
const BridgeProxy = artifacts.require("BridgeProxy");
const TronWexel721 = artifacts.require("TronWexel721");

module.exports = async function (deployer, network, accounts) {
  // USDT token address on Tron
  // Mainnet: TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
  // Nile testnet: TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf
  const USDT_ADDRESS = network === 'mainnet' 
    ? 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
    : 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf';

  console.log('\n=== Deploying Tron Contracts ===\n');
  console.log('Network:', network);
  console.log('Deployer:', accounts[0]);
  console.log('USDT Address:', USDT_ADDRESS);

  // 1. Deploy TronDepositVault
  console.log('\n1. Deploying TronDepositVault...');
  await deployer.deploy(TronDepositVault, USDT_ADDRESS);
  const vault = await TronDepositVault.deployed();
  console.log('TronDepositVault deployed at:', vault.address);

  // 2. Deploy TronPriceFeed
  console.log('\n2. Deploying TronPriceFeed...');
  await deployer.deploy(TronPriceFeed);
  const priceFeed = await TronPriceFeed.deployed();
  console.log('TronPriceFeed deployed at:', priceFeed.address);

  // 3. Deploy BridgeProxy
  console.log('\n3. Deploying BridgeProxy...');
  await deployer.deploy(BridgeProxy);
  const bridge = await BridgeProxy.deployed();
  console.log('BridgeProxy deployed at:', bridge.address);

  // 4. Deploy TronWexel721
  console.log('\n4. Deploying TronWexel721...');
  await deployer.deploy(TronWexel721);
  const wexel721 = await TronWexel721.deployed();
  console.log('TronWexel721 deployed at:', wexel721.address);

  // 5. Setup roles and initial configuration
  console.log('\n5. Configuring contracts...');

  // Grant BRIDGE_ROLE to BridgeProxy in DepositVault
  const BRIDGE_ROLE = web3.utils.keccak256('BRIDGE_ROLE');
  await vault.grantRole(BRIDGE_ROLE, bridge.address);
  console.log('Granted BRIDGE_ROLE to BridgeProxy in DepositVault');

  // Grant MINTER_ROLE to BridgeProxy in TronWexel721
  const MINTER_ROLE = web3.utils.keccak256('MINTER_ROLE');
  await wexel721.grantRole(MINTER_ROLE, bridge.address);
  console.log('Granted MINTER_ROLE to BridgeProxy in TronWexel721');

  // Create initial pools
  console.log('\n6. Creating initial pools...');
  
  // Pool 1: 18% APY, 12 months
  await vault.createPool(
    1,                    // poolId
    1800,                 // 18% APY
    12,                   // 12 months
    100 * 1e6             // $100 minimum
  );
  console.log('Created Pool 1: 18% APY, 12 months');

  // Pool 2: 24% APY, 24 months
  await vault.createPool(
    2,
    2400,
    24,
    200 * 1e6
  );
  console.log('Created Pool 2: 24% APY, 24 months');

  // Pool 3: 30% APY, 36 months
  await vault.createPool(
    3,
    3000,
    36,
    500 * 1e6
  );
  console.log('Created Pool 3: 30% APY, 36 months');

  console.log('\n=== Deployment Summary ===\n');
  console.log('TronDepositVault:', vault.address);
  console.log('TronPriceFeed:', priceFeed.address);
  console.log('BridgeProxy:', bridge.address);
  console.log('TronWexel721:', wexel721.address);
  console.log('\nDeployment completed successfully! ✅\n');

  // Save addresses to file
  const fs = require('fs');
  const addresses = {
    network: network,
    timestamp: new Date().toISOString(),
    contracts: {
      TronDepositVault: vault.address,
      TronPriceFeed: priceFeed.address,
      BridgeProxy: bridge.address,
      TronWexel721: wexel721.address,
      USDT: USDT_ADDRESS
    }
  };

  fs.writeFileSync(
    `deployed_addresses_${network}.json`,
    JSON.stringify(addresses, null, 2)
  );
  console.log(`Addresses saved to deployed_addresses_${network}.json\n`);
};
