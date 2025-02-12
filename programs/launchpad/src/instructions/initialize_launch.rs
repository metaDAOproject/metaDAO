use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;
use autocrat::ID as AUTOCRAT_PROGRAM_ID;
use autocrat::Dao;

use crate::state::Launch;
use crate::error::LaunchpadError;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitializeLaunchArgs {
    pub minimum_raise_amount: u64,
    pub maximum_raise_amount: u64,
}

#[derive(Accounts)]
pub struct InitializeLaunch<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + std::mem::size_of::<Launch>(),
        seeds = [b"launch", dao.key().as_ref()],
        bump
    )]
    pub launch: Account<'info, Launch>,

    #[account(
        init,
        payer = creator,
        associated_token::mint = usdc_mint,
        associated_token::authority = launch
    )]
    pub usdc_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub creator: Signer<'info>,
    
    #[account(
        constraint = dao.usdc_mint == usdc_mint.key()
    )]
    pub dao: Account<'info, Dao>,
    
    /// CHECK: This is USDC mint
    pub usdc_mint: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl InitializeLaunch<'_> {
    pub fn handle(
        ctx: Context<Self>,
        args: InitializeLaunchArgs,
    ) -> Result<()> {
        require_gte!(
            args.maximum_raise_amount,
            args.minimum_raise_amount,
            LaunchpadError::InvalidRaiseAmount
        );

        let (dao_treasury, _) = Pubkey::find_program_address(
            &[ctx.accounts.dao.key().as_ref()],
            &AUTOCRAT_PROGRAM_ID
        );

        ctx.accounts.launch.set_inner(Launch {
            minimum_raise_amount: args.minimum_raise_amount,
            maximum_raise_amount: args.maximum_raise_amount,
            is_approved: false,
            dao: ctx.accounts.dao.key(),
            creator: ctx.accounts.creator.key(),
            dao_treasury,
            usdc_vault: ctx.accounts.usdc_vault.key(),
            committed_amount: 0,
            pda_bump: ctx.bumps.launch,
        });

        Ok(())
    }
}