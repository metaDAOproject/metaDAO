use anchor_lang::prelude::*;

#[account]
pub struct Launch {
    pub minimum_raise_amount: u64,
    pub maximum_raise_amount: u64,
    pub is_approved: bool,
    pub creator: Pubkey,
    pub usdc_vault: Pubkey,
    pub committed_amount: u64,
    pub pda_bump: u8,
    pub dao: Pubkey,
    pub dao_treasury: Pubkey,
}