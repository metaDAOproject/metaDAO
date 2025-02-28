use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum LaunchState {
    Initialized,
    Live,
    Complete,
    Refunding,
}

#[account]
pub struct Launch {
    /// The PDA bump.
    pub pda_bump: u8,
    /// The minimum amount of USDC that must be raised, otherwise
    /// everyone can get their USDC back.
    pub minimum_raise_amount: u64,
    /// The creator of the launch.
    pub creator: Pubkey,
    /// The launch signer address. Needed because Raydium pools need a SOL payer and this PDA can't hold SOL.
    pub launch_signer: Pubkey,
    /// The PDA bump for the launch signer.
    pub launch_signer_pda_bump: u8,
    /// The USDC vault that will hold the USDC raised until the launch is over.
    pub launch_usdc_vault: Pubkey,
    /// The token vault, used to send tokens to Raydium.
    pub launch_token_vault: Pubkey,
    /// The token that will be minted to funders and that will control the DAO.
    pub token_mint: Pubkey,
    /// The USDC mint.
    pub usdc_mint: Pubkey,
    /// The slot when the launch was started.
    pub slot_started: u64,
    /// The amount of USDC that has been committed by the users.
    pub total_committed_amount: u64,
    /// The state of the launch.
    pub state: LaunchState,
    /// The sequence number of this launch. Useful for sorting events.
    pub seq_num: u64,
    /// The number of slots for the launch.
    pub slots_for_launch: u64,
    /// The DAO, if the launch is complete.
    pub dao: Option<Pubkey>,
    /// The DAO treasury that USDC / LP is sent to, if the launch is complete.
    pub dao_treasury: Option<Pubkey>,
}