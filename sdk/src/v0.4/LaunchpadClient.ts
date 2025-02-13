import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, AccountInfo } from "@solana/web3.js";
import { Launchpad, IDL as LaunchpadIDL } from "./types/launchpad.js";
import { LAUNCHPAD_PROGRAM_ID } from "./constants.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
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
    creator: PublicKey = this.provider.publicKey
  ) {
    const [launch] = getLaunchAddr(this.launchpad.programId, dao);
    const usdcVault = getAssociatedTokenAddressSync(usdcMint, launch, true);
    const [daoTreasury] = getDaoTreasuryAddr(
      this.autocratClient.getProgramId(),
      dao
    );

    return this.launchpad.methods
      .initializeLaunch({
        minimumRaiseAmount,
        maximumRaiseAmount,
      })
      .accounts({
        launch,
        usdcVault,
        daoTreasury,
        creator,
        dao,
        usdcMint,
      });
  }
}
