import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { WexelsService } from './wexels.service';
import { CreateWexelDto } from './dto/create-wexel.dto';
import { ApplyBoostDto } from './dto/apply-boost.dto';

@Controller('wexels')
export class WexelsController {
  constructor(private readonly wexelsService: WexelsService) {}

  @Post()
  create(@Body() createWexelDto: CreateWexelDto) {
    return this.wexelsService.create(createWexelDto);
  }

  @Get()
  findAll() {
    return this.wexelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.wexelsService.findOne(id);
  }

  @Post('apply-boost')
  applyBoost(@Body() applyBoostDto: ApplyBoostDto) {
    return this.wexelsService.applyBoost(applyBoostDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWexelDto: Partial<CreateWexelDto>,
  ) {
    return this.wexelsService.update(id, updateWexelDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.wexelsService.remove(id);
  }
}
