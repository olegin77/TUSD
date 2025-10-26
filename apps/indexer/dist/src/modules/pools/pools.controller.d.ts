import { PoolsService } from './pools.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
export declare class PoolsController {
    private readonly poolsService;
    constructor(poolsService: PoolsService);
    create(createPoolDto: CreatePoolDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    update(id: number, updatePoolDto: UpdatePoolDto): Promise<any>;
    remove(id: number): Promise<any>;
}
