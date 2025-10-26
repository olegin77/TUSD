import type * as runtime from '@prisma/client/runtime/library';
import type * as Prisma from '../internal/prismaNamespace.js';
export type BoostModel = runtime.Types.Result.DefaultSelection<Prisma.$BoostPayload>;
export type AggregateBoost = {
    _count: BoostCountAggregateOutputType | null;
    _avg: BoostAvgAggregateOutputType | null;
    _sum: BoostSumAggregateOutputType | null;
    _min: BoostMinAggregateOutputType | null;
    _max: BoostMaxAggregateOutputType | null;
};
export type BoostAvgAggregateOutputType = {
    id: number | null;
    wexel_id: number | null;
    amount: number | null;
    value_usd: number | null;
    apy_boost_bp: number | null;
    price_usd: number | null;
};
export type BoostSumAggregateOutputType = {
    id: bigint | null;
    wexel_id: bigint | null;
    amount: bigint | null;
    value_usd: bigint | null;
    apy_boost_bp: number | null;
    price_usd: bigint | null;
};
export type BoostMinAggregateOutputType = {
    id: bigint | null;
    wexel_id: bigint | null;
    token_mint: string | null;
    amount: bigint | null;
    value_usd: bigint | null;
    apy_boost_bp: number | null;
    price_usd: bigint | null;
    created_at: Date | null;
};
export type BoostMaxAggregateOutputType = {
    id: bigint | null;
    wexel_id: bigint | null;
    token_mint: string | null;
    amount: bigint | null;
    value_usd: bigint | null;
    apy_boost_bp: number | null;
    price_usd: bigint | null;
    created_at: Date | null;
};
export type BoostCountAggregateOutputType = {
    id: number;
    wexel_id: number;
    token_mint: number;
    amount: number;
    value_usd: number;
    apy_boost_bp: number;
    price_usd: number;
    created_at: number;
    _all: number;
};
export type BoostAvgAggregateInputType = {
    id?: true;
    wexel_id?: true;
    amount?: true;
    value_usd?: true;
    apy_boost_bp?: true;
    price_usd?: true;
};
export type BoostSumAggregateInputType = {
    id?: true;
    wexel_id?: true;
    amount?: true;
    value_usd?: true;
    apy_boost_bp?: true;
    price_usd?: true;
};
export type BoostMinAggregateInputType = {
    id?: true;
    wexel_id?: true;
    token_mint?: true;
    amount?: true;
    value_usd?: true;
    apy_boost_bp?: true;
    price_usd?: true;
    created_at?: true;
};
export type BoostMaxAggregateInputType = {
    id?: true;
    wexel_id?: true;
    token_mint?: true;
    amount?: true;
    value_usd?: true;
    apy_boost_bp?: true;
    price_usd?: true;
    created_at?: true;
};
export type BoostCountAggregateInputType = {
    id?: true;
    wexel_id?: true;
    token_mint?: true;
    amount?: true;
    value_usd?: true;
    apy_boost_bp?: true;
    price_usd?: true;
    created_at?: true;
    _all?: true;
};
export type BoostAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoostWhereInput;
    orderBy?: Prisma.BoostOrderByWithRelationInput | Prisma.BoostOrderByWithRelationInput[];
    cursor?: Prisma.BoostWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BoostCountAggregateInputType;
    _avg?: BoostAvgAggregateInputType;
    _sum?: BoostSumAggregateInputType;
    _min?: BoostMinAggregateInputType;
    _max?: BoostMaxAggregateInputType;
};
export type GetBoostAggregateType<T extends BoostAggregateArgs> = {
    [P in keyof T & keyof AggregateBoost]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBoost[P]> : Prisma.GetScalarType<T[P], AggregateBoost[P]>;
};
export type BoostGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoostWhereInput;
    orderBy?: Prisma.BoostOrderByWithAggregationInput | Prisma.BoostOrderByWithAggregationInput[];
    by: Prisma.BoostScalarFieldEnum[] | Prisma.BoostScalarFieldEnum;
    having?: Prisma.BoostScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BoostCountAggregateInputType | true;
    _avg?: BoostAvgAggregateInputType;
    _sum?: BoostSumAggregateInputType;
    _min?: BoostMinAggregateInputType;
    _max?: BoostMaxAggregateInputType;
};
export type BoostGroupByOutputType = {
    id: bigint;
    wexel_id: bigint;
    token_mint: string;
    amount: bigint;
    value_usd: bigint;
    apy_boost_bp: number;
    price_usd: bigint;
    created_at: Date;
    _count: BoostCountAggregateOutputType | null;
    _avg: BoostAvgAggregateOutputType | null;
    _sum: BoostSumAggregateOutputType | null;
    _min: BoostMinAggregateOutputType | null;
    _max: BoostMaxAggregateOutputType | null;
};
type GetBoostGroupByPayload<T extends BoostGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BoostGroupByOutputType, T['by']> & {
    [P in keyof T & keyof BoostGroupByOutputType]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BoostGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BoostGroupByOutputType[P]>;
}>>;
export type BoostWhereInput = {
    AND?: Prisma.BoostWhereInput | Prisma.BoostWhereInput[];
    OR?: Prisma.BoostWhereInput[];
    NOT?: Prisma.BoostWhereInput | Prisma.BoostWhereInput[];
    id?: Prisma.BigIntFilter<'Boost'> | bigint | number;
    wexel_id?: Prisma.BigIntFilter<'Boost'> | bigint | number;
    token_mint?: Prisma.StringFilter<'Boost'> | string;
    amount?: Prisma.BigIntFilter<'Boost'> | bigint | number;
    value_usd?: Prisma.BigIntFilter<'Boost'> | bigint | number;
    apy_boost_bp?: Prisma.IntFilter<'Boost'> | number;
    price_usd?: Prisma.BigIntFilter<'Boost'> | bigint | number;
    created_at?: Prisma.DateTimeFilter<'Boost'> | Date | string;
    wexel?: Prisma.XOR<Prisma.WexelScalarRelationFilter, Prisma.WexelWhereInput>;
};
export type BoostOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    token_mint?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    value_usd?: Prisma.SortOrder;
    apy_boost_bp?: Prisma.SortOrder;
    price_usd?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    wexel?: Prisma.WexelOrderByWithRelationInput;
};
export type BoostWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number;
    AND?: Prisma.BoostWhereInput | Prisma.BoostWhereInput[];
    OR?: Prisma.BoostWhereInput[];
    NOT?: Prisma.BoostWhereInput | Prisma.BoostWhereInput[];
    wexel_id?: Prisma.BigIntFilter<'Boost'> | bigint | number;
    token_mint?: Prisma.StringFilter<'Boost'> | string;
    amount?: Prisma.BigIntFilter<'Boost'> | bigint | number;
    value_usd?: Prisma.BigIntFilter<'Boost'> | bigint | number;
    apy_boost_bp?: Prisma.IntFilter<'Boost'> | number;
    price_usd?: Prisma.BigIntFilter<'Boost'> | bigint | number;
    created_at?: Prisma.DateTimeFilter<'Boost'> | Date | string;
    wexel?: Prisma.XOR<Prisma.WexelScalarRelationFilter, Prisma.WexelWhereInput>;
}, 'id'>;
export type BoostOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    token_mint?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    value_usd?: Prisma.SortOrder;
    apy_boost_bp?: Prisma.SortOrder;
    price_usd?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.BoostCountOrderByAggregateInput;
    _avg?: Prisma.BoostAvgOrderByAggregateInput;
    _max?: Prisma.BoostMaxOrderByAggregateInput;
    _min?: Prisma.BoostMinOrderByAggregateInput;
    _sum?: Prisma.BoostSumOrderByAggregateInput;
};
export type BoostScalarWhereWithAggregatesInput = {
    AND?: Prisma.BoostScalarWhereWithAggregatesInput | Prisma.BoostScalarWhereWithAggregatesInput[];
    OR?: Prisma.BoostScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BoostScalarWhereWithAggregatesInput | Prisma.BoostScalarWhereWithAggregatesInput[];
    id?: Prisma.BigIntWithAggregatesFilter<'Boost'> | bigint | number;
    wexel_id?: Prisma.BigIntWithAggregatesFilter<'Boost'> | bigint | number;
    token_mint?: Prisma.StringWithAggregatesFilter<'Boost'> | string;
    amount?: Prisma.BigIntWithAggregatesFilter<'Boost'> | bigint | number;
    value_usd?: Prisma.BigIntWithAggregatesFilter<'Boost'> | bigint | number;
    apy_boost_bp?: Prisma.IntWithAggregatesFilter<'Boost'> | number;
    price_usd?: Prisma.BigIntWithAggregatesFilter<'Boost'> | bigint | number;
    created_at?: Prisma.DateTimeWithAggregatesFilter<'Boost'> | Date | string;
};
export type BoostCreateInput = {
    id?: bigint | number;
    token_mint: string;
    amount: bigint | number;
    value_usd: bigint | number;
    apy_boost_bp: number;
    price_usd: bigint | number;
    created_at?: Date | string;
    wexel: Prisma.WexelCreateNestedOneWithoutBoostsInput;
};
export type BoostUncheckedCreateInput = {
    id?: bigint | number;
    wexel_id: bigint | number;
    token_mint: string;
    amount: bigint | number;
    value_usd: bigint | number;
    apy_boost_bp: number;
    price_usd: bigint | number;
    created_at?: Date | string;
};
export type BoostUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    token_mint?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    value_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    apy_boost_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    price_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    wexel?: Prisma.WexelUpdateOneRequiredWithoutBoostsNestedInput;
};
export type BoostUncheckedUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    wexel_id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    token_mint?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    value_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    apy_boost_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    price_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoostCreateManyInput = {
    id?: bigint | number;
    wexel_id: bigint | number;
    token_mint: string;
    amount: bigint | number;
    value_usd: bigint | number;
    apy_boost_bp: number;
    price_usd: bigint | number;
    created_at?: Date | string;
};
export type BoostUpdateManyMutationInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    token_mint?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    value_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    apy_boost_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    price_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoostUncheckedUpdateManyInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    wexel_id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    token_mint?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    value_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    apy_boost_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    price_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoostListRelationFilter = {
    every?: Prisma.BoostWhereInput;
    some?: Prisma.BoostWhereInput;
    none?: Prisma.BoostWhereInput;
};
export type BoostOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BoostCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    token_mint?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    value_usd?: Prisma.SortOrder;
    apy_boost_bp?: Prisma.SortOrder;
    price_usd?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type BoostAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    value_usd?: Prisma.SortOrder;
    apy_boost_bp?: Prisma.SortOrder;
    price_usd?: Prisma.SortOrder;
};
export type BoostMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    token_mint?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    value_usd?: Prisma.SortOrder;
    apy_boost_bp?: Prisma.SortOrder;
    price_usd?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type BoostMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    token_mint?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    value_usd?: Prisma.SortOrder;
    apy_boost_bp?: Prisma.SortOrder;
    price_usd?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type BoostSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    value_usd?: Prisma.SortOrder;
    apy_boost_bp?: Prisma.SortOrder;
    price_usd?: Prisma.SortOrder;
};
export type BoostCreateNestedManyWithoutWexelInput = {
    create?: Prisma.XOR<Prisma.BoostCreateWithoutWexelInput, Prisma.BoostUncheckedCreateWithoutWexelInput> | Prisma.BoostCreateWithoutWexelInput[] | Prisma.BoostUncheckedCreateWithoutWexelInput[];
    connectOrCreate?: Prisma.BoostCreateOrConnectWithoutWexelInput | Prisma.BoostCreateOrConnectWithoutWexelInput[];
    createMany?: Prisma.BoostCreateManyWexelInputEnvelope;
    connect?: Prisma.BoostWhereUniqueInput | Prisma.BoostWhereUniqueInput[];
};
export type BoostUncheckedCreateNestedManyWithoutWexelInput = {
    create?: Prisma.XOR<Prisma.BoostCreateWithoutWexelInput, Prisma.BoostUncheckedCreateWithoutWexelInput> | Prisma.BoostCreateWithoutWexelInput[] | Prisma.BoostUncheckedCreateWithoutWexelInput[];
    connectOrCreate?: Prisma.BoostCreateOrConnectWithoutWexelInput | Prisma.BoostCreateOrConnectWithoutWexelInput[];
    createMany?: Prisma.BoostCreateManyWexelInputEnvelope;
    connect?: Prisma.BoostWhereUniqueInput | Prisma.BoostWhereUniqueInput[];
};
export type BoostUpdateManyWithoutWexelNestedInput = {
    create?: Prisma.XOR<Prisma.BoostCreateWithoutWexelInput, Prisma.BoostUncheckedCreateWithoutWexelInput> | Prisma.BoostCreateWithoutWexelInput[] | Prisma.BoostUncheckedCreateWithoutWexelInput[];
    connectOrCreate?: Prisma.BoostCreateOrConnectWithoutWexelInput | Prisma.BoostCreateOrConnectWithoutWexelInput[];
    upsert?: Prisma.BoostUpsertWithWhereUniqueWithoutWexelInput | Prisma.BoostUpsertWithWhereUniqueWithoutWexelInput[];
    createMany?: Prisma.BoostCreateManyWexelInputEnvelope;
    set?: Prisma.BoostWhereUniqueInput | Prisma.BoostWhereUniqueInput[];
    disconnect?: Prisma.BoostWhereUniqueInput | Prisma.BoostWhereUniqueInput[];
    delete?: Prisma.BoostWhereUniqueInput | Prisma.BoostWhereUniqueInput[];
    connect?: Prisma.BoostWhereUniqueInput | Prisma.BoostWhereUniqueInput[];
    update?: Prisma.BoostUpdateWithWhereUniqueWithoutWexelInput | Prisma.BoostUpdateWithWhereUniqueWithoutWexelInput[];
    updateMany?: Prisma.BoostUpdateManyWithWhereWithoutWexelInput | Prisma.BoostUpdateManyWithWhereWithoutWexelInput[];
    deleteMany?: Prisma.BoostScalarWhereInput | Prisma.BoostScalarWhereInput[];
};
export type BoostUncheckedUpdateManyWithoutWexelNestedInput = {
    create?: Prisma.XOR<Prisma.BoostCreateWithoutWexelInput, Prisma.BoostUncheckedCreateWithoutWexelInput> | Prisma.BoostCreateWithoutWexelInput[] | Prisma.BoostUncheckedCreateWithoutWexelInput[];
    connectOrCreate?: Prisma.BoostCreateOrConnectWithoutWexelInput | Prisma.BoostCreateOrConnectWithoutWexelInput[];
    upsert?: Prisma.BoostUpsertWithWhereUniqueWithoutWexelInput | Prisma.BoostUpsertWithWhereUniqueWithoutWexelInput[];
    createMany?: Prisma.BoostCreateManyWexelInputEnvelope;
    set?: Prisma.BoostWhereUniqueInput | Prisma.BoostWhereUniqueInput[];
    disconnect?: Prisma.BoostWhereUniqueInput | Prisma.BoostWhereUniqueInput[];
    delete?: Prisma.BoostWhereUniqueInput | Prisma.BoostWhereUniqueInput[];
    connect?: Prisma.BoostWhereUniqueInput | Prisma.BoostWhereUniqueInput[];
    update?: Prisma.BoostUpdateWithWhereUniqueWithoutWexelInput | Prisma.BoostUpdateWithWhereUniqueWithoutWexelInput[];
    updateMany?: Prisma.BoostUpdateManyWithWhereWithoutWexelInput | Prisma.BoostUpdateManyWithWhereWithoutWexelInput[];
    deleteMany?: Prisma.BoostScalarWhereInput | Prisma.BoostScalarWhereInput[];
};
export type BoostCreateWithoutWexelInput = {
    id?: bigint | number;
    token_mint: string;
    amount: bigint | number;
    value_usd: bigint | number;
    apy_boost_bp: number;
    price_usd: bigint | number;
    created_at?: Date | string;
};
export type BoostUncheckedCreateWithoutWexelInput = {
    id?: bigint | number;
    token_mint: string;
    amount: bigint | number;
    value_usd: bigint | number;
    apy_boost_bp: number;
    price_usd: bigint | number;
    created_at?: Date | string;
};
export type BoostCreateOrConnectWithoutWexelInput = {
    where: Prisma.BoostWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoostCreateWithoutWexelInput, Prisma.BoostUncheckedCreateWithoutWexelInput>;
};
export type BoostCreateManyWexelInputEnvelope = {
    data: Prisma.BoostCreateManyWexelInput | Prisma.BoostCreateManyWexelInput[];
    skipDuplicates?: boolean;
};
export type BoostUpsertWithWhereUniqueWithoutWexelInput = {
    where: Prisma.BoostWhereUniqueInput;
    update: Prisma.XOR<Prisma.BoostUpdateWithoutWexelInput, Prisma.BoostUncheckedUpdateWithoutWexelInput>;
    create: Prisma.XOR<Prisma.BoostCreateWithoutWexelInput, Prisma.BoostUncheckedCreateWithoutWexelInput>;
};
export type BoostUpdateWithWhereUniqueWithoutWexelInput = {
    where: Prisma.BoostWhereUniqueInput;
    data: Prisma.XOR<Prisma.BoostUpdateWithoutWexelInput, Prisma.BoostUncheckedUpdateWithoutWexelInput>;
};
export type BoostUpdateManyWithWhereWithoutWexelInput = {
    where: Prisma.BoostScalarWhereInput;
    data: Prisma.XOR<Prisma.BoostUpdateManyMutationInput, Prisma.BoostUncheckedUpdateManyWithoutWexelInput>;
};
export type BoostScalarWhereInput = {
    AND?: Prisma.BoostScalarWhereInput | Prisma.BoostScalarWhereInput[];
    OR?: Prisma.BoostScalarWhereInput[];
    NOT?: Prisma.BoostScalarWhereInput | Prisma.BoostScalarWhereInput[];
    id?: Prisma.BigIntFilter<'Boost'> | bigint | number;
    wexel_id?: Prisma.BigIntFilter<'Boost'> | bigint | number;
    token_mint?: Prisma.StringFilter<'Boost'> | string;
    amount?: Prisma.BigIntFilter<'Boost'> | bigint | number;
    value_usd?: Prisma.BigIntFilter<'Boost'> | bigint | number;
    apy_boost_bp?: Prisma.IntFilter<'Boost'> | number;
    price_usd?: Prisma.BigIntFilter<'Boost'> | bigint | number;
    created_at?: Prisma.DateTimeFilter<'Boost'> | Date | string;
};
export type BoostCreateManyWexelInput = {
    id?: bigint | number;
    token_mint: string;
    amount: bigint | number;
    value_usd: bigint | number;
    apy_boost_bp: number;
    price_usd: bigint | number;
    created_at?: Date | string;
};
export type BoostUpdateWithoutWexelInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    token_mint?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    value_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    apy_boost_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    price_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoostUncheckedUpdateWithoutWexelInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    token_mint?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    value_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    apy_boost_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    price_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoostUncheckedUpdateManyWithoutWexelInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    token_mint?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    value_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    apy_boost_bp?: Prisma.IntFieldUpdateOperationsInput | number;
    price_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoostSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    wexel_id?: boolean;
    token_mint?: boolean;
    amount?: boolean;
    value_usd?: boolean;
    apy_boost_bp?: boolean;
    price_usd?: boolean;
    created_at?: boolean;
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
}, ExtArgs['result']['boost']>;
export type BoostSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    wexel_id?: boolean;
    token_mint?: boolean;
    amount?: boolean;
    value_usd?: boolean;
    apy_boost_bp?: boolean;
    price_usd?: boolean;
    created_at?: boolean;
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
}, ExtArgs['result']['boost']>;
export type BoostSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    wexel_id?: boolean;
    token_mint?: boolean;
    amount?: boolean;
    value_usd?: boolean;
    apy_boost_bp?: boolean;
    price_usd?: boolean;
    created_at?: boolean;
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
}, ExtArgs['result']['boost']>;
export type BoostSelectScalar = {
    id?: boolean;
    wexel_id?: boolean;
    token_mint?: boolean;
    amount?: boolean;
    value_usd?: boolean;
    apy_boost_bp?: boolean;
    price_usd?: boolean;
    created_at?: boolean;
};
export type BoostOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<'id' | 'wexel_id' | 'token_mint' | 'amount' | 'value_usd' | 'apy_boost_bp' | 'price_usd' | 'created_at', ExtArgs['result']['boost']>;
export type BoostInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
};
export type BoostIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
};
export type BoostIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
};
export type $BoostPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: 'Boost';
    objects: {
        wexel: Prisma.$WexelPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: bigint;
        wexel_id: bigint;
        token_mint: string;
        amount: bigint;
        value_usd: bigint;
        apy_boost_bp: number;
        price_usd: bigint;
        created_at: Date;
    }, ExtArgs['result']['boost']>;
    composites: {};
};
export type BoostGetPayload<S extends boolean | null | undefined | BoostDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BoostPayload, S>;
export type BoostCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BoostFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BoostCountAggregateInputType | true;
};
export interface BoostDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Boost'];
        meta: {
            name: 'Boost';
        };
    };
    findUnique<T extends BoostFindUniqueArgs>(args: Prisma.SelectSubset<T, BoostFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BoostClient<runtime.Types.Result.GetResult<Prisma.$BoostPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BoostFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BoostFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BoostClient<runtime.Types.Result.GetResult<Prisma.$BoostPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BoostFindFirstArgs>(args?: Prisma.SelectSubset<T, BoostFindFirstArgs<ExtArgs>>): Prisma.Prisma__BoostClient<runtime.Types.Result.GetResult<Prisma.$BoostPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BoostFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BoostFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BoostClient<runtime.Types.Result.GetResult<Prisma.$BoostPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BoostFindManyArgs>(args?: Prisma.SelectSubset<T, BoostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoostPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>;
    create<T extends BoostCreateArgs>(args: Prisma.SelectSubset<T, BoostCreateArgs<ExtArgs>>): Prisma.Prisma__BoostClient<runtime.Types.Result.GetResult<Prisma.$BoostPayload<ExtArgs>, T, 'create', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BoostCreateManyArgs>(args?: Prisma.SelectSubset<T, BoostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BoostCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BoostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoostPayload<ExtArgs>, T, 'createManyAndReturn', GlobalOmitOptions>>;
    delete<T extends BoostDeleteArgs>(args: Prisma.SelectSubset<T, BoostDeleteArgs<ExtArgs>>): Prisma.Prisma__BoostClient<runtime.Types.Result.GetResult<Prisma.$BoostPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BoostUpdateArgs>(args: Prisma.SelectSubset<T, BoostUpdateArgs<ExtArgs>>): Prisma.Prisma__BoostClient<runtime.Types.Result.GetResult<Prisma.$BoostPayload<ExtArgs>, T, 'update', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BoostDeleteManyArgs>(args?: Prisma.SelectSubset<T, BoostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BoostUpdateManyArgs>(args: Prisma.SelectSubset<T, BoostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BoostUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BoostUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoostPayload<ExtArgs>, T, 'updateManyAndReturn', GlobalOmitOptions>>;
    upsert<T extends BoostUpsertArgs>(args: Prisma.SelectSubset<T, BoostUpsertArgs<ExtArgs>>): Prisma.Prisma__BoostClient<runtime.Types.Result.GetResult<Prisma.$BoostPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BoostCountArgs>(args?: Prisma.Subset<T, BoostCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BoostCountAggregateOutputType> : number>;
    aggregate<T extends BoostAggregateArgs>(args: Prisma.Subset<T, BoostAggregateArgs>): Prisma.PrismaPromise<GetBoostAggregateType<T>>;
    groupBy<T extends BoostGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BoostGroupByArgs['orderBy'];
    } : {
        orderBy?: BoostGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BoostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBoostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BoostFieldRefs;
}
export interface Prisma__BoostClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    wexel<T extends Prisma.WexelDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WexelDefaultArgs<ExtArgs>>): Prisma.Prisma__WexelClient<runtime.Types.Result.GetResult<Prisma.$WexelPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BoostFieldRefs {
    readonly id: Prisma.FieldRef<'Boost', 'BigInt'>;
    readonly wexel_id: Prisma.FieldRef<'Boost', 'BigInt'>;
    readonly token_mint: Prisma.FieldRef<'Boost', 'String'>;
    readonly amount: Prisma.FieldRef<'Boost', 'BigInt'>;
    readonly value_usd: Prisma.FieldRef<'Boost', 'BigInt'>;
    readonly apy_boost_bp: Prisma.FieldRef<'Boost', 'Int'>;
    readonly price_usd: Prisma.FieldRef<'Boost', 'BigInt'>;
    readonly created_at: Prisma.FieldRef<'Boost', 'DateTime'>;
}
export type BoostFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoostSelect<ExtArgs> | null;
    omit?: Prisma.BoostOmit<ExtArgs> | null;
    include?: Prisma.BoostInclude<ExtArgs> | null;
    where: Prisma.BoostWhereUniqueInput;
};
export type BoostFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoostSelect<ExtArgs> | null;
    omit?: Prisma.BoostOmit<ExtArgs> | null;
    include?: Prisma.BoostInclude<ExtArgs> | null;
    where: Prisma.BoostWhereUniqueInput;
};
export type BoostFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoostSelect<ExtArgs> | null;
    omit?: Prisma.BoostOmit<ExtArgs> | null;
    include?: Prisma.BoostInclude<ExtArgs> | null;
    where?: Prisma.BoostWhereInput;
    orderBy?: Prisma.BoostOrderByWithRelationInput | Prisma.BoostOrderByWithRelationInput[];
    cursor?: Prisma.BoostWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BoostScalarFieldEnum | Prisma.BoostScalarFieldEnum[];
};
export type BoostFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoostSelect<ExtArgs> | null;
    omit?: Prisma.BoostOmit<ExtArgs> | null;
    include?: Prisma.BoostInclude<ExtArgs> | null;
    where?: Prisma.BoostWhereInput;
    orderBy?: Prisma.BoostOrderByWithRelationInput | Prisma.BoostOrderByWithRelationInput[];
    cursor?: Prisma.BoostWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BoostScalarFieldEnum | Prisma.BoostScalarFieldEnum[];
};
export type BoostFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoostSelect<ExtArgs> | null;
    omit?: Prisma.BoostOmit<ExtArgs> | null;
    include?: Prisma.BoostInclude<ExtArgs> | null;
    where?: Prisma.BoostWhereInput;
    orderBy?: Prisma.BoostOrderByWithRelationInput | Prisma.BoostOrderByWithRelationInput[];
    cursor?: Prisma.BoostWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BoostScalarFieldEnum | Prisma.BoostScalarFieldEnum[];
};
export type BoostCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoostSelect<ExtArgs> | null;
    omit?: Prisma.BoostOmit<ExtArgs> | null;
    include?: Prisma.BoostInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoostCreateInput, Prisma.BoostUncheckedCreateInput>;
};
export type BoostCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BoostCreateManyInput | Prisma.BoostCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BoostCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoostSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BoostOmit<ExtArgs> | null;
    data: Prisma.BoostCreateManyInput | Prisma.BoostCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BoostIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BoostUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoostSelect<ExtArgs> | null;
    omit?: Prisma.BoostOmit<ExtArgs> | null;
    include?: Prisma.BoostInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoostUpdateInput, Prisma.BoostUncheckedUpdateInput>;
    where: Prisma.BoostWhereUniqueInput;
};
export type BoostUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BoostUpdateManyMutationInput, Prisma.BoostUncheckedUpdateManyInput>;
    where?: Prisma.BoostWhereInput;
    limit?: number;
};
export type BoostUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoostSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BoostOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoostUpdateManyMutationInput, Prisma.BoostUncheckedUpdateManyInput>;
    where?: Prisma.BoostWhereInput;
    limit?: number;
    include?: Prisma.BoostIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BoostUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoostSelect<ExtArgs> | null;
    omit?: Prisma.BoostOmit<ExtArgs> | null;
    include?: Prisma.BoostInclude<ExtArgs> | null;
    where: Prisma.BoostWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoostCreateInput, Prisma.BoostUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BoostUpdateInput, Prisma.BoostUncheckedUpdateInput>;
};
export type BoostDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoostSelect<ExtArgs> | null;
    omit?: Prisma.BoostOmit<ExtArgs> | null;
    include?: Prisma.BoostInclude<ExtArgs> | null;
    where: Prisma.BoostWhereUniqueInput;
};
export type BoostDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoostWhereInput;
    limit?: number;
};
export type BoostDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoostSelect<ExtArgs> | null;
    omit?: Prisma.BoostOmit<ExtArgs> | null;
    include?: Prisma.BoostInclude<ExtArgs> | null;
};
export {};
