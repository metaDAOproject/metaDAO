use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Token, TokenAccount, Transfer, Mint};

use crate::state::{Launch, LaunchState};
use crate::error::LaunchpadError;
use raydium_cpmm_cpi::{
    cpi,
    instruction,
    program::RaydiumCpmm,
    states::{AmmConfig, OBSERVATION_SEED, POOL_LP_MINT_SEED, POOL_VAULT_SEED},
};

#[derive(Accounts)]
pub struct CompleteLaunch<'info> {
    #[account(
        mut,
        constraint = launch.state == LaunchState::Live @ LaunchpadError::InvalidLaunchState,
        has_one = treasury_usdc_account,
        has_one = usdc_vault
    )]
    pub launch: Account<'info, Launch>,

    /// CHECK: pool vault and lp mint authority
    #[account(
        seeds = [
            raydium_cpmm_cpi::AUTH_SEED.as_bytes(),
        ],
        seeds::program = cp_swap_program,
        bump,
    )]
    pub authority: UncheckedAccount<'info>,

    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(mut)]
    pub usdc_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub treasury_usdc_account: Account<'info, TokenAccount>,

    /// Which config the pool belongs to.
    pub amm_config: Box<Account<'info, AmmConfig>>,

    /// CHECK: Initialize an account to store the pool state, init by cp-swap
    #[account(
        mut,
    )]  
    pub pool_state: Signer<'info>,

    /// Token_0 mint, the key must smaller then token_1 mint.
    #[account(
        constraint = token_0_mint.key() < token_1_mint.key(),
    )]
    pub token_0_mint: Box<Account<'info, Mint>>,

    /// Token_1 mint, the key must grater then token_0 mint.
    pub token_1_mint: Box<Account<'info, Mint>>,

    /// CHECK: pool lp mint, init by cp-swap
    #[account(
        mut,
        seeds = [
            POOL_LP_MINT_SEED.as_bytes(),
            pool_state.key().as_ref(),
        ],
        seeds::program = cp_swap_program,
        bump,
    )]
    pub lp_mint: UncheckedAccount<'info>,

    /// payer token0 account
    #[account(
        mut,
        token::mint = token_0_mint,
        token::authority = creator,
    )]
    pub creator_token_0: Box<Account<'info, TokenAccount>>,

    /// creator token1 account
    #[account(
        mut,
        token::mint = token_1_mint,
        token::authority = creator,
    )]
    pub creator_token_1: Box<Account<'info, TokenAccount>>,

    /// CHECK: creator lp ATA token account, init by cp-swap
    #[account(mut)]
    pub creator_lp_token: UncheckedAccount<'info>,

    /// CHECK: Token_0 vault for the pool, init by cp-swap
    #[account(
        mut,
        seeds = [
            POOL_VAULT_SEED.as_bytes(),
            pool_state.key().as_ref(),
            token_0_mint.key().as_ref()
        ],
        seeds::program = cp_swap_program,
        bump,
    )]
    pub token_0_vault: UncheckedAccount<'info>,

    /// CHECK: Token_1 vault for the pool, init by cp-swap
    #[account(
        mut,
        seeds = [
            POOL_VAULT_SEED.as_bytes(),
            pool_state.key().as_ref(),
            token_1_mint.key().as_ref()
        ],
        seeds::program = cp_swap_program,
        bump,
    )]
    pub token_1_vault: UncheckedAccount<'info>,

    /// create pool fee account
    #[account(
        mut,
        address= raydium_cpmm_cpi::create_pool_fee_reveiver::id(),
    )]
    pub create_pool_fee: Box<Account<'info, TokenAccount>>,

    /// CHECK: an account to store oracle observations, init by cp-swap
    #[account(
        mut,
        seeds = [
            OBSERVATION_SEED.as_bytes(),
            pool_state.key().as_ref(),
        ],
        seeds::program = cp_swap_program,
        bump,
    )]
    pub observation_state: UncheckedAccount<'info>,

    pub cp_swap_program: Program<'info, RaydiumCpmm>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

impl CompleteLaunch<'_> {
    pub fn validate(&self) -> Result<()> {
        let clock = Clock::get()?;
        
        // 7 days in slots (assuming 400ms per slot)
        const SLOTS_PER_DAY: u64 = 216_000; // (24 * 60 * 60 * 1000) / 400
        const REQUIRED_SLOTS: u64 = SLOTS_PER_DAY * 5;

        require!(
            clock.slot >= self.launch.slot_initialized.saturating_add(REQUIRED_SLOTS),
            LaunchpadError::LaunchPeriodNotOver
        );

        Ok(())
    }

    pub fn handle(ctx: Context<Self>) -> Result<()> {
        let launch = &mut ctx.accounts.launch;

        let launch_usdc_balance = ctx.accounts.usdc_vault.amount;

        if launch_usdc_balance >= launch.minimum_raise_amount {
            // Transfer USDC to DAO treasury
            let seeds = &[
                b"launch",
                launch.dao.as_ref(),
                &[launch.pda_bump],
            ];
            let signer = &[&seeds[..]];

            let usdc_to_lp = launch_usdc_balance.saturating_div(10);
            let usdc_to_dao = launch_usdc_balance.saturating_sub(usdc_to_lp);

            let token_to_lp = usdc_to_lp.saturating_mul(10_000);

            token::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.usdc_vault.to_account_info(),
                        to: ctx.accounts.treasury_usdc_account.to_account_info(),
                        authority: launch.to_account_info(),
                    },
                    signer,
                ),
                usdc_to_dao,
            )?;

            let cpi_accounts = cpi::accounts::Initialize {
                creator: ctx.accounts.creator.to_account_info(),
                amm_config: ctx.accounts.amm_config.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
                pool_state: ctx.accounts.pool_state.to_account_info(),
                token_0_mint: ctx.accounts.token_0_mint.to_account_info(),
                token_1_mint: ctx.accounts.token_1_mint.to_account_info(),
                lp_mint: ctx.accounts.lp_mint.to_account_info(),
                creator_token_0: ctx.accounts.creator_token_0.to_account_info(),
                creator_token_1: ctx.accounts.creator_token_1.to_account_info(),
                creator_lp_token: ctx.accounts.creator_lp_token.to_account_info(),
                token_0_vault: ctx.accounts.token_0_vault.to_account_info(),
                token_1_vault: ctx.accounts.token_1_vault.to_account_info(),
                create_pool_fee: ctx.accounts.create_pool_fee.to_account_info(),
                observation_state: ctx.accounts.observation_state.to_account_info(),
                token_program: ctx.accounts.token_program.to_account_info(),
                token_0_program: ctx.accounts.token_program.to_account_info(),
                token_1_program: ctx.accounts.token_program.to_account_info(),
                associated_token_program: ctx.accounts.associated_token_program.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            };
            let cpi_context = CpiContext::new(ctx.accounts.cp_swap_program.to_account_info(), cpi_accounts);
            cpi::initialize(cpi_context, 1, 1, 0)?;



            launch.state = LaunchState::Complete;
        } else {
            launch.state = LaunchState::Refunding;
        }

        Ok(())
    }
} 