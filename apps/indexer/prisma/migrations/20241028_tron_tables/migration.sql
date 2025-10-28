-- CreateTable for Tron deposits
CREATE TABLE IF NOT EXISTS "tron_deposits" (
    "id" BIGSERIAL PRIMARY KEY,
    "deposit_id" TEXT NOT NULL UNIQUE,
    "depositor" TEXT NOT NULL,
    "pool_id" INTEGER NOT NULL,
    "amount" TEXT NOT NULL,
    "solana_owner" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "wexel_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable for cross-chain messages
CREATE TABLE IF NOT EXISTS "cross_chain_messages" (
    "id" BIGSERIAL PRIMARY KEY,
    "message_id" TEXT NOT NULL UNIQUE,
    "message_type" TEXT NOT NULL,
    "source_chain" TEXT NOT NULL,
    "target_chain" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "confirmations" INTEGER NOT NULL DEFAULT 0,
    "required_confirmations" INTEGER NOT NULL DEFAULT 2,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "tx_hash_source" TEXT,
    "tx_hash_target" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable for Tron indexer state
CREATE TABLE IF NOT EXISTS "tron_indexer_state" (
    "id" SERIAL PRIMARY KEY,
    "last_block" BIGINT NOT NULL DEFAULT 0,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial indexer state
INSERT INTO "tron_indexer_state" (id, last_block) VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- CreateIndex
CREATE INDEX "tron_deposits_depositor_idx" ON "tron_deposits"("depositor");
CREATE INDEX "tron_deposits_solana_owner_idx" ON "tron_deposits"("solana_owner");
CREATE INDEX "tron_deposits_processed_idx" ON "tron_deposits"("processed");
CREATE INDEX "tron_deposits_timestamp_idx" ON "tron_deposits"("timestamp");

CREATE INDEX "cross_chain_messages_source_chain_idx" ON "cross_chain_messages"("source_chain");
CREATE INDEX "cross_chain_messages_target_chain_idx" ON "cross_chain_messages"("target_chain");
CREATE INDEX "cross_chain_messages_status_idx" ON "cross_chain_messages"("status");
CREATE INDEX "cross_chain_messages_processed_idx" ON "cross_chain_messages"("processed");
