use anchor_lang::prelude::*;

#[error_code]
pub enum LaunchpadError {
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Supply must be zero")]
    SupplyNonZero,
    #[msg("Launch period must be between 1 hour and 2 weeks")]
    InvalidSecondsForLaunch,
    #[msg("Insufficient funds")]
    InsufficientFunds,
    #[msg("Invalid launch state")]
    InvalidLaunchState,
    #[msg("Launch period not over")]
    LaunchPeriodNotOver,
    #[msg("Launch is complete, no more funding allowed")]
    LaunchExpired,
    #[msg("Launch needs to be in refunding state to get a refund")]
    LaunchNotRefunding,
    #[msg("Launch must be initialized to be started")]
    LaunchNotInitialized,
    #[msg("Freeze authority can't be set on launchpad tokens")]
    FreezeAuthoritySet,
} 