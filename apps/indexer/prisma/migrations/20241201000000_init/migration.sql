-- CreateEnum
CREATE TYPE "PoolStatus" AS ENUM ('active', 'inactive', 'paused');

-- CreateTable
CREATE TABLE "pools" (
    "id" SERIAL NOT NULL,
    "apy_base_bp" INTEGER NOT NULL,
    "lock_months" INTEGER NOT NULL,
    "min_deposit_usd" BIGINT NOT NULL,
    "total_liquidity" BIGINT NOT NULL DEFAULT 0,
    "total_wexels" BIGINT NOT NULL DEFAULT 0,
    "boost_target_bp" INTEGER NOT NULL DEFAULT 3000,
    "boost_max_bp" INTEGER NOT NULL DEFAULT 500,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "solana_address" TEXT,
    "tron_address" TEXT,
    "email" TEXT,
    "telegram_id" TEXT,
    "is_kyc_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wexels" (
    "id" BIGSERIAL NOT NULL,
    "owner_solana" TEXT,
    "owner_tron" TEXT,
    "pool_id" INTEGER NOT NULL,
    "principal_usd" BIGINT NOT NULL,
    "apy_base_bp" INTEGER NOT NULL,
    "apy_boost_bp" INTEGER NOT NULL DEFAULT 0,
    "start_ts" TIMESTAMP(3) NOT NULL,
    "end_ts" TIMESTAMP(3) NOT NULL,
    "is_collateralized" BOOLEAN NOT NULL DEFAULT false,
    "total_claimed_usd" BIGINT NOT NULL DEFAULT 0,
    "nft_mint_address" TEXT,
    "nft_token_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wexels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collateral" (
    "wexel_id" BIGINT NOT NULL,
    "loan_usd" BIGINT NOT NULL,
    "start_ts" TIMESTAMP(3) NOT NULL,
    "repaid" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collateral_pkey" PRIMARY KEY ("wexel_id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" BIGSERIAL NOT NULL,
    "wexel_id" BIGINT NOT NULL,
    "ask_price_usd" BIGINT NOT NULL,
    "auction" BOOLEAN NOT NULL DEFAULT false,
    "min_bid_usd" BIGINT,
    "expiry_ts" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claims" (
    "id" BIGSERIAL NOT NULL,
    "wexel_id" BIGINT NOT NULL,
    "amount_usd" BIGINT NOT NULL,
    "claim_type" TEXT NOT NULL,
    "tx_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boosts" (
    "id" BIGSERIAL NOT NULL,
    "wexel_id" BIGINT NOT NULL,
    "token_mint" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "value_usd" BIGINT NOT NULL,
    "apy_boost_bp" INTEGER NOT NULL,
    "price_usd" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "boosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposits" (
    "id" BIGSERIAL NOT NULL,
    "pool_id" INTEGER NOT NULL,
    "user_address" TEXT NOT NULL,
    "amount_usd" BIGINT NOT NULL,
    "wexel_id" BIGINT,
    "tx_hash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_prices" (
    "id" BIGSERIAL NOT NULL,
    "token_mint" TEXT NOT NULL,
    "price_usd" BIGINT NOT NULL,
    "source" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "token_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blockchain_events" (
    "id" BIGSERIAL NOT NULL,
    "chain" TEXT NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blockchain_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_solana_address_key" ON "users"("solana_address");

-- CreateIndex
CREATE UNIQUE INDEX "users_tron_address_key" ON "users"("tron_address");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_id_key" ON "users"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "token_prices_token_mint_key" ON "token_prices"("token_mint");

-- AddForeignKey
ALTER TABLE "wexels" ADD CONSTRAINT "wexels_pool_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "pools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collateral" ADD CONSTRAINT "collateral_wexel_id_fkey" FOREIGN KEY ("wexel_id") REFERENCES "wexels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_wexel_id_fkey" FOREIGN KEY ("wexel_id") REFERENCES "wexels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_wexel_id_fkey" FOREIGN KEY ("wexel_id") REFERENCES "wexels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boosts" ADD CONSTRAINT "boosts_wexel_id_fkey" FOREIGN KEY ("wexel_id") REFERENCES "wexels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_pool_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "pools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
