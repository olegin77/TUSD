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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PoolsService } from './pools.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';

@ApiTags('pools')
@Controller('pools')
export class PoolsController {
  constructor(private readonly poolsService: PoolsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create new pool',
    description: 'Create a new staking pool (admin only)',
  })
  @ApiBody({ type: CreatePoolDto })
  @ApiResponse({
    status: 201,
    description: 'Pool created successfully',
    schema: {
      example: {
        id: 1,
        apy_base_bp: 1800,
        lock_months: 12,
        min_deposit_usd: '100000000',
        boost_target_bp: 3000,
        boost_max_bp: 500,
        is_active: true,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createPoolDto: CreatePoolDto): Promise<any> {
    return this.poolsService.create(createPoolDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all pools',
    description: 'Retrieve all active staking pools',
  })
  @ApiResponse({
    status: 200,
    description: 'Pools retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          apy_base_bp: 1800,
          lock_months: 12,
          min_deposit_usd: '100000000',
          is_active: true,
        },
        {
          id: 2,
          apy_base_bp: 2400,
          lock_months: 18,
          min_deposit_usd: '500000000',
          is_active: true,
        },
      ],
    },
  })
  findAll(): Promise<any[]> {
    return this.poolsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get pool by ID',
    description: 'Retrieve detailed information about a specific pool',
  })
  @ApiParam({ name: 'id', description: 'Pool ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Pool found',
    schema: {
      example: {
        id: 1,
        apy_base_bp: 1800,
        lock_months: 12,
        min_deposit_usd: '100000000',
        boost_target_bp: 3000,
        boost_max_bp: 500,
        is_active: true,
        created_at: '2025-01-15T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Pool not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.poolsService.findOne(id.toString());
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update pool',
    description: 'Update pool parameters (admin only)',
  })
  @ApiParam({ name: 'id', description: 'Pool ID', type: Number })
  @ApiBody({ type: UpdatePoolDto })
  @ApiResponse({
    status: 200,
    description: 'Pool updated successfully',
    schema: {
      example: {
        id: 1,
        apy_base_bp: 2000,
        lock_months: 12,
        min_deposit_usd: '100000000',
        is_active: true,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Pool not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePoolDto: UpdatePoolDto,
  ): Promise<any> {
    return this.poolsService.update(id.toString(), updatePoolDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete pool',
    description: 'Soft delete a pool (admin only)',
  })
  @ApiParam({ name: 'id', description: 'Pool ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Pool deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Pool not found' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.poolsService.remove(id.toString());
  }
}
