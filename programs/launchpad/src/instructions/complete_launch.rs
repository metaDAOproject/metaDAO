use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

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

    #[account(mut)]
    pub usdc_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub treasury_usdc_account: Account<'info, TokenAccount>,

    pub cp_swap_program: Program<'info, RaydiumCpmm>,
    pub token_program: Program<'info, Token>,
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

        let treasury_usdc_balance = ctx.accounts.treasury_usdc_account.amount;

        if treasury_usdc_balance >= launch.minimum_raise_amount {
            // Transfer USDC to DAO treasury
            let seeds = &[
                b"launch",
                launch.dao.as_ref(),
                &[launch.pda_bump],
            ];
            let signer = &[&seeds[..]];

            let usdc_to_lp = treasury_usdc_balance.saturating_div(10);
            let usdc_to_dao = treasury_usdc_balance.saturating_sub(usdc_to_lp);

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



            launch.state = LaunchState::Complete;
        } else {
            launch.state = LaunchState::Refunding;
        }

        Ok(())
    }
} 