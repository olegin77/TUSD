import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateWexelDto } from './dto/create-wexel.dto';
import { ApplyBoostDto } from './dto/apply-boost.dto';

@Injectable()
export class WexelsService {
  constructor(private prisma: PrismaService) {}

  async create(createWexelDto: CreateWexelDto) {
    return this.prisma.wexel.create({
      data: createWexelDto,
    });
  }

  async findAll() {
    return this.prisma.wexel.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const wexel = await this.prisma.wexel.findUnique({
      where: { id: BigInt(id) },
    });

    if (!wexel) {
      throw new NotFoundException(`Wexel with ID ${id} not found`);
    }

    return wexel;
  }

  async applyBoost(applyBoostDto: ApplyBoostDto) {
    const wexel = await this.findOne(applyBoostDto.wexel_id.toString());

    return this.prisma.boost.create({
      data: {
        wexel_id: applyBoostDto.wexel_id,
        token_mint: applyBoostDto.token_mint,
        amount: applyBoostDto.amount,
      },
    });
  }

  async update(id: string, updateWexelDto: Partial<CreateWexelDto>) {
    await this.findOne(id);

    return this.prisma.wexel.update({
      where: { id: BigInt(id) },
      data: updateWexelDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.wexel.delete({
      where: { id: BigInt(id) },
    });
  }
}
