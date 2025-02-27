use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer};

use crate::state::{Launch, LaunchState, FundingRecord};
use crate::error::LaunchpadError;
use crate::events::{LaunchClaimEvent, CommonFields};

#[event_cpi]
#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(
        mut,
        has_one = launch_signer,
        has_one = token_mint,
        has_one = launch_token_vault,
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

    /// CHECK: just a signer
    pub launch_signer: UncheckedAccount<'info>,

    #[account(mut)]
    pub token_mint: Account<'info, Mint>,

    #[account(mut)]
    pub launch_token_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub funder: Signer<'info>,

    #[account(
        mut,
        token::mint = token_mint,
        token::authority = funder
    )]
    pub funder_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

impl Claim<'_> {
    pub fn validate(&self) -> Result<()> {
        require!(self.launch.state == LaunchState::Complete, LaunchpadError::InvalidLaunchState);
        Ok(())
    }

    pub fn handle(ctx: Context<Self>) -> Result<()> {
        let launch = &ctx.accounts.launch;
        let funding_record = &ctx.accounts.funding_record;
        let launch_key = launch.key();

        // Calculate tokens to transfer based on contribution percentage
        let token_amount = (funding_record.committed_amount as u128)
            .checked_mul(launch.total_tokens_available as u128)
            .unwrap()
            .checked_div(launch.total_committed_amount as u128)
            .unwrap();

        let seeds = &[
            b"launch_signer",
            launch_key.as_ref(),
            &[launch.launch_signer_pda_bump],
        ];
        let signer = &[&seeds[..]];

        // Transfer tokens from vault to funder
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.launch_token_vault.to_account_info(),
                    to: ctx.accounts.funder_token_account.to_account_info(),
                    authority: ctx.accounts.launch_signer.to_account_info(),
                },
                signer,
            ),
            token_amount as u64,
        )?;

        let clock = Clock::get()?;
        emit_cpi!(LaunchClaimEvent {
            common: CommonFields::new(&clock, launch.seq_num),
            launch: launch.key(),
            funder: ctx.accounts.funder.key(),
            tokens_claimed: token_amount as u64,
            funding_record: funding_record.key(),
        });

        Ok(())
    }
} 