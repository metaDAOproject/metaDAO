import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, AccountInfo } from "@solana/web3.js";
import { Launchpad, IDL as LaunchpadIDL } from "./types/launchpad.js";
import { LAUNCHPAD_PROGRAM_ID } from "./constants.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";
import { Launch } from "./types/index.js";
import { getLaunchAddr } from "./utils/pda.js";

export type CreateLaunchpadClientParams = {
  provider: AnchorProvider;
  launchpadProgramId?: PublicKey;
};

export class LaunchpadClient {
  public launchpad: Program<Launchpad>;
  public provider: AnchorProvider;

  private constructor(params: CreateLaunchpadClientParams) {
    this.provider = params.provider;
    this.launchpad = new Program(
      LaunchpadIDL,
      params.launchpadProgramId || LAUNCHPAD_PROGRAM_ID,
      this.provider
    );
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

    return this.launchpad.methods
      .initializeLaunch({
        minimumRaiseAmount,
        maximumRaiseAmount,
      })
      .accounts({
        launch,
        usdcVault,
        creator,
        dao,
        usdcMint,
      });
  }
}
