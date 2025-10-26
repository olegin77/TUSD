use anchor_lang::prelude::*;

declare_id!("3D7d2dRwysPv1ov5BzT934W2NYS9o7gfjBP2EphgVNXX");

// Constants
pub const POOL_SEED: &[u8] = b"pool";
pub const WEXEL_SEED: &[u8] = b"wexel";
pub const COLLATERAL_SEED: &[u8] = b"collateral";

// APY constants (in basis points)
pub const MIN_APY_BP: u16 = 1800; // 18%
pub const MAX_APY_BP: u16 = 3600; // 36%
pub const BOOST_TARGET_BP: u16 = 3000; // 30% of principal
pub const BOOST_MAX_BP: u16 = 500; // +5% APY maximum

// LTV (Loan-to-Value) constant
pub const LTV_BP: u16 = 6000; // 60%

// Time constants
pub const SECONDS_PER_DAY: i64 = 86400;
pub const SECONDS_PER_MONTH: i64 = 30 * SECONDS_PER_DAY;

// Error codes
#[error_code]
pub enum ErrorCode {
    #[msg("Invalid APY: must be between 18% and 36%")]
    InvalidApy,
    #[msg("Invalid lock period: must be between 12 and 36 months")]
    InvalidLockPeriod,
    #[msg("Insufficient deposit amount")]
    InsufficientDeposit,
    #[msg("Wexel not found")]
    WexelNotFound,
    #[msg("Wexel already collateralized")]
    AlreadyCollateralized,
    #[msg("Wexel not collateralized")]
    NotCollateralized,
    #[msg("Invalid boost amount")]
    InvalidBoostAmount,
    #[msg("Boost target exceeded")]
    BoostTargetExceeded,
    #[msg("Wexel not matured")]
    WexelNotMatured,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Invalid pool ID")]
    InvalidPoolId,
    #[msg("Wexel already finalized")]
    AlreadyFinalized,
    #[msg("Invalid price data")]
    InvalidPriceData,
    #[msg("Price deviation too high")]
    PriceDeviationTooHigh,
}

#[program]
pub mod solana_contracts {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("USDX/Wexel Platform initialized: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, pool_id: u8, principal_usd: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        let wexel = &mut ctx.accounts.wexel;
        let user = &ctx.accounts.user;

        // Validate pool ID
        require!(pool.id == pool_id, ErrorCode::InvalidPoolId);
        
        // Validate minimum deposit
        require!(principal_usd >= pool.min_deposit_usd, ErrorCode::InsufficientDeposit);
        
        // Validate APY range
        require!(pool.apy_bp >= MIN_APY_BP && pool.apy_bp <= MAX_APY_BP, ErrorCode::InvalidApy);
        
        // Validate lock period
        require!(pool.lock_months >= 12 && pool.lock_months <= 36, ErrorCode::InvalidLockPeriod);

        // Generate wexel ID (in production, use proper ID generation)
        let wexel_id = pool.total_wexels + 1;
        
        // Create new Wexel
        let new_wexel = Wexel::new(
            wexel_id,
            user.key(),
            pool_id,
            principal_usd,
            pool.apy_bp,
            pool.lock_months,
        );
        wexel.set_inner(new_wexel);

        // Update pool statistics
        pool.total_liquidity = pool.total_liquidity
            .checked_add(principal_usd)
            .ok_or(ErrorCode::MathOverflow)?;
        pool.total_wexels = pool.total_wexels
            .checked_add(1)
            .ok_or(ErrorCode::MathOverflow)?;

        msg!("Deposit successful: wexel_id={}, principal_usd={}", wexel_id, principal_usd);
        
        // Emit event for deposit
        emit!(WexelCreated {
            id: wexel_id,
            owner: user.key(),
            principal_usd,
        });
        
        Ok(())
    }

    pub fn apply_boost(ctx: Context<ApplyBoost>, wexel_id: u64, _token_mint: Pubkey, amount: u64) -> Result<()> {
        let wexel = &mut ctx.accounts.wexel;
        let user = &ctx.accounts.user;

        // Validate wexel ownership
        require!(wexel.owner == user.key(), ErrorCode::Unauthorized);
        
        // Validate wexel ID matches
        require!(wexel.id == wexel_id, ErrorCode::WexelNotFound);
        
        // Validate amount is positive
        require!(amount > 0, ErrorCode::InvalidBoostAmount);

        // Calculate boost target (30% of principal)
        let boost_target = (wexel.principal_usd * BOOST_TARGET_BP as u64) / 10000;
        
        // Calculate current boost value (simplified - in production, get from oracle)
        // For now, assume 1:1 ratio for demonstration
        let token_value_usd = amount; // TODO: Get actual price from oracle
        
        // Calculate total boost value including existing boost
        let current_boost_value = (wexel.principal_usd * wexel.apy_boost_bp as u64) / 10000;
        let total_boost_value = current_boost_value
            .checked_add(token_value_usd)
            .ok_or(ErrorCode::MathOverflow)?;
        
        // Check if boost target would be exceeded
        require!(total_boost_value <= boost_target, ErrorCode::BoostTargetExceeded);

        // Calculate new boost APY (max 5%)
        let new_boost_apy_bp = ((total_boost_value * 10000) / wexel.principal_usd)
            .min(BOOST_MAX_BP as u64) as u16;
        
        // Update wexel with new boost APY
        wexel.apy_boost_bp = new_boost_apy_bp;

        msg!("Boost applied: wexel_id={}, new_boost_apy_bp={}, value_usd={}", 
             wexel_id, new_boost_apy_bp, token_value_usd);
        
        // Emit event for boost application
        emit!(BoostApplied {
            wexel_id,
            apy_boost_bp: new_boost_apy_bp,
            value_usd: token_value_usd,
        });
        
        Ok(())
    }

    pub fn mint_wexel_finalize(ctx: Context<MintFinalize>, wexel_id: u64) -> Result<()> {
        let wexel = &mut ctx.accounts.wexel;
        let user = &ctx.accounts.user;

        // Validate wexel ownership
        require!(wexel.owner == user.key(), ErrorCode::Unauthorized);
        
        // Validate wexel ID matches
        require!(wexel.id == wexel_id, ErrorCode::WexelNotFound);
        
        // Check if already finalized (in production, add a flag for this)
        // For now, we'll allow multiple finalizations but log it
        msg!("Mint wexel finalize: wexel_id={}", wexel_id);
        
        // In production, this would:
        // 1. Mint the actual NFT with metadata
        // 2. Set finalization flag
        // 3. Transfer ownership to user
        
        // Emit event for wexel finalization
        emit!(WexelFinalized {
            wexel_id,
        });
        
        Ok(())
    }

    pub fn accrue(ctx: Context<Accrue>, wexel_id: u64) -> Result<()> {
        let wexel = &mut ctx.accounts.wexel;
        let rewards_vault = &mut ctx.accounts.rewards_vault;

        // Validate wexel ID matches
        require!(wexel.id == wexel_id, ErrorCode::WexelNotFound);
        
        // Check if wexel is still active (not expired)
        let current_time = Clock::get()?.unix_timestamp;
        require!(current_time < wexel.end_ts, ErrorCode::WexelNotMatured);

        // Calculate daily reward
        let daily_reward = wexel.calculate_daily_reward();
        
        // Check if there are sufficient funds in rewards vault
        require!(rewards_vault.balance >= daily_reward, ErrorCode::InsufficientDeposit);

        // Update wexel's total claimed amount
        wexel.total_claimed_usd = wexel.total_claimed_usd
            .checked_add(daily_reward)
            .ok_or(ErrorCode::MathOverflow)?;

        // Transfer reward to wexel owner (in production, this would be a proper transfer)
        // For now, we'll just update the vault balance
        rewards_vault.balance = rewards_vault.balance
            .checked_sub(daily_reward)
            .ok_or(ErrorCode::MathOverflow)?;

        msg!("Accrue successful: wexel_id={}, daily_reward={}", wexel_id, daily_reward);
        
        // Emit event for reward accrual
        emit!(Accrued {
            wexel_id,
            reward_usd: daily_reward,
        });
        
        Ok(())
    }

    pub fn claim(ctx: Context<Claim>, wexel_id: u64) -> Result<()> {
        let wexel = &mut ctx.accounts.wexel;
        let user = &ctx.accounts.user;

        // Validate wexel ownership
        require!(wexel.owner == user.key(), ErrorCode::Unauthorized);
        
        // Validate wexel ID matches
        require!(wexel.id == wexel_id, ErrorCode::WexelNotFound);

        // Calculate total available rewards
        let current_time = Clock::get()?.unix_timestamp;
        let days_elapsed = (current_time - wexel.start_ts) / SECONDS_PER_DAY;
        let total_rewards = wexel.calculate_daily_reward() * days_elapsed as u64;
        
        // Calculate claimable amount (total rewards - already claimed)
        let claimable_amount = total_rewards
            .checked_sub(wexel.total_claimed_usd)
            .unwrap_or(0);
        
        require!(claimable_amount > 0, ErrorCode::InsufficientDeposit);

        // Update claimed amount
        wexel.total_claimed_usd = wexel.total_claimed_usd
            .checked_add(claimable_amount)
            .ok_or(ErrorCode::MathOverflow)?;

        msg!("Claim successful: wexel_id={}, amount={}", wexel_id, claimable_amount);
        
        // Emit event for claim
        emit!(Claimed {
            wexel_id,
            to: user.key(),
            amount_usd: claimable_amount,
        });
        
        Ok(())
    }

    pub fn collateralize(ctx: Context<Collateralize>, wexel_id: u64) -> Result<()> {
        let wexel = &mut ctx.accounts.wexel;
        let collateral_position = &mut ctx.accounts.collateral_position;
        let user = &ctx.accounts.user;

        // Validate wexel ownership
        require!(wexel.owner == user.key(), ErrorCode::Unauthorized);
        
        // Validate wexel ID matches
        require!(wexel.id == wexel_id, ErrorCode::WexelNotFound);
        
        // Check if wexel is not already collateralized
        require!(!wexel.is_collateralized, ErrorCode::AlreadyCollateralized);

        // Calculate loan amount (60% of principal)
        let loan_amount = wexel.calculate_loan_amount();
        
        // Create collateral position
        let new_collateral = CollateralPosition::new(wexel_id, loan_amount);
        collateral_position.set_inner(new_collateral);
        
        // Update wexel status
        wexel.is_collateralized = true;

        msg!("Collateralize successful: wexel_id={}, loan_amount={}", wexel_id, loan_amount);
        
        // Emit event for collateralization
        emit!(Collateralized {
            wexel_id,
            loan_usd: loan_amount,
        });
        
        Ok(())
    }

    pub fn repay_loan(ctx: Context<RepayLoan>, wexel_id: u64, amount: u64) -> Result<()> {
        let wexel = &mut ctx.accounts.wexel;
        let collateral_position = &mut ctx.accounts.collateral_position;
        let user = &ctx.accounts.user;

        // Validate wexel ownership
        require!(wexel.owner == user.key(), ErrorCode::Unauthorized);
        
        // Validate wexel ID matches
        require!(wexel.id == wexel_id, ErrorCode::WexelNotFound);
        
        // Check if wexel is collateralized
        require!(wexel.is_collateralized, ErrorCode::NotCollateralized);
        
        // Check if loan is not already repaid
        require!(!collateral_position.repaid, ErrorCode::AlreadyCollateralized);

        // Validate repayment amount
        require!(amount > 0, ErrorCode::InvalidBoostAmount);
        require!(amount >= collateral_position.loan_usd, ErrorCode::InsufficientDeposit);

        // Mark loan as repaid
        collateral_position.repaid = true;
        
        // Update wexel status (remove collateralization)
        wexel.is_collateralized = false;

        msg!("Repay loan successful: wexel_id={}, amount={}", wexel_id, amount);
        
        // Emit event for loan repayment
        emit!(LoanRepaid {
            wexel_id,
        });
        
        Ok(())
    }

    pub fn redeem(ctx: Context<Redeem>, wexel_id: u64) -> Result<()> {
        let wexel = &mut ctx.accounts.wexel;
        let user = &ctx.accounts.user;

        // Validate wexel ownership
        require!(wexel.owner == user.key(), ErrorCode::Unauthorized);
        
        // Validate wexel ID matches
        require!(wexel.id == wexel_id, ErrorCode::WexelNotFound);
        
        // Check if wexel has matured
        let current_time = Clock::get()?.unix_timestamp;
        require!(current_time >= wexel.end_ts, ErrorCode::WexelNotMatured);

        // Calculate final rewards (if any remaining)
        let days_elapsed = (wexel.end_ts - wexel.start_ts) / SECONDS_PER_DAY;
        let total_rewards = wexel.calculate_daily_reward() * days_elapsed as u64;
        let remaining_rewards = total_rewards
            .checked_sub(wexel.total_claimed_usd)
            .unwrap_or(0);

        // In production, this would:
        // 1. Transfer principal back to user
        // 2. Transfer any remaining rewards
        // 3. Burn or transfer the NFT
        // 4. Clean up the wexel account

        let principal_amount = wexel.principal_usd;

        msg!("Redeem successful: wexel_id={}, principal={}, remaining_rewards={}", 
             wexel_id, principal_amount, remaining_rewards);
        
        // Emit event for redemption
        emit!(Redeemed {
            wexel_id,
            principal_usd: principal_amount,
        });
        
        Ok(())
    }
}

// Account structures
#[account]
pub struct Pool {
    pub id: u8,
    pub apy_bp: u16,            // APY в базисных пунктах, напр. 1800 = 18%
    pub lock_months: u8,        // 12..36
    pub min_deposit_usd: u64,
    pub total_liquidity: u64,
    pub total_wexels: u64,
    pub boost_target_bp: u16,   // 3000 = 30% от Principal
    pub boost_max_bp: u16,      // 500 = +5% APY максимум
}

#[account]
pub struct Wexel {
    pub id: u64,
    pub owner: Pubkey,
    pub pool_id: u8,
    pub principal_usd: u64,
    pub apy_base_bp: u16,
    pub apy_boost_bp: u16,
    pub start_ts: i64,
    pub end_ts: i64,
    pub is_collateralized: bool,
    pub total_claimed_usd: u64,
}

#[account]
pub struct CollateralPosition {
    pub wexel_id: u64,
    pub loan_usd: u64,
    pub start_ts: i64,
    pub repaid: bool,
}

#[account]
pub struct RewardsVault {
    pub balance: u64,
    pub total_distributed: u64,
}

// Event structures
#[event]
pub struct WexelCreated {
    pub id: u64,
    pub owner: Pubkey,
    pub principal_usd: u64,
}

#[event]
pub struct BoostApplied {
    pub wexel_id: u64,
    pub apy_boost_bp: u16,
    pub value_usd: u64,
}

#[event]
pub struct Accrued {
    pub wexel_id: u64,
    pub reward_usd: u64,
}

#[event]
pub struct Claimed {
    pub wexel_id: u64,
    pub to: Pubkey,
    pub amount_usd: u64,
}

#[event]
pub struct Collateralized {
    pub wexel_id: u64,
    pub loan_usd: u64,
}

#[event]
pub struct LoanRepaid {
    pub wexel_id: u64,
}

#[event]
pub struct Redeemed {
    pub wexel_id: u64,
    pub principal_usd: u64,
}

#[event]
pub struct WexelFinalized {
    pub wexel_id: u64,
}

// Context structures
#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    #[account(mut)]
    pub wexel: Account<'info, Wexel>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApplyBoost<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub wexel: Account<'info, Wexel>,
    pub token_mint: Account<'info, anchor_spl::token::Mint>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintFinalize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub wexel: Account<'info, Wexel>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Accrue<'info> {
    #[account(mut)]
    pub wexel: Account<'info, Wexel>,
    #[account(mut)]
    pub rewards_vault: Account<'info, RewardsVault>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub wexel: Account<'info, Wexel>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Collateralize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub wexel: Account<'info, Wexel>,
    #[account(mut)]
    pub collateral_position: Account<'info, CollateralPosition>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RepayLoan<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub wexel: Account<'info, Wexel>,
    #[account(mut)]
    pub collateral_position: Account<'info, CollateralPosition>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Redeem<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub wexel: Account<'info, Wexel>,
    pub system_program: Program<'info, System>,
}

// Utility functions
impl Pool {
    pub const LEN: usize = 8 + 1 + 2 + 1 + 8 + 8 + 8 + 2 + 2; // 48 bytes

    pub fn new(id: u8, apy_bp: u16, lock_months: u8, min_deposit_usd: u64) -> Self {
        Self {
            id,
            apy_bp,
            lock_months,
            min_deposit_usd,
            total_liquidity: 0,
            total_wexels: 0,
            boost_target_bp: BOOST_TARGET_BP,
            boost_max_bp: BOOST_MAX_BP,
        }
    }
}

impl Wexel {
    pub const LEN: usize = 8 + 8 + 32 + 1 + 8 + 2 + 2 + 8 + 8 + 1 + 8; // 88 bytes

    pub fn new(
        id: u64,
        owner: Pubkey,
        pool_id: u8,
        principal_usd: u64,
        apy_base_bp: u16,
        lock_months: u8,
    ) -> Self {
        let now = Clock::get().unwrap().unix_timestamp;
        let lock_seconds = (lock_months as i64) * SECONDS_PER_MONTH;
        
        Self {
            id,
            owner,
            pool_id,
            principal_usd,
            apy_base_bp,
            apy_boost_bp: 0,
            start_ts: now,
            end_ts: now + lock_seconds,
            is_collateralized: false,
            total_claimed_usd: 0,
        }
    }

    pub fn calculate_daily_reward(&self) -> u64 {
        let total_apy_bp = self.apy_base_bp + self.apy_boost_bp;
        (self.principal_usd * total_apy_bp as u64) / (365 * 10000)
    }

    pub fn calculate_loan_amount(&self) -> u64 {
        (self.principal_usd * LTV_BP as u64) / 10000
    }
}

impl CollateralPosition {
    pub const LEN: usize = 8 + 8 + 8 + 8 + 1; // 33 bytes

    pub fn new(wexel_id: u64, loan_usd: u64) -> Self {
        Self {
            wexel_id,
            loan_usd,
            start_ts: Clock::get().unwrap().unix_timestamp,
            repaid: false,
        }
    }
}
