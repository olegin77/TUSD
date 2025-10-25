import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ClaimModel = runtime.Types.Result.DefaultSelection<Prisma.$ClaimPayload>;
export type AggregateClaim = {
    _count: ClaimCountAggregateOutputType | null;
    _avg: ClaimAvgAggregateOutputType | null;
    _sum: ClaimSumAggregateOutputType | null;
    _min: ClaimMinAggregateOutputType | null;
    _max: ClaimMaxAggregateOutputType | null;
};
export type ClaimAvgAggregateOutputType = {
    id: number | null;
    wexel_id: number | null;
    amount_usd: number | null;
};
export type ClaimSumAggregateOutputType = {
    id: bigint | null;
    wexel_id: bigint | null;
    amount_usd: bigint | null;
};
export type ClaimMinAggregateOutputType = {
    id: bigint | null;
    wexel_id: bigint | null;
    amount_usd: bigint | null;
    claim_type: string | null;
    tx_hash: string | null;
    created_at: Date | null;
};
export type ClaimMaxAggregateOutputType = {
    id: bigint | null;
    wexel_id: bigint | null;
    amount_usd: bigint | null;
    claim_type: string | null;
    tx_hash: string | null;
    created_at: Date | null;
};
export type ClaimCountAggregateOutputType = {
    id: number;
    wexel_id: number;
    amount_usd: number;
    claim_type: number;
    tx_hash: number;
    created_at: number;
    _all: number;
};
export type ClaimAvgAggregateInputType = {
    id?: true;
    wexel_id?: true;
    amount_usd?: true;
};
export type ClaimSumAggregateInputType = {
    id?: true;
    wexel_id?: true;
    amount_usd?: true;
};
export type ClaimMinAggregateInputType = {
    id?: true;
    wexel_id?: true;
    amount_usd?: true;
    claim_type?: true;
    tx_hash?: true;
    created_at?: true;
};
export type ClaimMaxAggregateInputType = {
    id?: true;
    wexel_id?: true;
    amount_usd?: true;
    claim_type?: true;
    tx_hash?: true;
    created_at?: true;
};
export type ClaimCountAggregateInputType = {
    id?: true;
    wexel_id?: true;
    amount_usd?: true;
    claim_type?: true;
    tx_hash?: true;
    created_at?: true;
    _all?: true;
};
export type ClaimAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClaimWhereInput;
    orderBy?: Prisma.ClaimOrderByWithRelationInput | Prisma.ClaimOrderByWithRelationInput[];
    cursor?: Prisma.ClaimWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ClaimCountAggregateInputType;
    _avg?: ClaimAvgAggregateInputType;
    _sum?: ClaimSumAggregateInputType;
    _min?: ClaimMinAggregateInputType;
    _max?: ClaimMaxAggregateInputType;
};
export type GetClaimAggregateType<T extends ClaimAggregateArgs> = {
    [P in keyof T & keyof AggregateClaim]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateClaim[P]> : Prisma.GetScalarType<T[P], AggregateClaim[P]>;
};
export type ClaimGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClaimWhereInput;
    orderBy?: Prisma.ClaimOrderByWithAggregationInput | Prisma.ClaimOrderByWithAggregationInput[];
    by: Prisma.ClaimScalarFieldEnum[] | Prisma.ClaimScalarFieldEnum;
    having?: Prisma.ClaimScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ClaimCountAggregateInputType | true;
    _avg?: ClaimAvgAggregateInputType;
    _sum?: ClaimSumAggregateInputType;
    _min?: ClaimMinAggregateInputType;
    _max?: ClaimMaxAggregateInputType;
};
export type ClaimGroupByOutputType = {
    id: bigint;
    wexel_id: bigint;
    amount_usd: bigint;
    claim_type: string;
    tx_hash: string | null;
    created_at: Date;
    _count: ClaimCountAggregateOutputType | null;
    _avg: ClaimAvgAggregateOutputType | null;
    _sum: ClaimSumAggregateOutputType | null;
    _min: ClaimMinAggregateOutputType | null;
    _max: ClaimMaxAggregateOutputType | null;
};
type GetClaimGroupByPayload<T extends ClaimGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ClaimGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ClaimGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ClaimGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ClaimGroupByOutputType[P]>;
}>>;
export type ClaimWhereInput = {
    AND?: Prisma.ClaimWhereInput | Prisma.ClaimWhereInput[];
    OR?: Prisma.ClaimWhereInput[];
    NOT?: Prisma.ClaimWhereInput | Prisma.ClaimWhereInput[];
    id?: Prisma.BigIntFilter<"Claim"> | bigint | number;
    wexel_id?: Prisma.BigIntFilter<"Claim"> | bigint | number;
    amount_usd?: Prisma.BigIntFilter<"Claim"> | bigint | number;
    claim_type?: Prisma.StringFilter<"Claim"> | string;
    tx_hash?: Prisma.StringNullableFilter<"Claim"> | string | null;
    created_at?: Prisma.DateTimeFilter<"Claim"> | Date | string;
    wexel?: Prisma.XOR<Prisma.WexelScalarRelationFilter, Prisma.WexelWhereInput>;
};
export type ClaimOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    amount_usd?: Prisma.SortOrder;
    claim_type?: Prisma.SortOrder;
    tx_hash?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    wexel?: Prisma.WexelOrderByWithRelationInput;
};
export type ClaimWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number;
    AND?: Prisma.ClaimWhereInput | Prisma.ClaimWhereInput[];
    OR?: Prisma.ClaimWhereInput[];
    NOT?: Prisma.ClaimWhereInput | Prisma.ClaimWhereInput[];
    wexel_id?: Prisma.BigIntFilter<"Claim"> | bigint | number;
    amount_usd?: Prisma.BigIntFilter<"Claim"> | bigint | number;
    claim_type?: Prisma.StringFilter<"Claim"> | string;
    tx_hash?: Prisma.StringNullableFilter<"Claim"> | string | null;
    created_at?: Prisma.DateTimeFilter<"Claim"> | Date | string;
    wexel?: Prisma.XOR<Prisma.WexelScalarRelationFilter, Prisma.WexelWhereInput>;
}, "id">;
export type ClaimOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    amount_usd?: Prisma.SortOrder;
    claim_type?: Prisma.SortOrder;
    tx_hash?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.ClaimCountOrderByAggregateInput;
    _avg?: Prisma.ClaimAvgOrderByAggregateInput;
    _max?: Prisma.ClaimMaxOrderByAggregateInput;
    _min?: Prisma.ClaimMinOrderByAggregateInput;
    _sum?: Prisma.ClaimSumOrderByAggregateInput;
};
export type ClaimScalarWhereWithAggregatesInput = {
    AND?: Prisma.ClaimScalarWhereWithAggregatesInput | Prisma.ClaimScalarWhereWithAggregatesInput[];
    OR?: Prisma.ClaimScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ClaimScalarWhereWithAggregatesInput | Prisma.ClaimScalarWhereWithAggregatesInput[];
    id?: Prisma.BigIntWithAggregatesFilter<"Claim"> | bigint | number;
    wexel_id?: Prisma.BigIntWithAggregatesFilter<"Claim"> | bigint | number;
    amount_usd?: Prisma.BigIntWithAggregatesFilter<"Claim"> | bigint | number;
    claim_type?: Prisma.StringWithAggregatesFilter<"Claim"> | string;
    tx_hash?: Prisma.StringNullableWithAggregatesFilter<"Claim"> | string | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"Claim"> | Date | string;
};
export type ClaimCreateInput = {
    id?: bigint | number;
    amount_usd: bigint | number;
    claim_type: string;
    tx_hash?: string | null;
    created_at?: Date | string;
    wexel: Prisma.WexelCreateNestedOneWithoutClaimsInput;
};
export type ClaimUncheckedCreateInput = {
    id?: bigint | number;
    wexel_id: bigint | number;
    amount_usd: bigint | number;
    claim_type: string;
    tx_hash?: string | null;
    created_at?: Date | string;
};
export type ClaimUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    amount_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    claim_type?: Prisma.StringFieldUpdateOperationsInput | string;
    tx_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    wexel?: Prisma.WexelUpdateOneRequiredWithoutClaimsNestedInput;
};
export type ClaimUncheckedUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    wexel_id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    amount_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    claim_type?: Prisma.StringFieldUpdateOperationsInput | string;
    tx_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClaimCreateManyInput = {
    id?: bigint | number;
    wexel_id: bigint | number;
    amount_usd: bigint | number;
    claim_type: string;
    tx_hash?: string | null;
    created_at?: Date | string;
};
export type ClaimUpdateManyMutationInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    amount_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    claim_type?: Prisma.StringFieldUpdateOperationsInput | string;
    tx_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClaimUncheckedUpdateManyInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    wexel_id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    amount_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    claim_type?: Prisma.StringFieldUpdateOperationsInput | string;
    tx_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClaimListRelationFilter = {
    every?: Prisma.ClaimWhereInput;
    some?: Prisma.ClaimWhereInput;
    none?: Prisma.ClaimWhereInput;
};
export type ClaimOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ClaimCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    amount_usd?: Prisma.SortOrder;
    claim_type?: Prisma.SortOrder;
    tx_hash?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type ClaimAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    amount_usd?: Prisma.SortOrder;
};
export type ClaimMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    amount_usd?: Prisma.SortOrder;
    claim_type?: Prisma.SortOrder;
    tx_hash?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type ClaimMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    amount_usd?: Prisma.SortOrder;
    claim_type?: Prisma.SortOrder;
    tx_hash?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type ClaimSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    amount_usd?: Prisma.SortOrder;
};
export type ClaimCreateNestedManyWithoutWexelInput = {
    create?: Prisma.XOR<Prisma.ClaimCreateWithoutWexelInput, Prisma.ClaimUncheckedCreateWithoutWexelInput> | Prisma.ClaimCreateWithoutWexelInput[] | Prisma.ClaimUncheckedCreateWithoutWexelInput[];
    connectOrCreate?: Prisma.ClaimCreateOrConnectWithoutWexelInput | Prisma.ClaimCreateOrConnectWithoutWexelInput[];
    createMany?: Prisma.ClaimCreateManyWexelInputEnvelope;
    connect?: Prisma.ClaimWhereUniqueInput | Prisma.ClaimWhereUniqueInput[];
};
export type ClaimUncheckedCreateNestedManyWithoutWexelInput = {
    create?: Prisma.XOR<Prisma.ClaimCreateWithoutWexelInput, Prisma.ClaimUncheckedCreateWithoutWexelInput> | Prisma.ClaimCreateWithoutWexelInput[] | Prisma.ClaimUncheckedCreateWithoutWexelInput[];
    connectOrCreate?: Prisma.ClaimCreateOrConnectWithoutWexelInput | Prisma.ClaimCreateOrConnectWithoutWexelInput[];
    createMany?: Prisma.ClaimCreateManyWexelInputEnvelope;
    connect?: Prisma.ClaimWhereUniqueInput | Prisma.ClaimWhereUniqueInput[];
};
export type ClaimUpdateManyWithoutWexelNestedInput = {
    create?: Prisma.XOR<Prisma.ClaimCreateWithoutWexelInput, Prisma.ClaimUncheckedCreateWithoutWexelInput> | Prisma.ClaimCreateWithoutWexelInput[] | Prisma.ClaimUncheckedCreateWithoutWexelInput[];
    connectOrCreate?: Prisma.ClaimCreateOrConnectWithoutWexelInput | Prisma.ClaimCreateOrConnectWithoutWexelInput[];
    upsert?: Prisma.ClaimUpsertWithWhereUniqueWithoutWexelInput | Prisma.ClaimUpsertWithWhereUniqueWithoutWexelInput[];
    createMany?: Prisma.ClaimCreateManyWexelInputEnvelope;
    set?: Prisma.ClaimWhereUniqueInput | Prisma.ClaimWhereUniqueInput[];
    disconnect?: Prisma.ClaimWhereUniqueInput | Prisma.ClaimWhereUniqueInput[];
    delete?: Prisma.ClaimWhereUniqueInput | Prisma.ClaimWhereUniqueInput[];
    connect?: Prisma.ClaimWhereUniqueInput | Prisma.ClaimWhereUniqueInput[];
    update?: Prisma.ClaimUpdateWithWhereUniqueWithoutWexelInput | Prisma.ClaimUpdateWithWhereUniqueWithoutWexelInput[];
    updateMany?: Prisma.ClaimUpdateManyWithWhereWithoutWexelInput | Prisma.ClaimUpdateManyWithWhereWithoutWexelInput[];
    deleteMany?: Prisma.ClaimScalarWhereInput | Prisma.ClaimScalarWhereInput[];
};
export type ClaimUncheckedUpdateManyWithoutWexelNestedInput = {
    create?: Prisma.XOR<Prisma.ClaimCreateWithoutWexelInput, Prisma.ClaimUncheckedCreateWithoutWexelInput> | Prisma.ClaimCreateWithoutWexelInput[] | Prisma.ClaimUncheckedCreateWithoutWexelInput[];
    connectOrCreate?: Prisma.ClaimCreateOrConnectWithoutWexelInput | Prisma.ClaimCreateOrConnectWithoutWexelInput[];
    upsert?: Prisma.ClaimUpsertWithWhereUniqueWithoutWexelInput | Prisma.ClaimUpsertWithWhereUniqueWithoutWexelInput[];
    createMany?: Prisma.ClaimCreateManyWexelInputEnvelope;
    set?: Prisma.ClaimWhereUniqueInput | Prisma.ClaimWhereUniqueInput[];
    disconnect?: Prisma.ClaimWhereUniqueInput | Prisma.ClaimWhereUniqueInput[];
    delete?: Prisma.ClaimWhereUniqueInput | Prisma.ClaimWhereUniqueInput[];
    connect?: Prisma.ClaimWhereUniqueInput | Prisma.ClaimWhereUniqueInput[];
    update?: Prisma.ClaimUpdateWithWhereUniqueWithoutWexelInput | Prisma.ClaimUpdateWithWhereUniqueWithoutWexelInput[];
    updateMany?: Prisma.ClaimUpdateManyWithWhereWithoutWexelInput | Prisma.ClaimUpdateManyWithWhereWithoutWexelInput[];
    deleteMany?: Prisma.ClaimScalarWhereInput | Prisma.ClaimScalarWhereInput[];
};
export type ClaimCreateWithoutWexelInput = {
    id?: bigint | number;
    amount_usd: bigint | number;
    claim_type: string;
    tx_hash?: string | null;
    created_at?: Date | string;
};
export type ClaimUncheckedCreateWithoutWexelInput = {
    id?: bigint | number;
    amount_usd: bigint | number;
    claim_type: string;
    tx_hash?: string | null;
    created_at?: Date | string;
};
export type ClaimCreateOrConnectWithoutWexelInput = {
    where: Prisma.ClaimWhereUniqueInput;
    create: Prisma.XOR<Prisma.ClaimCreateWithoutWexelInput, Prisma.ClaimUncheckedCreateWithoutWexelInput>;
};
export type ClaimCreateManyWexelInputEnvelope = {
    data: Prisma.ClaimCreateManyWexelInput | Prisma.ClaimCreateManyWexelInput[];
    skipDuplicates?: boolean;
};
export type ClaimUpsertWithWhereUniqueWithoutWexelInput = {
    where: Prisma.ClaimWhereUniqueInput;
    update: Prisma.XOR<Prisma.ClaimUpdateWithoutWexelInput, Prisma.ClaimUncheckedUpdateWithoutWexelInput>;
    create: Prisma.XOR<Prisma.ClaimCreateWithoutWexelInput, Prisma.ClaimUncheckedCreateWithoutWexelInput>;
};
export type ClaimUpdateWithWhereUniqueWithoutWexelInput = {
    where: Prisma.ClaimWhereUniqueInput;
    data: Prisma.XOR<Prisma.ClaimUpdateWithoutWexelInput, Prisma.ClaimUncheckedUpdateWithoutWexelInput>;
};
export type ClaimUpdateManyWithWhereWithoutWexelInput = {
    where: Prisma.ClaimScalarWhereInput;
    data: Prisma.XOR<Prisma.ClaimUpdateManyMutationInput, Prisma.ClaimUncheckedUpdateManyWithoutWexelInput>;
};
export type ClaimScalarWhereInput = {
    AND?: Prisma.ClaimScalarWhereInput | Prisma.ClaimScalarWhereInput[];
    OR?: Prisma.ClaimScalarWhereInput[];
    NOT?: Prisma.ClaimScalarWhereInput | Prisma.ClaimScalarWhereInput[];
    id?: Prisma.BigIntFilter<"Claim"> | bigint | number;
    wexel_id?: Prisma.BigIntFilter<"Claim"> | bigint | number;
    amount_usd?: Prisma.BigIntFilter<"Claim"> | bigint | number;
    claim_type?: Prisma.StringFilter<"Claim"> | string;
    tx_hash?: Prisma.StringNullableFilter<"Claim"> | string | null;
    created_at?: Prisma.DateTimeFilter<"Claim"> | Date | string;
};
export type ClaimCreateManyWexelInput = {
    id?: bigint | number;
    amount_usd: bigint | number;
    claim_type: string;
    tx_hash?: string | null;
    created_at?: Date | string;
};
export type ClaimUpdateWithoutWexelInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    amount_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    claim_type?: Prisma.StringFieldUpdateOperationsInput | string;
    tx_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClaimUncheckedUpdateWithoutWexelInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    amount_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    claim_type?: Prisma.StringFieldUpdateOperationsInput | string;
    tx_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClaimUncheckedUpdateManyWithoutWexelInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    amount_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    claim_type?: Prisma.StringFieldUpdateOperationsInput | string;
    tx_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClaimSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    wexel_id?: boolean;
    amount_usd?: boolean;
    claim_type?: boolean;
    tx_hash?: boolean;
    created_at?: boolean;
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["claim"]>;
export type ClaimSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    wexel_id?: boolean;
    amount_usd?: boolean;
    claim_type?: boolean;
    tx_hash?: boolean;
    created_at?: boolean;
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["claim"]>;
export type ClaimSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    wexel_id?: boolean;
    amount_usd?: boolean;
    claim_type?: boolean;
    tx_hash?: boolean;
    created_at?: boolean;
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["claim"]>;
export type ClaimSelectScalar = {
    id?: boolean;
    wexel_id?: boolean;
    amount_usd?: boolean;
    claim_type?: boolean;
    tx_hash?: boolean;
    created_at?: boolean;
};
export type ClaimOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "wexel_id" | "amount_usd" | "claim_type" | "tx_hash" | "created_at", ExtArgs["result"]["claim"]>;
export type ClaimInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
};
export type ClaimIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
};
export type ClaimIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
};
export type $ClaimPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Claim";
    objects: {
        wexel: Prisma.$WexelPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: bigint;
        wexel_id: bigint;
        amount_usd: bigint;
        claim_type: string;
        tx_hash: string | null;
        created_at: Date;
    }, ExtArgs["result"]["claim"]>;
    composites: {};
};
export type ClaimGetPayload<S extends boolean | null | undefined | ClaimDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ClaimPayload, S>;
export type ClaimCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ClaimFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ClaimCountAggregateInputType | true;
};
export interface ClaimDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Claim'];
        meta: {
            name: 'Claim';
        };
    };
    findUnique<T extends ClaimFindUniqueArgs>(args: Prisma.SelectSubset<T, ClaimFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ClaimClient<runtime.Types.Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ClaimFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ClaimFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ClaimClient<runtime.Types.Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ClaimFindFirstArgs>(args?: Prisma.SelectSubset<T, ClaimFindFirstArgs<ExtArgs>>): Prisma.Prisma__ClaimClient<runtime.Types.Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ClaimFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ClaimFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ClaimClient<runtime.Types.Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ClaimFindManyArgs>(args?: Prisma.SelectSubset<T, ClaimFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ClaimCreateArgs>(args: Prisma.SelectSubset<T, ClaimCreateArgs<ExtArgs>>): Prisma.Prisma__ClaimClient<runtime.Types.Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ClaimCreateManyArgs>(args?: Prisma.SelectSubset<T, ClaimCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ClaimCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ClaimCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ClaimDeleteArgs>(args: Prisma.SelectSubset<T, ClaimDeleteArgs<ExtArgs>>): Prisma.Prisma__ClaimClient<runtime.Types.Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ClaimUpdateArgs>(args: Prisma.SelectSubset<T, ClaimUpdateArgs<ExtArgs>>): Prisma.Prisma__ClaimClient<runtime.Types.Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ClaimDeleteManyArgs>(args?: Prisma.SelectSubset<T, ClaimDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ClaimUpdateManyArgs>(args: Prisma.SelectSubset<T, ClaimUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ClaimUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ClaimUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ClaimUpsertArgs>(args: Prisma.SelectSubset<T, ClaimUpsertArgs<ExtArgs>>): Prisma.Prisma__ClaimClient<runtime.Types.Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ClaimCountArgs>(args?: Prisma.Subset<T, ClaimCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ClaimCountAggregateOutputType> : number>;
    aggregate<T extends ClaimAggregateArgs>(args: Prisma.Subset<T, ClaimAggregateArgs>): Prisma.PrismaPromise<GetClaimAggregateType<T>>;
    groupBy<T extends ClaimGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ClaimGroupByArgs['orderBy'];
    } : {
        orderBy?: ClaimGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ClaimGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClaimGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ClaimFieldRefs;
}
export interface Prisma__ClaimClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    wexel<T extends Prisma.WexelDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WexelDefaultArgs<ExtArgs>>): Prisma.Prisma__WexelClient<runtime.Types.Result.GetResult<Prisma.$WexelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ClaimFieldRefs {
    readonly id: Prisma.FieldRef<"Claim", 'BigInt'>;
    readonly wexel_id: Prisma.FieldRef<"Claim", 'BigInt'>;
    readonly amount_usd: Prisma.FieldRef<"Claim", 'BigInt'>;
    readonly claim_type: Prisma.FieldRef<"Claim", 'String'>;
    readonly tx_hash: Prisma.FieldRef<"Claim", 'String'>;
    readonly created_at: Prisma.FieldRef<"Claim", 'DateTime'>;
}
export type ClaimFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimSelect<ExtArgs> | null;
    omit?: Prisma.ClaimOmit<ExtArgs> | null;
    include?: Prisma.ClaimInclude<ExtArgs> | null;
    where: Prisma.ClaimWhereUniqueInput;
};
export type ClaimFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimSelect<ExtArgs> | null;
    omit?: Prisma.ClaimOmit<ExtArgs> | null;
    include?: Prisma.ClaimInclude<ExtArgs> | null;
    where: Prisma.ClaimWhereUniqueInput;
};
export type ClaimFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimSelect<ExtArgs> | null;
    omit?: Prisma.ClaimOmit<ExtArgs> | null;
    include?: Prisma.ClaimInclude<ExtArgs> | null;
    where?: Prisma.ClaimWhereInput;
    orderBy?: Prisma.ClaimOrderByWithRelationInput | Prisma.ClaimOrderByWithRelationInput[];
    cursor?: Prisma.ClaimWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ClaimScalarFieldEnum | Prisma.ClaimScalarFieldEnum[];
};
export type ClaimFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimSelect<ExtArgs> | null;
    omit?: Prisma.ClaimOmit<ExtArgs> | null;
    include?: Prisma.ClaimInclude<ExtArgs> | null;
    where?: Prisma.ClaimWhereInput;
    orderBy?: Prisma.ClaimOrderByWithRelationInput | Prisma.ClaimOrderByWithRelationInput[];
    cursor?: Prisma.ClaimWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ClaimScalarFieldEnum | Prisma.ClaimScalarFieldEnum[];
};
export type ClaimFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimSelect<ExtArgs> | null;
    omit?: Prisma.ClaimOmit<ExtArgs> | null;
    include?: Prisma.ClaimInclude<ExtArgs> | null;
    where?: Prisma.ClaimWhereInput;
    orderBy?: Prisma.ClaimOrderByWithRelationInput | Prisma.ClaimOrderByWithRelationInput[];
    cursor?: Prisma.ClaimWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ClaimScalarFieldEnum | Prisma.ClaimScalarFieldEnum[];
};
export type ClaimCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimSelect<ExtArgs> | null;
    omit?: Prisma.ClaimOmit<ExtArgs> | null;
    include?: Prisma.ClaimInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ClaimCreateInput, Prisma.ClaimUncheckedCreateInput>;
};
export type ClaimCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ClaimCreateManyInput | Prisma.ClaimCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ClaimCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ClaimOmit<ExtArgs> | null;
    data: Prisma.ClaimCreateManyInput | Prisma.ClaimCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ClaimIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ClaimUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimSelect<ExtArgs> | null;
    omit?: Prisma.ClaimOmit<ExtArgs> | null;
    include?: Prisma.ClaimInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ClaimUpdateInput, Prisma.ClaimUncheckedUpdateInput>;
    where: Prisma.ClaimWhereUniqueInput;
};
export type ClaimUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ClaimUpdateManyMutationInput, Prisma.ClaimUncheckedUpdateManyInput>;
    where?: Prisma.ClaimWhereInput;
    limit?: number;
};
export type ClaimUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ClaimOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ClaimUpdateManyMutationInput, Prisma.ClaimUncheckedUpdateManyInput>;
    where?: Prisma.ClaimWhereInput;
    limit?: number;
    include?: Prisma.ClaimIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ClaimUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimSelect<ExtArgs> | null;
    omit?: Prisma.ClaimOmit<ExtArgs> | null;
    include?: Prisma.ClaimInclude<ExtArgs> | null;
    where: Prisma.ClaimWhereUniqueInput;
    create: Prisma.XOR<Prisma.ClaimCreateInput, Prisma.ClaimUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ClaimUpdateInput, Prisma.ClaimUncheckedUpdateInput>;
};
export type ClaimDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimSelect<ExtArgs> | null;
    omit?: Prisma.ClaimOmit<ExtArgs> | null;
    include?: Prisma.ClaimInclude<ExtArgs> | null;
    where: Prisma.ClaimWhereUniqueInput;
};
export type ClaimDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClaimWhereInput;
    limit?: number;
};
export type ClaimDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimSelect<ExtArgs> | null;
    omit?: Prisma.ClaimOmit<ExtArgs> | null;
    include?: Prisma.ClaimInclude<ExtArgs> | null;
};
export {};
