use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::error::LaunchpadError;
use crate::events::{CommonFields, LaunchRefundedEvent};
use crate::state::{FundingRecord, Launch, LaunchState};

#[event_cpi]
#[derive(Accounts)]
pub struct Refund<'info> {
    #[account(
        mut,
        has_one = launch_usdc_vault,
        has_one = launch_signer,
    )]
    pub launch: Account<'info, Launch>,

    #[account(
        mut,
        close = funder,
        has_one = funder,
        seeds = [b"funding_record", launch.key().as_ref(), funder.key().as_ref()],
        bump = funding_record.pda_bump
    )]
    pub funding_record: Account<'info, FundingRecord>,

    #[account(mut)]
    pub launch_usdc_vault: Account<'info, TokenAccount>,

    /// CHECK: just a signer
    pub launch_signer: UncheckedAccount<'info>,

    #[account(mut)]
    pub funder: Signer<'info>,

    #[account(mut)]
    pub funder_usdc_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

impl Refund<'_> {
    pub fn validate(&self) -> Result<()> {
        require!(
            self.launch.state == LaunchState::Refunding,
            LaunchpadError::LaunchNotRefunding
        );
        Ok(())
    }

    pub fn handle(ctx: Context<Self>) -> Result<()> {
        let launch = &mut ctx.accounts.launch;
        let launch_key = launch.key();
        let funding_record = &ctx.accounts.funding_record;

        let seeds = &[
            b"launch_signer",
            launch_key.as_ref(),
            &[launch.launch_signer_pda_bump],
        ];
        let signer = &[&seeds[..]];

        // Transfer USDC back to the user
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.launch_usdc_vault.to_account_info(),
                    to: ctx.accounts.funder_usdc_account.to_account_info(),
                    authority: ctx.accounts.launch_signer.to_account_info(),
                },
                signer,
            ),
            funding_record.committed_amount,
        )?;

        launch.seq_num += 1;

        let clock = Clock::get()?;
        emit_cpi!(LaunchRefundedEvent {
            common: CommonFields::new(&clock, launch.seq_num),
            launch: ctx.accounts.launch.key(),
            funder: ctx.accounts.funder.key(),
            usdc_refunded: funding_record.committed_amount,
            funding_record: ctx.accounts.funding_record.key(),
        });

        Ok(())
    }
}
