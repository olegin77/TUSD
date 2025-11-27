import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { VaultsService } from './vaults.service';
import { CreateVaultDto } from './dto/create-vault.dto';
import { UpdateVaultDto } from './dto/update-vault.dto';

@ApiTags('vaults')
@Controller('vaults')
export class VaultsController {
  constructor(private readonly vaultsService: VaultsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create new vault',
    description: 'Create a new investment vault (admin only)',
  })
  @ApiBody({ type: CreateVaultDto })
  @ApiResponse({
    status: 201,
    description: 'Vault created successfully',
    schema: {
      example: {
        id: 1,
        name: 'Starter',
        type: 'VAULT_1',
        duration_months: 12,
        min_entry_amount: '100',
        base_usdt_apy: 4.0,
        boosted_usdt_apy: 8.4,
        takara_apr: 30.0,
        boost_token_symbol: 'LAIKA',
        batch_number: 1,
        batch_status: 'COLLECTING',
        is_active: true,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createVaultDto: CreateVaultDto): Promise<any> {
    return this.vaultsService.create(createVaultDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all vaults',
    description: 'Retrieve all active investment vaults with batch info',
  })
  @ApiResponse({
    status: 200,
    description: 'Vaults retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          name: 'Starter',
          type: 'VAULT_1',
          duration_months: 12,
          min_entry_amount: '100',
          base_usdt_apy: 4.0,
          boosted_usdt_apy: 8.4,
          takara_apr: 30.0,
          batch_number: 1,
          batch_status: 'COLLECTING',
          current_liquidity: '50000',
          target_liquidity: '100000',
        },
      ],
    },
  })
  findAll(): Promise<any[]> {
    return this.vaultsService.findAll();
  }

  @Get('yields')
  @ApiOperation({
    summary: 'Get vault yields summary',
    description: 'Get detailed yield information for all vaults',
  })
  @ApiResponse({
    status: 200,
    description: 'Vault yields retrieved',
    schema: {
      example: [
        {
          vaultId: 1,
          name: 'Starter',
          type: 'VAULT_1',
          durationMonths: 12,
          minEntryAmount: 100,
          usdtYield: {
            baseApy: 4.0,
            boostedApy: 8.4,
            frequencyMultipliers: {
              MONTHLY: 1.0,
              QUARTERLY: 1.15,
              YEARLY: 1.3,
            },
          },
          takaraYield: {
            apr: 30,
            internalPrice: 0.1,
          },
          boostCondition: {
            tokenSymbol: 'LAIKA',
            ratio: 0.4,
            discount: 0.15,
            fixedPrice: null,
          },
          batch: {
            number: 1,
            status: 'COLLECTING',
            currentLiquidity: 50000,
            targetLiquidity: 100000,
            progress: 50,
          },
        },
      ],
    },
  })
  getYields(): Promise<any[]> {
    return this.vaultsService.getVaultYields();
  }

  @Get('calculate/usdt')
  @ApiOperation({
    summary: 'Calculate USDT yield',
    description: 'Calculate projected USDT yield for a deposit',
  })
  @ApiQuery({
    name: 'amount',
    type: Number,
    description: 'Deposit amount in USD',
  })
  @ApiQuery({
    name: 'baseApy',
    type: Number,
    description: 'Base APY percentage',
  })
  @ApiQuery({
    name: 'boostedApy',
    type: Number,
    description: 'Boosted APY percentage',
  })
  @ApiQuery({
    name: 'hasBoosted',
    type: Boolean,
    description: 'Is boost active',
  })
  @ApiQuery({
    name: 'frequency',
    enum: ['MONTHLY', 'QUARTERLY', 'YEARLY'],
    description: 'Payout frequency',
  })
  calculateUsdtYield(
    @Query('amount') amount: number,
    @Query('baseApy') baseApy: number,
    @Query('boostedApy') boostedApy: number,
    @Query('hasBoosted') hasBoosted: boolean,
    @Query('frequency') frequency: 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
  ) {
    return this.vaultsService.calculateUsdtYield(
      Number(amount),
      Number(baseApy),
      Number(boostedApy),
      hasBoosted === true || hasBoosted === ('true' as any),
      frequency,
    );
  }

  @Get('calculate/takara')
  @ApiOperation({
    summary: 'Calculate Takara mining yield',
    description: 'Calculate projected Takara token yield for a deposit',
  })
  @ApiQuery({
    name: 'amount',
    type: Number,
    description: 'Deposit amount in USD',
  })
  @ApiQuery({
    name: 'takaraApr',
    type: Number,
    description: 'Takara APR percentage',
  })
  calculateTakaraYield(
    @Query('amount') amount: number,
    @Query('takaraApr') takaraApr: number,
  ) {
    return this.vaultsService.calculateTakaraYield(
      Number(amount),
      Number(takaraApr),
    );
  }

  @Get('check/laika-boost')
  @ApiOperation({
    summary: 'Check Laika boost eligibility',
    description: 'Check if user qualifies for Laika boost (Vault 1)',
  })
  @ApiQuery({ name: 'depositAmount', type: Number })
  @ApiQuery({ name: 'laikaBalance', type: Number })
  @ApiQuery({ name: 'laikaPrice', type: Number })
  @ApiQuery({ name: 'discountRate', type: Number, required: false })
  checkLaikaBoost(
    @Query('depositAmount') depositAmount: number,
    @Query('laikaBalance') laikaBalance: number,
    @Query('laikaPrice') laikaPrice: number,
    @Query('discountRate') discountRate?: number,
  ) {
    return this.vaultsService.checkLaikaBoostEligibility(
      Number(depositAmount),
      Number(laikaBalance),
      Number(laikaPrice),
      discountRate ? Number(discountRate) : 0.15,
    );
  }

  @Get('check/takara-boost')
  @ApiOperation({
    summary: 'Check Takara boost eligibility',
    description: 'Check if user qualifies for Takara boost (Vault 2, 3)',
  })
  @ApiQuery({ name: 'depositAmount', type: Number })
  @ApiQuery({ name: 'takaraBalance', type: Number })
  @ApiQuery({ name: 'fixedPrice', type: Number, required: false })
  checkTakaraBoost(
    @Query('depositAmount') depositAmount: number,
    @Query('takaraBalance') takaraBalance: number,
    @Query('fixedPrice') fixedPrice?: number,
  ) {
    return this.vaultsService.checkTakaraBoostEligibility(
      Number(depositAmount),
      Number(takaraBalance),
      fixedPrice ? Number(fixedPrice) : 0.1,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get vault by ID',
    description: 'Retrieve detailed information about a specific vault',
  })
  @ApiParam({ name: 'id', description: 'Vault ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Vault found',
    schema: {
      example: {
        id: 1,
        name: 'Starter',
        type: 'VAULT_1',
        duration_months: 12,
        min_entry_amount: '100',
        base_usdt_apy: 4.0,
        boosted_usdt_apy: 8.4,
        takara_apr: 30.0,
        boost_token_symbol: 'LAIKA',
        boost_ratio: 0.4,
        boost_discount: 0.15,
        batch_number: 1,
        batch_status: 'COLLECTING',
        current_liquidity: '50000',
        target_liquidity: '100000',
        is_active: true,
        created_at: '2025-01-15T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Vault not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.vaultsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update vault',
    description: 'Update vault parameters (admin only)',
  })
  @ApiParam({ name: 'id', description: 'Vault ID', type: Number })
  @ApiBody({ type: UpdateVaultDto })
  @ApiResponse({
    status: 200,
    description: 'Vault updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Vault not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVaultDto: UpdateVaultDto,
  ): Promise<any> {
    return this.vaultsService.update(id, updateVaultDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete vault',
    description: 'Soft delete a vault (admin only)',
  })
  @ApiParam({ name: 'id', description: 'Vault ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Vault deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Vault not found' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.vaultsService.remove(id);
  }

  @Post('seed')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Seed default vaults',
    description:
      'Create default vaults according to TZ specification (admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Default vaults seeded',
  })
  async seedVaults(): Promise<{ message: string }> {
    await this.vaultsService.seedDefaultVaults();
    return { message: 'Default vaults seeded successfully' };
  }
}
