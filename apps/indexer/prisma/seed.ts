import { PrismaClient, VaultType, BatchStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create TAKARA Vaults (Master v6 - CORRECTED APY VALUES!)
  //
  // IMPORTANT: These APY values are FINAL per master.md:
  // - Vault 1 (Starter): 7% base + 1.4% boost = 8.4% max (LAIKA boost)
  // - Vault 2 (Advanced): 7% base + 6% boost = 13% max (TAKARA boost)
  // - Vault 3 (Whale): 8% base + 7% boost = 15% max (TAKARA boost)
  //
  // Frequency multipliers (applied to max APY):
  // - Monthly: x1.0
  // - Quarterly: x1.15
  // - Yearly: x1.30
  //
  const vaults = [
    {
      name: 'Starter',
      type: VaultType.VAULT_1,
      duration_months: 12,
      min_entry_amount: new Decimal(100),
      // CORRECTED: 7% base + 1.4% boost = 8.4% max
      base_usdt_apy: 7.0,
      boosted_usdt_apy: 8.4,
      takara_apr: 30,
      boost_token_symbol: 'LAIKA',
      boost_ratio: 0.4, // 40% of deposit in Laika
      boost_discount: 0.15, // 15% discount on market price
      boost_fixed_price: null, // Uses market price
      batch_number: 1,
      batch_status: BatchStatus.COLLECTING,
      current_liquidity: new Decimal(0),
      target_liquidity: new Decimal(100000),
      is_active: true,
      // APY in basis points (Master v6)
      base_apy_bps: 700, // 7.00% base
      boost_apy_bps: 140, // +1.40% boost
      max_apy_bps: 840, // 8.40% max
      takara_apr_bps: 3000, // 30% Takara mining APR
      // Legacy fields
      apy_base_bp: 700,
      lock_months: 12,
      min_deposit_usd: BigInt(100_000000),
      laika_boost_max: 1.4,
    },
    {
      name: 'Advanced',
      type: VaultType.VAULT_2,
      duration_months: 30,
      min_entry_amount: new Decimal(1500),
      // CORRECTED: 7% base + 6% boost = 13% max (WAS WRONG: 4%/8%)
      base_usdt_apy: 7.0,
      boosted_usdt_apy: 13.0,
      takara_apr: 30,
      boost_token_symbol: 'TAKARA',
      boost_ratio: 1.0, // 1:1 to deposit
      boost_discount: 0, // No discount
      boost_fixed_price: new Decimal(0.1), // Fixed $0.10
      batch_number: 1,
      batch_status: BatchStatus.COLLECTING,
      current_liquidity: new Decimal(0),
      target_liquidity: new Decimal(100000),
      is_active: true,
      // APY in basis points (Master v6)
      base_apy_bps: 700, // 7.00% base
      boost_apy_bps: 600, // +6.00% boost
      max_apy_bps: 1300, // 13.00% max
      takara_apr_bps: 3000, // 30% Takara mining APR
      // Legacy fields
      apy_base_bp: 700,
      lock_months: 30,
      min_deposit_usd: BigInt(1500_000000),
      laika_boost_max: 6.0,
    },
    {
      name: 'Whale',
      type: VaultType.VAULT_3,
      duration_months: 36,
      min_entry_amount: new Decimal(5000),
      // CORRECTED: 8% base + 7% boost = 15% max (WAS WRONG: 6%/10%)
      base_usdt_apy: 8.0,
      boosted_usdt_apy: 15.0,
      takara_apr: 40,
      boost_token_symbol: 'TAKARA',
      boost_ratio: 1.0, // 1:1 to deposit
      boost_discount: 0, // No discount
      boost_fixed_price: new Decimal(0.1), // Fixed $0.10
      batch_number: 1,
      batch_status: BatchStatus.COLLECTING,
      current_liquidity: new Decimal(0),
      target_liquidity: new Decimal(100000),
      is_active: true,
      // APY in basis points (Master v6)
      base_apy_bps: 800, // 8.00% base
      boost_apy_bps: 700, // +7.00% boost
      max_apy_bps: 1500, // 15.00% max
      takara_apr_bps: 4000, // 40% Takara mining APR
      // Legacy fields
      apy_base_bp: 800,
      lock_months: 36,
      min_deposit_usd: BigInt(5000_000000),
      laika_boost_max: 7.0,
    },
  ];

  console.log('🏦 Creating TAKARA vaults...');
  for (let i = 0; i < vaults.length; i++) {
    const vaultData = vaults[i];
    const vault = await prisma.vault.upsert({
      where: { id: i + 1 },
      update: vaultData,
      create: vaultData,
    });
    console.log(
      `✅ Vault created: ${vault.name} (${vault.type}), ${vault.duration_months} months, min $${vault.min_entry_amount}`,
    );
  }

  // Create admin user
  console.log('👤 Creating admin user...');
  const adminAddress = 'AdminSolanaAddress111111111111111111111';
  const adminUser = await prisma.user.upsert({
    where: { solana_address: adminAddress },
    update: {},
    create: {
      solana_address: adminAddress,
      tron_address: 'TAdminTronAddress11111111111111111111',
      email: 'admin@takara.io',
      is_kyc_verified: true,
      is_active: true,
    },
  });
  console.log(`✅ Admin user created: ${adminUser.email}`);

  // Create token prices
  console.log('🪙 Creating token prices...');
  const tokenPrices = [
    {
      token_mint: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // USDT on TRON
      price_usd: BigInt(1_000000), // $1.00
      source: 'fixed',
    },
    {
      token_mint: 'LaikaMint111111111111111111111111111111', // LAIKA token
      price_usd: BigInt(100000), // $0.10 (example)
      source: 'dex',
    },
    {
      token_mint: 'TakaraMint11111111111111111111111111111', // TAKARA token
      price_usd: BigInt(100000), // $0.10 (fixed internal price)
      source: 'internal',
    },
  ];

  for (const tokenPrice of tokenPrices) {
    await prisma.tokenPrice.upsert({
      where: { token_mint: tokenPrice.token_mint },
      update: { price_usd: tokenPrice.price_usd, source: tokenPrice.source },
      create: tokenPrice,
    });
    console.log(
      `✅ Token price: ${tokenPrice.token_mint.substring(0, 10)}... = $${Number(tokenPrice.price_usd) / 1_000000}`,
    );
  }

  // Initialize Takara config
  console.log('⚙️ Initializing Takara config...');
  const totalSupply = new Decimal(1_000_000_000); // 1 billion tokens
  const miningPool = totalSupply.mul(0.6); // 60% for mining

  await prisma.takaraConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      internal_price_usd: new Decimal(0.1),
      total_supply: totalSupply,
      mining_pool_total: miningPool,
      mining_pool_remaining: miningPool,
      mining_pool_distributed: new Decimal(0),
    },
  });
  console.log(
    `✅ Takara config initialized: ${totalSupply.toNumber().toLocaleString()} total, ${miningPool.toNumber().toLocaleString()} in mining pool`,
  );

  // Create test user (for development)
  if (process.env.NODE_ENV === 'development') {
    console.log('👤 Creating test user...');
    const testUser = await prisma.user.upsert({
      where: { solana_address: 'TestSolanaAddress111111111111111111111111' },
      update: {},
      create: {
        solana_address: 'TestSolanaAddress111111111111111111111111',
        tron_address: 'TTestTronAddress1111111111111111111111',
        email: 'test@takara.io',
        is_kyc_verified: false,
        is_active: true,
      },
    });
    console.log(`✅ Test user created: ${testUser.email}`);
  }

  console.log('');
  console.log('✨ Database seeding completed!');
  console.log('');
  console.log('📋 Summary:');
  console.log(`   - ${vaults.length} TAKARA vaults created`);
  console.log(`   - ${tokenPrices.length} token prices set`);
  console.log(
    `   - Takara mining pool: ${miningPool.toNumber().toLocaleString()} tokens`,
  );
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
