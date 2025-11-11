import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create initial pools with different lock periods and APY
  const pools = [
    {
      apy_base_bp: 1800, // 18% APY
      lock_months: 12,
      min_deposit_usd: BigInt(100_000000), // $100 minimum (6 decimals)
      boost_target_bp: 3000, // 30% of principal for max boost
      boost_max_bp: 500, // 5% max boost APY
      is_active: true,
    },
    {
      apy_base_bp: 2400, // 24% APY
      lock_months: 18,
      min_deposit_usd: BigInt(500_000000), // $500 minimum
      boost_target_bp: 3000,
      boost_max_bp: 500,
      is_active: true,
    },
    {
      apy_base_bp: 3000, // 30% APY
      lock_months: 24,
      min_deposit_usd: BigInt(1000_000000), // $1,000 minimum
      boost_target_bp: 3000,
      boost_max_bp: 500,
      is_active: true,
    },
    {
      apy_base_bp: 3300, // 33% APY
      lock_months: 30,
      min_deposit_usd: BigInt(2500_000000), // $2,500 minimum
      boost_target_bp: 3000,
      boost_max_bp: 500,
      is_active: true,
    },
    {
      apy_base_bp: 3600, // 36% APY
      lock_months: 36,
      min_deposit_usd: BigInt(5000_000000), // $5,000 minimum
      boost_target_bp: 3000,
      boost_max_bp: 500,
      is_active: true,
    },
  ];

  console.log('📊 Creating pools...');
  for (const poolData of pools) {
    const pool = await prisma.pool.upsert({
      where: {
        // Use a composite key or filter approach
        id: pools.indexOf(poolData) + 1,
      },
      update: poolData,
      create: poolData,
    });
    console.log(
      `✅ Pool created: ${pool.lock_months} months, ${pool.apy_base_bp / 100}% APY, min $${Number(pool.min_deposit_usd) / 1_000000}`,
    );
  }

  // Create system configurations
  console.log('⚙️ Creating system configurations...');
  const configs = [
    { key: 'COLLATERAL_RATIO', value: '150', description: 'Minimum collateral ratio (%)' },
    { key: 'LIQUIDATION_THRESHOLD', value: '120', description: 'Liquidation threshold (%)' },
    { key: 'STABILITY_FEE', value: '0.02', description: 'Annual stability fee' },
    { key: 'MIN_DEPOSIT', value: '100', description: 'Minimum deposit amount (USD)' },
  ];

  for (const config of configs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    });
    console.log(`✅ Config: ${config.key} = ${config.value}`);
  }

  // Create admin user
  console.log('👤 Creating admin user...');
  const adminAddress = '0x' + '0'.repeat(40);
  const adminUser = await prisma.user.upsert({
    where: { solana_address: adminAddress },
    update: {},
    create: {
      solana_address: adminAddress,
      tron_address: 'T' + '0'.repeat(33),
      email: 'admin@wexel.io',
      is_kyc_verified: true,
      is_active: true,
    },
  });
  console.log(`✅ Admin user created: ${adminUser.email}`);

  // Create test tokens
  console.log('🪙 Creating test tokens...');
  const tokens = [
    {
      symbol: 'USDT',
      name: 'Tether USD',
      address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      decimals: 6,
      chain: 'TRON',
      is_active: true,
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      decimals: 6,
      chain: 'SOLANA',
      is_active: true,
    },
  ];

  for (const token of tokens) {
    await prisma.token.upsert({
      where: {
        chain_address: {
          chain: token.chain,
          address: token.address,
        }
      },
      update: {},
      create: token,
    });
    console.log(`✅ Token: ${token.symbol} on ${token.chain}`);
  }

  // Create a test user (for development)
  if (process.env.NODE_ENV === 'development') {
    console.log('👤 Creating test user...');
    const testUser = await prisma.user.upsert({
      where: { solana_address: 'TestSolanaAddress111111111111111111111111' },
      update: {},
      create: {
        solana_address: 'TestSolanaAddress111111111111111111111111',
        tron_address: 'TTestTronAddress1111111111111111111111',
        email: 'test@example.com',
        is_kyc_verified: false,
        is_active: true,
      },
    });
    console.log(`✅ Test user created: ${testUser.email}`);
  }

  console.log('✨ Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
