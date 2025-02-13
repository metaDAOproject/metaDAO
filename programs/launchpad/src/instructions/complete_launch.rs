use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::state::{Launch, LaunchState};
use crate::error::LaunchpadError;

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

    pub token_program: Program<'info, Token>,
}

impl CompleteLaunch<'_> {
    pub fn validate(&self) -> Result<()> {
        Ok(())
    }

    pub fn handle(ctx: Context<Self>) -> Result<()> {
        let launch = &mut ctx.accounts.launch;

        if launch.committed_amount >= launch.minimum_raise_amount {
            // Transfer USDC to DAO treasury
            let seeds = &[
                b"launch",
                launch.dao.as_ref(),
                &[launch.pda_bump],
            ];
            let signer = &[&seeds[..]];

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
                launch.committed_amount,
            )?;

            launch.state = LaunchState::Complete;
        } else {
            launch.state = LaunchState::Refunding;
        }

        Ok(())
    }
} 