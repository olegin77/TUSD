import type * as runtime from '@prisma/client/runtime/library';
import type * as Prisma from '../internal/prismaNamespace.js';
export type ListingModel = runtime.Types.Result.DefaultSelection<Prisma.$ListingPayload>;
export type AggregateListing = {
    _count: ListingCountAggregateOutputType | null;
    _avg: ListingAvgAggregateOutputType | null;
    _sum: ListingSumAggregateOutputType | null;
    _min: ListingMinAggregateOutputType | null;
    _max: ListingMaxAggregateOutputType | null;
};
export type ListingAvgAggregateOutputType = {
    id: number | null;
    wexel_id: number | null;
    ask_price_usd: number | null;
    min_bid_usd: number | null;
};
export type ListingSumAggregateOutputType = {
    id: bigint | null;
    wexel_id: bigint | null;
    ask_price_usd: bigint | null;
    min_bid_usd: bigint | null;
};
export type ListingMinAggregateOutputType = {
    id: bigint | null;
    wexel_id: bigint | null;
    ask_price_usd: bigint | null;
    auction: boolean | null;
    min_bid_usd: bigint | null;
    expiry_ts: Date | null;
    status: string | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type ListingMaxAggregateOutputType = {
    id: bigint | null;
    wexel_id: bigint | null;
    ask_price_usd: bigint | null;
    auction: boolean | null;
    min_bid_usd: bigint | null;
    expiry_ts: Date | null;
    status: string | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type ListingCountAggregateOutputType = {
    id: number;
    wexel_id: number;
    ask_price_usd: number;
    auction: number;
    min_bid_usd: number;
    expiry_ts: number;
    status: number;
    created_at: number;
    updated_at: number;
    _all: number;
};
export type ListingAvgAggregateInputType = {
    id?: true;
    wexel_id?: true;
    ask_price_usd?: true;
    min_bid_usd?: true;
};
export type ListingSumAggregateInputType = {
    id?: true;
    wexel_id?: true;
    ask_price_usd?: true;
    min_bid_usd?: true;
};
export type ListingMinAggregateInputType = {
    id?: true;
    wexel_id?: true;
    ask_price_usd?: true;
    auction?: true;
    min_bid_usd?: true;
    expiry_ts?: true;
    status?: true;
    created_at?: true;
    updated_at?: true;
};
export type ListingMaxAggregateInputType = {
    id?: true;
    wexel_id?: true;
    ask_price_usd?: true;
    auction?: true;
    min_bid_usd?: true;
    expiry_ts?: true;
    status?: true;
    created_at?: true;
    updated_at?: true;
};
export type ListingCountAggregateInputType = {
    id?: true;
    wexel_id?: true;
    ask_price_usd?: true;
    auction?: true;
    min_bid_usd?: true;
    expiry_ts?: true;
    status?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
};
export type ListingAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListingWhereInput;
    orderBy?: Prisma.ListingOrderByWithRelationInput | Prisma.ListingOrderByWithRelationInput[];
    cursor?: Prisma.ListingWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ListingCountAggregateInputType;
    _avg?: ListingAvgAggregateInputType;
    _sum?: ListingSumAggregateInputType;
    _min?: ListingMinAggregateInputType;
    _max?: ListingMaxAggregateInputType;
};
export type GetListingAggregateType<T extends ListingAggregateArgs> = {
    [P in keyof T & keyof AggregateListing]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateListing[P]> : Prisma.GetScalarType<T[P], AggregateListing[P]>;
};
export type ListingGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListingWhereInput;
    orderBy?: Prisma.ListingOrderByWithAggregationInput | Prisma.ListingOrderByWithAggregationInput[];
    by: Prisma.ListingScalarFieldEnum[] | Prisma.ListingScalarFieldEnum;
    having?: Prisma.ListingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ListingCountAggregateInputType | true;
    _avg?: ListingAvgAggregateInputType;
    _sum?: ListingSumAggregateInputType;
    _min?: ListingMinAggregateInputType;
    _max?: ListingMaxAggregateInputType;
};
export type ListingGroupByOutputType = {
    id: bigint;
    wexel_id: bigint;
    ask_price_usd: bigint;
    auction: boolean;
    min_bid_usd: bigint | null;
    expiry_ts: Date | null;
    status: string;
    created_at: Date;
    updated_at: Date;
    _count: ListingCountAggregateOutputType | null;
    _avg: ListingAvgAggregateOutputType | null;
    _sum: ListingSumAggregateOutputType | null;
    _min: ListingMinAggregateOutputType | null;
    _max: ListingMaxAggregateOutputType | null;
};
type GetListingGroupByPayload<T extends ListingGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ListingGroupByOutputType, T['by']> & {
    [P in keyof T & keyof ListingGroupByOutputType]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ListingGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ListingGroupByOutputType[P]>;
}>>;
export type ListingWhereInput = {
    AND?: Prisma.ListingWhereInput | Prisma.ListingWhereInput[];
    OR?: Prisma.ListingWhereInput[];
    NOT?: Prisma.ListingWhereInput | Prisma.ListingWhereInput[];
    id?: Prisma.BigIntFilter<'Listing'> | bigint | number;
    wexel_id?: Prisma.BigIntFilter<'Listing'> | bigint | number;
    ask_price_usd?: Prisma.BigIntFilter<'Listing'> | bigint | number;
    auction?: Prisma.BoolFilter<'Listing'> | boolean;
    min_bid_usd?: Prisma.BigIntNullableFilter<'Listing'> | bigint | number | null;
    expiry_ts?: Prisma.DateTimeNullableFilter<'Listing'> | Date | string | null;
    status?: Prisma.StringFilter<'Listing'> | string;
    created_at?: Prisma.DateTimeFilter<'Listing'> | Date | string;
    updated_at?: Prisma.DateTimeFilter<'Listing'> | Date | string;
    wexel?: Prisma.XOR<Prisma.WexelScalarRelationFilter, Prisma.WexelWhereInput>;
};
export type ListingOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    ask_price_usd?: Prisma.SortOrder;
    auction?: Prisma.SortOrder;
    min_bid_usd?: Prisma.SortOrderInput | Prisma.SortOrder;
    expiry_ts?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    wexel?: Prisma.WexelOrderByWithRelationInput;
};
export type ListingWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number;
    AND?: Prisma.ListingWhereInput | Prisma.ListingWhereInput[];
    OR?: Prisma.ListingWhereInput[];
    NOT?: Prisma.ListingWhereInput | Prisma.ListingWhereInput[];
    wexel_id?: Prisma.BigIntFilter<'Listing'> | bigint | number;
    ask_price_usd?: Prisma.BigIntFilter<'Listing'> | bigint | number;
    auction?: Prisma.BoolFilter<'Listing'> | boolean;
    min_bid_usd?: Prisma.BigIntNullableFilter<'Listing'> | bigint | number | null;
    expiry_ts?: Prisma.DateTimeNullableFilter<'Listing'> | Date | string | null;
    status?: Prisma.StringFilter<'Listing'> | string;
    created_at?: Prisma.DateTimeFilter<'Listing'> | Date | string;
    updated_at?: Prisma.DateTimeFilter<'Listing'> | Date | string;
    wexel?: Prisma.XOR<Prisma.WexelScalarRelationFilter, Prisma.WexelWhereInput>;
}, 'id'>;
export type ListingOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    ask_price_usd?: Prisma.SortOrder;
    auction?: Prisma.SortOrder;
    min_bid_usd?: Prisma.SortOrderInput | Prisma.SortOrder;
    expiry_ts?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    _count?: Prisma.ListingCountOrderByAggregateInput;
    _avg?: Prisma.ListingAvgOrderByAggregateInput;
    _max?: Prisma.ListingMaxOrderByAggregateInput;
    _min?: Prisma.ListingMinOrderByAggregateInput;
    _sum?: Prisma.ListingSumOrderByAggregateInput;
};
export type ListingScalarWhereWithAggregatesInput = {
    AND?: Prisma.ListingScalarWhereWithAggregatesInput | Prisma.ListingScalarWhereWithAggregatesInput[];
    OR?: Prisma.ListingScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ListingScalarWhereWithAggregatesInput | Prisma.ListingScalarWhereWithAggregatesInput[];
    id?: Prisma.BigIntWithAggregatesFilter<'Listing'> | bigint | number;
    wexel_id?: Prisma.BigIntWithAggregatesFilter<'Listing'> | bigint | number;
    ask_price_usd?: Prisma.BigIntWithAggregatesFilter<'Listing'> | bigint | number;
    auction?: Prisma.BoolWithAggregatesFilter<'Listing'> | boolean;
    min_bid_usd?: Prisma.BigIntNullableWithAggregatesFilter<'Listing'> | bigint | number | null;
    expiry_ts?: Prisma.DateTimeNullableWithAggregatesFilter<'Listing'> | Date | string | null;
    status?: Prisma.StringWithAggregatesFilter<'Listing'> | string;
    created_at?: Prisma.DateTimeWithAggregatesFilter<'Listing'> | Date | string;
    updated_at?: Prisma.DateTimeWithAggregatesFilter<'Listing'> | Date | string;
};
export type ListingCreateInput = {
    id?: bigint | number;
    ask_price_usd: bigint | number;
    auction?: boolean;
    min_bid_usd?: bigint | number | null;
    expiry_ts?: Date | string | null;
    status?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    wexel: Prisma.WexelCreateNestedOneWithoutListingsInput;
};
export type ListingUncheckedCreateInput = {
    id?: bigint | number;
    wexel_id: bigint | number;
    ask_price_usd: bigint | number;
    auction?: boolean;
    min_bid_usd?: bigint | number | null;
    expiry_ts?: Date | string | null;
    status?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type ListingUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    ask_price_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    auction?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    min_bid_usd?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    expiry_ts?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    wexel?: Prisma.WexelUpdateOneRequiredWithoutListingsNestedInput;
};
export type ListingUncheckedUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    wexel_id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    ask_price_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    auction?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    min_bid_usd?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    expiry_ts?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ListingCreateManyInput = {
    id?: bigint | number;
    wexel_id: bigint | number;
    ask_price_usd: bigint | number;
    auction?: boolean;
    min_bid_usd?: bigint | number | null;
    expiry_ts?: Date | string | null;
    status?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type ListingUpdateManyMutationInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    ask_price_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    auction?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    min_bid_usd?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    expiry_ts?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ListingUncheckedUpdateManyInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    wexel_id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    ask_price_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    auction?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    min_bid_usd?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    expiry_ts?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ListingListRelationFilter = {
    every?: Prisma.ListingWhereInput;
    some?: Prisma.ListingWhereInput;
    none?: Prisma.ListingWhereInput;
};
export type ListingOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ListingCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    ask_price_usd?: Prisma.SortOrder;
    auction?: Prisma.SortOrder;
    min_bid_usd?: Prisma.SortOrder;
    expiry_ts?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type ListingAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    ask_price_usd?: Prisma.SortOrder;
    min_bid_usd?: Prisma.SortOrder;
};
export type ListingMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    ask_price_usd?: Prisma.SortOrder;
    auction?: Prisma.SortOrder;
    min_bid_usd?: Prisma.SortOrder;
    expiry_ts?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type ListingMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    ask_price_usd?: Prisma.SortOrder;
    auction?: Prisma.SortOrder;
    min_bid_usd?: Prisma.SortOrder;
    expiry_ts?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type ListingSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    wexel_id?: Prisma.SortOrder;
    ask_price_usd?: Prisma.SortOrder;
    min_bid_usd?: Prisma.SortOrder;
};
export type ListingCreateNestedManyWithoutWexelInput = {
    create?: Prisma.XOR<Prisma.ListingCreateWithoutWexelInput, Prisma.ListingUncheckedCreateWithoutWexelInput> | Prisma.ListingCreateWithoutWexelInput[] | Prisma.ListingUncheckedCreateWithoutWexelInput[];
    connectOrCreate?: Prisma.ListingCreateOrConnectWithoutWexelInput | Prisma.ListingCreateOrConnectWithoutWexelInput[];
    createMany?: Prisma.ListingCreateManyWexelInputEnvelope;
    connect?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
};
export type ListingUncheckedCreateNestedManyWithoutWexelInput = {
    create?: Prisma.XOR<Prisma.ListingCreateWithoutWexelInput, Prisma.ListingUncheckedCreateWithoutWexelInput> | Prisma.ListingCreateWithoutWexelInput[] | Prisma.ListingUncheckedCreateWithoutWexelInput[];
    connectOrCreate?: Prisma.ListingCreateOrConnectWithoutWexelInput | Prisma.ListingCreateOrConnectWithoutWexelInput[];
    createMany?: Prisma.ListingCreateManyWexelInputEnvelope;
    connect?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
};
export type ListingUpdateManyWithoutWexelNestedInput = {
    create?: Prisma.XOR<Prisma.ListingCreateWithoutWexelInput, Prisma.ListingUncheckedCreateWithoutWexelInput> | Prisma.ListingCreateWithoutWexelInput[] | Prisma.ListingUncheckedCreateWithoutWexelInput[];
    connectOrCreate?: Prisma.ListingCreateOrConnectWithoutWexelInput | Prisma.ListingCreateOrConnectWithoutWexelInput[];
    upsert?: Prisma.ListingUpsertWithWhereUniqueWithoutWexelInput | Prisma.ListingUpsertWithWhereUniqueWithoutWexelInput[];
    createMany?: Prisma.ListingCreateManyWexelInputEnvelope;
    set?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
    disconnect?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
    delete?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
    connect?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
    update?: Prisma.ListingUpdateWithWhereUniqueWithoutWexelInput | Prisma.ListingUpdateWithWhereUniqueWithoutWexelInput[];
    updateMany?: Prisma.ListingUpdateManyWithWhereWithoutWexelInput | Prisma.ListingUpdateManyWithWhereWithoutWexelInput[];
    deleteMany?: Prisma.ListingScalarWhereInput | Prisma.ListingScalarWhereInput[];
};
export type ListingUncheckedUpdateManyWithoutWexelNestedInput = {
    create?: Prisma.XOR<Prisma.ListingCreateWithoutWexelInput, Prisma.ListingUncheckedCreateWithoutWexelInput> | Prisma.ListingCreateWithoutWexelInput[] | Prisma.ListingUncheckedCreateWithoutWexelInput[];
    connectOrCreate?: Prisma.ListingCreateOrConnectWithoutWexelInput | Prisma.ListingCreateOrConnectWithoutWexelInput[];
    upsert?: Prisma.ListingUpsertWithWhereUniqueWithoutWexelInput | Prisma.ListingUpsertWithWhereUniqueWithoutWexelInput[];
    createMany?: Prisma.ListingCreateManyWexelInputEnvelope;
    set?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
    disconnect?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
    delete?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
    connect?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
    update?: Prisma.ListingUpdateWithWhereUniqueWithoutWexelInput | Prisma.ListingUpdateWithWhereUniqueWithoutWexelInput[];
    updateMany?: Prisma.ListingUpdateManyWithWhereWithoutWexelInput | Prisma.ListingUpdateManyWithWhereWithoutWexelInput[];
    deleteMany?: Prisma.ListingScalarWhereInput | Prisma.ListingScalarWhereInput[];
};
export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null;
    increment?: bigint | number;
    decrement?: bigint | number;
    multiply?: bigint | number;
    divide?: bigint | number;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type ListingCreateWithoutWexelInput = {
    id?: bigint | number;
    ask_price_usd: bigint | number;
    auction?: boolean;
    min_bid_usd?: bigint | number | null;
    expiry_ts?: Date | string | null;
    status?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type ListingUncheckedCreateWithoutWexelInput = {
    id?: bigint | number;
    ask_price_usd: bigint | number;
    auction?: boolean;
    min_bid_usd?: bigint | number | null;
    expiry_ts?: Date | string | null;
    status?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type ListingCreateOrConnectWithoutWexelInput = {
    where: Prisma.ListingWhereUniqueInput;
    create: Prisma.XOR<Prisma.ListingCreateWithoutWexelInput, Prisma.ListingUncheckedCreateWithoutWexelInput>;
};
export type ListingCreateManyWexelInputEnvelope = {
    data: Prisma.ListingCreateManyWexelInput | Prisma.ListingCreateManyWexelInput[];
    skipDuplicates?: boolean;
};
export type ListingUpsertWithWhereUniqueWithoutWexelInput = {
    where: Prisma.ListingWhereUniqueInput;
    update: Prisma.XOR<Prisma.ListingUpdateWithoutWexelInput, Prisma.ListingUncheckedUpdateWithoutWexelInput>;
    create: Prisma.XOR<Prisma.ListingCreateWithoutWexelInput, Prisma.ListingUncheckedCreateWithoutWexelInput>;
};
export type ListingUpdateWithWhereUniqueWithoutWexelInput = {
    where: Prisma.ListingWhereUniqueInput;
    data: Prisma.XOR<Prisma.ListingUpdateWithoutWexelInput, Prisma.ListingUncheckedUpdateWithoutWexelInput>;
};
export type ListingUpdateManyWithWhereWithoutWexelInput = {
    where: Prisma.ListingScalarWhereInput;
    data: Prisma.XOR<Prisma.ListingUpdateManyMutationInput, Prisma.ListingUncheckedUpdateManyWithoutWexelInput>;
};
export type ListingScalarWhereInput = {
    AND?: Prisma.ListingScalarWhereInput | Prisma.ListingScalarWhereInput[];
    OR?: Prisma.ListingScalarWhereInput[];
    NOT?: Prisma.ListingScalarWhereInput | Prisma.ListingScalarWhereInput[];
    id?: Prisma.BigIntFilter<'Listing'> | bigint | number;
    wexel_id?: Prisma.BigIntFilter<'Listing'> | bigint | number;
    ask_price_usd?: Prisma.BigIntFilter<'Listing'> | bigint | number;
    auction?: Prisma.BoolFilter<'Listing'> | boolean;
    min_bid_usd?: Prisma.BigIntNullableFilter<'Listing'> | bigint | number | null;
    expiry_ts?: Prisma.DateTimeNullableFilter<'Listing'> | Date | string | null;
    status?: Prisma.StringFilter<'Listing'> | string;
    created_at?: Prisma.DateTimeFilter<'Listing'> | Date | string;
    updated_at?: Prisma.DateTimeFilter<'Listing'> | Date | string;
};
export type ListingCreateManyWexelInput = {
    id?: bigint | number;
    ask_price_usd: bigint | number;
    auction?: boolean;
    min_bid_usd?: bigint | number | null;
    expiry_ts?: Date | string | null;
    status?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type ListingUpdateWithoutWexelInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    ask_price_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    auction?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    min_bid_usd?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    expiry_ts?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ListingUncheckedUpdateWithoutWexelInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    ask_price_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    auction?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    min_bid_usd?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    expiry_ts?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ListingUncheckedUpdateManyWithoutWexelInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    ask_price_usd?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    auction?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    min_bid_usd?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    expiry_ts?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ListingSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    wexel_id?: boolean;
    ask_price_usd?: boolean;
    auction?: boolean;
    min_bid_usd?: boolean;
    expiry_ts?: boolean;
    status?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
}, ExtArgs['result']['listing']>;
export type ListingSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    wexel_id?: boolean;
    ask_price_usd?: boolean;
    auction?: boolean;
    min_bid_usd?: boolean;
    expiry_ts?: boolean;
    status?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
}, ExtArgs['result']['listing']>;
export type ListingSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    wexel_id?: boolean;
    ask_price_usd?: boolean;
    auction?: boolean;
    min_bid_usd?: boolean;
    expiry_ts?: boolean;
    status?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
}, ExtArgs['result']['listing']>;
export type ListingSelectScalar = {
    id?: boolean;
    wexel_id?: boolean;
    ask_price_usd?: boolean;
    auction?: boolean;
    min_bid_usd?: boolean;
    expiry_ts?: boolean;
    status?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
};
export type ListingOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<'id' | 'wexel_id' | 'ask_price_usd' | 'auction' | 'min_bid_usd' | 'expiry_ts' | 'status' | 'created_at' | 'updated_at', ExtArgs['result']['listing']>;
export type ListingInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
};
export type ListingIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
};
export type ListingIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    wexel?: boolean | Prisma.WexelDefaultArgs<ExtArgs>;
};
export type $ListingPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: 'Listing';
    objects: {
        wexel: Prisma.$WexelPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: bigint;
        wexel_id: bigint;
        ask_price_usd: bigint;
        auction: boolean;
        min_bid_usd: bigint | null;
        expiry_ts: Date | null;
        status: string;
        created_at: Date;
        updated_at: Date;
    }, ExtArgs['result']['listing']>;
    composites: {};
};
export type ListingGetPayload<S extends boolean | null | undefined | ListingDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ListingPayload, S>;
export type ListingCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ListingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ListingCountAggregateInputType | true;
};
export interface ListingDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Listing'];
        meta: {
            name: 'Listing';
        };
    };
    findUnique<T extends ListingFindUniqueArgs>(args: Prisma.SelectSubset<T, ListingFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ListingFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ListingFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ListingFindFirstArgs>(args?: Prisma.SelectSubset<T, ListingFindFirstArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ListingFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ListingFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ListingFindManyArgs>(args?: Prisma.SelectSubset<T, ListingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>;
    create<T extends ListingCreateArgs>(args: Prisma.SelectSubset<T, ListingCreateArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, 'create', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ListingCreateManyArgs>(args?: Prisma.SelectSubset<T, ListingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ListingCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ListingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, 'createManyAndReturn', GlobalOmitOptions>>;
    delete<T extends ListingDeleteArgs>(args: Prisma.SelectSubset<T, ListingDeleteArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ListingUpdateArgs>(args: Prisma.SelectSubset<T, ListingUpdateArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, 'update', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ListingDeleteManyArgs>(args?: Prisma.SelectSubset<T, ListingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ListingUpdateManyArgs>(args: Prisma.SelectSubset<T, ListingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ListingUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ListingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, 'updateManyAndReturn', GlobalOmitOptions>>;
    upsert<T extends ListingUpsertArgs>(args: Prisma.SelectSubset<T, ListingUpsertArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ListingCountArgs>(args?: Prisma.Subset<T, ListingCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ListingCountAggregateOutputType> : number>;
    aggregate<T extends ListingAggregateArgs>(args: Prisma.Subset<T, ListingAggregateArgs>): Prisma.PrismaPromise<GetListingAggregateType<T>>;
    groupBy<T extends ListingGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ListingGroupByArgs['orderBy'];
    } : {
        orderBy?: ListingGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ListingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetListingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ListingFieldRefs;
}
export interface Prisma__ListingClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    wexel<T extends Prisma.WexelDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WexelDefaultArgs<ExtArgs>>): Prisma.Prisma__WexelClient<runtime.Types.Result.GetResult<Prisma.$WexelPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ListingFieldRefs {
    readonly id: Prisma.FieldRef<'Listing', 'BigInt'>;
    readonly wexel_id: Prisma.FieldRef<'Listing', 'BigInt'>;
    readonly ask_price_usd: Prisma.FieldRef<'Listing', 'BigInt'>;
    readonly auction: Prisma.FieldRef<'Listing', 'Boolean'>;
    readonly min_bid_usd: Prisma.FieldRef<'Listing', 'BigInt'>;
    readonly expiry_ts: Prisma.FieldRef<'Listing', 'DateTime'>;
    readonly status: Prisma.FieldRef<'Listing', 'String'>;
    readonly created_at: Prisma.FieldRef<'Listing', 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<'Listing', 'DateTime'>;
}
export type ListingFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
    where: Prisma.ListingWhereUniqueInput;
};
export type ListingFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
    where: Prisma.ListingWhereUniqueInput;
};
export type ListingFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
    where?: Prisma.ListingWhereInput;
    orderBy?: Prisma.ListingOrderByWithRelationInput | Prisma.ListingOrderByWithRelationInput[];
    cursor?: Prisma.ListingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ListingScalarFieldEnum | Prisma.ListingScalarFieldEnum[];
};
export type ListingFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
    where?: Prisma.ListingWhereInput;
    orderBy?: Prisma.ListingOrderByWithRelationInput | Prisma.ListingOrderByWithRelationInput[];
    cursor?: Prisma.ListingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ListingScalarFieldEnum | Prisma.ListingScalarFieldEnum[];
};
export type ListingFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
    where?: Prisma.ListingWhereInput;
    orderBy?: Prisma.ListingOrderByWithRelationInput | Prisma.ListingOrderByWithRelationInput[];
    cursor?: Prisma.ListingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ListingScalarFieldEnum | Prisma.ListingScalarFieldEnum[];
};
export type ListingCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ListingCreateInput, Prisma.ListingUncheckedCreateInput>;
};
export type ListingCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ListingCreateManyInput | Prisma.ListingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ListingCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    data: Prisma.ListingCreateManyInput | Prisma.ListingCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ListingIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ListingUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ListingUpdateInput, Prisma.ListingUncheckedUpdateInput>;
    where: Prisma.ListingWhereUniqueInput;
};
export type ListingUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ListingUpdateManyMutationInput, Prisma.ListingUncheckedUpdateManyInput>;
    where?: Prisma.ListingWhereInput;
    limit?: number;
};
export type ListingUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ListingUpdateManyMutationInput, Prisma.ListingUncheckedUpdateManyInput>;
    where?: Prisma.ListingWhereInput;
    limit?: number;
    include?: Prisma.ListingIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ListingUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
    where: Prisma.ListingWhereUniqueInput;
    create: Prisma.XOR<Prisma.ListingCreateInput, Prisma.ListingUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ListingUpdateInput, Prisma.ListingUncheckedUpdateInput>;
};
export type ListingDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
    where: Prisma.ListingWhereUniqueInput;
};
export type ListingDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListingWhereInput;
    limit?: number;
};
export type ListingDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
};
export {};
