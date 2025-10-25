import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
export type DepositModel = runtime.Types.Result.DefaultSelection<Prisma.$DepositPayload>;
export type AggregateDeposit = {
    _count: DepositCountAggregateOutputType | null;
    _avg: DepositAvgAggregateOutputType | null;
    _sum: DepositSumAggregateOutputType | null;
    _min: DepositMinAggregateOutputType | null;
    _max: DepositMaxAggregateOutputType | null;
};
export type DepositAvgAggregateOutputType = {
    id: number | null;
    pool_id: number | null;
    amount_usd: number | null;
    wexel_id: number | null;
};
export type DepositSumAggregateOutputType = {
    id: bigint | null;
    pool_id: number | null;
    amount_usd: bigint | null;
    wexel_id: bigint | null;
};
export type DepositMinAggregateOutputType = {
    id: bigint | null;
    pool_id: number | null;
    user_address: string | null;
    amount_usd: bigint | null;
    wexel_id: bigint | null;
    tx_hash: string | null;
    status: string | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type DepositMaxAggregateOutputType = {
    id: bigint | null;
    pool_id: number | null;
    user_address: string | null;
    amount_usd: bigint | null;
    wexel_id: bigint | null;
    tx_hash: string | null;
    status: string | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type DepositCountAggregateOutputType = {
    id: number;
    pool_id: number;
    user_address: number;
    amount_usd: number;
    wexel_id: number;
    tx_hash: number;
    status: number;
    created_at: number;
    updated_at: number;
    _all: number;
};
export type DepositAvgAggregateInputType = {
    id?: true;
    pool_id?: true;
    amount_usd?: true;
    wexel_id?: true;
};
export type DepositSumAggregateInputType = {
    id?: true;
    pool_id?: true;
    amount_usd?: true;
    wexel_id?: true;
};
export type DepositMinAggregateInputType = {
    id?: true;
    pool_id?: true;
    user_address?: true;
    amount_usd?: true;
    wexel_id?: true;
    tx_hash?: true;
    status?: true;
    created_at?: true;
    updated_at?: true;
};
export type DepositMaxAggregateInputType = {
    id?: true;
    pool_id?: true;
    user_address?: true;
    amount_usd?: true;
    wexel_id?: true;
    tx_hash?: true;
    status?: true;
    created_at?: true;
    updated_at?: true;
};
export type DepositCountAggregateInputType = {
    id?: true;
    pool_id?: true;
    user_address?: true;
    amount_usd?: true;
    wexel_id?: true;
    tx_hash?: true;
    status?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
};
export type DepositAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DepositWhereInput;
    orderBy?: Prisma.DepositOrderByWithRelationInput | Prisma.DepositOrderByWithRelationInput[];
    cursor?: Prisma.DepositWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DepositCountAggregateInputType;
    _avg?: DepositAvgAggregateInputType;
    _sum?: DepositSumAggregateInputType;
    _min?: DepositMinAggregateInputType;
    _max?: DepositMaxAggregateInputType;
};
export type GetDepositAggregateType<T extends DepositAggregateArgs> = {
    [P in keyof T & keyof AggregateDeposit]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDeposit[P]> : Prisma.GetScalarType<T[P], AggregateDeposit[P]>;
};
export type DepositGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DepositWhereInput;
    orderBy?: Prisma.DepositOrderByWithAggregationInput | Prisma.DepositOrderByWithAggregationInput[];
    by: Prisma.DepositScalarFieldEnum[] | Prisma.DepositScalarFieldEnum;
    having?: Prisma.DepositScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DepositCountAggregateInputType | true;
    _avg?: DepositAvgAggregateInputType;
    _sum?: DepositSumAggregateInputType;
    _min?: DepositMinAggregateInputType;
    _max?: DepositMaxAggregateInputType;
};
export type DepositGroupByOutputType = {
    id: bigint;
    pool_id: number;
    user_address: string;
    amount_usd: bigint;
    wexel_id: bigint | null;
    tx_hash: string | null;
    status: string;
    created_at: Date;
    updated_at: Date;
    _count: DepositCountAggregateOutputType | null;
    _avg: DepositAvgAggregateOutputType | null;
    _sum: DepositSumAggregateOutputType | null;
    _min: DepositMinAggregateOutputType | null;
    _max: DepositMaxAggregateOutputType | null;
};
type GetDepositGroupByPayload<T extends DepositGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DepositGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DepositGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DepositGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DepositGroupByOutputType[P]>;
}>>;
export type DepositWhereInput = {
    AND?: Prisma.DepositWhereInput | Prisma.DepositWhereInput[];
    OR?: Prisma.DepositWhereInput[];
    NOT?: Prisma.DepositWhereInput | Prisma.DepositWhereInput[];
    id?: Prisma.BigIntFilter<"Deposit"> | bigint | number;
    pool_id?: Prisma.IntFilter<"Deposit"> | number;
    user_address?: Prisma.StringFilter<"Deposit"> | string;
    amount_usd?: Prisma.BigIntFilter<"Deposit"> | bigint | number;
    wexel_id?: Prisma.BigIntNullableFilter<"Deposit"> | bigint | number | null;
    tx_hash?: Prisma.StringNullableFilter<"Deposit"> | string | null;
    status?: Prisma.StringFilter<"Deposit"> | string;
    created_at?: Prisma.DateTimeFilter<"Deposit"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Deposit"> | Date | string;
    pool?: Prisma.XOR<Prisma.PoolScalarRelationFilter, Prisma.PoolWhereInput>;
};
export type DepositOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    pool_id?: Prisma.SortOrder;
    user_address?: Prisma.SortOrder;
    amount_usd?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    tx_hash?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    pool?: Prisma.PoolOrderByWithRelationInput;
};
export type DepositWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number;
    AND?: Prisma.DepositWhereInput | Prisma.DepositWhereInput[];
    OR?: Prisma.DepositWhereInput[];
    NOT?: Prisma.DepositWhereInput | Prisma.DepositWhereInput[];
    pool_id?: Prisma.IntFilter<"Deposit"> | number;
    user_address?: Prisma.StringFilter<"Deposit"> | string;
    amount_usd?: Prisma.BigIntFilter<"Deposit"> | bigint | number;
    wexel_id?: Prisma.BigIntNullableFilter<"Deposit"> | bigint | number | null;
    tx_hash?: Prisma.StringNullableFilter<"Deposit"> | string | null;
    status?: Prisma.StringFilter<"Deposit"> | string;
    created_at?: Prisma.DateTimeFilter<"Deposit"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Deposit"> | Date | string;
    pool?: Prisma.XOR<Prisma.PoolScalarRelationFilter, Prisma.PoolWhereInput>;
}, "id">;
export type DepositOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    pool_id?: Prisma.SortOrder;
    user_address?: Prisma.SortOrder;
    amount_usd?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    tx_hash?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    _count?: Prisma.DepositCountOrderByAggregateInput;
    _avg?: Prisma.DepositAvgOrderByAggregateInput;
    _max?: Prisma.DepositMaxOrderByAggregateInput;
    _min?: Prisma.DepositMinOrderByAggregateInput;
    _sum?: Prisma.DepositSumOrderByAggregateInput;
};
export type DepositScalarWhereWithAggregatesInput = {
    AND?: Prisma.DepositScalarWhereWithAggregatesInput | Prisma.DepositScalarWhereWithAggregatesInput[];
    OR?: Prisma.DepositScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DepositScalarWhereWithAggregatesInput | Prisma.DepositScalarWhereWithAggregatesInput[];
    id?: Prisma.BigIntWithAggregatesFilter<"Deposit"> | bigint | number;
    pool_id?: Prisma.IntWithAggregatesFilter<"Deposit"> | number;
    user_address?: Prisma.StringWithAggregatesFilter<"Deposit"> | string;
    amount_usd?: Prisma.BigIntWithAggregatesFilter<"Deposit"> | bigint | number;
    wexel_id?: Prisma.BigIntNullableWithAggregatesFilter<"Deposit"> | bigint | number | null;
    tx_hash?: Prisma.StringNullableWithAggregatesFilter<"Deposit"> | string | null;
    status?: Prisma.StringWithAggregatesFilter<"Deposit"> | string;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"Deposit"> | Date | string;
    updated_at?: Prisma.DateTimeWithAggregatesFilter<"Deposit"> | Date | string;
};
export type DepositCreateInput = {
    id?: bigint | number;
    user_address: string;
    amount_usd: bigint | number;
    wexel_id?: bigint | number | null;
    tx_hash?: string | null;
    status?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    pool: Prisma.PoolCreateNestedOneWithoutDepositsInput;
};
export type DepositUncheckedCreateInput = {
    id?: bigint | number;
    pool_id: number;
    user_address: string;
    amount_usd: bigint | number;
    wexel_id?: bigint | number | null;
    tx_hash?: string | null;
    status?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type DepositUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    user_address?: Prisma.StringFieldUpdateOperationsInput | string;
    amount_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    wexel_id?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    tx_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pool?: Prisma.PoolUpdateOneRequiredWithoutDepositsNestedInput;
};
export type DepositUncheckedUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    pool_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_address?: Prisma.StringFieldUpdateOperationsInput | string;
    amount_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    wexel_id?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    tx_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DepositCreateManyInput = {
    id?: bigint | number;
    pool_id: number;
    user_address: string;
    amount_usd: bigint | number;
    wexel_id?: bigint | number | null;
    tx_hash?: string | null;
    status?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type DepositUpdateManyMutationInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    user_address?: Prisma.StringFieldUpdateOperationsInput | string;
    amount_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    wexel_id?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    tx_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DepositUncheckedUpdateManyInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    pool_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_address?: Prisma.StringFieldUpdateOperationsInput | string;
    amount_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    wexel_id?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    tx_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DepositListRelationFilter = {
    every?: Prisma.DepositWhereInput;
    some?: Prisma.DepositWhereInput;
    none?: Prisma.DepositWhereInput;
};
export type DepositOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type DepositCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    pool_id?: Prisma.SortOrder;
    user_address?: Prisma.SortOrder;
    amount_usd?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    tx_hash?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type DepositAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    pool_id?: Prisma.SortOrder;
    amount_usd?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
};
export type DepositMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    pool_id?: Prisma.SortOrder;
    user_address?: Prisma.SortOrder;
    amount_usd?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    tx_hash?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type DepositMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    pool_id?: Prisma.SortOrder;
    user_address?: Prisma.SortOrder;
    amount_usd?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    tx_hash?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type DepositSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    pool_id?: Prisma.SortOrder;
    amount_usd?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
};
export type DepositCreateNestedManyWithoutPoolInput = {
    create?: Prisma.XOR<Prisma.DepositCreateWithoutPoolInput, Prisma.DepositUncheckedCreateWithoutPoolInput> | Prisma.DepositCreateWithoutPoolInput[] | Prisma.DepositUncheckedCreateWithoutPoolInput[];
    connectOrCreate?: Prisma.DepositCreateOrConnectWithoutPoolInput | Prisma.DepositCreateOrConnectWithoutPoolInput[];
    createMany?: Prisma.DepositCreateManyPoolInputEnvelope;
    connect?: Prisma.DepositWhereUniqueInput | Prisma.DepositWhereUniqueInput[];
};
export type DepositUncheckedCreateNestedManyWithoutPoolInput = {
    create?: Prisma.XOR<Prisma.DepositCreateWithoutPoolInput, Prisma.DepositUncheckedCreateWithoutPoolInput> | Prisma.DepositCreateWithoutPoolInput[] | Prisma.DepositUncheckedCreateWithoutPoolInput[];
    connectOrCreate?: Prisma.DepositCreateOrConnectWithoutPoolInput | Prisma.DepositCreateOrConnectWithoutPoolInput[];
    createMany?: Prisma.DepositCreateManyPoolInputEnvelope;
    connect?: Prisma.DepositWhereUniqueInput | Prisma.DepositWhereUniqueInput[];
};
export type DepositUpdateManyWithoutPoolNestedInput = {
    create?: Prisma.XOR<Prisma.DepositCreateWithoutPoolInput, Prisma.DepositUncheckedCreateWithoutPoolInput> | Prisma.DepositCreateWithoutPoolInput[] | Prisma.DepositUncheckedCreateWithoutPoolInput[];
    connectOrCreate?: Prisma.DepositCreateOrConnectWithoutPoolInput | Prisma.DepositCreateOrConnectWithoutPoolInput[];
    upsert?: Prisma.DepositUpsertWithWhereUniqueWithoutPoolInput | Prisma.DepositUpsertWithWhereUniqueWithoutPoolInput[];
    createMany?: Prisma.DepositCreateManyPoolInputEnvelope;
    set?: Prisma.DepositWhereUniqueInput | Prisma.DepositWhereUniqueInput[];
    disconnect?: Prisma.DepositWhereUniqueInput | Prisma.DepositWhereUniqueInput[];
    delete?: Prisma.DepositWhereUniqueInput | Prisma.DepositWhereUniqueInput[];
    connect?: Prisma.DepositWhereUniqueInput | Prisma.DepositWhereUniqueInput[];
    update?: Prisma.DepositUpdateWithWhereUniqueWithoutPoolInput | Prisma.DepositUpdateWithWhereUniqueWithoutPoolInput[];
    updateMany?: Prisma.DepositUpdateManyWithWhereWithoutPoolInput | Prisma.DepositUpdateManyWithWhereWithoutPoolInput[];
    deleteMany?: Prisma.DepositScalarWhereInput | Prisma.DepositScalarWhereInput[];
};
export type DepositUncheckedUpdateManyWithoutPoolNestedInput = {
    create?: Prisma.XOR<Prisma.DepositCreateWithoutPoolInput, Prisma.DepositUncheckedCreateWithoutPoolInput> | Prisma.DepositCreateWithoutPoolInput[] | Prisma.DepositUncheckedCreateWithoutPoolInput[];
    connectOrCreate?: Prisma.DepositCreateOrConnectWithoutPoolInput | Prisma.DepositCreateOrConnectWithoutPoolInput[];
    upsert?: Prisma.DepositUpsertWithWhereUniqueWithoutPoolInput | Prisma.DepositUpsertWithWhereUniqueWithoutPoolInput[];
    createMany?: Prisma.DepositCreateManyPoolInputEnvelope;
    set?: Prisma.DepositWhereUniqueInput | Prisma.DepositWhereUniqueInput[];
    disconnect?: Prisma.DepositWhereUniqueInput | Prisma.DepositWhereUniqueInput[];
    delete?: Prisma.DepositWhereUniqueInput | Prisma.DepositWhereUniqueInput[];
    connect?: Prisma.DepositWhereUniqueInput | Prisma.DepositWhereUniqueInput[];
    update?: Prisma.DepositUpdateWithWhereUniqueWithoutPoolInput | Prisma.DepositUpdateWithWhereUniqueWithoutPoolInput[];
    updateMany?: Prisma.DepositUpdateManyWithWhereWithoutPoolInput | Prisma.DepositUpdateManyWithWhereWithoutPoolInput[];
    deleteMany?: Prisma.DepositScalarWhereInput | Prisma.DepositScalarWhereInput[];
};
export type DepositCreateWithoutPoolInput = {
    id?: bigint | number;
    user_address: string;
    amount_usd: bigint | number;
    wexel_id?: bigint | number | null;
    tx_hash?: string | null;
    status?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type DepositUncheckedCreateWithoutPoolInput = {
    id?: bigint | number;
    user_address: string;
    amount_usd: bigint | number;
    wexel_id?: bigint | number | null;
    tx_hash?: string | null;
    status?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type DepositCreateOrConnectWithoutPoolInput = {
    where: Prisma.DepositWhereUniqueInput;
    create: Prisma.XOR<Prisma.DepositCreateWithoutPoolInput, Prisma.DepositUncheckedCreateWithoutPoolInput>;
};
export type DepositCreateManyPoolInputEnvelope = {
    data: Prisma.DepositCreateManyPoolInput | Prisma.DepositCreateManyPoolInput[];
    skipDuplicates?: boolean;
};
export type DepositUpsertWithWhereUniqueWithoutPoolInput = {
    where: Prisma.DepositWhereUniqueInput;
    update: Prisma.XOR<Prisma.DepositUpdateWithoutPoolInput, Prisma.DepositUncheckedUpdateWithoutPoolInput>;
    create: Prisma.XOR<Prisma.DepositCreateWithoutPoolInput, Prisma.DepositUncheckedCreateWithoutPoolInput>;
};
export type DepositUpdateWithWhereUniqueWithoutPoolInput = {
    where: Prisma.DepositWhereUniqueInput;
    data: Prisma.XOR<Prisma.DepositUpdateWithoutPoolInput, Prisma.DepositUncheckedUpdateWithoutPoolInput>;
};
export type DepositUpdateManyWithWhereWithoutPoolInput = {
    where: Prisma.DepositScalarWhereInput;
    data: Prisma.XOR<Prisma.DepositUpdateManyMutationInput, Prisma.DepositUncheckedUpdateManyWithoutPoolInput>;
};
export type DepositScalarWhereInput = {
    AND?: Prisma.DepositScalarWhereInput | Prisma.DepositScalarWhereInput[];
    OR?: Prisma.DepositScalarWhereInput[];
    NOT?: Prisma.DepositScalarWhereInput | Prisma.DepositScalarWhereInput[];
    id?: Prisma.BigIntFilter<"Deposit"> | bigint | number;
    pool_id?: Prisma.IntFilter<"Deposit"> | number;
    user_address?: Prisma.StringFilter<"Deposit"> | string;
    amount_usd?: Prisma.BigIntFilter<"Deposit"> | bigint | number;
    wexel_id?: Prisma.BigIntNullableFilter<"Deposit"> | bigint | number | null;
    tx_hash?: Prisma.StringNullableFilter<"Deposit"> | string | null;
    status?: Prisma.StringFilter<"Deposit"> | string;
    created_at?: Prisma.DateTimeFilter<"Deposit"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Deposit"> | Date | string;
};
export type DepositCreateManyPoolInput = {
    id?: bigint | number;
    user_address: string;
    amount_usd: bigint | number;
    wexel_id?: bigint | number | null;
    tx_hash?: string | null;
    status?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type DepositUpdateWithoutPoolInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    user_address?: Prisma.StringFieldUpdateOperationsInput | string;
    amount_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    wexel_id?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    tx_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DepositUncheckedUpdateWithoutPoolInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    user_address?: Prisma.StringFieldUpdateOperationsInput | string;
    amount_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    wexel_id?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    tx_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DepositUncheckedUpdateManyWithoutPoolInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    user_address?: Prisma.StringFieldUpdateOperationsInput | string;
    amount_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    wexel_id?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    tx_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DepositSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    pool_id?: boolean;
    user_address?: boolean;
    amount_usd?: boolean;
    wexel_id?: boolean;
    tx_hash?: boolean;
    status?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    pool?: boolean | Prisma.PoolDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["deposit"]>;
export type DepositSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    pool_id?: boolean;
    user_address?: boolean;
    amount_usd?: boolean;
    wexel_id?: boolean;
    tx_hash?: boolean;
    status?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    pool?: boolean | Prisma.PoolDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["deposit"]>;
export type DepositSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    pool_id?: boolean;
    user_address?: boolean;
    amount_usd?: boolean;
    wexel_id?: boolean;
    tx_hash?: boolean;
    status?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    pool?: boolean | Prisma.PoolDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["deposit"]>;
export type DepositSelectScalar = {
    id?: boolean;
    pool_id?: boolean;
    user_address?: boolean;
    amount_usd?: boolean;
    wexel_id?: boolean;
    tx_hash?: boolean;
    status?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
};
export type DepositOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "pool_id" | "user_address" | "amount_usd" | "wexel_id" | "tx_hash" | "status" | "created_at" | "updated_at", ExtArgs["result"]["deposit"]>;
export type DepositInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pool?: boolean | Prisma.PoolDefaultArgs<ExtArgs>;
};
export type DepositIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pool?: boolean | Prisma.PoolDefaultArgs<ExtArgs>;
};
export type DepositIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pool?: boolean | Prisma.PoolDefaultArgs<ExtArgs>;
};
export type $DepositPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Deposit";
    objects: {
        pool: Prisma.$PoolPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: bigint;
        pool_id: number;
        user_address: string;
        amount_usd: bigint;
        wexel_id: bigint | null;
        tx_hash: string | null;
        status: string;
        created_at: Date;
        updated_at: Date;
    }, ExtArgs["result"]["deposit"]>;
    composites: {};
};
export type DepositGetPayload<S extends boolean | null | undefined | DepositDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DepositPayload, S>;
export type DepositCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DepositFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DepositCountAggregateInputType | true;
};
export interface DepositDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Deposit'];
        meta: {
            name: 'Deposit';
        };
    };
    findUnique<T extends DepositFindUniqueArgs>(args: Prisma.SelectSubset<T, DepositFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DepositClient<runtime.Types.Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DepositFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DepositFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DepositClient<runtime.Types.Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DepositFindFirstArgs>(args?: Prisma.SelectSubset<T, DepositFindFirstArgs<ExtArgs>>): Prisma.Prisma__DepositClient<runtime.Types.Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DepositFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DepositFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DepositClient<runtime.Types.Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DepositFindManyArgs>(args?: Prisma.SelectSubset<T, DepositFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DepositCreateArgs>(args: Prisma.SelectSubset<T, DepositCreateArgs<ExtArgs>>): Prisma.Prisma__DepositClient<runtime.Types.Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DepositCreateManyArgs>(args?: Prisma.SelectSubset<T, DepositCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DepositCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DepositCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DepositDeleteArgs>(args: Prisma.SelectSubset<T, DepositDeleteArgs<ExtArgs>>): Prisma.Prisma__DepositClient<runtime.Types.Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DepositUpdateArgs>(args: Prisma.SelectSubset<T, DepositUpdateArgs<ExtArgs>>): Prisma.Prisma__DepositClient<runtime.Types.Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DepositDeleteManyArgs>(args?: Prisma.SelectSubset<T, DepositDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DepositUpdateManyArgs>(args: Prisma.SelectSubset<T, DepositUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DepositUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DepositUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DepositUpsertArgs>(args: Prisma.SelectSubset<T, DepositUpsertArgs<ExtArgs>>): Prisma.Prisma__DepositClient<runtime.Types.Result.GetResult<Prisma.$DepositPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DepositCountArgs>(args?: Prisma.Subset<T, DepositCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DepositCountAggregateOutputType> : number>;
    aggregate<T extends DepositAggregateArgs>(args: Prisma.Subset<T, DepositAggregateArgs>): Prisma.PrismaPromise<GetDepositAggregateType<T>>;
    groupBy<T extends DepositGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DepositGroupByArgs['orderBy'];
    } : {
        orderBy?: DepositGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DepositGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDepositGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DepositFieldRefs;
}
export interface Prisma__DepositClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    pool<T extends Prisma.PoolDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PoolDefaultArgs<ExtArgs>>): Prisma.Prisma__PoolClient<runtime.Types.Result.GetResult<Prisma.$PoolPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DepositFieldRefs {
    readonly id: Prisma.FieldRef<"Deposit", 'BigInt'>;
    readonly pool_id: Prisma.FieldRef<"Deposit", 'Int'>;
    readonly user_address: Prisma.FieldRef<"Deposit", 'String'>;
    readonly amount_usd: Prisma.FieldRef<"Deposit", 'BigInt'>;
    readonly wexel_id: Prisma.FieldRef<"Deposit", 'BigInt'>;
    readonly tx_hash: Prisma.FieldRef<"Deposit", 'String'>;
    readonly status: Prisma.FieldRef<"Deposit", 'String'>;
    readonly created_at: Prisma.FieldRef<"Deposit", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"Deposit", 'DateTime'>;
}
export type DepositFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DepositSelect<ExtArgs> | null;
    omit?: Prisma.DepositOmit<ExtArgs> | null;
    include?: Prisma.DepositInclude<ExtArgs> | null;
    where: Prisma.DepositWhereUniqueInput;
};
export type DepositFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DepositSelect<ExtArgs> | null;
    omit?: Prisma.DepositOmit<ExtArgs> | null;
    include?: Prisma.DepositInclude<ExtArgs> | null;
    where: Prisma.DepositWhereUniqueInput;
};
export type DepositFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DepositFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DepositFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DepositCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DepositSelect<ExtArgs> | null;
    omit?: Prisma.DepositOmit<ExtArgs> | null;
    include?: Prisma.DepositInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DepositCreateInput, Prisma.DepositUncheckedCreateInput>;
};
export type DepositCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DepositCreateManyInput | Prisma.DepositCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DepositCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DepositSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DepositOmit<ExtArgs> | null;
    data: Prisma.DepositCreateManyInput | Prisma.DepositCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.DepositIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type DepositUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DepositSelect<ExtArgs> | null;
    omit?: Prisma.DepositOmit<ExtArgs> | null;
    include?: Prisma.DepositInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DepositUpdateInput, Prisma.DepositUncheckedUpdateInput>;
    where: Prisma.DepositWhereUniqueInput;
};
export type DepositUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DepositUpdateManyMutationInput, Prisma.DepositUncheckedUpdateManyInput>;
    where?: Prisma.DepositWhereInput;
    limit?: number;
};
export type DepositUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DepositSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DepositOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DepositUpdateManyMutationInput, Prisma.DepositUncheckedUpdateManyInput>;
    where?: Prisma.DepositWhereInput;
    limit?: number;
    include?: Prisma.DepositIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type DepositUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DepositSelect<ExtArgs> | null;
    omit?: Prisma.DepositOmit<ExtArgs> | null;
    include?: Prisma.DepositInclude<ExtArgs> | null;
    where: Prisma.DepositWhereUniqueInput;
    create: Prisma.XOR<Prisma.DepositCreateInput, Prisma.DepositUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DepositUpdateInput, Prisma.DepositUncheckedUpdateInput>;
};
export type DepositDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DepositSelect<ExtArgs> | null;
    omit?: Prisma.DepositOmit<ExtArgs> | null;
    include?: Prisma.DepositInclude<ExtArgs> | null;
    where: Prisma.DepositWhereUniqueInput;
};
export type DepositDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DepositWhereInput;
    limit?: number;
};
export type DepositDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DepositSelect<ExtArgs> | null;
    omit?: Prisma.DepositOmit<ExtArgs> | null;
    include?: Prisma.DepositInclude<ExtArgs> | null;
};
export {};
