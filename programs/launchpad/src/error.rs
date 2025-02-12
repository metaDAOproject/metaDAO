use anchor_lang::prelude::*;

#[error_code]
pub enum LaunchpadError {
    #[msg("Maximum raise amount must be greater than minimum")]
    InvalidRaiseAmount,
    #[msg("Launch has not been approved")]
    LaunchNotApproved,
    #[msg("Amount would exceed maximum raise amount")]
    ExceedsMaximumRaise,
} 