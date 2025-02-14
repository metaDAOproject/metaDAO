import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, AccountInfo } from "@solana/web3.js";
import { Launchpad, IDL as LaunchpadIDL } from "./types/launchpad.js";
import {
  LAUNCHPAD_PROGRAM_ID,
  RAYDIUM_CP_SWAP_PROGRAM_ID,
} from "./constants.js";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";
import { Launch } from "./types/index.js";
import { getDaoTreasuryAddr, getLaunchAddr } from "./utils/pda.js";
import { AutocratClient } from "./AutocratClient.js";

export type CreateLaunchpadClientParams = {
  provider: AnchorProvider;
  launchpadProgramId?: PublicKey;
  autocratProgramId?: PublicKey;
  conditionalVaultProgramId?: PublicKey;
  ammProgramId?: PublicKey;
};

export class LaunchpadClient {
  public launchpad: Program<Launchpad>;
  public provider: AnchorProvider;
  public autocratClient: AutocratClient;

  private constructor(params: CreateLaunchpadClientParams) {
    this.provider = params.provider;
    this.launchpad = new Program(
      LaunchpadIDL,
      params.launchpadProgramId || LAUNCHPAD_PROGRAM_ID,
      this.provider
    );
    this.autocratClient = AutocratClient.createClient({
      provider: this.provider,
      autocratProgramId: params.autocratProgramId,
      conditionalVaultProgramId: params.conditionalVaultProgramId,
      ammProgramId: params.ammProgramId,
    });
  }

  static createClient(params: CreateLaunchpadClientParams): LaunchpadClient {
    return new LaunchpadClient(params);
  }

  getProgramId(): PublicKey {
    return this.launchpad.programId;
  }

  async getLaunch(launch: PublicKey): Promise<Launch> {
    return await this.launchpad.account.launch.fetch(launch);
  }

  async fetchLaunch(launch: PublicKey): Promise<Launch | null> {
    return await this.launchpad.account.launch.fetchNullable(launch);
  }

  async deserializeLaunch(accountInfo: AccountInfo<Buffer>): Promise<Launch> {
    return this.launchpad.coder.accounts.decode("launch", accountInfo.data);
  }

  initializeLaunchIx(
    dao: PublicKey,
    minimumRaiseAmount: BN,
    maximumRaiseAmount: BN,
    usdcMint: PublicKey,
    tokenMint: PublicKey,
    creator: PublicKey = this.provider.publicKey
  ) {
    const [launch] = getLaunchAddr(this.launchpad.programId, dao);
    const usdcVault = getAssociatedTokenAddressSync(usdcMint, launch, true);
    const tokenVault = getAssociatedTokenAddressSync(tokenMint, launch, true);
    const [daoTreasury] = getDaoTreasuryAddr(
      this.autocratClient.getProgramId(),
      dao
    );
    const treasuryUsdcAccount = getAssociatedTokenAddressSync(
      usdcMint,
      daoTreasury,
      true
    );

    return this.launchpad.methods
      .initializeLaunch({
        minimumRaiseAmount,
      })
      .accounts({
        launch,
        usdcVault,
        tokenVault,
        daoTreasury,
        treasuryUsdcAccount,
        creator,
        dao,
        usdcMint,
        tokenMint,
      })
      .preInstructions([
        createAssociatedTokenAccountIdempotentInstruction(
          creator,
          getAssociatedTokenAddressSync(tokenMint, launch, true),
          launch,
          tokenMint
        ),
        createAssociatedTokenAccountIdempotentInstruction(
          creator,
          getAssociatedTokenAddressSync(usdcMint, launch, true),
          launch,
          usdcMint
        ),
        createAssociatedTokenAccountIdempotentInstruction(
          creator,
          getAssociatedTokenAddressSync(usdcMint, daoTreasury, true),
          daoTreasury,
          usdcMint
        ),
      ]);
  }

  fundIx(
    launch: PublicKey,
    amount: BN,
    usdcMint: PublicKey,
    tokenMint: PublicKey,
    funder: PublicKey = this.provider.publicKey
  ) {
    const usdcVault = getAssociatedTokenAddressSync(usdcMint, launch, true);
    const funderUsdcAccount = getAssociatedTokenAddressSync(usdcMint, funder);
    const funderTokenAccount = getAssociatedTokenAddressSync(tokenMint, funder);

    return this.launchpad.methods.fund(amount).accounts({
      launch,
      usdcVault,
      tokenMint,
      funder,
      funderUsdcAccount,
      funderTokenAccount,
    });
  }

  completeLaunchIx(
    launch: PublicKey,
    usdcMint: PublicKey,
    daoTreasury: PublicKey
  ) {
    const usdcVault = getAssociatedTokenAddressSync(usdcMint, launch, true);
    const treasuryUsdcAccount = getAssociatedTokenAddressSync(
      usdcMint,
      daoTreasury,
      true
    );

    return this.launchpad.methods.completeLaunch().accounts({
      launch,
      usdcVault,
      treasuryUsdcAccount,
      cpSwapProgram: RAYDIUM_CP_SWAP_PROGRAM_ID,
    });
  }
}
