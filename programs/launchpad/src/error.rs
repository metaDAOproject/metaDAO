use anchor_lang::prelude::*;

#[error_code]
pub enum LaunchpadError {
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Supply must be zero")]
    SupplyNonZero,
    #[msg("Invalid launch state")]
    InvalidLaunchState,
    #[msg("Launch period not over")]
    LaunchPeriodNotOver,
} 