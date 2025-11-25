use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer, MintTo},
};

declare_id!("TKRAxyz111111111111111111111111111111111111");

/// Takara Token Program - Reward token for TUSD Platform
///
/// Tokenomics:
/// - Total Supply: Configurable at initialization
/// - 60% allocated to Mining Vault (rewards for deposits)
/// - 40% allocated to Admin/Liquidity wallet
#[program]
pub mod takara_token {
    use super::*;

    // Constants
    pub const MINING_POOL_PERCENT: u64 = 60;
    pub const ADMIN_POOL_PERCENT: u64 = 40;
    pub const TAKARA_DECIMALS: u8 = 6;

    /// Initialize Takara token with mining vault
    /// Creates the token mint and distributes initial supply:
    /// - 60% to MiningVault PDA
    /// - 40% to Admin wallet
    pub fn initialize(
        ctx: Context<Initialize>,
        total_supply: u64,
        token_name: String,
        token_symbol: String,
    ) -> Result<()> {
        let config = &mut ctx.accounts.takara_config;
        let clock = Clock::get()?;

        // Calculate allocations
        let mining_allocation = (total_supply * MINING_POOL_PERCENT) / 100;
        let admin_allocation = (total_supply * ADMIN_POOL_PERCENT) / 100;

        // Initialize config
        config.authority = ctx.accounts.authority.key();
        config.oracle_authority = ctx.accounts.authority.key(); // Initially same as authority
        config.token_mint = ctx.accounts.takara_mint.key();
        config.mining_vault = ctx.accounts.mining_vault.key();
        config.total_supply = total_supply;
        config.mining_pool_total = mining_allocation;
        config.mining_pool_remaining = mining_allocation;
        config.mining_pool_distributed = 0;
        config.internal_price_usd = 100_000; // $0.10 initial price (6 decimals)
        config.is_initialized = true;
        config.is_paused = false;
        config.created_at = clock.unix_timestamp;
        config.token_name = token_name;
        config.token_symbol = token_symbol;
        config.bump = ctx.bumps.takara_config;
        config.mining_vault_bump = ctx.bumps.mining_vault;

        // Mint tokens to Mining Vault (60%)
        let cpi_accounts_vault = MintTo {
            mint: ctx.accounts.takara_mint.to_account_info(),
            to: ctx.accounts.mining_vault.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx_vault = CpiContext::new(cpi_program.clone(), cpi_accounts_vault);
        token::mint_to(cpi_ctx_vault, mining_allocation)?;

        // Mint tokens to Admin wallet (40%)
        let cpi_accounts_admin = MintTo {
            mint: ctx.accounts.takara_mint.to_account_info(),
            to: ctx.accounts.admin_token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_ctx_admin = CpiContext::new(cpi_program, cpi_accounts_admin);
        token::mint_to(cpi_ctx_admin, admin_allocation)?;

        emit!(TakaraInitialized {
            total_supply,
            mining_allocation,
            admin_allocation,
            token_mint: ctx.accounts.takara_mint.key(),
            mining_vault: ctx.accounts.mining_vault.key(),
            initialized_at: clock.unix_timestamp,
        });

        Ok(())
    }

    /// Claim Takara rewards from Mining Vault
    /// Requires oracle signature to verify reward amount
    ///
    /// # Arguments
    /// * `reward_amount` - Amount of Takara to claim (calculated by backend)
    /// * `deposit_id` - Unique deposit identifier (from Tron deposit)
    /// * `nonce` - Unique nonce to prevent replay attacks
    pub fn claim_takara(
        ctx: Context<ClaimTakara>,
        reward_amount: u64,
        deposit_id: u64,
        nonce: u64,
    ) -> Result<()> {
        let config = &mut ctx.accounts.takara_config;
        let clock = Clock::get()?;

        // Validate
        require!(!config.is_paused, TakaraError::ProgramPaused);
        require!(reward_amount > 0, TakaraError::InvalidAmount);
        require!(
            config.mining_pool_remaining >= reward_amount,
            TakaraError::MiningPoolExhausted
        );

        // Check nonce hasn't been used
        let claim_record = &mut ctx.accounts.claim_record;
        require!(!claim_record.is_claimed, TakaraError::AlreadyClaimed);

        // Initialize claim record
        claim_record.deposit_id = deposit_id;
        claim_record.user = ctx.accounts.user.key();
        claim_record.amount = reward_amount;
        claim_record.nonce = nonce;
        claim_record.claimed_at = clock.unix_timestamp;
        claim_record.is_claimed = true;
        claim_record.bump = ctx.bumps.claim_record;

        // Transfer tokens from Mining Vault to user
        let seeds = &[
            b"mining_vault".as_ref(),
            config.token_mint.as_ref(),
            &[config.mining_vault_bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.mining_vault.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.mining_vault.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, reward_amount)?;

        // Update config
        config.mining_pool_remaining = config.mining_pool_remaining
            .checked_sub(reward_amount)
            .ok_or(TakaraError::MathOverflow)?;
        config.mining_pool_distributed = config.mining_pool_distributed
            .checked_add(reward_amount)
            .ok_or(TakaraError::MathOverflow)?;

        emit!(TakaraClaimed {
            user: ctx.accounts.user.key(),
            deposit_id,
            amount: reward_amount,
            remaining_pool: config.mining_pool_remaining,
            claimed_at: clock.unix_timestamp,
        });

        Ok(())
    }

    /// Update internal Takara price (oracle function)
    /// Only callable by oracle authority
    pub fn update_price(ctx: Context<UpdatePrice>, new_price_usd: u64) -> Result<()> {
        let config = &mut ctx.accounts.takara_config;

        require!(
            ctx.accounts.oracle.key() == config.oracle_authority,
            TakaraError::Unauthorized
        );
        require!(new_price_usd > 0, TakaraError::InvalidAmount);

        let old_price = config.internal_price_usd;
        config.internal_price_usd = new_price_usd;

        emit!(PriceUpdated {
            old_price,
            new_price: new_price_usd,
            updated_by: ctx.accounts.oracle.key(),
        });

        Ok(())
    }

    /// Update oracle authority
    pub fn set_oracle_authority(
        ctx: Context<SetOracleAuthority>,
        new_oracle: Pubkey,
    ) -> Result<()> {
        let config = &mut ctx.accounts.takara_config;

        require!(
            ctx.accounts.authority.key() == config.authority,
            TakaraError::Unauthorized
        );

        let old_oracle = config.oracle_authority;
        config.oracle_authority = new_oracle;

        emit!(OracleAuthorityChanged {
            old_oracle,
            new_oracle,
        });

        Ok(())
    }

    /// Pause/unpause the program
    pub fn set_paused(ctx: Context<SetPaused>, paused: bool) -> Result<()> {
        let config = &mut ctx.accounts.takara_config;

        require!(
            ctx.accounts.authority.key() == config.authority,
            TakaraError::Unauthorized
        );

        config.is_paused = paused;

        emit!(PauseStatusChanged {
            paused,
            changed_by: ctx.accounts.authority.key(),
        });

        Ok(())
    }

    /// Get mining pool statistics
    pub fn get_mining_stats(ctx: Context<GetMiningStats>) -> Result<MiningStats> {
        let config = &ctx.accounts.takara_config;

        Ok(MiningStats {
            total_supply: config.total_supply,
            mining_pool_total: config.mining_pool_total,
            mining_pool_remaining: config.mining_pool_remaining,
            mining_pool_distributed: config.mining_pool_distributed,
            internal_price_usd: config.internal_price_usd,
            is_paused: config.is_paused,
        })
    }
}

// ============================================
// Account Structures
// ============================================

#[account]
pub struct TakaraConfig {
    pub authority: Pubkey,           // Admin authority
    pub oracle_authority: Pubkey,    // Oracle for price updates and claim verification
    pub token_mint: Pubkey,          // Takara token mint address
    pub mining_vault: Pubkey,        // Mining vault PDA address
    pub total_supply: u64,           // Total token supply
    pub mining_pool_total: u64,      // 60% of supply for mining
    pub mining_pool_remaining: u64,  // Remaining in mining pool
    pub mining_pool_distributed: u64, // Distributed from mining pool
    pub internal_price_usd: u64,     // Internal price in USD (6 decimals)
    pub is_initialized: bool,
    pub is_paused: bool,
    pub created_at: i64,
    pub token_name: String,          // Max 32 chars
    pub token_symbol: String,        // Max 10 chars
    pub bump: u8,
    pub mining_vault_bump: u8,
}

#[account]
pub struct ClaimRecord {
    pub deposit_id: u64,      // Unique deposit ID from Tron
    pub user: Pubkey,         // User who claimed
    pub amount: u64,          // Amount claimed
    pub nonce: u64,           // Unique nonce
    pub claimed_at: i64,      // Timestamp
    pub is_claimed: bool,     // Prevents double claims
    pub bump: u8,
}

// ============================================
// Account Contexts
// ============================================

#[derive(Accounts)]
#[instruction(total_supply: u64, token_name: String, token_symbol: String)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        mint::decimals = 6,
        mint::authority = authority,
        mint::freeze_authority = authority,
    )]
    pub takara_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 32 + 32 + 8 + 8 + 8 + 8 + 8 + 1 + 1 + 8 + 36 + 14 + 1 + 1, // TakaraConfig size
        seeds = [b"takara_config"],
        bump
    )]
    pub takara_config: Account<'info, TakaraConfig>,

    #[account(
        init,
        payer = authority,
        token::mint = takara_mint,
        token::authority = mining_vault,
        seeds = [b"mining_vault", takara_mint.key().as_ref()],
        bump
    )]
    pub mining_vault: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = authority,
        associated_token::mint = takara_mint,
        associated_token::authority = authority,
    )]
    pub admin_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(reward_amount: u64, deposit_id: u64, nonce: u64)]
pub struct ClaimTakara<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    /// Oracle must co-sign to verify the reward amount
    pub oracle: Signer<'info>,

    #[account(
        mut,
        seeds = [b"takara_config"],
        bump = takara_config.bump,
        constraint = oracle.key() == takara_config.oracle_authority @ TakaraError::Unauthorized
    )]
    pub takara_config: Account<'info, TakaraConfig>,

    #[account(
        mut,
        seeds = [b"mining_vault", takara_config.token_mint.as_ref()],
        bump = takara_config.mining_vault_bump,
    )]
    pub mining_vault: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = takara_mint,
        associated_token::authority = user,
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(
        constraint = takara_mint.key() == takara_config.token_mint @ TakaraError::InvalidMint
    )]
    pub takara_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = user,
        space = 8 + 8 + 32 + 8 + 8 + 8 + 1 + 1, // ClaimRecord size
        seeds = [b"claim", deposit_id.to_le_bytes().as_ref(), nonce.to_le_bytes().as_ref()],
        bump
    )]
    pub claim_record: Account<'info, ClaimRecord>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePrice<'info> {
    pub oracle: Signer<'info>,

    #[account(
        mut,
        seeds = [b"takara_config"],
        bump = takara_config.bump,
    )]
    pub takara_config: Account<'info, TakaraConfig>,
}

#[derive(Accounts)]
pub struct SetOracleAuthority<'info> {
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"takara_config"],
        bump = takara_config.bump,
    )]
    pub takara_config: Account<'info, TakaraConfig>,
}

#[derive(Accounts)]
pub struct SetPaused<'info> {
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"takara_config"],
        bump = takara_config.bump,
    )]
    pub takara_config: Account<'info, TakaraConfig>,
}

#[derive(Accounts)]
pub struct GetMiningStats<'info> {
    #[account(
        seeds = [b"takara_config"],
        bump = takara_config.bump,
    )]
    pub takara_config: Account<'info, TakaraConfig>,
}

// ============================================
// Return Types
// ============================================

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MiningStats {
    pub total_supply: u64,
    pub mining_pool_total: u64,
    pub mining_pool_remaining: u64,
    pub mining_pool_distributed: u64,
    pub internal_price_usd: u64,
    pub is_paused: bool,
}

// ============================================
// Events
// ============================================

#[event]
pub struct TakaraInitialized {
    pub total_supply: u64,
    pub mining_allocation: u64,
    pub admin_allocation: u64,
    pub token_mint: Pubkey,
    pub mining_vault: Pubkey,
    pub initialized_at: i64,
}

#[event]
pub struct TakaraClaimed {
    pub user: Pubkey,
    pub deposit_id: u64,
    pub amount: u64,
    pub remaining_pool: u64,
    pub claimed_at: i64,
}

#[event]
pub struct PriceUpdated {
    pub old_price: u64,
    pub new_price: u64,
    pub updated_by: Pubkey,
}

#[event]
pub struct OracleAuthorityChanged {
    pub old_oracle: Pubkey,
    pub new_oracle: Pubkey,
}

#[event]
pub struct PauseStatusChanged {
    pub paused: bool,
    pub changed_by: Pubkey,
}

// ============================================
// Errors
// ============================================

#[error_code]
pub enum TakaraError {
    #[msg("Program is paused")]
    ProgramPaused,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Mining pool exhausted")]
    MiningPoolExhausted,
    #[msg("Already claimed")]
    AlreadyClaimed,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Invalid mint")]
    InvalidMint,
    #[msg("Invalid signature")]
    InvalidSignature,
}
