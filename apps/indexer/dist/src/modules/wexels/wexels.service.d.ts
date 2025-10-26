import { PrismaService } from '../../database/prisma.service';
import { CreateWexelDto } from './dto/create-wexel.dto';
import { ApplyBoostDto } from './dto/apply-boost.dto';
export declare class WexelsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createWexelDto: CreateWexelDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    applyBoost(applyBoostDto: ApplyBoostDto): Promise<any>;
    update(id: string, updateWexelDto: Partial<CreateWexelDto>): Promise<any>;
    remove(id: string): Promise<any>;
}
