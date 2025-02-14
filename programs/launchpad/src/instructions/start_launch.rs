use anchor_lang::prelude::*;
use crate::state::{Launch, LaunchState};
use crate::error::LaunchpadError;

#[derive(Accounts)]
pub struct StartLaunch<'info> {
    #[account(
        mut,
        has_one = creator,
    )]
    pub launch: Account<'info, Launch>,

    pub creator: Signer<'info>,
}

impl StartLaunch<'_> {
    pub fn validate(&self) -> Result<()> {
        require!(
            self.launch.state == LaunchState::Initialized,
            LaunchpadError::LaunchNotInitialized
        );

        Ok(())
    }

    pub fn handle(ctx: Context<Self>) -> Result<()> {
        let launch = &mut ctx.accounts.launch;
        let clock = Clock::get()?;

        launch.state = LaunchState::Live;
        launch.slot_started = clock.slot;

        Ok(())
    }
}
