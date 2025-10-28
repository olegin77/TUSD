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

  // Create a test user (for development)
  if (process.env.NODE_ENV === 'development') {
    console.log('👤 Creating test user...');
    const testUser = await prisma.user.upsert({
      where: { id: 1 },
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
