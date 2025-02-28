use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};
use anchor_spl::associated_token::AssociatedToken;

use crate::state::{Launch, LaunchState};
use crate::events::{LaunchInitializedEvent, CommonFields};
use crate::error::LaunchpadError;
use crate::AVAILABLE_TOKENS;

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone)]
pub struct InitializeLaunchArgs {
    pub minimum_raise_amount: u64,
    pub slots_for_launch: u64,
}

#[event_cpi]
#[derive(Accounts)]
pub struct InitializeLaunch<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + std::mem::size_of::<Launch>(),
        seeds = [b"launch", token_mint.key().as_ref()],
        bump
    )]
    pub launch: Account<'info, Launch>,

    /// CHECK: This is the launch signer
    pub launch_signer: UncheckedAccount<'info>,

    #[account(
        associated_token::mint = usdc_mint,
        associated_token::authority = launch_signer
    )]
    pub usdc_vault: Account<'info, TokenAccount>,

    #[account(
        associated_token::mint = token_mint,
        associated_token::authority = launch_signer
    )]
    pub token_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub creator: Signer<'info>,
    
    #[account(mint::decimals = 6)]
    pub usdc_mint: Account<'info, Mint>,

    #[account(
        mint::decimals = 6,
        mint::authority = launch_signer,
    )]
    pub token_mint: Account<'info, Mint>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl InitializeLaunch<'_> {
    pub fn validate(&self, _args: InitializeLaunchArgs) -> Result<()> {
        require_eq!(self.token_mint.supply, 0, LaunchpadError::SupplyNonZero);

        require!(self.token_mint.freeze_authority.is_none(), LaunchpadError::FreezeAuthoritySet);

        Ok(())
    }

    pub fn handle(
        ctx: Context<Self>,
        args: InitializeLaunchArgs,
    ) -> Result<()> {
        let (launch_signer, launch_signer_pda_bump) =
            Pubkey::find_program_address(&[b"launch_signer", ctx.accounts.launch.key().as_ref()], ctx.program_id);

        ctx.accounts.launch.set_inner(Launch {
            minimum_raise_amount: args.minimum_raise_amount,
            creator: ctx.accounts.creator.key(),
            launch_signer,
            launch_signer_pda_bump,
            launch_usdc_vault: ctx.accounts.usdc_vault.key(),
            launch_token_vault: ctx.accounts.token_vault.key(),
            total_committed_amount: 0,
            token_mint: ctx.accounts.token_mint.key(),
            pda_bump: ctx.bumps.launch,
            seq_num: 0,
            state: LaunchState::Initialized,
            slot_started: 0,
            slots_for_launch: args.slots_for_launch,
            dao: None,
            dao_treasury: None,
        });

        let clock = Clock::get()?;
        emit_cpi!(LaunchInitializedEvent {
            common: CommonFields::new(&clock, 0),
            launch: ctx.accounts.launch.key(),
            creator: ctx.accounts.creator.key(),
            usdc_mint: ctx.accounts.usdc_mint.key(),
            token_mint: ctx.accounts.token_mint.key(),
            pda_bump: ctx.bumps.launch,
        });

        let launch_key = ctx.accounts.launch.key();

        let seeds = &[
            b"launch_signer",
            launch_key.as_ref(),
            &[launch_signer_pda_bump],
        ];
        let signer = &[&seeds[..]];

        // Mint total tokens to launch token vault
        token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.token_mint.to_account_info(),
                    to: ctx.accounts.token_vault.to_account_info(),
                    authority: ctx.accounts.launch_signer.to_account_info(),
                },
                signer,
            ),
            AVAILABLE_TOKENS,
        )?;

        Ok(())
    }
}