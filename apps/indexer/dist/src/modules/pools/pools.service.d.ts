import { PrismaService } from '../../database/prisma.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
export declare class PoolsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    create(createPoolDto: CreatePoolDto): Promise<any>;
    update(id: string, updatePoolDto: UpdatePoolDto): Promise<any>;
    remove(id: string): Promise<any>;
}
