use anchor_lang::prelude::*;

#[error_code]
pub enum LaunchpadError {
    #[msg("Supply must be 0 at time of launch initialization")]
    SupplyNonZero,
    #[msg("Amount must be greater than 0")]
    InvalidAmount,
} 