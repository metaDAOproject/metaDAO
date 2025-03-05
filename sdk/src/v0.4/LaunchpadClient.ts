import { AnchorProvider, Program } from "@coral-xyz/anchor";
import {
  PublicKey,
  Keypair,
  AccountInfo,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import { Launchpad, IDL as LaunchpadIDL } from "./types/launchpad.js";
import {
  LAUNCHPAD_PROGRAM_ID,
  RAYDIUM_AUTHORITY,
  LOW_FEE_RAYDIUM_CONFIG,
  RAYDIUM_CP_SWAP_PROGRAM_ID,
  RAYDIUM_CREATE_POOL_FEE_RECEIVE,
  DEVNET_RAYDIUM_CP_SWAP_PROGRAM_ID,
  DEVNET_RAYDIUM_AUTHORITY,
  DEVNET_LOW_FEE_RAYDIUM_CONFIG,
  DEVNET_RAYDIUM_CREATE_POOL_FEE_RECEIVE,
  MPL_TOKEN_METADATA_PROGRAM_ID,
} from "./constants.js";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";
import { FundingRecord, Launch } from "./types/index.js";
import {
  getDaoTreasuryAddr,
  getEventAuthorityAddr,
  getFundingRecordAddr,
  getLaunchAddr,
  getLaunchSignerAddr,
  getMetadataAddr,
} from "./utils/pda.js";
import { AutocratClient } from "./AutocratClient.js";
import * as anchor from "@coral-xyz/anchor";

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

  async getFundingRecord(fundingRecord: PublicKey): Promise<FundingRecord> {
    return await this.launchpad.account.fundingRecord.fetch(fundingRecord);
  }

  async fetchFundingRecord(
    fundingRecord: PublicKey
  ): Promise<FundingRecord | null> {
    return await this.launchpad.account.fundingRecord.fetchNullable(
      fundingRecord
    );
  }

  async deserializeFundingRecord(
    accountInfo: AccountInfo<Buffer>
  ): Promise<FundingRecord> {
    return this.launchpad.coder.accounts.decode(
      "fundingRecord",
      accountInfo.data
    );
  }

  initializeLaunchIx(
    tokenName: string,
    tokenSymbol: string,
    tokenUri: string,
    minimumRaiseAmount: BN,
    slotsForLaunch: BN,
    usdcMint: PublicKey,
    tokenMintKp: Keypair,
    creator: PublicKey = this.provider.publicKey
  ) {
    const [launch] = getLaunchAddr(
      this.launchpad.programId,
      tokenMintKp.publicKey
    );
    const [launchSigner] = getLaunchSignerAddr(
      this.launchpad.programId,
      launch
    );
    const usdcVault = getAssociatedTokenAddressSync(
      usdcMint,
      launchSigner,
      true
    );

    const tokenVault = getAssociatedTokenAddressSync(
      tokenMintKp.publicKey,
      launchSigner,
      true
    );
    const [tokenMetadata] = getMetadataAddr(tokenMintKp.publicKey);

    return this.launchpad.methods
      .initializeLaunch({
        minimumRaiseAmount,
        slotsForLaunch,
        tokenName,
        tokenSymbol,
        tokenUri,
      })
      .accounts({
        launch,
        launchSigner,
        usdcVault,
        tokenVault,
        creator,
        usdcMint,
        tokenMint: tokenMintKp.publicKey,
        tokenMetadata,
        tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
      })
      .preInstructions([
        createAssociatedTokenAccountIdempotentInstruction(
          creator,
          getAssociatedTokenAddressSync(usdcMint, launchSigner, true),
          launchSigner,
          usdcMint
        ),
      ])
      .signers([tokenMintKp]);
  }

  startLaunchIx(
    launch: PublicKey,
    creator: PublicKey = this.provider.publicKey
  ) {
    return this.launchpad.methods.startLaunch().accounts({
      launch,
      creator,
    });
  }

  fundIx(
    launch: PublicKey,
    amount: BN,
    usdcMint: PublicKey,
    funder: PublicKey = this.provider.publicKey
  ) {
    const [launchSigner] = getLaunchSignerAddr(
      this.launchpad.programId,
      launch
    );
    const launchUsdcVault = getAssociatedTokenAddressSync(
      usdcMint,
      launchSigner,
      true
    );
    const funderUsdcAccount = getAssociatedTokenAddressSync(usdcMint, funder);
    const [fundingRecord] = getFundingRecordAddr(
      this.launchpad.programId,
      launch,
      funder
    );

    return this.launchpad.methods.fund(amount).accounts({
      launch,
      launchUsdcVault,
      fundingRecord,
      funder,
      funderUsdcAccount,
      launchSigner,
    });
  }

  completeLaunchIx(
    launch: PublicKey,
    usdcMint: PublicKey,
    tokenMint: PublicKey,
    isDevnet: boolean = false
  ) {
    const [launchSigner] = getLaunchSignerAddr(
      this.launchpad.programId,
      launch
    );
    const launchUsdcVault = getAssociatedTokenAddressSync(
      usdcMint,
      launchSigner,
      true
    );
    const launchTokenVault = getAssociatedTokenAddressSync(
      tokenMint,
      launchSigner,
      true
    );

    const daoKp = Keypair.generate();
    const [daoTreasury] = getDaoTreasuryAddr(
      this.autocratClient.getProgramId(),
      daoKp.publicKey
    );
    const treasuryUsdcAccount = getAssociatedTokenAddressSync(
      usdcMint,
      daoTreasury,
      true
    );

    const poolStateKp = Keypair.generate();

    const cpSwapProgramId = isDevnet
      ? DEVNET_RAYDIUM_CP_SWAP_PROGRAM_ID
      : RAYDIUM_CP_SWAP_PROGRAM_ID;

    const [lpMint] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("pool_lp_mint"),
        poolStateKp.publicKey.toBuffer(),
      ],
      cpSwapProgramId
    );

    const lpVault = getAssociatedTokenAddressSync(lpMint, launchSigner, true);

    const [poolTokenVault] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("pool_vault"),
        poolStateKp.publicKey.toBuffer(),
        tokenMint.toBuffer(),
      ],
      cpSwapProgramId
    );

    const [poolUsdcVault] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("pool_vault"),
        poolStateKp.publicKey.toBuffer(),
        usdcMint.toBuffer(),
      ],
      cpSwapProgramId
    );

    const [observationState] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("observation"),
        poolStateKp.publicKey.toBuffer(),
      ],
      cpSwapProgramId
    );

    const [autocratEventAuthority] = getEventAuthorityAddr(
      this.autocratClient.getProgramId()
    );

    console.log(DEVNET_LOW_FEE_RAYDIUM_CONFIG.toBase58());

    return this.launchpad.methods
      .completeLaunch()
      .accounts({
        launch,
        launchSigner,
        launchUsdcVault,
        launchTokenVault,
        dao: daoKp.publicKey,
        daoTreasury,
        treasuryUsdcAccount,
        usdcMint,
        tokenMint,
        lpMint,
        lpVault,
        poolTokenVault,
        poolUsdcVault,
        poolState: poolStateKp.publicKey,
        observationState,
        cpSwapProgram: cpSwapProgramId,
        authority: isDevnet ? DEVNET_RAYDIUM_AUTHORITY : RAYDIUM_AUTHORITY,
        ammConfig: isDevnet
          ? DEVNET_LOW_FEE_RAYDIUM_CONFIG
          : LOW_FEE_RAYDIUM_CONFIG,
        createPoolFee: isDevnet
          ? DEVNET_RAYDIUM_CREATE_POOL_FEE_RECEIVE
          : RAYDIUM_CREATE_POOL_FEE_RECEIVE,
        autocratProgram: this.autocratClient.getProgramId(),
        autocratEventAuthority,
      })
      .signers([poolStateKp, daoKp])
      .preInstructions([
        createAssociatedTokenAccountIdempotentInstruction(
          this.provider.publicKey,
          treasuryUsdcAccount,
          daoTreasury,
          usdcMint
        ),
      ]);
  }

  refundIx(
    launch: PublicKey,
    usdcMint: PublicKey,
    tokenMint: PublicKey,
    funder: PublicKey = this.provider.publicKey
  ) {
    const [launchSigner] = getLaunchSignerAddr(
      this.launchpad.programId,
      launch
    );

    const [fundingRecord] = getFundingRecordAddr(
      this.launchpad.programId,
      launch,
      funder
    );

    const launchUsdcVault = getAssociatedTokenAddressSync(
      usdcMint,
      launchSigner,
      true
    );
    const funderUsdcAccount = getAssociatedTokenAddressSync(usdcMint, funder);

    return this.launchpad.methods.refund().accounts({
      launch,
      launchSigner,
      launchUsdcVault,
      funder,
      funderUsdcAccount,
      fundingRecord,
    });
  }

  claimIx(
    launch: PublicKey,
    tokenMint: PublicKey,
    funder: PublicKey = this.provider.publicKey
  ) {
    const [launchSigner] = getLaunchSignerAddr(
      this.launchpad.programId,
      launch
    );
    const [fundingRecord] = getFundingRecordAddr(
      this.launchpad.programId,
      launch,
      funder
    );

    return this.launchpad.methods
      .claim()
      .accounts({
        launch,
        fundingRecord,
        launchSigner,
        funder,
        funderTokenAccount: getAssociatedTokenAddressSync(tokenMint, funder),
        tokenMint,
        launchTokenVault: getAssociatedTokenAddressSync(
          tokenMint,
          launchSigner,
          true
        ),
      })
      .preInstructions([
        createAssociatedTokenAccountIdempotentInstruction(
          funder,
          getAssociatedTokenAddressSync(tokenMint, funder, true),
          funder,
          tokenMint
        ),
      ]);
  }
}
