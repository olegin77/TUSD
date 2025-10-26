import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
export type PoolModel = runtime.Types.Result.DefaultSelection<Prisma.$PoolPayload>;
export type AggregatePool = {
    _count: PoolCountAggregateOutputType | null;
    _avg: PoolAvgAggregateOutputType | null;
    _sum: PoolSumAggregateOutputType | null;
    _min: PoolMinAggregateOutputType | null;
    _max: PoolMaxAggregateOutputType | null;
};
export type PoolAvgAggregateOutputType = {
    id: number | null;
    apy_base_bp: number | null;
    lock_months: number | null;
    min_deposit_usd: number | null;
    total_liquidity: number | null;
    total_wexels: number | null;
    boost_target_bp: number | null;
    boost_max_bp: number | null;
};
export type PoolSumAggregateOutputType = {
    id: number | null;
    apy_base_bp: number | null;
    lock_months: number | null;
    min_deposit_usd: bigint | null;
    total_liquidity: bigint | null;
    total_wexels: bigint | null;
    boost_target_bp: number | null;
    boost_max_bp: number | null;
};
export type PoolMinAggregateOutputType = {
    id: number | null;
    apy_base_bp: number | null;
    lock_months: number | null;
    min_deposit_usd: bigint | null;
    total_liquidity: bigint | null;
    total_wexels: bigint | null;
    boost_target_bp: number | null;
    boost_max_bp: number | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type PoolMaxAggregateOutputType = {
    id: number | null;
    apy_base_bp: number | null;
    lock_months: number | null;
    min_deposit_usd: bigint | null;
    total_liquidity: bigint | null;
    total_wexels: bigint | null;
    boost_target_bp: number | null;
    boost_max_bp: number | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type PoolCountAggregateOutputType = {
    id: number;
    apy_base_bp: number;
    lock_months: number;
    min_deposit_usd: number;
    total_liquidity: number;
    total_wexels: number;
    boost_target_bp: number;
    boost_max_bp: number;
    is_active: number;
    created_at: number;
    updated_at: number;
    _all: number;
};
export type PoolAvgAggregateInputType = {
    id?: true;
    apy_base_bp?: true;
    lock_months?: true;
    min_deposit_usd?: true;
    total_liquidity?: true;
    total_wexels?: true;
    boost_target_bp?: true;
    boost_max_bp?: true;
};
export type PoolSumAggregateInputType = {
    id?: true;
    apy_base_bp?: true;
    lock_months?: true;
    min_deposit_usd?: true;
    total_liquidity?: true;
    total_wexels?: true;
    boost_target_bp?: true;
    boost_max_bp?: true;
};
export type PoolMinAggregateInputType = {
    id?: true;
    apy_base_bp?: true;
    lock_months?: true;
    min_deposit_usd?: true;
    total_liquidity?: true;
    total_wexels?: true;
    boost_target_bp?: true;
    boost_max_bp?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
};
export type PoolMaxAggregateInputType = {
    id?: true;
    apy_base_bp?: true;
    lock_months?: true;
    min_deposit_usd?: true;
    total_liquidity?: true;
    total_wexels?: true;
    boost_target_bp?: true;
    boost_max_bp?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
};
export type PoolCountAggregateInputType = {
    id?: true;
    apy_base_bp?: true;
    lock_months?: true;
    min_deposit_usd?: true;
    total_liquidity?: true;
    total_wexels?: true;
    boost_target_bp?: true;
    boost_max_bp?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
};
export type PoolAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PoolWhereInput;
    orderBy?: Prisma.PoolOrderByWithRelationInput | Prisma.PoolOrderByWithRelationInput[];
    cursor?: Prisma.PoolWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PoolCountAggregateInputType;
    _avg?: PoolAvgAggregateInputType;
    _sum?: PoolSumAggregateInputType;
    _min?: PoolMinAggregateInputType;
    _max?: PoolMaxAggregateInputType;
};
export type GetPoolAggregateType<T extends PoolAggregateArgs> = {
    [P in keyof T & keyof AggregatePool]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePool[P]> : Prisma.GetScalarType<T[P], AggregatePool[P]>;
};
export type PoolGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PoolWhereInput;
    orderBy?: Prisma.PoolOrderByWithAggregationInput | Prisma.PoolOrderByWithAggregationInput[];
    by: Prisma.PoolScalarFieldEnum[] | Prisma.PoolScalarFieldEnum;
    having?: Prisma.PoolScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PoolCountAggregateInputType | true;
    _avg?: PoolAvgAggregateInputType;
    _sum?: PoolSumAggregateInputType;
    _min?: PoolMinAggregateInputType;
    _max?: PoolMaxAggregateInputType;
};
export type PoolGroupByOutputType = {
    id: number;
    apy_base_bp: number;
    lock_months: number;
    min_deposit_usd: bigint;
    total_liquidity: bigint;
    total_wexels: bigint;
    boost_target_bp: number;
    boost_max_bp: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    _count: PoolCountAggregateOutputType | null;
    _avg: PoolAvgAggregateOutputType | null;
    _sum: PoolSumAggregateOutputType | null;
    _min: PoolMinAggregateOutputType | null;
    _max: PoolMaxAggregateOutputType | null;
};
type GetPoolGroupByPayload<T extends PoolGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PoolGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PoolGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PoolGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PoolGroupByOutputType[P]>;
}>>;
export type PoolWhereInput = {
    AND?: Prisma.PoolWhereInput | Prisma.PoolWhereInput[];
    OR?: Prisma.PoolWhereInput[];
    NOT?: Prisma.PoolWhereInput | Prisma.PoolWhereInput[];
    id?: Prisma.IntFilter<"Pool"> | number;
    apy_base_bp?: Prisma.IntFilter<"Pool"> | number;
    lock_months?: Prisma.IntFilter<"Pool"> | number;
    min_deposit_usd?: Prisma.BigIntFilter<"Pool"> | bigint | number;
    total_liquidity?: Prisma.BigIntFilter<"Pool"> | bigint | number;
    total_wexels?: Prisma.BigIntFilter<"Pool"> | bigint | number;
    boost_target_bp?: Prisma.IntFilter<"Pool"> | number;
    boost_max_bp?: Prisma.IntFilter<"Pool"> | number;
    is_active?: Prisma.BoolFilter<"Pool"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Pool"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Pool"> | Date | string;
    wexels?: Prisma.WexelListRelationFilter;
    deposits?: Prisma.DepositListRelationFilter;
};
export type PoolOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    apy_base_bp?: Prisma.SortOrder;
    lock_months?: Prisma.SortOrder;
    min_deposit_usd?: Prisma.SortOrder;
    total_liquidity?: Prisma.SortOrder;
    total_wexels?: Prisma.SortOrder;
    boost_target_bp?: Prisma.SortOrder;
    boost_max_bp?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    wexels?: Prisma.WexelOrderByRelationAggregateInput;
    deposits?: Prisma.DepositOrderByRelationAggregateInput;
};
export type PoolWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.PoolWhereInput | Prisma.PoolWhereInput[];
    OR?: Prisma.PoolWhereInput[];
    NOT?: Prisma.PoolWhereInput | Prisma.PoolWhereInput[];
    apy_base_bp?: Prisma.IntFilter<"Pool"> | number;
    lock_months?: Prisma.IntFilter<"Pool"> | number;
    min_deposit_usd?: Prisma.BigIntFilter<"Pool"> | bigint | number;
    total_liquidity?: Prisma.BigIntFilter<"Pool"> | bigint | number;
    total_wexels?: Prisma.BigIntFilter<"Pool"> | bigint | number;
    boost_target_bp?: Prisma.IntFilter<"Pool"> | number;
    boost_max_bp?: Prisma.IntFilter<"Pool"> | number;
    is_active?: Prisma.BoolFilter<"Pool"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Pool"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Pool"> | Date | string;
    wexels?: Prisma.WexelListRelationFilter;
    deposits?: Prisma.DepositListRelationFilter;
}, "id">;
export type PoolOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    apy_base_bp?: Prisma.SortOrder;
    lock_months?: Prisma.SortOrder;
    min_deposit_usd?: Prisma.SortOrder;
    total_liquidity?: Prisma.SortOrder;
    total_wexels?: Prisma.SortOrder;
    boost_target_bp?: Prisma.SortOrder;
    boost_max_bp?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    _count?: Prisma.PoolCountOrderByAggregateInput;
    _avg?: Prisma.PoolAvgOrderByAggregateInput;
    _max?: Prisma.PoolMaxOrderByAggregateInput;
    _min?: Prisma.PoolMinOrderByAggregateInput;
    _sum?: Prisma.PoolSumOrderByAggregateInput;
};
export type PoolScalarWhereWithAggregatesInput = {
    AND?: Prisma.PoolScalarWhereWithAggregatesInput | Prisma.PoolScalarWhereWithAggregatesInput[];
    OR?: Prisma.PoolScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PoolScalarWhereWithAggregatesInput | Prisma.PoolScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Pool"> | number;
    apy_base_bp?: Prisma.IntWithAggregatesFilter<"Pool"> | number;
    lock_months?: Prisma.IntWithAggregatesFilter<"Pool"> | number;
    min_deposit_usd?: Prisma.BigIntWithAggregatesFilter<"Pool"> | bigint | number;
    total_liquidity?: Prisma.BigIntWithAggregatesFilter<"Pool"> | bigint | number;
    total_wexels?: Prisma.BigIntWithAggregatesFilter<"Pool"> | bigint | number;
    boost_target_bp?: Prisma.IntWithAggregatesFilter<"Pool"> | number;
    boost_max_bp?: Prisma.IntWithAggregatesFilter<"Pool"> | number;
    is_active?: Prisma.BoolWithAggregatesFilter<"Pool"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"Pool"> | Date | string;
    updated_at?: Prisma.DateTimeWithAggregatesFilter<"Pool"> | Date | string;
};
export type PoolCreateInput = {
    apy_base_bp: number;
    lock_months: number;
    min_deposit_usd: bigint | number;
    total_liquidity?: bigint | number;
    total_wexels?: bigint | number;
    boost_target_bp?: number;
    boost_max_bp?: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    wexels?: Prisma.WexelCreateNestedManyWithoutPoolInput;
    deposits?: Prisma.DepositCreateNestedManyWithoutPoolInput;
};
export type PoolUncheckedCreateInput = {
    id?: number;
    apy_base_bp: number;
    lock_months: number;
    min_deposit_usd: bigint | number;
    total_liquidity?: bigint | number;
    total_wexels?: bigint | number;
    boost_target_bp?: number;
    boost_max_bp?: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    wexels?: Prisma.WexelUncheckedCreateNestedManyWithoutPoolInput;
    deposits?: Prisma.DepositUncheckedCreateNestedManyWithoutPoolInput;
};
export type PoolUpdateInput = {
    apy_base_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    lock_months?: Prisma.IntFieldUpdateOperationsInput | number;
    min_deposit_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    total_liquidity?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    total_wexels?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    boost_target_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    boost_max_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    wexels?: Prisma.WexelUpdateManyWithoutPoolNestedInput;
    deposits?: Prisma.DepositUpdateManyWithoutPoolNestedInput;
};
export type PoolUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    apy_base_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    lock_months?: Prisma.IntFieldUpdateOperationsInput | number;
    min_deposit_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    total_liquidity?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    total_wexels?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    boost_target_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    boost_max_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    wexels?: Prisma.WexelUncheckedUpdateManyWithoutPoolNestedInput;
    deposits?: Prisma.DepositUncheckedUpdateManyWithoutPoolNestedInput;
};
export type PoolCreateManyInput = {
    id?: number;
    apy_base_bp: number;
    lock_months: number;
    min_deposit_usd: bigint | number;
    total_liquidity?: bigint | number;
    total_wexels?: bigint | number;
    boost_target_bp?: number;
    boost_max_bp?: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type PoolUpdateManyMutationInput = {
    apy_base_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    lock_months?: Prisma.IntFieldUpdateOperationsInput | number;
    min_deposit_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    total_liquidity?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    total_wexels?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    boost_target_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    boost_max_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PoolUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    apy_base_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    lock_months?: Prisma.IntFieldUpdateOperationsInput | number;
    min_deposit_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    total_liquidity?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    total_wexels?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    boost_target_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    boost_max_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PoolCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    apy_base_bp?: Prisma.SortOrder;
    lock_months?: Prisma.SortOrder;
    min_deposit_usd?: Prisma.SortOrder;
    total_liquidity?: Prisma.SortOrder;
    total_wexels?: Prisma.SortOrder;
    boost_target_bp?: Prisma.SortOrder;
    boost_max_bp?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type PoolAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    apy_base_bp?: Prisma.SortOrder;
    lock_months?: Prisma.SortOrder;
    min_deposit_usd?: Prisma.SortOrder;
    total_liquidity?: Prisma.SortOrder;
    total_wexels?: Prisma.SortOrder;
    boost_target_bp?: Prisma.SortOrder;
    boost_max_bp?: Prisma.SortOrder;
};
export type PoolMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    apy_base_bp?: Prisma.SortOrder;
    lock_months?: Prisma.SortOrder;
    min_deposit_usd?: Prisma.SortOrder;
    total_liquidity?: Prisma.SortOrder;
    total_wexels?: Prisma.SortOrder;
    boost_target_bp?: Prisma.SortOrder;
    boost_max_bp?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type PoolMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    apy_base_bp?: Prisma.SortOrder;
    lock_months?: Prisma.SortOrder;
    min_deposit_usd?: Prisma.SortOrder;
    total_liquidity?: Prisma.SortOrder;
    total_wexels?: Prisma.SortOrder;
    boost_target_bp?: Prisma.SortOrder;
    boost_max_bp?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type PoolSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    apy_base_bp?: Prisma.SortOrder;
    lock_months?: Prisma.SortOrder;
    min_deposit_usd?: Prisma.SortOrder;
    total_liquidity?: Prisma.SortOrder;
    total_wexels?: Prisma.SortOrder;
    boost_target_bp?: Prisma.SortOrder;
    boost_max_bp?: Prisma.SortOrder;
};
export type PoolScalarRelationFilter = {
    is?: Prisma.PoolWhereInput;
    isNot?: Prisma.PoolWhereInput;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number;
    increment?: bigint | number;
    decrement?: bigint | number;
    multiply?: bigint | number;
    divide?: bigint | number;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type PoolCreateNestedOneWithoutWexelsInput = {
    create?: Prisma.XOR<Prisma.PoolCreateWithoutWexelsInput, Prisma.PoolUncheckedCreateWithoutWexelsInput>;
    connectOrCreate?: Prisma.PoolCreateOrConnectWithoutWexelsInput;
    connect?: Prisma.PoolWhereUniqueInput;
};
export type PoolUpdateOneRequiredWithoutWexelsNestedInput = {
    create?: Prisma.XOR<Prisma.PoolCreateWithoutWexelsInput, Prisma.PoolUncheckedCreateWithoutWexelsInput>;
    connectOrCreate?: Prisma.PoolCreateOrConnectWithoutWexelsInput;
    upsert?: Prisma.PoolUpsertWithoutWexelsInput;
    connect?: Prisma.PoolWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PoolUpdateToOneWithWhereWithoutWexelsInput, Prisma.PoolUpdateWithoutWexelsInput>, Prisma.PoolUncheckedUpdateWithoutWexelsInput>;
};
export type PoolCreateNestedOneWithoutDepositsInput = {
    create?: Prisma.XOR<Prisma.PoolCreateWithoutDepositsInput, Prisma.PoolUncheckedCreateWithoutDepositsInput>;
    connectOrCreate?: Prisma.PoolCreateOrConnectWithoutDepositsInput;
    connect?: Prisma.PoolWhereUniqueInput;
};
export type PoolUpdateOneRequiredWithoutDepositsNestedInput = {
    create?: Prisma.XOR<Prisma.PoolCreateWithoutDepositsInput, Prisma.PoolUncheckedCreateWithoutDepositsInput>;
    connectOrCreate?: Prisma.PoolCreateOrConnectWithoutDepositsInput;
    upsert?: Prisma.PoolUpsertWithoutDepositsInput;
    connect?: Prisma.PoolWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PoolUpdateToOneWithWhereWithoutDepositsInput, Prisma.PoolUpdateWithoutDepositsInput>, Prisma.PoolUncheckedUpdateWithoutDepositsInput>;
};
export type PoolCreateWithoutWexelsInput = {
    apy_base_bp: number;
    lock_months: number;
    min_deposit_usd: bigint | number;
    total_liquidity?: bigint | number;
    total_wexels?: bigint | number;
    boost_target_bp?: number;
    boost_max_bp?: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    deposits?: Prisma.DepositCreateNestedManyWithoutPoolInput;
};
export type PoolUncheckedCreateWithoutWexelsInput = {
    id?: number;
    apy_base_bp: number;
    lock_months: number;
    min_deposit_usd: bigint | number;
    total_liquidity?: bigint | number;
    total_wexels?: bigint | number;
    boost_target_bp?: number;
    boost_max_bp?: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    deposits?: Prisma.DepositUncheckedCreateNestedManyWithoutPoolInput;
};
export type PoolCreateOrConnectWithoutWexelsInput = {
    where: Prisma.PoolWhereUniqueInput;
    create: Prisma.XOR<Prisma.PoolCreateWithoutWexelsInput, Prisma.PoolUncheckedCreateWithoutWexelsInput>;
};
export type PoolUpsertWithoutWexelsInput = {
    update: Prisma.XOR<Prisma.PoolUpdateWithoutWexelsInput, Prisma.PoolUncheckedUpdateWithoutWexelsInput>;
    create: Prisma.XOR<Prisma.PoolCreateWithoutWexelsInput, Prisma.PoolUncheckedCreateWithoutWexelsInput>;
    where?: Prisma.PoolWhereInput;
};
export type PoolUpdateToOneWithWhereWithoutWexelsInput = {
    where?: Prisma.PoolWhereInput;
    data: Prisma.XOR<Prisma.PoolUpdateWithoutWexelsInput, Prisma.PoolUncheckedUpdateWithoutWexelsInput>;
};
export type PoolUpdateWithoutWexelsInput = {
    apy_base_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    lock_months?: Prisma.IntFieldUpdateOperationsInput | number;
    min_deposit_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    total_liquidity?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    total_wexels?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    boost_target_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    boost_max_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deposits?: Prisma.DepositUpdateManyWithoutPoolNestedInput;
};
export type PoolUncheckedUpdateWithoutWexelsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    apy_base_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    lock_months?: Prisma.IntFieldUpdateOperationsInput | number;
    min_deposit_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    total_liquidity?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    total_wexels?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    boost_target_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    boost_max_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deposits?: Prisma.DepositUncheckedUpdateManyWithoutPoolNestedInput;
};
export type PoolCreateWithoutDepositsInput = {
    apy_base_bp: number;
    lock_months: number;
    min_deposit_usd: bigint | number;
    total_liquidity?: bigint | number;
    total_wexels?: bigint | number;
    boost_target_bp?: number;
    boost_max_bp?: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    wexels?: Prisma.WexelCreateNestedManyWithoutPoolInput;
};
export type PoolUncheckedCreateWithoutDepositsInput = {
    id?: number;
    apy_base_bp: number;
    lock_months: number;
    min_deposit_usd: bigint | number;
    total_liquidity?: bigint | number;
    total_wexels?: bigint | number;
    boost_target_bp?: number;
    boost_max_bp?: number;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    wexels?: Prisma.WexelUncheckedCreateNestedManyWithoutPoolInput;
};
export type PoolCreateOrConnectWithoutDepositsInput = {
    where: Prisma.PoolWhereUniqueInput;
    create: Prisma.XOR<Prisma.PoolCreateWithoutDepositsInput, Prisma.PoolUncheckedCreateWithoutDepositsInput>;
};
export type PoolUpsertWithoutDepositsInput = {
    update: Prisma.XOR<Prisma.PoolUpdateWithoutDepositsInput, Prisma.PoolUncheckedUpdateWithoutDepositsInput>;
    create: Prisma.XOR<Prisma.PoolCreateWithoutDepositsInput, Prisma.PoolUncheckedCreateWithoutDepositsInput>;
    where?: Prisma.PoolWhereInput;
};
export type PoolUpdateToOneWithWhereWithoutDepositsInput = {
    where?: Prisma.PoolWhereInput;
    data: Prisma.XOR<Prisma.PoolUpdateWithoutDepositsInput, Prisma.PoolUncheckedUpdateWithoutDepositsInput>;
};
export type PoolUpdateWithoutDepositsInput = {
    apy_base_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    lock_months?: Prisma.IntFieldUpdateOperationsInput | number;
    min_deposit_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    total_liquidity?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    total_wexels?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    boost_target_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    boost_max_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    wexels?: Prisma.WexelUpdateManyWithoutPoolNestedInput;
};
export type PoolUncheckedUpdateWithoutDepositsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    apy_base_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    lock_months?: Prisma.IntFieldUpdateOperationsInput | number;
    min_deposit_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    total_liquidity?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    total_wexels?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    boost_target_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    boost_max_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    wexels?: Prisma.WexelUncheckedUpdateManyWithoutPoolNestedInput;
};
export type PoolCountOutputType = {
    wexels: number;
    deposits: number;
};
export type PoolCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    wexels?: boolean | PoolCountOutputTypeCountWexelsArgs;
    deposits?: boolean | PoolCountOutputTypeCountDepositsArgs;
};
export type PoolCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PoolCountOutputTypeSelect<ExtArgs> | null;
};
export type PoolCountOutputTypeCountWexelsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WexelWhereInput;
};
export type PoolCountOutputTypeCountDepositsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DepositWhereInput;
};
export type PoolSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    apy_base_bp?: boolean;
    lock_months?: boolean;
    min_deposit_usd?: boolean;
    total_liquidity?: boolean;
    total_wexels?: boolean;
    boost_target_bp?: boolean;
    boost_max_bp?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    wexels?: boolean | Prisma.Pool$wexelsArgs<ExtArgs>;
    deposits?: boolean | Prisma.Pool$depositsArgs<ExtArgs>;
    _count?: boolean | Prisma.PoolCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["pool"]>;
export type PoolSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    apy_base_bp?: boolean;
    lock_months?: boolean;
    min_deposit_usd?: boolean;
    total_liquidity?: boolean;
    total_wexels?: boolean;
    boost_target_bp?: boolean;
    boost_max_bp?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
}, ExtArgs["result"]["pool"]>;
export type PoolSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    apy_base_bp?: boolean;
    lock_months?: boolean;
    min_deposit_usd?: boolean;
    total_liquidity?: boolean;
    total_wexels?: boolean;
    boost_target_bp?: boolean;
    boost_max_bp?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
}, ExtArgs["result"]["pool"]>;
export type PoolSelectScalar = {
    id?: boolean;
    apy_base_bp?: boolean;
    lock_months?: boolean;
    min_deposit_usd?: boolean;
    total_liquidity?: boolean;
    total_wexels?: boolean;
    boost_target_bp?: boolean;
    boost_max_bp?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
};
export type PoolOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "apy_base_bp" | "lock_months" | "min_deposit_usd" | "total_liquidity" | "total_wexels" | "boost_target_bp" | "boost_max_bp" | "is_active" | "created_at" | "updated_at", ExtArgs["result"]["pool"]>;
export type PoolInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    wexels?: boolean | Prisma.Pool$wexelsArgs<ExtArgs>;
    deposits?: boolean | Prisma.Pool$depositsArgs<ExtArgs>;
    _count?: boolean | Prisma.PoolCountOutputTypeDefaultArgs<ExtArgs>;
};
export type PoolIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type PoolIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $PoolPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Pool";
    objects: {
        wexels: Prisma.$WexelPayload<ExtArgs>[];
        deposits: Prisma.$DepositPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        apy_base_bp: number;
        lock_months: number;
        min_deposit_usd: bigint;
        total_liquidity: bigint;
        total_wexels: bigint;
        boost_target_bp: number;
        boost_max_bp: number;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    }, ExtArgs["result"]["pool"]>;
    composites: {};
};
export type PoolGetPayload<S extends boolean | null | undefined | PoolDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PoolPayload, S>;
export type PoolCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PoolFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PoolCountAggregateInputType | true;
};
export interface PoolDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Pool'];
        meta: {
            name: 'Pool';
        };
    };
    findUnique<T extends PoolFindUniqueArgs>(args: Prisma.SelectSubset<T, PoolFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PoolClient<runtime.Types.Result.GetResult<Prisma.$PoolPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PoolFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PoolFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PoolClient<runtime.Types.Result.GetResult<Prisma.$PoolPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PoolFindFirstArgs>(args?: Prisma.SelectSubset<T, PoolFindFirstArgs<ExtArgs>>): Prisma.Prisma__PoolClient<runtime.Types.Result.GetResult<Prisma.$PoolPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PoolFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PoolFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PoolClient<runtime.Types.Result.GetResult<Prisma.$PoolPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PoolFindManyArgs>(args?: Prisma.SelectSubset<T, PoolFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PoolPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PoolCreateArgs>(args: Prisma.SelectSubset<T, PoolCreateArgs<ExtArgs>>): Prisma.Prisma__PoolClient<runtime.Types.Result.GetResult<Prisma.$PoolPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PoolCreateManyArgs>(args?: Prisma.SelectSubset<T, PoolCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PoolCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PoolCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PoolPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PoolDeleteArgs>(args: Prisma.SelectSubset<T, PoolDeleteArgs<ExtArgs>>): Prisma.Prisma__PoolClient<runtime.Types.Result.GetResult<Prisma.$PoolPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PoolUpdateArgs>(args: Prisma.SelectSubset<T, PoolUpdateArgs<ExtArgs>>): Prisma.Prisma__PoolClient<runtime.Types.Result.GetResult<Prisma.$PoolPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PoolDeleteManyArgs>(args?: Prisma.SelectSubset<T, PoolDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PoolUpdateManyArgs>(args: Prisma.SelectSubset<T, PoolUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PoolUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PoolUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PoolPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PoolUpsertArgs>(args: Prisma.SelectSubset<T, PoolUpsertArgs<ExtArgs>>): Prisma.Prisma__PoolClient<runtime.Types.Result.GetResult<Prisma.$PoolPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PoolCountArgs>(args?: Prisma.Subset<T, PoolCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PoolCountAggregateOutputType> : number>;
    aggregate<T extends PoolAggregateArgs>(args: Prisma.Subset<T, PoolAggregateArgs>): Prisma.PrismaPromise<GetPoolAggregateType<T>>;
    groupBy<T extends PoolGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PoolGroupByArgs['orderBy'];
    } : {
        orderBy?: PoolGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PoolGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPoolGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PoolFieldRefs;
}
export interface Prisma__PoolClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    wexels<T extends Prisma.Pool$wexelsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Pool$wexelsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WexelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    deposits<T extends Prisma.Pool$depositsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Pool$depositsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PoolFieldRefs {
    readonly id: Prisma.FieldRef<"Pool", 'Int'>;
    readonly apy_base_bp: Prisma.FieldRef<"Pool", 'Int'>;
    readonly lock_months: Prisma.FieldRef<"Pool", 'Int'>;
    readonly min_deposit_usd: Prisma.FieldRef<"Pool", 'BigInt'>;
    readonly total_liquidity: Prisma.FieldRef<"Pool", 'BigInt'>;
    readonly total_wexels: Prisma.FieldRef<"Pool", 'BigInt'>;
    readonly boost_target_bp: Prisma.FieldRef<"Pool", 'Int'>;
    readonly boost_max_bp: Prisma.FieldRef<"Pool", 'Int'>;
    readonly is_active: Prisma.FieldRef<"Pool", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"Pool", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"Pool", 'DateTime'>;
}
export type PoolFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PoolSelect<ExtArgs> | null;
    omit?: Prisma.PoolOmit<ExtArgs> | null;
    include?: Prisma.PoolInclude<ExtArgs> | null;
    where: Prisma.PoolWhereUniqueInput;
};
export type PoolFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PoolSelect<ExtArgs> | null;
    omit?: Prisma.PoolOmit<ExtArgs> | null;
    include?: Prisma.PoolInclude<ExtArgs> | null;
    where: Prisma.PoolWhereUniqueInput;
};
export type PoolFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PoolSelect<ExtArgs> | null;
    omit?: Prisma.PoolOmit<ExtArgs> | null;
    include?: Prisma.PoolInclude<ExtArgs> | null;
    where?: Prisma.PoolWhereInput;
    orderBy?: Prisma.PoolOrderByWithRelationInput | Prisma.PoolOrderByWithRelationInput[];
    cursor?: Prisma.PoolWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PoolScalarFieldEnum | Prisma.PoolScalarFieldEnum[];
};
export type PoolFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PoolSelect<ExtArgs> | null;
    omit?: Prisma.PoolOmit<ExtArgs> | null;
    include?: Prisma.PoolInclude<ExtArgs> | null;
    where?: Prisma.PoolWhereInput;
    orderBy?: Prisma.PoolOrderByWithRelationInput | Prisma.PoolOrderByWithRelationInput[];
    cursor?: Prisma.PoolWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PoolScalarFieldEnum | Prisma.PoolScalarFieldEnum[];
};
export type PoolFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PoolSelect<ExtArgs> | null;
    omit?: Prisma.PoolOmit<ExtArgs> | null;
    include?: Prisma.PoolInclude<ExtArgs> | null;
    where?: Prisma.PoolWhereInput;
    orderBy?: Prisma.PoolOrderByWithRelationInput | Prisma.PoolOrderByWithRelationInput[];
    cursor?: Prisma.PoolWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PoolScalarFieldEnum | Prisma.PoolScalarFieldEnum[];
};
export type PoolCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PoolSelect<ExtArgs> | null;
    omit?: Prisma.PoolOmit<ExtArgs> | null;
    include?: Prisma.PoolInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PoolCreateInput, Prisma.PoolUncheckedCreateInput>;
};
export type PoolCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PoolCreateManyInput | Prisma.PoolCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PoolCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PoolSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PoolOmit<ExtArgs> | null;
    data: Prisma.PoolCreateManyInput | Prisma.PoolCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PoolUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PoolSelect<ExtArgs> | null;
    omit?: Prisma.PoolOmit<ExtArgs> | null;
    include?: Prisma.PoolInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PoolUpdateInput, Prisma.PoolUncheckedUpdateInput>;
    where: Prisma.PoolWhereUniqueInput;
};
export type PoolUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PoolUpdateManyMutationInput, Prisma.PoolUncheckedUpdateManyInput>;
    where?: Prisma.PoolWhereInput;
    limit?: number;
};
export type PoolUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PoolSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PoolOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PoolUpdateManyMutationInput, Prisma.PoolUncheckedUpdateManyInput>;
    where?: Prisma.PoolWhereInput;
    limit?: number;
};
export type PoolUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PoolSelect<ExtArgs> | null;
    omit?: Prisma.PoolOmit<ExtArgs> | null;
    include?: Prisma.PoolInclude<ExtArgs> | null;
    where: Prisma.PoolWhereUniqueInput;
    create: Prisma.XOR<Prisma.PoolCreateInput, Prisma.PoolUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PoolUpdateInput, Prisma.PoolUncheckedUpdateInput>;
};
export type PoolDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PoolSelect<ExtArgs> | null;
    omit?: Prisma.PoolOmit<ExtArgs> | null;
    include?: Prisma.PoolInclude<ExtArgs> | null;
    where: Prisma.PoolWhereUniqueInput;
};
export type PoolDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PoolWhereInput;
    limit?: number;
};
export type Pool$wexelsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WexelSelect<ExtArgs> | null;
    omit?: Prisma.WexelOmit<ExtArgs> | null;
    include?: Prisma.WexelInclude<ExtArgs> | null;
    where?: Prisma.WexelWhereInput;
    orderBy?: Prisma.WexelOrderByWithRelationInput | Prisma.WexelOrderByWithRelationInput[];
    cursor?: Prisma.WexelWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WexelScalarFieldEnum | Prisma.WexelScalarFieldEnum[];
};
export type Pool$depositsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DepositSelect<ExtArgs> | null;
    omit?: Prisma.DepositOmit<ExtArgs> | null;
    include?: Prisma.DepositInclude<ExtArgs> | null;
    where?: Prisma.DepositWhereInput;
    orderBy?: Prisma.DepositOrderByWithRelationInput | Prisma.DepositOrderByWithRelationInput[];
    cursor?: Prisma.DepositWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DepositScalarFieldEnum | Prisma.DepositScalarFieldEnum[];
};
export type PoolDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PoolSelect<ExtArgs> | null;
    omit?: Prisma.PoolOmit<ExtArgs> | null;
    include?: Prisma.PoolInclude<ExtArgs> | null;
};
export {};
