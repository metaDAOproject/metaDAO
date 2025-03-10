//! A smart contract that facilitates the creation of new futarchic DAOs.
use anchor_lang::prelude::*;

pub mod error;
pub mod events;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("AfJJJ5UqxhBKoE3grkKAZZsoXDE9kncbMKvqSHGsCNrE");

/// 10M tokens with 6 decimals
pub const AVAILABLE_TOKENS: u64 = 10_000_000 * 1_000_000;

pub mod usdc_mint {
    use anchor_lang::prelude::declare_id;

    #[cfg(feature = "devnet")]
    declare_id!("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

    #[cfg(not(feature = "devnet"))]
    declare_id!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
}

#[program]
pub mod launchpad {
    use super::*;

    #[access_control(ctx.accounts.validate(&args))]
    pub fn initialize_launch(
        ctx: Context<InitializeLaunch>,
        args: InitializeLaunchArgs,
    ) -> Result<()> {
        InitializeLaunch::handle(ctx, args)
    }

    #[access_control(ctx.accounts.validate())]
    pub fn start_launch(ctx: Context<StartLaunch>) -> Result<()> {
        StartLaunch::handle(ctx)
    }

    #[access_control(ctx.accounts.validate(amount))]
    pub fn fund(ctx: Context<Fund>, amount: u64) -> Result<()> {
        Fund::handle(ctx, amount)
    }

    #[access_control(ctx.accounts.validate())]
    pub fn complete_launch(ctx: Context<CompleteLaunch>) -> Result<()> {
        CompleteLaunch::handle(ctx)
    }

    #[access_control(ctx.accounts.validate())]
    pub fn refund(ctx: Context<Refund>) -> Result<()> {
        Refund::handle(ctx)
    }

    #[access_control(ctx.accounts.validate())]
    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        Claim::handle(ctx)
    }
}
