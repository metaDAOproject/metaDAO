//! A smart contract that facilitates the creation of new futarchic DAOs via ICO.
//! 
//! Creators can create a `Launch`, specifying the minimum and maximum to raise.
use anchor_lang::prelude::*;
// use anchor_spl::token::{Token, TokenAccount, Transfer};
// use anchor_spl::associated_token::AssociatedToken;

pub mod state;
pub mod instructions;
pub mod error;

use instructions::*;


declare_id!("AfJJJ5UqxhBKoE3grkKAZZsoXDE9kncbMKvqSHGsCNrE");

#[program]
pub mod launchpad {
    use super::*;

    pub fn initialize_launch(
        ctx: Context<InitializeLaunch>,
        args: InitializeLaunchArgs,
    ) -> Result<()> {
        InitializeLaunch::handle(ctx, args)
    }
}
