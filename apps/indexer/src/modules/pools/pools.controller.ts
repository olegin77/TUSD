import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PoolsService } from './pools.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';

@Controller('pools')
export class PoolsController {
  constructor(private readonly poolsService: PoolsService) {}

  @Post()
  create(@Body() createPoolDto: CreatePoolDto) {
    return this.poolsService.create(createPoolDto);
  }

  @Get()
  findAll() {
    return this.poolsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.poolsService.findOne(id.toString());
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePoolDto: UpdatePoolDto,
  ) {
    return this.poolsService.update(id.toString(), updatePoolDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.poolsService.remove(id.toString());
  }
}
