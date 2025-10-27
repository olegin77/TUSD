use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solana_contracts {
    use super::*;

    // Constants
    const LTV_BP: u16 = 6000; // 60% LTV
    const APY_BP: u16 = 1800; // 18% APY
    const BOOST_APY_BP: u16 = 500; // 5% boost APY
    const BOOST_TARGET_BP: u16 = 3000; // 30% of principal for max boost
    const SECONDS_PER_DAY: u64 = 86400;
    const SECONDS_PER_MONTH: u64 = 30 * SECONDS_PER_DAY;

    // Error codes
    #[error_code]
    pub enum ErrorCode {
        #[msg("Insufficient funds")]
        InsufficientFunds,
        #[msg("Wexel not found")]
        WexelNotFound,
        #[msg("Wexel not matured")]
        WexelNotMatured,
        #[msg("Invalid pool")]
        InvalidPool,
        #[msg("Invalid amount")]
        InvalidAmount,
        #[msg("Unauthorized")]
        Unauthorized,
        #[msg("Math overflow")]
        MathOverflow,
        #[msg("Invalid boost value")]
        InvalidBoostValue,
        #[msg("Wexel already collateralized")]
        WexelAlreadyCollateralized,
        #[msg("Wexel not collateralized")]
        WexelNotCollateralized,
        #[msg("Invalid loan amount")]
        InvalidLoanAmount,
        #[msg("Invalid repayment amount")]
        InvalidRepaymentAmount,
        #[msg("Wexel already finalized")]
        WexelAlreadyFinalized,
        #[msg("Wexel not finalized")]
        WexelNotFinalized,
    }

    // Events
    #[event]
    pub struct WexelCreated {
        pub id: u64,
        pub owner: Pubkey,
        pub principal_usd: u64,
        pub apy_bp: u16,
        pub lock_period_months: u8,
        pub created_at: i64,
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
        pub accrued_at: i64,
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
        pub ltv_bp: u16,
    }

    #[event]
    pub struct LoanRepaid {
        pub wexel_id: u64,
        pub repaid_amount: u64,
    }

    #[event]
    pub struct Redeemed {
        pub wexel_id: u64,
        pub principal_usd: u64,
        pub redeemed_at: i64,
    }

    #[event]
    pub struct WexelFinalized {
        pub wexel_id: u64,
        pub finalized_at: i64,
    }

    // Account structures
    #[account]
    pub struct Pool {
        pub id: u64,
        pub total_deposits: u64,
        pub total_loans: u64,
        pub apy_bp: u16,
        pub created_at: i64,
    }

    #[account]
    pub struct Wexel {
        pub id: u64,
        pub owner: Pubkey,
        pub principal_usd: u64,
        pub apy_bp: u16,
        pub apy_boost_bp: u16,
        pub lock_period_months: u8,
        pub created_at: i64,
        pub matured_at: i64,
        pub is_collateralized: bool,
        pub is_finalized: bool,
        pub total_rewards: u64,
        pub claimed_rewards: u64,
    }

    #[account]
    pub struct CollateralPosition {
        pub wexel_id: u64,
        pub owner: Pubkey,
        pub loan_usd: u64,
        pub ltv_bp: u16,
        pub created_at: i64,
        pub is_repaid: bool,
    }

    #[account]
    pub struct RewardsVault {
        pub total_rewards: u64,
        pub distributed_rewards: u64,
    }

    // Instructions
    pub fn deposit(ctx: Context<Deposit>, pool_id: u64, principal_usd: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        let wexel = &mut ctx.accounts.wexel;
        let clock = Clock::get()?;

        // Validate input
        require!(principal_usd > 0, ErrorCode::InvalidAmount);

        // Initialize pool if first deposit
        if pool.id == 0 {
            pool.id = pool_id;
            pool.apy_bp = APY_BP;
            pool.created_at = clock.unix_timestamp;
        }

        // Initialize wexel
        wexel.id = pool_id;
        wexel.owner = ctx.accounts.user.key();
        wexel.principal_usd = principal_usd;
        wexel.apy_bp = APY_BP;
        wexel.apy_boost_bp = 0;
        wexel.lock_period_months = 12; // Default 12 months
        wexel.created_at = clock.unix_timestamp;
        wexel.matured_at = clock.unix_timestamp + (12 * SECONDS_PER_MONTH) as i64;
        wexel.is_collateralized = false;
        wexel.is_finalized = false;
        wexel.total_rewards = 0;
        wexel.claimed_rewards = 0;

        // Update pool
        pool.total_deposits = pool.total_deposits
            .checked_add(principal_usd)
            .ok_or(ErrorCode::MathOverflow)?;

        // Emit event
        emit!(WexelCreated {
            id: wexel.id,
            owner: wexel.owner,
            principal_usd: wexel.principal_usd,
            apy_bp: wexel.apy_bp,
            lock_period_months: wexel.lock_period_months,
            created_at: wexel.created_at,
        });

        Ok(())
    }

    pub fn apply_boost(ctx: Context<ApplyBoost>, wexel_id: u64, amount: u64) -> Result<()> {
        let wexel = &mut ctx.accounts.wexel;

        // Validate input
        require!(amount > 0, ErrorCode::InvalidAmount);
        require!(wexel.id == wexel_id, ErrorCode::WexelNotFound);

        // Calculate boost APY
        let boost_target = (wexel.principal_usd * BOOST_TARGET_BP as u64) / 10000;
        let boost_ratio = if boost_target > 0 {
            amount.min(boost_target) as f64 / boost_target as f64
        } else {
            0.0
        };
        let boost_apy_bp = (boost_ratio * BOOST_APY_BP as f64) as u16;

        // Update wexel
        wexel.apy_boost_bp = boost_apy_bp;

        // Emit event
        emit!(BoostApplied {
            wexel_id: wexel.id,
            apy_boost_bp: boost_apy_bp,
            value_usd: amount,
        });

        Ok(())
    }

    pub fn mint_wexel_finalize(ctx: Context<MintWexelFinalize>, wexel_id: u64) -> Result<()> {
        let wexel = &mut ctx.accounts.wexel;
        let clock = Clock::get()?;

        // Validate wexel
        require!(wexel.id == wexel_id, ErrorCode::WexelNotFound);
        require!(!wexel.is_finalized, ErrorCode::WexelAlreadyFinalized);
        require!(clock.unix_timestamp >= wexel.matured_at, ErrorCode::WexelNotMatured);

        // Finalize wexel
        wexel.is_finalized = true;

        // Emit event
        emit!(WexelFinalized {
            wexel_id: wexel.id,
            finalized_at: clock.unix_timestamp,
        });

        Ok(())
    }

    pub fn accrue(ctx: Context<Accrue>, wexel_id: u64) -> Result<()> {
        let wexel = &mut ctx.accounts.wexel;
        let rewards_vault = &mut ctx.accounts.rewards_vault;
        let clock = Clock::get()?;

        // Validate wexel
        require!(wexel.id == wexel_id, ErrorCode::WexelNotFound);
        require!(!wexel.is_finalized, ErrorCode::WexelAlreadyFinalized);

        // Calculate rewards
        let days_elapsed = (clock.unix_timestamp - wexel.created_at) / SECONDS_PER_DAY as i64;
        let total_apy_bp = wexel.apy_bp + wexel.apy_boost_bp;
        let daily_reward = (wexel.principal_usd * total_apy_bp as u64) / (365 * 10000);
        let total_rewards = daily_reward * days_elapsed as u64;

        // Update wexel
        wexel.total_rewards = total_rewards;

        // Update rewards vault
        rewards_vault.total_rewards = rewards_vault.total_rewards
            .checked_add(total_rewards)
            .ok_or(ErrorCode::MathOverflow)?;

        // Emit event
        emit!(Accrued {
            wexel_id: wexel.id,
            reward_usd: total_rewards,
            accrued_at: clock.unix_timestamp,
        });

        Ok(())
    }

    pub fn claim(ctx: Context<Claim>, wexel_id: u64) -> Result<()> {
        let wexel = &mut ctx.accounts.wexel;
        let rewards_vault = &mut ctx.accounts.rewards_vault;

        // Validate wexel
        require!(wexel.id == wexel_id, ErrorCode::WexelNotFound);
        require!(wexel.total_rewards > 0, ErrorCode::InvalidAmount);

        // Calculate claimable amount
        let claimable_amount = wexel.total_rewards - wexel.claimed_rewards;
        require!(claimable_amount > 0, ErrorCode::InvalidAmount);

        // Update wexel
        wexel.claimed_rewards = wexel.claimed_rewards
            .checked_add(claimable_amount)
            .ok_or(ErrorCode::MathOverflow)?;

        // Update rewards vault
        rewards_vault.distributed_rewards = rewards_vault.distributed_rewards
            .checked_add(claimable_amount)
            .ok_or(ErrorCode::MathOverflow)?;

        // Emit event
        emit!(Claimed {
            wexel_id: wexel.id,
            to: ctx.accounts.user.key(),
            amount_usd: claimable_amount,
        });

        Ok(())
    }

    pub fn collateralize(ctx: Context<Collateralize>, wexel_id: u64) -> Result<()> {
        let wexel = &mut ctx.accounts.wexel;
        let collateral_position = &mut ctx.accounts.collateral_position;
        let clock = Clock::get()?;

        // Validate wexel
        require!(wexel.id == wexel_id, ErrorCode::WexelNotFound);
        require!(!wexel.is_collateralized, ErrorCode::WexelAlreadyCollateralized);
        require!(!wexel.is_finalized, ErrorCode::WexelAlreadyFinalized);

        // Calculate loan amount
        let loan_usd = (wexel.principal_usd * LTV_BP as u64) / 10000;
        require!(loan_usd > 0, ErrorCode::InvalidLoanAmount);

        // Initialize collateral position
        collateral_position.wexel_id = wexel_id;
        collateral_position.owner = ctx.accounts.user.key();
        collateral_position.loan_usd = loan_usd;
        collateral_position.ltv_bp = LTV_BP;
        collateral_position.created_at = clock.unix_timestamp;
        collateral_position.is_repaid = false;

        // Update wexel
        wexel.is_collateralized = true;

        // Emit event
        emit!(Collateralized {
            wexel_id: wexel.id,
            loan_usd: loan_usd,
            ltv_bp: LTV_BP,
        });

        Ok(())
    }

    pub fn repay_loan(ctx: Context<RepayLoan>, wexel_id: u64, repay_amount: u64) -> Result<()> {
        let wexel = &mut ctx.accounts.wexel;
        let collateral_position = &mut ctx.accounts.collateral_position;

        // Validate wexel
        require!(wexel.id == wexel_id, ErrorCode::WexelNotFound);
        require!(wexel.is_collateralized, ErrorCode::WexelNotCollateralized);
        require!(!collateral_position.is_repaid, ErrorCode::InvalidRepaymentAmount);

        // Validate repayment amount
        require!(repay_amount > 0, ErrorCode::InvalidAmount);
        require!(repay_amount >= collateral_position.loan_usd, ErrorCode::InvalidRepaymentAmount);

        // Update collateral position
        collateral_position.is_repaid = true;

        // Update wexel
        wexel.is_collateralized = false;

        // Emit event
        emit!(LoanRepaid {
            wexel_id: wexel.id,
            repaid_amount: repay_amount,
        });

        Ok(())
    }

    pub fn redeem(ctx: Context<Redeem>, wexel_id: u64) -> Result<()> {
        let wexel = &mut ctx.accounts.wexel;
        let clock = Clock::get()?;

        // Validate wexel
        require!(wexel.id == wexel_id, ErrorCode::WexelNotFound);
        require!(wexel.is_finalized, ErrorCode::WexelNotFinalized);
        require!(clock.unix_timestamp >= wexel.matured_at, ErrorCode::WexelNotMatured);

        // Emit event
        emit!(Redeemed {
            wexel_id: wexel.id,
            principal_usd: wexel.principal_usd,
            redeemed_at: clock.unix_timestamp,
        });

        Ok(())
    }
}

// Account contexts
#[derive(Accounts)]
#[instruction(pool_id: u64, principal_usd: u64)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        space = 8 + 8 + 8 + 8 + 2 + 8, // Pool::LEN
        seeds = [b"pool", pool_id.to_le_bytes().as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,
    #[account(
        init,
        payer = user,
        space = 8 + 8 + 32 + 8 + 2 + 2 + 1 + 8 + 8 + 1 + 1 + 8 + 8, // Wexel::LEN
        seeds = [b"wexel", user.key().as_ref(), pool_id.to_le_bytes().as_ref()],
        bump
    )]
    pub wexel: Account<'info, Wexel>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(wexel_id: u64, amount: u64)]
pub struct ApplyBoost<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        constraint = wexel.owner == user.key() @ solana_contracts::ErrorCode::Unauthorized
    )]
    pub wexel: Account<'info, Wexel>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(wexel_id: u64)]
pub struct MintWexelFinalize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        constraint = wexel.owner == user.key() @ solana_contracts::ErrorCode::Unauthorized
    )]
    pub wexel: Account<'info, Wexel>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(wexel_id: u64)]
pub struct Accrue<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        constraint = wexel.owner == user.key() @ solana_contracts::ErrorCode::Unauthorized
    )]
    pub wexel: Account<'info, Wexel>,
    #[account(
        init,
        payer = user,
        space = 8 + 8 + 8, // RewardsVault::LEN
        seeds = [b"rewards_vault", wexel_id.to_le_bytes().as_ref()],
        bump
    )]
    pub rewards_vault: Account<'info, RewardsVault>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(wexel_id: u64)]
pub struct Claim<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        constraint = wexel.owner == user.key() @ solana_contracts::ErrorCode::Unauthorized
    )]
    pub wexel: Account<'info, Wexel>,
    #[account(
        mut,
        constraint = rewards_vault.key() == Pubkey::find_program_address(
            &[b"rewards_vault", wexel_id.to_le_bytes().as_ref()],
            &crate::ID
        ).0
    )]
    pub rewards_vault: Account<'info, RewardsVault>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(wexel_id: u64)]
pub struct Collateralize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        constraint = wexel.owner == user.key() @ solana_contracts::ErrorCode::Unauthorized
    )]
    pub wexel: Account<'info, Wexel>,
    #[account(
        init,
        payer = user,
        space = 8 + 8 + 32 + 8 + 2 + 8 + 1, // CollateralPosition::LEN
        seeds = [b"collateral", wexel_id.to_le_bytes().as_ref()],
        bump
    )]
    pub collateral_position: Account<'info, CollateralPosition>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(wexel_id: u64, repay_amount: u64)]
pub struct RepayLoan<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        constraint = wexel.owner == user.key() @ solana_contracts::ErrorCode::Unauthorized
    )]
    pub wexel: Account<'info, Wexel>,
    #[account(
        mut,
        constraint = collateral_position.wexel_id == wexel_id @ solana_contracts::ErrorCode::WexelNotFound
    )]
    pub collateral_position: Account<'info, CollateralPosition>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(wexel_id: u64)]
pub struct Redeem<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        constraint = wexel.owner == user.key() @ solana_contracts::ErrorCode::Unauthorized
    )]
    pub wexel: Account<'info, Wexel>,
    pub system_program: Program<'info, System>,
}
