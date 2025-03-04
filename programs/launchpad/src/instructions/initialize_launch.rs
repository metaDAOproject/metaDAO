use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};
use anchor_spl::associated_token::AssociatedToken;

use crate::state::{Launch, LaunchState};
use crate::events::{LaunchInitializedEvent, CommonFields};
use crate::error::LaunchpadError;
use crate::AVAILABLE_TOKENS;
use anchor_spl::metadata::{
    create_metadata_accounts_v3, mpl_token_metadata::types::DataV2, CreateMetadataAccountsV3,
    Metadata, mpl_token_metadata::ID as MPL_TOKEN_METADATA_PROGRAM_ID,
};

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct InitializeLaunchArgs {
    pub minimum_raise_amount: u64,
    pub slots_for_launch: u64,
    pub token_name: String,
    pub token_symbol: String,
    pub token_uri: String,
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

    #[account(
        init,
        payer = creator,
        mint::decimals = 6,
        mint::authority = launch_signer,
    )]
    pub token_mint: Account<'info, Mint>,

    /// CHECK: This is the token metadata
    #[account(
        mut,
        seeds = [b"metadata", MPL_TOKEN_METADATA_PROGRAM_ID.as_ref(), token_mint.key().as_ref()],
        seeds::program = MPL_TOKEN_METADATA_PROGRAM_ID,
        bump
    )]
    pub token_metadata: UncheckedAccount<'info>,

    /// CHECK: This is the launch signer
    #[account(
        seeds = [b"launch_signer", launch.key().as_ref()],
        bump
    )]
    pub launch_signer: UncheckedAccount<'info>,

    #[account(
        associated_token::mint = usdc_mint,
        associated_token::authority = launch_signer
    )]
    pub usdc_vault: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = creator,
        associated_token::mint = token_mint,
        associated_token::authority = launch_signer
    )]
    pub token_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub creator: Signer<'info>,
    
    #[account(mint::decimals = 6)]
    pub usdc_mint: Account<'info, Mint>,

    pub rent: Sysvar<'info, Rent>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub token_metadata_program: Program<'info, Metadata>,
}

impl InitializeLaunch<'_> {
    pub fn validate(&self, args: &InitializeLaunchArgs) -> Result<()> {
        Ok(())
    }

    pub fn handle(
        ctx: Context<Self>,
        args: InitializeLaunchArgs,
    ) -> Result<()> {
        ctx.accounts.launch.set_inner(Launch {
            minimum_raise_amount: args.minimum_raise_amount,
            creator: ctx.accounts.creator.key(),
            launch_signer: ctx.accounts.launch_signer.key(),
            launch_signer_pda_bump: ctx.bumps.launch_signer,
            launch_usdc_vault: ctx.accounts.usdc_vault.key(),
            launch_token_vault: ctx.accounts.token_vault.key(),
            total_committed_amount: 0,
            token_mint: ctx.accounts.token_mint.key(),
            usdc_mint: ctx.accounts.usdc_mint.key(),
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
            minimum_raise_amount: args.minimum_raise_amount,
            creator: ctx.accounts.creator.key(),
            launch_signer: ctx.accounts.launch_signer.key(),
            launch_signer_pda_bump: ctx.bumps.launch_signer,
            launch_usdc_vault: ctx.accounts.usdc_vault.key(),
            launch_token_vault: ctx.accounts.token_vault.key(),
            token_mint: ctx.accounts.token_mint.key(),
            usdc_mint: ctx.accounts.usdc_mint.key(),
            pda_bump: ctx.bumps.launch,
            slots_for_launch: args.slots_for_launch,
        });

        let launch_key = ctx.accounts.launch.key();

        let seeds = &[
            b"launch_signer",
            launch_key.as_ref(),
            &[ctx.bumps.launch_signer],
        ];
        let signer = &[&seeds[..]];

        let cpi_program = ctx.accounts.token_metadata_program.to_account_info();

        let cpi_accounts = CreateMetadataAccountsV3 {
            metadata: ctx.accounts.token_metadata.to_account_info(),
            mint: ctx.accounts.token_mint.to_account_info(),
            mint_authority: ctx.accounts.launch_signer.to_account_info(),
            payer: ctx.accounts.creator.to_account_info(),
            update_authority: ctx.accounts.launch_signer.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        };

        create_metadata_accounts_v3(
            CpiContext::new(cpi_program, cpi_accounts).with_signer(signer),
            DataV2 {
                name: args.token_name.clone(),
                symbol: args.token_symbol.clone(),
                uri: args.token_uri.clone(),
                seller_fee_basis_points: 0,
                creators: None,
                collection: None,
                uses: None,
            },
            true,
            true,
            None,
        )?;

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