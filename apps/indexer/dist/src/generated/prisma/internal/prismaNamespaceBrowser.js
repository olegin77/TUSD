"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonNullValueFilter = exports.NullsOrder = exports.QueryMode = exports.JsonNullValueInput = exports.SortOrder = exports.BlockchainEventScalarFieldEnum = exports.TokenPriceScalarFieldEnum = exports.UserScalarFieldEnum = exports.DepositScalarFieldEnum = exports.BoostScalarFieldEnum = exports.ClaimScalarFieldEnum = exports.ListingScalarFieldEnum = exports.CollateralPositionScalarFieldEnum = exports.WexelScalarFieldEnum = exports.PoolScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.Decimal = void 0;
const runtime = __importStar(require("@prisma/client/runtime/index-browser"));
exports.Decimal = runtime.Decimal;
exports.NullTypes = {
    DbNull: runtime.objectEnumValues.classes.DbNull,
    JsonNull: runtime.objectEnumValues.classes.JsonNull,
    AnyNull: runtime.objectEnumValues.classes.AnyNull,
};
exports.DbNull = runtime.objectEnumValues.instances.DbNull;
exports.JsonNull = runtime.objectEnumValues.instances.JsonNull;
exports.AnyNull = runtime.objectEnumValues.instances.AnyNull;
exports.ModelName = {
    Pool: 'Pool',
    Wexel: 'Wexel',
    CollateralPosition: 'CollateralPosition',
    Listing: 'Listing',
    Claim: 'Claim',
    Boost: 'Boost',
    Deposit: 'Deposit',
    User: 'User',
    TokenPrice: 'TokenPrice',
    BlockchainEvent: 'BlockchainEvent',
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable',
});
exports.PoolScalarFieldEnum = {
    id: 'id',
    apy_base_bp: 'apy_base_bp',
    lock_months: 'lock_months',
    min_deposit_usd: 'min_deposit_usd',
    total_liquidity: 'total_liquidity',
    total_wexels: 'total_wexels',
    boost_target_bp: 'boost_target_bp',
    boost_max_bp: 'boost_max_bp',
    is_active: 'is_active',
    created_at: 'created_at',
    updated_at: 'updated_at',
};
exports.WexelScalarFieldEnum = {
    id: 'id',
    owner_solana: 'owner_solana',
    owner_tron: 'owner_tron',
    pool_id: 'pool_id',
    principal_usd: 'principal_usd',
    apy_base_bp: 'apy_base_bp',
    apy_boost_bp: 'apy_boost_bp',
    start_ts: 'start_ts',
    end_ts: 'end_ts',
    is_collateralized: 'is_collateralized',
    total_claimed_usd: 'total_claimed_usd',
    nft_mint_address: 'nft_mint_address',
    nft_token_address: 'nft_token_address',
    created_at: 'created_at',
    updated_at: 'updated_at',
};
exports.CollateralPositionScalarFieldEnum = {
    wexel_id: 'wexel_id',
    loan_usd: 'loan_usd',
    start_ts: 'start_ts',
    repaid: 'repaid',
    created_at: 'created_at',
    updated_at: 'updated_at',
};
exports.ListingScalarFieldEnum = {
    id: 'id',
    wexel_id: 'wexel_id',
    ask_price_usd: 'ask_price_usd',
    auction: 'auction',
    min_bid_usd: 'min_bid_usd',
    expiry_ts: 'expiry_ts',
    status: 'status',
    created_at: 'created_at',
    updated_at: 'updated_at',
};
exports.ClaimScalarFieldEnum = {
    id: 'id',
    wexel_id: 'wexel_id',
    amount_usd: 'amount_usd',
    claim_type: 'claim_type',
    tx_hash: 'tx_hash',
    created_at: 'created_at',
};
exports.BoostScalarFieldEnum = {
    id: 'id',
    wexel_id: 'wexel_id',
    token_mint: 'token_mint',
    amount: 'amount',
    value_usd: 'value_usd',
    apy_boost_bp: 'apy_boost_bp',
    price_usd: 'price_usd',
    created_at: 'created_at',
};
exports.DepositScalarFieldEnum = {
    id: 'id',
    pool_id: 'pool_id',
    user_address: 'user_address',
    amount_usd: 'amount_usd',
    wexel_id: 'wexel_id',
    tx_hash: 'tx_hash',
    status: 'status',
    created_at: 'created_at',
    updated_at: 'updated_at',
};
exports.UserScalarFieldEnum = {
    id: 'id',
    solana_address: 'solana_address',
    tron_address: 'tron_address',
    email: 'email',
    telegram_id: 'telegram_id',
    is_kyc_verified: 'is_kyc_verified',
    is_active: 'is_active',
    created_at: 'created_at',
    updated_at: 'updated_at',
};
exports.TokenPriceScalarFieldEnum = {
    id: 'id',
    token_mint: 'token_mint',
    price_usd: 'price_usd',
    source: 'source',
    updated_at: 'updated_at',
};
exports.BlockchainEventScalarFieldEnum = {
    id: 'id',
    chain: 'chain',
    tx_hash: 'tx_hash',
    event_type: 'event_type',
    data: 'data',
    processed: 'processed',
    created_at: 'created_at',
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc',
};
exports.JsonNullValueInput = {
    JsonNull: exports.JsonNull,
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive',
};
exports.NullsOrder = {
    first: 'first',
    last: 'last',
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull,
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map