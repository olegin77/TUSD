import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PoolsService } from './pools.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export class CreatePoolDto {
  apy_base_bp: number;
  lock_months: number;
  min_deposit_usd: string; // BigInt as string
  boost_target_bp?: number;
  boost_max_bp?: number;
}

export class UpdatePoolDto {
  apy_base_bp?: number;
  lock_months?: number;
  min_deposit_usd?: string; // BigInt as string
  boost_target_bp?: number;
  boost_max_bp?: number;
  is_active?: boolean;
}

@Controller('pools')
export class PoolsController {
  constructor(private readonly poolsService: PoolsService) {}

  @Get()
  findAll() {
    return this.poolsService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.poolsService.getStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.poolsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPoolDto: CreatePoolDto) {
    return this.poolsService.create({
      ...createPoolDto,
      min_deposit_usd: BigInt(createPoolDto.min_deposit_usd),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePoolDto: UpdatePoolDto,
  ) {
    const data: any = { ...updatePoolDto };
    if (updatePoolDto.min_deposit_usd) {
      data.min_deposit_usd = BigInt(updatePoolDto.min_deposit_usd);
    }
    return this.poolsService.update(id, data);
  }
}
