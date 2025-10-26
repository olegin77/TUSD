import type * as runtime from '@prisma/client/runtime/library';
import type * as Prisma from '../internal/prismaNamespace.js';
export type CollateralPositionModel = runtime.Types.Result.DefaultSelection<Prisma.$CollateralPositionPayload>;
export type AggregateCollateralPosition = {
    _count: CollateralPositionCountAggregateOutputType | null;
    _avg: CollateralPositionAvgAggregateOutputType | null;
    _sum: CollateralPositionSumAggregateOutputType | null;
    _min: CollateralPositionMinAggregateOutputType | null;
    _max: CollateralPositionMaxAggregateOutputType | null;
};
export type CollateralPositionAvgAggregateOutputType = {
    wexel_id: number | null;
    loan_usd: number | null;
};
export type CollateralPositionSumAggregateOutputType = {
    wexel_id: bigint | null;
    loan_usd: bigint | null;
};
export type CollateralPositionMinAggregateOutputType = {
    wexel_id: bigint | null;
    loan_usd: bigint | null;
    start_ts: Date | null;
    repaid: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type CollateralPositionMaxAggregateOutputType = {
    wexel_id: bigint | null;
    loan_usd: bigint | null;
    start_ts: Date | null;
    repaid: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type CollateralPositionCountAggregateOutputType = {
    wexel_id: number;
    loan_usd: number;
    start_ts: number;
    repaid: number;
    created_at: number;
    updated_at: number;
    _all: number;
};
export type CollateralPositionAvgAggregateInputType = {
    wexel_id?: true;
    loan_usd?: true;
};
export type CollateralPositionSumAggregateInputType = {
    wexel_id?: true;
    loan_usd?: true;
};
export type CollateralPositionMinAggregateInputType = {
    wexel_id?: true;
    loan_usd?: true;
    start_ts?: true;
    repaid?: true;
    created_at?: true;
    updated_at?: true;
};
export type CollateralPositionMaxAggregateInputType = {
    wexel_id?: true;
    loan_usd?: true;
    start_ts?: true;
    repaid?: true;
    created_at?: true;
    updated_at?: true;
};
export type CollateralPositionCountAggregateInputType = {
    wexel_id?: true;
    loan_usd?: true;
    start_ts?: true;
    repaid?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
};
export type CollateralPositionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CollateralPositionWhereInput;
    orderBy?: Prisma.CollateralPositionOrderByWithRelationInput | Prisma.CollateralPositionOrderByWithRelationInput[];
    cursor?: Prisma.CollateralPositionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CollateralPositionCountAggregateInputType;
    _avg?: CollateralPositionAvgAggregateInputType;
    _sum?: CollateralPositionSumAggregateInputType;
    _min?: CollateralPositionMinAggregateInputType;
    _max?: CollateralPositionMaxAggregateInputType;
};
export type GetCollateralPositionAggregateType<T extends CollateralPositionAggregateArgs> = {
    [P in keyof T & keyof AggregateCollateralPosition]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCollateralPosition[P]> : Prisma.GetScalarType<T[P], AggregateCollateralPosition[P]>;
};
export type CollateralPositionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CollateralPositionWhereInput;
    orderBy?: Prisma.CollateralPositionOrderByWithAggregationInput | Prisma.CollateralPositionOrderByWithAggregationInput[];
    by: Prisma.CollateralPositionScalarFieldEnum[] | Prisma.CollateralPositionScalarFieldEnum;
    having?: Prisma.CollateralPositionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CollateralPositionCountAggregateInputType | true;
    _avg?: CollateralPositionAvgAggregateInputType;
    _sum?: CollateralPositionSumAggregateInputType;
    _min?: CollateralPositionMinAggregateInputType;
    _max?: CollateralPositionMaxAggregateInputType;
};
export type CollateralPositionGroupByOutputType = {
    wexel_id: bigint;
    loan_usd: bigint;
    start_ts: Date;
    repaid: boolean;
    created_at: Date;
    updated_at: Date;
    _count: CollateralPositionCountAggregateOutputType | null;
    _avg: CollateralPositionAvgAggregateOutputType | null;
    _sum: CollateralPositionSumAggregateOutputType | null;
    _min: CollateralPositionMinAggregateOutputType | null;
    _max: CollateralPositionMaxAggregateOutputType | null;
};
type GetCollateralPositionGroupByPayload<T extends CollateralPositionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CollateralPositionGroupByOutputType, T['by']> & {
    [P in keyof T & keyof CollateralPositionGroupByOutputType]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CollateralPositionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CollateralPositionGroupByOutputType[P]>;
}>>;
export type CollateralPositionWhereInput = {
    AND?: Prisma.CollateralPositionWhereInput | Prisma.CollateralPositionWhereInput[];
    OR?: Prisma.CollateralPositionWhereInput[];
    NOT?: Prisma.CollateralPositionWhereInput | Prisma.CollateralPositionWhereInput[];
    wexel_id?: Prisma.BigIntFilter<'CollateralPosition'> | bigint | number;
    loan_usd?: Prisma.BigIntFilter<'CollateralPosition'> | bigint | number;
    start_ts?: Prisma.DateTimeFilter<'CollateralPosition'> | Date | string;
    repaid?: Prisma.BoolFilter<'CollateralPosition'> | boolean;
    created_at?: Prisma.DateTimeFilter<'CollateralPosition'> | Date | string;
    updated_at?: Prisma.DateTimeFilter<'CollateralPosition'> | Date | string;
    wexel?: Prisma.XOR<Prisma.WexelScalarRelationFilter, Prisma.WexelWhereInput>;
};
export type CollateralPositionOrderByWithRelationInput = {
    wexel_id?: Prisma.SortOrder;
    loan_usd?: Prisma.SortOrder;
    start_ts?: Prisma.SortOrder;
    repaid?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    wexel?: Prisma.WexelOrderByWithRelationInput;
};
export type CollateralPositionWhereUniqueInput = Prisma.AtLeast<{
    wexel_id?: bigint | number;
    AND?: Prisma.CollateralPositionWhereInput | Prisma.CollateralPositionWhereInput[];
    OR?: Prisma.CollateralPositionWhereInput[];
    NOT?: Prisma.CollateralPositionWhereInput | Prisma.CollateralPositionWhereInput[];
    loan_usd?: Prisma.BigIntFilter<'CollateralPosition'> | bigint | number;
    start_ts?: Prisma.DateTimeFilter<'CollateralPosition'> | Date | string;
    repaid?: Prisma.BoolFilter<'CollateralPosition'> | boolean;
    created_at?: Prisma.DateTimeFilter<'CollateralPosition'> | Date | string;
    updated_at?: Prisma.DateTimeFilter<'CollateralPosition'> | Date | string;
    wexel?: Prisma.XOR<Prisma.WexelScalarRelationFilter, Prisma.WexelWhereInput>;
}, 'wexel_id'>;
export type CollateralPositionOrderByWithAggregationInput = {
    wexel_id?: Prisma.SortOrder;
    loan_usd?: Prisma.SortOrder;
    start_ts?: Prisma.SortOrder;
    repaid?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    _count?: Prisma.CollateralPositionCountOrderByAggregateInput;
    _avg?: Prisma.CollateralPositionAvgOrderByAggregateInput;
    _max?: Prisma.CollateralPositionMaxOrderByAggregateInput;
    _min?: Prisma.CollateralPositionMinOrderByAggregateInput;
    _sum?: Prisma.CollateralPositionSumOrderByAggregateInput;
};
export type CollateralPositionScalarWhereWithAggregatesInput = {
    AND?: Prisma.CollateralPositionScalarWhereWithAggregatesInput | Prisma.CollateralPositionScalarWhereWithAggregatesInput[];
    OR?: Prisma.CollateralPositionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CollateralPositionScalarWhereWithAggregatesInput | Prisma.CollateralPositionScalarWhereWithAggregatesInput[];
    wexel_id?: Prisma.BigIntWithAggregatesFilter<'CollateralPosition'> | bigint | number;
    loan_usd?: Prisma.BigIntWithAggregatesFilter<'CollateralPosition'> | bigint | number;
    start_ts?: Prisma.DateTimeWithAggregatesFilter<'CollateralPosition'> | Date | string;
    repaid?: Prisma.BoolWithAggregatesFilter<'CollateralPosition'> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<'CollateralPosition'> | Date | string;
    updated_at?: Prisma.DateTimeWithAggregatesFilter<'CollateralPosition'> | Date | string;
};
export type CollateralPositionCreateInput = {
    loan_usd: bigint | number;
    start_ts: Date | string;
    repaid?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    wexel: Prisma.WexelCreateNestedOneWithoutCollateral_positionInput;
};
export type CollateralPositionUncheckedCreateInput = {
    wexel_id: bigint | number;
    loan_usd: bigint | number;
    start_ts: Date | string;
    repaid?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type CollateralPositionUpdateInput = {
    loan_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    start_ts?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    repaid?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    wexel?: Prisma.WexelUpdateOneRequiredWithoutCollateral_positionNestedInput;
};
export type CollateralPositionUncheckedUpdateInput = {
    wexel_id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    loan_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    start_ts?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    repaid?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CollateralPositionCreateManyInput = {
    wexel_id: bigint | number;
    loan_usd: bigint | number;
    start_ts: Date | string;
    repaid?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type CollateralPositionUpdateManyMutationInput = {
    loan_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    start_ts?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    repaid?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CollateralPositionUncheckedUpdateManyInput = {
    wexel_id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    loan_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    start_ts?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    repaid?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CollateralPositionNullableScalarRelationFilter = {
    is?: Prisma.CollateralPositionWhereInput | null;
    isNot?: Prisma.CollateralPositionWhereInput | null;
};
export type CollateralPositionCountOrderByAggregateInput = {
    wexel_id?: Prisma.SortOrder;
    loan_usd?: Prisma.SortOrder;
    start_ts?: Prisma.SortOrder;
    repaid?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type CollateralPositionAvgOrderByAggregateInput = {
    wexel_id?: Prisma.SortOrder;
    loan_usd?: Prisma.SortOrder;
};
export type CollateralPositionMaxOrderByAggregateInput = {
    wexel_id?: Prisma.SortOrder;
    loan_usd?: Prisma.SortOrder;
    start_ts?: Prisma.SortOrder;
    repaid?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type CollateralPositionMinOrderByAggregateInput = {
    wexel_id?: Prisma.SortOrder;
    loan_usd?: Prisma.SortOrder;
    start_ts?: Prisma.SortOrder;
    repaid?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type CollateralPositionSumOrderByAggregateInput = {
    wexel_id?: Prisma.SortOrder;
    loan_usd?: Prisma.SortOrder;
};
export type CollateralPositionCreateNestedOneWithoutWexelInput = {
    create?: Prisma.XOR<Prisma.CollateralPositionCreateWithoutWexelInput, Prisma.CollateralPositionUncheckedCreateWithoutWexelInput>;
    connectOrCreate?: Prisma.CollateralPositionCreateOrConnectWithoutWexelInput;
    connect?: Prisma.CollateralPositionWhereUniqueInput;
};
export type CollateralPositionUncheckedCreateNestedOneWithoutWexelInput = {
    create?: Prisma.XOR<Prisma.CollateralPositionCreateWithoutWexelInput, Prisma.CollateralPositionUncheckedCreateWithoutWexelInput>;
    connectOrCreate?: Prisma.CollateralPositionCreateOrConnectWithoutWexelInput;
    connect?: Prisma.CollateralPositionWhereUniqueInput;
};
export type CollateralPositionUpdateOneWithoutWexelNestedInput = {
    create?: Prisma.XOR<Prisma.CollateralPositionCreateWithoutWexelInput, Prisma.CollateralPositionUncheckedCreateWithoutWexelInput>;
    connectOrCreate?: Prisma.CollateralPositionCreateOrConnectWithoutWexelInput;
    upsert?: Prisma.CollateralPositionUpsertWithoutWexelInput;
    disconnect?: Prisma.CollateralPositionWhereInput | boolean;
    delete?: Prisma.CollateralPositionWhereInput | boolean;
    connect?: Prisma.CollateralPositionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CollateralPositionUpdateToOneWithWhereWithoutWexelInput, Prisma.CollateralPositionUpdateWithoutWexelInput>, Prisma.CollateralPositionUncheckedUpdateWithoutWexelInput>;
};
export type CollateralPositionUncheckedUpdateOneWithoutWexelNestedInput = {
    create?: Prisma.XOR<Prisma.CollateralPositionCreateWithoutWexelInput, Prisma.CollateralPositionUncheckedCreateWithoutWexelInput>;
    connectOrCreate?: Prisma.CollateralPositionCreateOrConnectWithoutWexelInput;
    upsert?: Prisma.CollateralPositionUpsertWithoutWexelInput;
    disconnect?: Prisma.CollateralPositionWhereInput | boolean;
    delete?: Prisma.CollateralPositionWhereInput | boolean;
    connect?: Prisma.CollateralPositionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CollateralPositionUpdateToOneWithWhereWithoutWexelInput, Prisma.CollateralPositionUpdateWithoutWexelInput>, Prisma.CollateralPositionUncheckedUpdateWithoutWexelInput>;
};
export type CollateralPositionCreateWithoutWexelInput = {
    loan_usd: bigint | number;
    start_ts: Date | string;
    repaid?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type CollateralPositionUncheckedCreateWithoutWexelInput = {
    loan_usd: bigint | number;
    start_ts: Date | string;
    repaid?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type CollateralPositionCreateOrConnectWithoutWexelInput = {
    where: Prisma.CollateralPositionWhereUniqueInput;
    create: Prisma.XOR<Prisma.CollateralPositionCreateWithoutWexelInput, Prisma.CollateralPositionUncheckedCreateWithoutWexelInput>;
};
export type CollateralPositionUpsertWithoutWexelInput = {
    update: Prisma.XOR<Prisma.CollateralPositionUpdateWithoutWexelInput, Prisma.CollateralPositionUncheckedUpdateWithoutWexelInput>;
    create: Prisma.XOR<Prisma.CollateralPositionCreateWithoutWexelInput, Prisma.CollateralPositionUncheckedCreateWithoutWexelInput>;
    where?: Prisma.CollateralPositionWhereInput;
};
export type CollateralPositionUpdateToOneWithWhereWithoutWexelInput = {
    where?: Prisma.CollateralPositionWhereInput;
    data: Prisma.XOR<Prisma.CollateralPositionUpdateWithoutWexelInput, Prisma.CollateralPositionUncheckedUpdateWithoutWexelInput>;
};
export type CollateralPositionUpdateWithoutWexelInput = {
    loan_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    start_ts?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    repaid?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CollateralPositionUncheckedUpdateWithoutWexelInput = {
    loan_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    start_ts?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    repaid?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CollateralPositionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    wexel_id?: boolean;
    loan_usd?: boolean;
    start_ts?: boolean;
    repaid?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
}, ExtArgs['result']['collateralPosition']>;
export type CollateralPositionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    wexel_id?: boolean;
    loan_usd?: boolean;
    start_ts?: boolean;
    repaid?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
}, ExtArgs['result']['collateralPosition']>;
export type CollateralPositionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    wexel_id?: boolean;
    loan_usd?: boolean;
    start_ts?: boolean;
    repaid?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
}, ExtArgs['result']['collateralPosition']>;
export type CollateralPositionSelectScalar = {
    wexel_id?: boolean;
    loan_usd?: boolean;
    start_ts?: boolean;
    repaid?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
};
export type CollateralPositionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<'wexel_id' | 'loan_usd' | 'start_ts' | 'repaid' | 'created_at' | 'updated_at', ExtArgs['result']['collateralPosition']>;
export type CollateralPositionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
};
export type CollateralPositionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
};
export type CollateralPositionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
};
export type $CollateralPositionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: 'CollateralPosition';
    objects: {
        wexel: Prisma.$WexelPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        wexel_id: bigint;
        loan_usd: bigint;
        start_ts: Date;
        repaid: boolean;
        created_at: Date;
        updated_at: Date;
    }, ExtArgs['result']['collateralPosition']>;
    composites: {};
};
export type CollateralPositionGetPayload<S extends boolean | null | undefined | CollateralPositionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CollateralPositionPayload, S>;
export type CollateralPositionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CollateralPositionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CollateralPositionCountAggregateInputType | true;
};
export interface CollateralPositionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CollateralPosition'];
        meta: {
            name: 'CollateralPosition';
        };
    };
    findUnique<T extends CollateralPositionFindUniqueArgs>(args: Prisma.SelectSubset<T, CollateralPositionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CollateralPositionClient<runtime.Types.Result.GetResult<Prisma.$CollateralPositionPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CollateralPositionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CollateralPositionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CollateralPositionClient<runtime.Types.Result.GetResult<Prisma.$CollateralPositionPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CollateralPositionFindFirstArgs>(args?: Prisma.SelectSubset<T, CollateralPositionFindFirstArgs<ExtArgs>>): Prisma.Prisma__CollateralPositionClient<runtime.Types.Result.GetResult<Prisma.$CollateralPositionPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CollateralPositionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CollateralPositionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CollateralPositionClient<runtime.Types.Result.GetResult<Prisma.$CollateralPositionPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CollateralPositionFindManyArgs>(args?: Prisma.SelectSubset<T, CollateralPositionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CollateralPositionPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>;
    create<T extends CollateralPositionCreateArgs>(args: Prisma.SelectSubset<T, CollateralPositionCreateArgs<ExtArgs>>): Prisma.Prisma__CollateralPositionClient<runtime.Types.Result.GetResult<Prisma.$CollateralPositionPayload<ExtArgs>, T, 'create', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CollateralPositionCreateManyArgs>(args?: Prisma.SelectSubset<T, CollateralPositionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CollateralPositionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CollateralPositionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CollateralPositionPayload<ExtArgs>, T, 'createManyAndReturn', GlobalOmitOptions>>;
    delete<T extends CollateralPositionDeleteArgs>(args: Prisma.SelectSubset<T, CollateralPositionDeleteArgs<ExtArgs>>): Prisma.Prisma__CollateralPositionClient<runtime.Types.Result.GetResult<Prisma.$CollateralPositionPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CollateralPositionUpdateArgs>(args: Prisma.SelectSubset<T, CollateralPositionUpdateArgs<ExtArgs>>): Prisma.Prisma__CollateralPositionClient<runtime.Types.Result.GetResult<Prisma.$CollateralPositionPayload<ExtArgs>, T, 'update', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CollateralPositionDeleteManyArgs>(args?: Prisma.SelectSubset<T, CollateralPositionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CollateralPositionUpdateManyArgs>(args: Prisma.SelectSubset<T, CollateralPositionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CollateralPositionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CollateralPositionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CollateralPositionPayload<ExtArgs>, T, 'updateManyAndReturn', GlobalOmitOptions>>;
    upsert<T extends CollateralPositionUpsertArgs>(args: Prisma.SelectSubset<T, CollateralPositionUpsertArgs<ExtArgs>>): Prisma.Prisma__CollateralPositionClient<runtime.Types.Result.GetResult<Prisma.$CollateralPositionPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CollateralPositionCountArgs>(args?: Prisma.Subset<T, CollateralPositionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CollateralPositionCountAggregateOutputType> : number>;
    aggregate<T extends CollateralPositionAggregateArgs>(args: Prisma.Subset<T, CollateralPositionAggregateArgs>): Prisma.PrismaPromise<GetCollateralPositionAggregateType<T>>;
    groupBy<T extends CollateralPositionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CollateralPositionGroupByArgs['orderBy'];
    } : {
        orderBy?: CollateralPositionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CollateralPositionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCollateralPositionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CollateralPositionFieldRefs;
}
export interface Prisma__CollateralPositionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    wexel<T extends Prisma.WexelDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WexelDefaultArgs<ExtArgs>>): Prisma.Prisma__WexelClient<runtime.Types.Result.GetResult<Prisma.$WexelPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CollateralPositionFieldRefs {
    readonly wexel_id: Prisma.FieldRef<'CollateralPosition', 'BigInt'>;
    readonly loan_usd: Prisma.FieldRef<'CollateralPosition', 'BigInt'>;
    readonly start_ts: Prisma.FieldRef<'CollateralPosition', 'DateTime'>;
    readonly repaid: Prisma.FieldRef<'CollateralPosition', 'Boolean'>;
    readonly created_at: Prisma.FieldRef<'CollateralPosition', 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<'CollateralPosition', 'DateTime'>;
}
export type CollateralPositionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CollateralPositionSelect<ExtArgs> | null;
    omit?: Prisma.CollateralPositionOmit<ExtArgs> | null;
    include?: Prisma.CollateralPositionInclude<ExtArgs> | null;
    where: Prisma.CollateralPositionWhereUniqueInput;
};
export type CollateralPositionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CollateralPositionSelect<ExtArgs> | null;
    omit?: Prisma.CollateralPositionOmit<ExtArgs> | null;
    include?: Prisma.CollateralPositionInclude<ExtArgs> | null;
    where: Prisma.CollateralPositionWhereUniqueInput;
};
export type CollateralPositionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CollateralPositionSelect<ExtArgs> | null;
    omit?: Prisma.CollateralPositionOmit<ExtArgs> | null;
    include?: Prisma.CollateralPositionInclude<ExtArgs> | null;
    where?: Prisma.CollateralPositionWhereInput;
    orderBy?: Prisma.CollateralPositionOrderByWithRelationInput | Prisma.CollateralPositionOrderByWithRelationInput[];
    cursor?: Prisma.CollateralPositionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CollateralPositionScalarFieldEnum | Prisma.CollateralPositionScalarFieldEnum[];
};
export type CollateralPositionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CollateralPositionSelect<ExtArgs> | null;
    omit?: Prisma.CollateralPositionOmit<ExtArgs> | null;
    include?: Prisma.CollateralPositionInclude<ExtArgs> | null;
    where?: Prisma.CollateralPositionWhereInput;
    orderBy?: Prisma.CollateralPositionOrderByWithRelationInput | Prisma.CollateralPositionOrderByWithRelationInput[];
    cursor?: Prisma.CollateralPositionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CollateralPositionScalarFieldEnum | Prisma.CollateralPositionScalarFieldEnum[];
};
export type CollateralPositionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CollateralPositionSelect<ExtArgs> | null;
    omit?: Prisma.CollateralPositionOmit<ExtArgs> | null;
    include?: Prisma.CollateralPositionInclude<ExtArgs> | null;
    where?: Prisma.CollateralPositionWhereInput;
    orderBy?: Prisma.CollateralPositionOrderByWithRelationInput | Prisma.CollateralPositionOrderByWithRelationInput[];
    cursor?: Prisma.CollateralPositionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CollateralPositionScalarFieldEnum | Prisma.CollateralPositionScalarFieldEnum[];
};
export type CollateralPositionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CollateralPositionSelect<ExtArgs> | null;
    omit?: Prisma.CollateralPositionOmit<ExtArgs> | null;
    include?: Prisma.CollateralPositionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CollateralPositionCreateInput, Prisma.CollateralPositionUncheckedCreateInput>;
};
export type CollateralPositionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CollateralPositionCreateManyInput | Prisma.CollateralPositionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CollateralPositionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CollateralPositionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CollateralPositionOmit<ExtArgs> | null;
    data: Prisma.CollateralPositionCreateManyInput | Prisma.CollateralPositionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CollateralPositionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CollateralPositionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CollateralPositionSelect<ExtArgs> | null;
    omit?: Prisma.CollateralPositionOmit<ExtArgs> | null;
    include?: Prisma.CollateralPositionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CollateralPositionUpdateInput, Prisma.CollateralPositionUncheckedUpdateInput>;
    where: Prisma.CollateralPositionWhereUniqueInput;
};
export type CollateralPositionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CollateralPositionUpdateManyMutationInput, Prisma.CollateralPositionUncheckedUpdateManyInput>;
    where?: Prisma.CollateralPositionWhereInput;
    limit?: number;
};
export type CollateralPositionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CollateralPositionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CollateralPositionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CollateralPositionUpdateManyMutationInput, Prisma.CollateralPositionUncheckedUpdateManyInput>;
    where?: Prisma.CollateralPositionWhereInput;
    limit?: number;
    include?: Prisma.CollateralPositionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CollateralPositionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CollateralPositionSelect<ExtArgs> | null;
    omit?: Prisma.CollateralPositionOmit<ExtArgs> | null;
    include?: Prisma.CollateralPositionInclude<ExtArgs> | null;
    where: Prisma.CollateralPositionWhereUniqueInput;
    create: Prisma.XOR<Prisma.CollateralPositionCreateInput, Prisma.CollateralPositionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CollateralPositionUpdateInput, Prisma.CollateralPositionUncheckedUpdateInput>;
};
export type CollateralPositionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CollateralPositionSelect<ExtArgs> | null;
    omit?: Prisma.CollateralPositionOmit<ExtArgs> | null;
    include?: Prisma.CollateralPositionInclude<ExtArgs> | null;
    where: Prisma.CollateralPositionWhereUniqueInput;
};
export type CollateralPositionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CollateralPositionWhereInput;
    limit?: number;
};
export type CollateralPositionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CollateralPositionSelect<ExtArgs> | null;
    omit?: Prisma.CollateralPositionOmit<ExtArgs> | null;
    include?: Prisma.CollateralPositionInclude<ExtArgs> | null;
};
export {};
