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
}

#[program]
pub mod solana_contracts {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("USDX/Wexel Platform initialized: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn deposit(_ctx: Context<Deposit>, pool_id: u8, principal_usd: u64) -> Result<()> {
        // TODO: Implement deposit logic
        msg!("Deposit: pool_id={}, principal_usd={}", pool_id, principal_usd);
        
        // Emit event for deposit
        emit!(WexelCreated {
            id: 0, // TODO: Get actual wexel ID
            owner: _ctx.accounts.user.key(),
            principal_usd,
        });
        
        Ok(())
    }

    pub fn apply_boost(_ctx: Context<ApplyBoost>, wexel_id: u64, token_mint: Pubkey, amount: u64) -> Result<()> {
        // TODO: Implement boost logic
        msg!("Apply boost: wexel_id={}, token_mint={}, amount={}", wexel_id, token_mint, amount);
        
        // Emit event for boost application
        emit!(BoostApplied {
            wexel_id,
            apy_boost_bp: 0, // TODO: Calculate actual boost APY
            value_usd: 0,    // TODO: Calculate actual USD value
        });
        
        Ok(())
    }

    pub fn mint_wexel_finalize(_ctx: Context<MintFinalize>, wexel_id: u64) -> Result<()> {
        // TODO: Implement finalize logic
        msg!("Mint wexel finalize: wexel_id={}", wexel_id);
        Ok(())
    }

    pub fn accrue(_ctx: Context<Accrue>, wexel_id: u64) -> Result<()> {
        // TODO: Implement accrue logic
        msg!("Accrue: wexel_id={}", wexel_id);
        
        // Emit event for reward accrual
        emit!(Accrued {
            wexel_id,
            reward_usd: 0, // TODO: Calculate actual reward amount
        });
        
        Ok(())
    }

    pub fn claim(_ctx: Context<Claim>, wexel_id: u64) -> Result<()> {
        // TODO: Implement claim logic
        msg!("Claim: wexel_id={}", wexel_id);
        
        // Emit event for claim
        emit!(Claimed {
            wexel_id,
            to: _ctx.accounts.user.key(),
            amount_usd: 0, // TODO: Calculate actual claim amount
        });
        
        Ok(())
    }

    pub fn collateralize(_ctx: Context<Collateralize>, wexel_id: u64) -> Result<()> {
        // TODO: Implement collateralize logic
        msg!("Collateralize: wexel_id={}", wexel_id);
        
        // Emit event for collateralization
        emit!(Collateralized {
            wexel_id,
            loan_usd: 0, // TODO: Calculate actual loan amount (60% of principal)
        });
        
        Ok(())
    }

    pub fn repay_loan(_ctx: Context<RepayLoan>, wexel_id: u64, amount: u64) -> Result<()> {
        // TODO: Implement repay loan logic
        msg!("Repay loan: wexel_id={}, amount={}", wexel_id, amount);
        
        // Emit event for loan repayment
        emit!(LoanRepaid {
            wexel_id,
        });
        
        Ok(())
    }

    pub fn redeem(_ctx: Context<Redeem>, wexel_id: u64) -> Result<()> {
        // TODO: Implement redeem logic
        msg!("Redeem: wexel_id={}", wexel_id);
        
        // Emit event for redemption
        emit!(Redeemed {
            wexel_id,
            principal_usd: 0, // TODO: Get actual principal amount
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
pub struct MintFinalize {
    // TODO: Add required accounts
}

#[derive(Accounts)]
pub struct Accrue {
    // TODO: Add required accounts
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
pub struct Collateralize {
    // TODO: Add required accounts
}

#[derive(Accounts)]
pub struct RepayLoan {
    // TODO: Add required accounts
}

#[derive(Accounts)]
pub struct Redeem {
    // TODO: Add required accounts
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
