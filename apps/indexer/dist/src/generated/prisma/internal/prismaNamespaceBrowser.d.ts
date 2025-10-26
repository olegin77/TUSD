import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.AnyNull);
};
export declare const DbNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
export declare const JsonNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
export declare const AnyNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
export declare const ModelName: {
    readonly Pool: "Pool";
    readonly Wexel: "Wexel";
    readonly CollateralPosition: "CollateralPosition";
    readonly Listing: "Listing";
    readonly Claim: "Claim";
    readonly Boost: "Boost";
    readonly Deposit: "Deposit";
    readonly User: "User";
    readonly TokenPrice: "TokenPrice";
    readonly BlockchainEvent: "BlockchainEvent";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const PoolScalarFieldEnum: {
    readonly id: "id";
    readonly apy_base_bp: "apy_base_bp";
    readonly lock_months: "lock_months";
    readonly min_deposit_usd: "min_deposit_usd";
    readonly total_liquidity: "total_liquidity";
    readonly total_wexels: "total_wexels";
    readonly boost_target_bp: "boost_target_bp";
    readonly boost_max_bp: "boost_max_bp";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type PoolScalarFieldEnum = (typeof PoolScalarFieldEnum)[keyof typeof PoolScalarFieldEnum];
export declare const WexelScalarFieldEnum: {
    readonly id: "id";
    readonly owner_solana: "owner_solana";
    readonly owner_tron: "owner_tron";
    readonly pool_id: "pool_id";
    readonly principal_usd: "principal_usd";
    readonly apy_base_bp: "apy_base_bp";
    readonly apy_boost_bp: "apy_boost_bp";
    readonly start_ts: "start_ts";
    readonly end_ts: "end_ts";
    readonly is_collateralized: "is_collateralized";
    readonly total_claimed_usd: "total_claimed_usd";
    readonly nft_mint_address: "nft_mint_address";
    readonly nft_token_address: "nft_token_address";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type WexelScalarFieldEnum = (typeof WexelScalarFieldEnum)[keyof typeof WexelScalarFieldEnum];
export declare const CollateralPositionScalarFieldEnum: {
    readonly wexel_id: "wexel_id";
    readonly loan_usd: "loan_usd";
    readonly start_ts: "start_ts";
    readonly repaid: "repaid";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type CollateralPositionScalarFieldEnum = (typeof CollateralPositionScalarFieldEnum)[keyof typeof CollateralPositionScalarFieldEnum];
export declare const ListingScalarFieldEnum: {
    readonly id: "id";
    readonly wexel_id: "wexel_id";
    readonly ask_price_usd: "ask_price_usd";
    readonly auction: "auction";
    readonly min_bid_usd: "min_bid_usd";
    readonly expiry_ts: "expiry_ts";
    readonly status: "status";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type ListingScalarFieldEnum = (typeof ListingScalarFieldEnum)[keyof typeof ListingScalarFieldEnum];
export declare const ClaimScalarFieldEnum: {
    readonly id: "id";
    readonly wexel_id: "wexel_id";
    readonly amount_usd: "amount_usd";
    readonly claim_type: "claim_type";
    readonly tx_hash: "tx_hash";
    readonly created_at: "created_at";
};
export type ClaimScalarFieldEnum = (typeof ClaimScalarFieldEnum)[keyof typeof ClaimScalarFieldEnum];
export declare const BoostScalarFieldEnum: {
    readonly id: "id";
    readonly wexel_id: "wexel_id";
    readonly token_mint: "token_mint";
    readonly amount: "amount";
    readonly value_usd: "value_usd";
    readonly apy_boost_bp: "apy_boost_bp";
    readonly price_usd: "price_usd";
    readonly created_at: "created_at";
};
export type BoostScalarFieldEnum = (typeof BoostScalarFieldEnum)[keyof typeof BoostScalarFieldEnum];
export declare const DepositScalarFieldEnum: {
    readonly id: "id";
    readonly pool_id: "pool_id";
    readonly user_address: "user_address";
    readonly amount_usd: "amount_usd";
    readonly wexel_id: "wexel_id";
    readonly tx_hash: "tx_hash";
    readonly status: "status";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type DepositScalarFieldEnum = (typeof DepositScalarFieldEnum)[keyof typeof DepositScalarFieldEnum];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly solana_address: "solana_address";
    readonly tron_address: "tron_address";
    readonly email: "email";
    readonly telegram_id: "telegram_id";
    readonly is_kyc_verified: "is_kyc_verified";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const TokenPriceScalarFieldEnum: {
    readonly id: "id";
    readonly token_mint: "token_mint";
    readonly price_usd: "price_usd";
    readonly source: "source";
    readonly updated_at: "updated_at";
};
export type TokenPriceScalarFieldEnum = (typeof TokenPriceScalarFieldEnum)[keyof typeof TokenPriceScalarFieldEnum];
export declare const BlockchainEventScalarFieldEnum: {
    readonly id: "id";
    readonly chain: "chain";
    readonly tx_hash: "tx_hash";
    readonly event_type: "event_type";
    readonly data: "data";
    readonly processed: "processed";
    readonly created_at: "created_at";
};
export type BlockchainEventScalarFieldEnum = (typeof BlockchainEventScalarFieldEnum)[keyof typeof BlockchainEventScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
    readonly JsonNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
    readonly AnyNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
