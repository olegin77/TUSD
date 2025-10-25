import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
export type BlockchainEventModel = runtime.Types.Result.DefaultSelection<Prisma.$BlockchainEventPayload>;
export type AggregateBlockchainEvent = {
    _count: BlockchainEventCountAggregateOutputType | null;
    _avg: BlockchainEventAvgAggregateOutputType | null;
    _sum: BlockchainEventSumAggregateOutputType | null;
    _min: BlockchainEventMinAggregateOutputType | null;
    _max: BlockchainEventMaxAggregateOutputType | null;
};
export type BlockchainEventAvgAggregateOutputType = {
    id: number | null;
};
export type BlockchainEventSumAggregateOutputType = {
    id: bigint | null;
};
export type BlockchainEventMinAggregateOutputType = {
    id: bigint | null;
    chain: string | null;
    tx_hash: string | null;
    event_type: string | null;
    processed: boolean | null;
    created_at: Date | null;
};
export type BlockchainEventMaxAggregateOutputType = {
    id: bigint | null;
    chain: string | null;
    tx_hash: string | null;
    event_type: string | null;
    processed: boolean | null;
    created_at: Date | null;
};
export type BlockchainEventCountAggregateOutputType = {
    id: number;
    chain: number;
    tx_hash: number;
    event_type: number;
    data: number;
    processed: number;
    created_at: number;
    _all: number;
};
export type BlockchainEventAvgAggregateInputType = {
    id?: true;
};
export type BlockchainEventSumAggregateInputType = {
    id?: true;
};
export type BlockchainEventMinAggregateInputType = {
    id?: true;
    chain?: true;
    tx_hash?: true;
    event_type?: true;
    processed?: true;
    created_at?: true;
};
export type BlockchainEventMaxAggregateInputType = {
    id?: true;
    chain?: true;
    tx_hash?: true;
    event_type?: true;
    processed?: true;
    created_at?: true;
};
export type BlockchainEventCountAggregateInputType = {
    id?: true;
    chain?: true;
    tx_hash?: true;
    event_type?: true;
    data?: true;
    processed?: true;
    created_at?: true;
    _all?: true;
};
export type BlockchainEventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BlockchainEventWhereInput;
    orderBy?: Prisma.BlockchainEventOrderByWithRelationInput | Prisma.BlockchainEventOrderByWithRelationInput[];
    cursor?: Prisma.BlockchainEventWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BlockchainEventCountAggregateInputType;
    _avg?: BlockchainEventAvgAggregateInputType;
    _sum?: BlockchainEventSumAggregateInputType;
    _min?: BlockchainEventMinAggregateInputType;
    _max?: BlockchainEventMaxAggregateInputType;
};
export type GetBlockchainEventAggregateType<T extends BlockchainEventAggregateArgs> = {
    [P in keyof T & keyof AggregateBlockchainEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBlockchainEvent[P]> : Prisma.GetScalarType<T[P], AggregateBlockchainEvent[P]>;
};
export type BlockchainEventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BlockchainEventWhereInput;
    orderBy?: Prisma.BlockchainEventOrderByWithAggregationInput | Prisma.BlockchainEventOrderByWithAggregationInput[];
    by: Prisma.BlockchainEventScalarFieldEnum[] | Prisma.BlockchainEventScalarFieldEnum;
    having?: Prisma.BlockchainEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BlockchainEventCountAggregateInputType | true;
    _avg?: BlockchainEventAvgAggregateInputType;
    _sum?: BlockchainEventSumAggregateInputType;
    _min?: BlockchainEventMinAggregateInputType;
    _max?: BlockchainEventMaxAggregateInputType;
};
export type BlockchainEventGroupByOutputType = {
    id: bigint;
    chain: string;
    tx_hash: string;
    event_type: string;
    data: runtime.JsonValue;
    processed: boolean;
    created_at: Date;
    _count: BlockchainEventCountAggregateOutputType | null;
    _avg: BlockchainEventAvgAggregateOutputType | null;
    _sum: BlockchainEventSumAggregateOutputType | null;
    _min: BlockchainEventMinAggregateOutputType | null;
    _max: BlockchainEventMaxAggregateOutputType | null;
};
type GetBlockchainEventGroupByPayload<T extends BlockchainEventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BlockchainEventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BlockchainEventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BlockchainEventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BlockchainEventGroupByOutputType[P]>;
}>>;
export type BlockchainEventWhereInput = {
    AND?: Prisma.BlockchainEventWhereInput | Prisma.BlockchainEventWhereInput[];
    OR?: Prisma.BlockchainEventWhereInput[];
    NOT?: Prisma.BlockchainEventWhereInput | Prisma.BlockchainEventWhereInput[];
    id?: Prisma.BigIntFilter<"BlockchainEvent"> | bigint | number;
    chain?: Prisma.StringFilter<"BlockchainEvent"> | string;
    tx_hash?: Prisma.StringFilter<"BlockchainEvent"> | string;
    event_type?: Prisma.StringFilter<"BlockchainEvent"> | string;
    data?: Prisma.JsonFilter<"BlockchainEvent">;
    processed?: Prisma.BoolFilter<"BlockchainEvent"> | boolean;
    created_at?: Prisma.DateTimeFilter<"BlockchainEvent"> | Date | string;
};
export type BlockchainEventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    chain?: Prisma.SortOrder;
    tx_hash?: Prisma.SortOrder;
    event_type?: Prisma.SortOrder;
    data?: Prisma.SortOrder;
    processed?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type BlockchainEventWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number;
    AND?: Prisma.BlockchainEventWhereInput | Prisma.BlockchainEventWhereInput[];
    OR?: Prisma.BlockchainEventWhereInput[];
    NOT?: Prisma.BlockchainEventWhereInput | Prisma.BlockchainEventWhereInput[];
    chain?: Prisma.StringFilter<"BlockchainEvent"> | string;
    tx_hash?: Prisma.StringFilter<"BlockchainEvent"> | string;
    event_type?: Prisma.StringFilter<"BlockchainEvent"> | string;
    data?: Prisma.JsonFilter<"BlockchainEvent">;
    processed?: Prisma.BoolFilter<"BlockchainEvent"> | boolean;
    created_at?: Prisma.DateTimeFilter<"BlockchainEvent"> | Date | string;
}, "id">;
export type BlockchainEventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    chain?: Prisma.SortOrder;
    tx_hash?: Prisma.SortOrder;
    event_type?: Prisma.SortOrder;
    data?: Prisma.SortOrder;
    processed?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.BlockchainEventCountOrderByAggregateInput;
    _avg?: Prisma.BlockchainEventAvgOrderByAggregateInput;
    _max?: Prisma.BlockchainEventMaxOrderByAggregateInput;
    _min?: Prisma.BlockchainEventMinOrderByAggregateInput;
    _sum?: Prisma.BlockchainEventSumOrderByAggregateInput;
};
export type BlockchainEventScalarWhereWithAggregatesInput = {
    AND?: Prisma.BlockchainEventScalarWhereWithAggregatesInput | Prisma.BlockchainEventScalarWhereWithAggregatesInput[];
    OR?: Prisma.BlockchainEventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BlockchainEventScalarWhereWithAggregatesInput | Prisma.BlockchainEventScalarWhereWithAggregatesInput[];
    id?: Prisma.BigIntWithAggregatesFilter<"BlockchainEvent"> | bigint | number;
    chain?: Prisma.StringWithAggregatesFilter<"BlockchainEvent"> | string;
    tx_hash?: Prisma.StringWithAggregatesFilter<"BlockchainEvent"> | string;
    event_type?: Prisma.StringWithAggregatesFilter<"BlockchainEvent"> | string;
    data?: Prisma.JsonWithAggregatesFilter<"BlockchainEvent">;
    processed?: Prisma.BoolWithAggregatesFilter<"BlockchainEvent"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"BlockchainEvent"> | Date | string;
};
export type BlockchainEventCreateInput = {
    id?: bigint | number;
    chain: string;
    tx_hash: string;
    event_type: string;
    data: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    processed?: boolean;
    created_at?: Date | string;
};
export type BlockchainEventUncheckedCreateInput = {
    id?: bigint | number;
    chain: string;
    tx_hash: string;
    event_type: string;
    data: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    processed?: boolean;
    created_at?: Date | string;
};
export type BlockchainEventUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    chain?: Prisma.StringFieldUpdateOperationsInput | string;
    tx_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    event_type?: Prisma.StringFieldUpdateOperationsInput | string;
    data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    processed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlockchainEventUncheckedUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    chain?: Prisma.StringFieldUpdateOperationsInput | string;
    tx_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    event_type?: Prisma.StringFieldUpdateOperationsInput | string;
    data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    processed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlockchainEventCreateManyInput = {
    id?: bigint | number;
    chain: string;
    tx_hash: string;
    event_type: string;
    data: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    processed?: boolean;
    created_at?: Date | string;
};
export type BlockchainEventUpdateManyMutationInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    chain?: Prisma.StringFieldUpdateOperationsInput | string;
    tx_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    event_type?: Prisma.StringFieldUpdateOperationsInput | string;
    data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    processed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlockchainEventUncheckedUpdateManyInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    chain?: Prisma.StringFieldUpdateOperationsInput | string;
    tx_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    event_type?: Prisma.StringFieldUpdateOperationsInput | string;
    data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    processed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlockchainEventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    chain?: Prisma.SortOrder;
    tx_hash?: Prisma.SortOrder;
    event_type?: Prisma.SortOrder;
    data?: Prisma.SortOrder;
    processed?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type BlockchainEventAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type BlockchainEventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    chain?: Prisma.SortOrder;
    tx_hash?: Prisma.SortOrder;
    event_type?: Prisma.SortOrder;
    processed?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type BlockchainEventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    chain?: Prisma.SortOrder;
    tx_hash?: Prisma.SortOrder;
    event_type?: Prisma.SortOrder;
    processed?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type BlockchainEventSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type BlockchainEventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    chain?: boolean;
    tx_hash?: boolean;
    event_type?: boolean;
    data?: boolean;
    processed?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["blockchainEvent"]>;
export type BlockchainEventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    chain?: boolean;
    tx_hash?: boolean;
    event_type?: boolean;
    data?: boolean;
    processed?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["blockchainEvent"]>;
export type BlockchainEventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    chain?: boolean;
    tx_hash?: boolean;
    event_type?: boolean;
    data?: boolean;
    processed?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["blockchainEvent"]>;
export type BlockchainEventSelectScalar = {
    id?: boolean;
    chain?: boolean;
    tx_hash?: boolean;
    event_type?: boolean;
    data?: boolean;
    processed?: boolean;
    created_at?: boolean;
};
export type BlockchainEventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "chain" | "tx_hash" | "event_type" | "data" | "processed" | "created_at", ExtArgs["result"]["blockchainEvent"]>;
export type $BlockchainEventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BlockchainEvent";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: bigint;
        chain: string;
        tx_hash: string;
        event_type: string;
        data: runtime.JsonValue;
        processed: boolean;
        created_at: Date;
    }, ExtArgs["result"]["blockchainEvent"]>;
    composites: {};
};
export type BlockchainEventGetPayload<S extends boolean | null | undefined | BlockchainEventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BlockchainEventPayload, S>;
export type BlockchainEventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BlockchainEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BlockchainEventCountAggregateInputType | true;
};
export interface BlockchainEventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BlockchainEvent'];
        meta: {
            name: 'BlockchainEvent';
        };
    };
    findUnique<T extends BlockchainEventFindUniqueArgs>(args: Prisma.SelectSubset<T, BlockchainEventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BlockchainEventClient<runtime.Types.Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BlockchainEventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BlockchainEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BlockchainEventClient<runtime.Types.Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BlockchainEventFindFirstArgs>(args?: Prisma.SelectSubset<T, BlockchainEventFindFirstArgs<ExtArgs>>): Prisma.Prisma__BlockchainEventClient<runtime.Types.Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BlockchainEventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BlockchainEventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BlockchainEventClient<runtime.Types.Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BlockchainEventFindManyArgs>(args?: Prisma.SelectSubset<T, BlockchainEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BlockchainEventCreateArgs>(args: Prisma.SelectSubset<T, BlockchainEventCreateArgs<ExtArgs>>): Prisma.Prisma__BlockchainEventClient<runtime.Types.Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BlockchainEventCreateManyArgs>(args?: Prisma.SelectSubset<T, BlockchainEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BlockchainEventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BlockchainEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BlockchainEventDeleteArgs>(args: Prisma.SelectSubset<T, BlockchainEventDeleteArgs<ExtArgs>>): Prisma.Prisma__BlockchainEventClient<runtime.Types.Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BlockchainEventUpdateArgs>(args: Prisma.SelectSubset<T, BlockchainEventUpdateArgs<ExtArgs>>): Prisma.Prisma__BlockchainEventClient<runtime.Types.Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BlockchainEventDeleteManyArgs>(args?: Prisma.SelectSubset<T, BlockchainEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BlockchainEventUpdateManyArgs>(args: Prisma.SelectSubset<T, BlockchainEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BlockchainEventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BlockchainEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BlockchainEventUpsertArgs>(args: Prisma.SelectSubset<T, BlockchainEventUpsertArgs<ExtArgs>>): Prisma.Prisma__BlockchainEventClient<runtime.Types.Result.GetResult<Prisma.$BlockchainEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BlockchainEventCountArgs>(args?: Prisma.Subset<T, BlockchainEventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BlockchainEventCountAggregateOutputType> : number>;
    aggregate<T extends BlockchainEventAggregateArgs>(args: Prisma.Subset<T, BlockchainEventAggregateArgs>): Prisma.PrismaPromise<GetBlockchainEventAggregateType<T>>;
    groupBy<T extends BlockchainEventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BlockchainEventGroupByArgs['orderBy'];
    } : {
        orderBy?: BlockchainEventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BlockchainEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBlockchainEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BlockchainEventFieldRefs;
}
export interface Prisma__BlockchainEventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BlockchainEventFieldRefs {
    readonly id: Prisma.FieldRef<"BlockchainEvent", 'BigInt'>;
    readonly chain: Prisma.FieldRef<"BlockchainEvent", 'String'>;
    readonly tx_hash: Prisma.FieldRef<"BlockchainEvent", 'String'>;
    readonly event_type: Prisma.FieldRef<"BlockchainEvent", 'String'>;
    readonly data: Prisma.FieldRef<"BlockchainEvent", 'Json'>;
    readonly processed: Prisma.FieldRef<"BlockchainEvent", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"BlockchainEvent", 'DateTime'>;
}
export type BlockchainEventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlockchainEventSelect<ExtArgs> | null;
    omit?: Prisma.BlockchainEventOmit<ExtArgs> | null;
    where: Prisma.BlockchainEventWhereUniqueInput;
};
export type BlockchainEventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlockchainEventSelect<ExtArgs> | null;
    omit?: Prisma.BlockchainEventOmit<ExtArgs> | null;
    where: Prisma.BlockchainEventWhereUniqueInput;
};
export type BlockchainEventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlockchainEventSelect<ExtArgs> | null;
    omit?: Prisma.BlockchainEventOmit<ExtArgs> | null;
    where?: Prisma.BlockchainEventWhereInput;
    orderBy?: Prisma.BlockchainEventOrderByWithRelationInput | Prisma.BlockchainEventOrderByWithRelationInput[];
    cursor?: Prisma.BlockchainEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BlockchainEventScalarFieldEnum | Prisma.BlockchainEventScalarFieldEnum[];
};
export type BlockchainEventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlockchainEventSelect<ExtArgs> | null;
    omit?: Prisma.BlockchainEventOmit<ExtArgs> | null;
    where?: Prisma.BlockchainEventWhereInput;
    orderBy?: Prisma.BlockchainEventOrderByWithRelationInput | Prisma.BlockchainEventOrderByWithRelationInput[];
    cursor?: Prisma.BlockchainEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BlockchainEventScalarFieldEnum | Prisma.BlockchainEventScalarFieldEnum[];
};
export type BlockchainEventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlockchainEventSelect<ExtArgs> | null;
    omit?: Prisma.BlockchainEventOmit<ExtArgs> | null;
    where?: Prisma.BlockchainEventWhereInput;
    orderBy?: Prisma.BlockchainEventOrderByWithRelationInput | Prisma.BlockchainEventOrderByWithRelationInput[];
    cursor?: Prisma.BlockchainEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BlockchainEventScalarFieldEnum | Prisma.BlockchainEventScalarFieldEnum[];
};
export type BlockchainEventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlockchainEventSelect<ExtArgs> | null;
    omit?: Prisma.BlockchainEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BlockchainEventCreateInput, Prisma.BlockchainEventUncheckedCreateInput>;
};
export type BlockchainEventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BlockchainEventCreateManyInput | Prisma.BlockchainEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BlockchainEventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlockchainEventSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BlockchainEventOmit<ExtArgs> | null;
    data: Prisma.BlockchainEventCreateManyInput | Prisma.BlockchainEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BlockchainEventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlockchainEventSelect<ExtArgs> | null;
    omit?: Prisma.BlockchainEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BlockchainEventUpdateInput, Prisma.BlockchainEventUncheckedUpdateInput>;
    where: Prisma.BlockchainEventWhereUniqueInput;
};
export type BlockchainEventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BlockchainEventUpdateManyMutationInput, Prisma.BlockchainEventUncheckedUpdateManyInput>;
    where?: Prisma.BlockchainEventWhereInput;
    limit?: number;
};
export type BlockchainEventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlockchainEventSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BlockchainEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BlockchainEventUpdateManyMutationInput, Prisma.BlockchainEventUncheckedUpdateManyInput>;
    where?: Prisma.BlockchainEventWhereInput;
    limit?: number;
};
export type BlockchainEventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlockchainEventSelect<ExtArgs> | null;
    omit?: Prisma.BlockchainEventOmit<ExtArgs> | null;
    where: Prisma.BlockchainEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.BlockchainEventCreateInput, Prisma.BlockchainEventUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BlockchainEventUpdateInput, Prisma.BlockchainEventUncheckedUpdateInput>;
};
export type BlockchainEventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlockchainEventSelect<ExtArgs> | null;
    omit?: Prisma.BlockchainEventOmit<ExtArgs> | null;
    where: Prisma.BlockchainEventWhereUniqueInput;
};
export type BlockchainEventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BlockchainEventWhereInput;
    limit?: number;
};
export type BlockchainEventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlockchainEventSelect<ExtArgs> | null;
    omit?: Prisma.BlockchainEventOmit<ExtArgs> | null;
};
export {};
