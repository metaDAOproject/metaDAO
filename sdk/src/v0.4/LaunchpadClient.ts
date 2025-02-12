import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";
import { Launchpad, IDL as LaunchpadIDL } from "./types/launchpad.js";
import { LAUNCHPAD_PROGRAM_ID } from "./constants.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";

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

  initializeLaunchIx(
    dao: PublicKey,
    minimumRaiseAmount: BN,
    maximumRaiseAmount: BN,
    usdcMint: PublicKey,
    creator: PublicKey = this.provider.publicKey
  ) {
    const [launch] = PublicKey.findProgramAddressSync(
      [Buffer.from("launch"), dao.toBuffer()],
      this.launchpad.programId
    );

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

  async getLaunch(launch: PublicKey) {
    return await this.launchpad.account.launch.fetch(launch);
  }
}
