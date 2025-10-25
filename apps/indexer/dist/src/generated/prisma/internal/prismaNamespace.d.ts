import * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Metrics = runtime.Metrics;
export type Metric<T> = runtime.Metric<T>;
export type MetricHistogram = runtime.MetricHistogram;
export type MetricHistogramBucket = runtime.MetricHistogramBucket;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
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
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
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
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "pool" | "wexel" | "collateralPosition" | "listing" | "claim" | "boost" | "deposit" | "user" | "tokenPrice" | "blockchainEvent";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        Pool: {
            payload: Prisma.$PoolPayload<ExtArgs>;
            fields: Prisma.PoolFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PoolFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PoolPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PoolFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PoolPayload>;
                };
                findFirst: {
                    args: Prisma.PoolFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PoolPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PoolFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PoolPayload>;
                };
                findMany: {
                    args: Prisma.PoolFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PoolPayload>[];
                };
                create: {
                    args: Prisma.PoolCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PoolPayload>;
                };
                createMany: {
                    args: Prisma.PoolCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PoolCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PoolPayload>[];
                };
                delete: {
                    args: Prisma.PoolDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PoolPayload>;
                };
                update: {
                    args: Prisma.PoolUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PoolPayload>;
                };
                deleteMany: {
                    args: Prisma.PoolDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PoolUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PoolUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PoolPayload>[];
                };
                upsert: {
                    args: Prisma.PoolUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PoolPayload>;
                };
                aggregate: {
                    args: Prisma.PoolAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePool>;
                };
                groupBy: {
                    args: Prisma.PoolGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PoolGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PoolCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PoolCountAggregateOutputType> | number;
                };
            };
        };
        Wexel: {
            payload: Prisma.$WexelPayload<ExtArgs>;
            fields: Prisma.WexelFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.WexelFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WexelPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.WexelFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WexelPayload>;
                };
                findFirst: {
                    args: Prisma.WexelFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WexelPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.WexelFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WexelPayload>;
                };
                findMany: {
                    args: Prisma.WexelFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WexelPayload>[];
                };
                create: {
                    args: Prisma.WexelCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WexelPayload>;
                };
                createMany: {
                    args: Prisma.WexelCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.WexelCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WexelPayload>[];
                };
                delete: {
                    args: Prisma.WexelDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WexelPayload>;
                };
                update: {
                    args: Prisma.WexelUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WexelPayload>;
                };
                deleteMany: {
                    args: Prisma.WexelDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.WexelUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.WexelUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WexelPayload>[];
                };
                upsert: {
                    args: Prisma.WexelUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WexelPayload>;
                };
                aggregate: {
                    args: Prisma.WexelAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWexel>;
                };
                groupBy: {
                    args: Prisma.WexelGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WexelGroupByOutputType>[];
                };
                count: {
                    args: Prisma.WexelCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WexelCountAggregateOutputType> | number;
                };
            };
        };
        CollateralPosition: {
            payload: Prisma.$CollateralPositionPayload<ExtArgs>;
            fields: Prisma.CollateralPositionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CollateralPositionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CollateralPositionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CollateralPositionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CollateralPositionPayload>;
                };
                findFirst: {
                    args: Prisma.CollateralPositionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CollateralPositionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CollateralPositionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CollateralPositionPayload>;
                };
                findMany: {
                    args: Prisma.CollateralPositionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CollateralPositionPayload>[];
                };
                create: {
                    args: Prisma.CollateralPositionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CollateralPositionPayload>;
                };
                createMany: {
                    args: Prisma.CollateralPositionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CollateralPositionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CollateralPositionPayload>[];
                };
                delete: {
                    args: Prisma.CollateralPositionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CollateralPositionPayload>;
                };
                update: {
                    args: Prisma.CollateralPositionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CollateralPositionPayload>;
                };
                deleteMany: {
                    args: Prisma.CollateralPositionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CollateralPositionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CollateralPositionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CollateralPositionPayload>[];
                };
                upsert: {
                    args: Prisma.CollateralPositionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CollateralPositionPayload>;
                };
                aggregate: {
                    args: Prisma.CollateralPositionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCollateralPosition>;
                };
                groupBy: {
                    args: Prisma.CollateralPositionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CollateralPositionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CollateralPositionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CollateralPositionCountAggregateOutputType> | number;
                };
            };
        };
        Listing: {
            payload: Prisma.$ListingPayload<ExtArgs>;
            fields: Prisma.ListingFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ListingFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ListingFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>;
                };
                findFirst: {
                    args: Prisma.ListingFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ListingFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>;
                };
                findMany: {
                    args: Prisma.ListingFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>[];
                };
                create: {
                    args: Prisma.ListingCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>;
                };
                createMany: {
                    args: Prisma.ListingCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ListingCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>[];
                };
                delete: {
                    args: Prisma.ListingDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>;
                };
                update: {
                    args: Prisma.ListingUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>;
                };
                deleteMany: {
                    args: Prisma.ListingDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ListingUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ListingUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>[];
                };
                upsert: {
                    args: Prisma.ListingUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>;
                };
                aggregate: {
                    args: Prisma.ListingAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateListing>;
                };
                groupBy: {
                    args: Prisma.ListingGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ListingGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ListingCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ListingCountAggregateOutputType> | number;
                };
            };
        };
        Claim: {
            payload: Prisma.$ClaimPayload<ExtArgs>;
            fields: Prisma.ClaimFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ClaimFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ClaimFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPayload>;
                };
                findFirst: {
                    args: Prisma.ClaimFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ClaimFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPayload>;
                };
                findMany: {
                    args: Prisma.ClaimFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPayload>[];
                };
                create: {
                    args: Prisma.ClaimCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPayload>;
                };
                createMany: {
                    args: Prisma.ClaimCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ClaimCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPayload>[];
                };
                delete: {
                    args: Prisma.ClaimDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPayload>;
                };
                update: {
                    args: Prisma.ClaimUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPayload>;
                };
                deleteMany: {
                    args: Prisma.ClaimDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ClaimUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ClaimUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPayload>[];
                };
                upsert: {
                    args: Prisma.ClaimUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPayload>;
                };
                aggregate: {
                    args: Prisma.ClaimAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateClaim>;
                };
                groupBy: {
                    args: Prisma.ClaimGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ClaimGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ClaimCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ClaimCountAggregateOutputType> | number;
                };
            };
        };
        Boost: {
            payload: Prisma.$BoostPayload<ExtArgs>;
            fields: Prisma.BoostFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BoostFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoostPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BoostFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoostPayload>;
                };
                findFirst: {
                    args: Prisma.BoostFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoostPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BoostFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoostPayload>;
                };
                findMany: {
                    args: Prisma.BoostFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoostPayload>[];
                };
                create: {
                    args: Prisma.BoostCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoostPayload>;
                };
                createMany: {
                    args: Prisma.BoostCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BoostCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoostPayload>[];
                };
                delete: {
                    args: Prisma.BoostDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoostPayload>;
                };
                update: {
                    args: Prisma.BoostUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoostPayload>;
                };
                deleteMany: {
                    args: Prisma.BoostDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BoostUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BoostUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoostPayload>[];
                };
                upsert: {
                    args: Prisma.BoostUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoostPayload>;
                };
                aggregate: {
                    args: Prisma.BoostAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBoost>;
                };
                groupBy: {
                    args: Prisma.BoostGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BoostGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BoostCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BoostCountAggregateOutputType> | number;
                };
            };
        };
        Deposit: {
            payload: Prisma.$DepositPayload<ExtArgs>;
            fields: Prisma.DepositFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.DepositFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DepositPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.DepositFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DepositPayload>;
                };
                findFirst: {
                    args: Prisma.DepositFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DepositPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.DepositFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DepositPayload>;
                };
                findMany: {
                    args: Prisma.DepositFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DepositPayload>[];
                };
                create: {
                    args: Prisma.DepositCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DepositPayload>;
                };
                createMany: {
                    args: Prisma.DepositCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.DepositCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DepositPayload>[];
                };
                delete: {
                    args: Prisma.DepositDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DepositPayload>;
                };
                update: {
                    args: Prisma.DepositUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DepositPayload>;
                };
                deleteMany: {
                    args: Prisma.DepositDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.DepositUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.DepositUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DepositPayload>[];
                };
                upsert: {
                    args: Prisma.DepositUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DepositPayload>;
                };
                aggregate: {
                    args: Prisma.DepositAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDeposit>;
                };
                groupBy: {
                    args: Prisma.DepositGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DepositGroupByOutputType>[];
                };
                count: {
                    args: Prisma.DepositCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DepositCountAggregateOutputType> | number;
                };
            };
        };
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        TokenPrice: {
            payload: Prisma.$TokenPricePayload<ExtArgs>;
            fields: Prisma.TokenPriceFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TokenPriceFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPricePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TokenPriceFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPricePayload>;
                };
                findFirst: {
                    args: Prisma.TokenPriceFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPricePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TokenPriceFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPricePayload>;
                };
                findMany: {
                    args: Prisma.TokenPriceFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPricePayload>[];
                };
                create: {
                    args: Prisma.TokenPriceCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPricePayload>;
                };
                createMany: {
                    args: Prisma.TokenPriceCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TokenPriceCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPricePayload>[];
                };
                delete: {
                    args: Prisma.TokenPriceDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPricePayload>;
                };
                update: {
                    args: Prisma.TokenPriceUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPricePayload>;
                };
                deleteMany: {
                    args: Prisma.TokenPriceDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TokenPriceUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TokenPriceUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPricePayload>[];
                };
                upsert: {
                    args: Prisma.TokenPriceUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenPricePayload>;
                };
                aggregate: {
                    args: Prisma.TokenPriceAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTokenPrice>;
                };
                groupBy: {
                    args: Prisma.TokenPriceGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TokenPriceGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TokenPriceCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TokenPriceCountAggregateOutputType> | number;
                };
            };
        };
        BlockchainEvent: {
            payload: Prisma.$BlockchainEventPayload<ExtArgs>;
            fields: Prisma.BlockchainEventFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BlockchainEventFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BlockchainEventPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BlockchainEventFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BlockchainEventPayload>;
                };
                findFirst: {
                    args: Prisma.BlockchainEventFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BlockchainEventPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BlockchainEventFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BlockchainEventPayload>;
                };
                findMany: {
                    args: Prisma.BlockchainEventFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BlockchainEventPayload>[];
                };
                create: {
                    args: Prisma.BlockchainEventCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BlockchainEventPayload>;
                };
                createMany: {
                    args: Prisma.BlockchainEventCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BlockchainEventCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BlockchainEventPayload>[];
                };
                delete: {
                    args: Prisma.BlockchainEventDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BlockchainEventPayload>;
                };
                update: {
                    args: Prisma.BlockchainEventUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BlockchainEventPayload>;
                };
                deleteMany: {
                    args: Prisma.BlockchainEventDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BlockchainEventUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BlockchainEventUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BlockchainEventPayload>[];
                };
                upsert: {
                    args: Prisma.BlockchainEventUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BlockchainEventPayload>;
                };
                aggregate: {
                    args: Prisma.BlockchainEventAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBlockchainEvent>;
                };
                groupBy: {
                    args: Prisma.BlockchainEventGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BlockchainEventGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BlockchainEventCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BlockchainEventCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
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
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>;
export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
export type BatchPayload = {
    count: number;
};
export type Datasource = {
    url?: string;
};
export type Datasources = {
    db?: Datasource;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export interface PrismaClientOptions {
    datasources?: Datasources;
    datasourceUrl?: string;
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    adapter?: runtime.SqlDriverAdapterFactory | null;
    omit?: GlobalOmitConfig;
}
export type GlobalOmitConfig = {
    pool?: Prisma.PoolOmit;
    wexel?: Prisma.WexelOmit;
    collateralPosition?: Prisma.CollateralPositionOmit;
    listing?: Prisma.ListingOmit;
    claim?: Prisma.ClaimOmit;
    boost?: Prisma.BoostOmit;
    deposit?: Prisma.DepositOmit;
    user?: Prisma.UserOmit;
    tokenPrice?: Prisma.TokenPriceOmit;
    blockchainEvent?: Prisma.BlockchainEventOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
