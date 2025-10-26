import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TokenPriceModel = runtime.Types.Result.DefaultSelection<Prisma.$TokenPricePayload>;
export type AggregateTokenPrice = {
    _count: TokenPriceCountAggregateOutputType | null;
    _avg: TokenPriceAvgAggregateOutputType | null;
    _sum: TokenPriceSumAggregateOutputType | null;
    _min: TokenPriceMinAggregateOutputType | null;
    _max: TokenPriceMaxAggregateOutputType | null;
};
export type TokenPriceAvgAggregateOutputType = {
    id: number | null;
    price_usd: number | null;
};
export type TokenPriceSumAggregateOutputType = {
    id: bigint | null;
    price_usd: bigint | null;
};
export type TokenPriceMinAggregateOutputType = {
    id: bigint | null;
    token_mint: string | null;
    price_usd: bigint | null;
    source: string | null;
    updated_at: Date | null;
};
export type TokenPriceMaxAggregateOutputType = {
    id: bigint | null;
    token_mint: string | null;
    price_usd: bigint | null;
    source: string | null;
    updated_at: Date | null;
};
export type TokenPriceCountAggregateOutputType = {
    id: number;
    token_mint: number;
    price_usd: number;
    source: number;
    updated_at: number;
    _all: number;
};
export type TokenPriceAvgAggregateInputType = {
    id?: true;
    price_usd?: true;
};
export type TokenPriceSumAggregateInputType = {
    id?: true;
    price_usd?: true;
};
export type TokenPriceMinAggregateInputType = {
    id?: true;
    token_mint?: true;
    price_usd?: true;
    source?: true;
    updated_at?: true;
};
export type TokenPriceMaxAggregateInputType = {
    id?: true;
    token_mint?: true;
    price_usd?: true;
    source?: true;
    updated_at?: true;
};
export type TokenPriceCountAggregateInputType = {
    id?: true;
    token_mint?: true;
    price_usd?: true;
    source?: true;
    updated_at?: true;
    _all?: true;
};
export type TokenPriceAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TokenPriceWhereInput;
    orderBy?: Prisma.TokenPriceOrderByWithRelationInput | Prisma.TokenPriceOrderByWithRelationInput[];
    cursor?: Prisma.TokenPriceWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TokenPriceCountAggregateInputType;
    _avg?: TokenPriceAvgAggregateInputType;
    _sum?: TokenPriceSumAggregateInputType;
    _min?: TokenPriceMinAggregateInputType;
    _max?: TokenPriceMaxAggregateInputType;
};
export type GetTokenPriceAggregateType<T extends TokenPriceAggregateArgs> = {
    [P in keyof T & keyof AggregateTokenPrice]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTokenPrice[P]> : Prisma.GetScalarType<T[P], AggregateTokenPrice[P]>;
};
export type TokenPriceGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TokenPriceWhereInput;
    orderBy?: Prisma.TokenPriceOrderByWithAggregationInput | Prisma.TokenPriceOrderByWithAggregationInput[];
    by: Prisma.TokenPriceScalarFieldEnum[] | Prisma.TokenPriceScalarFieldEnum;
    having?: Prisma.TokenPriceScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TokenPriceCountAggregateInputType | true;
    _avg?: TokenPriceAvgAggregateInputType;
    _sum?: TokenPriceSumAggregateInputType;
    _min?: TokenPriceMinAggregateInputType;
    _max?: TokenPriceMaxAggregateInputType;
};
export type TokenPriceGroupByOutputType = {
    id: bigint;
    token_mint: string;
    price_usd: bigint;
    source: string;
    updated_at: Date;
    _count: TokenPriceCountAggregateOutputType | null;
    _avg: TokenPriceAvgAggregateOutputType | null;
    _sum: TokenPriceSumAggregateOutputType | null;
    _min: TokenPriceMinAggregateOutputType | null;
    _max: TokenPriceMaxAggregateOutputType | null;
};
type GetTokenPriceGroupByPayload<T extends TokenPriceGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TokenPriceGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TokenPriceGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TokenPriceGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TokenPriceGroupByOutputType[P]>;
}>>;
export type TokenPriceWhereInput = {
    AND?: Prisma.TokenPriceWhereInput | Prisma.TokenPriceWhereInput[];
    OR?: Prisma.TokenPriceWhereInput[];
    NOT?: Prisma.TokenPriceWhereInput | Prisma.TokenPriceWhereInput[];
    id?: Prisma.BigIntFilter<"TokenPrice"> | bigint | number;
    token_mint?: Prisma.StringFilter<"TokenPrice"> | string;
    price_usd?: Prisma.BigIntFilter<"TokenPrice"> | bigint | number;
    source?: Prisma.StringFilter<"TokenPrice"> | string;
    updated_at?: Prisma.DateTimeFilter<"TokenPrice"> | Date | string;
};
export type TokenPriceOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    token_mint?: Prisma.SortOrder;
    price_usd?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type TokenPriceWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number;
    token_mint?: string;
    AND?: Prisma.TokenPriceWhereInput | Prisma.TokenPriceWhereInput[];
    OR?: Prisma.TokenPriceWhereInput[];
    NOT?: Prisma.TokenPriceWhereInput | Prisma.TokenPriceWhereInput[];
    price_usd?: Prisma.BigIntFilter<"TokenPrice"> | bigint | number;
    source?: Prisma.StringFilter<"TokenPrice"> | string;
    updated_at?: Prisma.DateTimeFilter<"TokenPrice"> | Date | string;
}, "id" | "token_mint">;
export type TokenPriceOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    token_mint?: Prisma.SortOrder;
    price_usd?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    _count?: Prisma.TokenPriceCountOrderByAggregateInput;
    _avg?: Prisma.TokenPriceAvgOrderByAggregateInput;
    _max?: Prisma.TokenPriceMaxOrderByAggregateInput;
    _min?: Prisma.TokenPriceMinOrderByAggregateInput;
    _sum?: Prisma.TokenPriceSumOrderByAggregateInput;
};
export type TokenPriceScalarWhereWithAggregatesInput = {
    AND?: Prisma.TokenPriceScalarWhereWithAggregatesInput | Prisma.TokenPriceScalarWhereWithAggregatesInput[];
    OR?: Prisma.TokenPriceScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TokenPriceScalarWhereWithAggregatesInput | Prisma.TokenPriceScalarWhereWithAggregatesInput[];
    id?: Prisma.BigIntWithAggregatesFilter<"TokenPrice"> | bigint | number;
    token_mint?: Prisma.StringWithAggregatesFilter<"TokenPrice"> | string;
    price_usd?: Prisma.BigIntWithAggregatesFilter<"TokenPrice"> | bigint | number;
    source?: Prisma.StringWithAggregatesFilter<"TokenPrice"> | string;
    updated_at?: Prisma.DateTimeWithAggregatesFilter<"TokenPrice"> | Date | string;
};
export type TokenPriceCreateInput = {
    id?: bigint | number;
    token_mint: string;
    price_usd: bigint | number;
    source: string;
    updated_at?: Date | string;
};
export type TokenPriceUncheckedCreateInput = {
    id?: bigint | number;
    token_mint: string;
    price_usd: bigint | number;
    source: string;
    updated_at?: Date | string;
};
export type TokenPriceUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    token_mint?: Prisma.StringFieldUpdateOperationsInput | string;
    price_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TokenPriceUncheckedUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    token_mint?: Prisma.StringFieldUpdateOperationsInput | string;
    price_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TokenPriceCreateManyInput = {
    id?: bigint | number;
    token_mint: string;
    price_usd: bigint | number;
    source: string;
    updated_at?: Date | string;
};
export type TokenPriceUpdateManyMutationInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    token_mint?: Prisma.StringFieldUpdateOperationsInput | string;
    price_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TokenPriceUncheckedUpdateManyInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    token_mint?: Prisma.StringFieldUpdateOperationsInput | string;
    price_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TokenPriceCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    token_mint?: Prisma.SortOrder;
    price_usd?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type TokenPriceAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    price_usd?: Prisma.SortOrder;
};
export type TokenPriceMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    token_mint?: Prisma.SortOrder;
    price_usd?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type TokenPriceMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    token_mint?: Prisma.SortOrder;
    price_usd?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type TokenPriceSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    price_usd?: Prisma.SortOrder;
};
export type TokenPriceSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    token_mint?: boolean;
    price_usd?: boolean;
    source?: boolean;
    updated_at?: boolean;
}, ExtArgs["result"]["tokenPrice"]>;
export type TokenPriceSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    token_mint?: boolean;
    price_usd?: boolean;
    source?: boolean;
    updated_at?: boolean;
}, ExtArgs["result"]["tokenPrice"]>;
export type TokenPriceSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    token_mint?: boolean;
    price_usd?: boolean;
    source?: boolean;
    updated_at?: boolean;
}, ExtArgs["result"]["tokenPrice"]>;
export type TokenPriceSelectScalar = {
    id?: boolean;
    token_mint?: boolean;
    price_usd?: boolean;
    source?: boolean;
    updated_at?: boolean;
};
export type TokenPriceOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "token_mint" | "price_usd" | "source" | "updated_at", ExtArgs["result"]["tokenPrice"]>;
export type $TokenPricePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TokenPrice";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: bigint;
        token_mint: string;
        price_usd: bigint;
        source: string;
        updated_at: Date;
    }, ExtArgs["result"]["tokenPrice"]>;
    composites: {};
};
export type TokenPriceGetPayload<S extends boolean | null | undefined | TokenPriceDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TokenPricePayload, S>;
export type TokenPriceCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TokenPriceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TokenPriceCountAggregateInputType | true;
};
export interface TokenPriceDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TokenPrice'];
        meta: {
            name: 'TokenPrice';
        };
    };
    findUnique<T extends TokenPriceFindUniqueArgs>(args: Prisma.SelectSubset<T, TokenPriceFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TokenPriceClient<runtime.Types.Result.GetResult<Prisma.$TokenPricePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TokenPriceFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TokenPriceFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TokenPriceClient<runtime.Types.Result.GetResult<Prisma.$TokenPricePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TokenPriceFindFirstArgs>(args?: Prisma.SelectSubset<T, TokenPriceFindFirstArgs<ExtArgs>>): Prisma.Prisma__TokenPriceClient<runtime.Types.Result.GetResult<Prisma.$TokenPricePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TokenPriceFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TokenPriceFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TokenPriceClient<runtime.Types.Result.GetResult<Prisma.$TokenPricePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TokenPriceFindManyArgs>(args?: Prisma.SelectSubset<T, TokenPriceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TokenPricePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TokenPriceCreateArgs>(args: Prisma.SelectSubset<T, TokenPriceCreateArgs<ExtArgs>>): Prisma.Prisma__TokenPriceClient<runtime.Types.Result.GetResult<Prisma.$TokenPricePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TokenPriceCreateManyArgs>(args?: Prisma.SelectSubset<T, TokenPriceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TokenPriceCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TokenPriceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TokenPricePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TokenPriceDeleteArgs>(args: Prisma.SelectSubset<T, TokenPriceDeleteArgs<ExtArgs>>): Prisma.Prisma__TokenPriceClient<runtime.Types.Result.GetResult<Prisma.$TokenPricePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TokenPriceUpdateArgs>(args: Prisma.SelectSubset<T, TokenPriceUpdateArgs<ExtArgs>>): Prisma.Prisma__TokenPriceClient<runtime.Types.Result.GetResult<Prisma.$TokenPricePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TokenPriceDeleteManyArgs>(args?: Prisma.SelectSubset<T, TokenPriceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TokenPriceUpdateManyArgs>(args: Prisma.SelectSubset<T, TokenPriceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TokenPriceUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TokenPriceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TokenPricePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TokenPriceUpsertArgs>(args: Prisma.SelectSubset<T, TokenPriceUpsertArgs<ExtArgs>>): Prisma.Prisma__TokenPriceClient<runtime.Types.Result.GetResult<Prisma.$TokenPricePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TokenPriceCountArgs>(args?: Prisma.Subset<T, TokenPriceCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TokenPriceCountAggregateOutputType> : number>;
    aggregate<T extends TokenPriceAggregateArgs>(args: Prisma.Subset<T, TokenPriceAggregateArgs>): Prisma.PrismaPromise<GetTokenPriceAggregateType<T>>;
    groupBy<T extends TokenPriceGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TokenPriceGroupByArgs['orderBy'];
    } : {
        orderBy?: TokenPriceGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TokenPriceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTokenPriceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TokenPriceFieldRefs;
}
export interface Prisma__TokenPriceClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TokenPriceFieldRefs {
    readonly id: Prisma.FieldRef<"TokenPrice", 'BigInt'>;
    readonly token_mint: Prisma.FieldRef<"TokenPrice", 'String'>;
    readonly price_usd: Prisma.FieldRef<"TokenPrice", 'BigInt'>;
    readonly source: Prisma.FieldRef<"TokenPrice", 'String'>;
    readonly updated_at: Prisma.FieldRef<"TokenPrice", 'DateTime'>;
}
export type TokenPriceFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TokenPriceSelect<ExtArgs> | null;
    omit?: Prisma.TokenPriceOmit<ExtArgs> | null;
    where: Prisma.TokenPriceWhereUniqueInput;
};
export type TokenPriceFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TokenPriceSelect<ExtArgs> | null;
    omit?: Prisma.TokenPriceOmit<ExtArgs> | null;
    where: Prisma.TokenPriceWhereUniqueInput;
};
export type TokenPriceFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TokenPriceSelect<ExtArgs> | null;
    omit?: Prisma.TokenPriceOmit<ExtArgs> | null;
    where?: Prisma.TokenPriceWhereInput;
    orderBy?: Prisma.TokenPriceOrderByWithRelationInput | Prisma.TokenPriceOrderByWithRelationInput[];
    cursor?: Prisma.TokenPriceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TokenPriceScalarFieldEnum | Prisma.TokenPriceScalarFieldEnum[];
};
export type TokenPriceFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TokenPriceSelect<ExtArgs> | null;
    omit?: Prisma.TokenPriceOmit<ExtArgs> | null;
    where?: Prisma.TokenPriceWhereInput;
    orderBy?: Prisma.TokenPriceOrderByWithRelationInput | Prisma.TokenPriceOrderByWithRelationInput[];
    cursor?: Prisma.TokenPriceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TokenPriceScalarFieldEnum | Prisma.TokenPriceScalarFieldEnum[];
};
export type TokenPriceFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TokenPriceSelect<ExtArgs> | null;
    omit?: Prisma.TokenPriceOmit<ExtArgs> | null;
    where?: Prisma.TokenPriceWhereInput;
    orderBy?: Prisma.TokenPriceOrderByWithRelationInput | Prisma.TokenPriceOrderByWithRelationInput[];
    cursor?: Prisma.TokenPriceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TokenPriceScalarFieldEnum | Prisma.TokenPriceScalarFieldEnum[];
};
export type TokenPriceCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TokenPriceSelect<ExtArgs> | null;
    omit?: Prisma.TokenPriceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TokenPriceCreateInput, Prisma.TokenPriceUncheckedCreateInput>;
};
export type TokenPriceCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TokenPriceCreateManyInput | Prisma.TokenPriceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TokenPriceCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TokenPriceSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TokenPriceOmit<ExtArgs> | null;
    data: Prisma.TokenPriceCreateManyInput | Prisma.TokenPriceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TokenPriceUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TokenPriceSelect<ExtArgs> | null;
    omit?: Prisma.TokenPriceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TokenPriceUpdateInput, Prisma.TokenPriceUncheckedUpdateInput>;
    where: Prisma.TokenPriceWhereUniqueInput;
};
export type TokenPriceUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TokenPriceUpdateManyMutationInput, Prisma.TokenPriceUncheckedUpdateManyInput>;
    where?: Prisma.TokenPriceWhereInput;
    limit?: number;
};
export type TokenPriceUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TokenPriceSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TokenPriceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TokenPriceUpdateManyMutationInput, Prisma.TokenPriceUncheckedUpdateManyInput>;
    where?: Prisma.TokenPriceWhereInput;
    limit?: number;
};
export type TokenPriceUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TokenPriceSelect<ExtArgs> | null;
    omit?: Prisma.TokenPriceOmit<ExtArgs> | null;
    where: Prisma.TokenPriceWhereUniqueInput;
    create: Prisma.XOR<Prisma.TokenPriceCreateInput, Prisma.TokenPriceUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TokenPriceUpdateInput, Prisma.TokenPriceUncheckedUpdateInput>;
};
export type TokenPriceDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TokenPriceSelect<ExtArgs> | null;
    omit?: Prisma.TokenPriceOmit<ExtArgs> | null;
    where: Prisma.TokenPriceWhereUniqueInput;
};
export type TokenPriceDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TokenPriceWhereInput;
    limit?: number;
};
export type TokenPriceDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TokenPriceSelect<ExtArgs> | null;
    omit?: Prisma.TokenPriceOmit<ExtArgs> | null;
};
export {};
