import { ComputeBudgetProgram, PublicKey } from "@solana/web3.js";
import { assert } from "chai";
import {
  AutocratClient,
  getFundingRecordAddr,
  getLaunchAddr,
  getLaunchSignerAddr,
  LaunchpadClient,
} from "@metadaoproject/futarchy/v0.4";
import { createMint } from "spl-token-bankrun";
import { BN } from "bn.js";
import { getAssociatedTokenAddressSync, createSetAuthorityInstruction, AuthorityType } from "@solana/spl-token";

export default function suite() {
  let autocratClient: AutocratClient;
  let launchpadClient: LaunchpadClient;
  let dao: PublicKey;
  let daoTreasury: PublicKey;
  let META: PublicKey;
  let USDC: PublicKey;
  let launch: PublicKey;
  let launchSigner: PublicKey;
  let usdcVault: PublicKey;
  let funderUsdcAccount: PublicKey;

  const minRaise = new BN(100_000000); // 1000 USDC
  const maxRaise = new BN(5000_000000); // 5000 USDC
  const SLOTS_PER_DAY = 216_000n;

  before(async function () {
    autocratClient = this.autocratClient;
    launchpadClient = this.launchpadClient;
  });

  beforeEach(async function () {
    // Create test tokens
    META = await createMint(this.banksClient, this.payer, this.payer.publicKey, null, 6);
    USDC = await createMint(this.banksClient, this.payer, this.payer.publicKey, null, 6);

    // Initialize DAO
    dao = await autocratClient.initializeDao(META, 400, 5, 5000, USDC);
    [daoTreasury] = PublicKey.findProgramAddressSync(
      [dao.toBuffer()],
      autocratClient.autocrat.programId
    );

    // Get accounts
    [launch] = getLaunchAddr(launchpadClient.getProgramId(), dao);
    [launchSigner] = getLaunchSignerAddr(launchpadClient.getProgramId(), launch);
    usdcVault = getAssociatedTokenAddressSync(USDC, launchSigner, true);
    funderUsdcAccount = getAssociatedTokenAddressSync(USDC, this.payer.publicKey);

    // Initialize launch
    await launchpadClient.initializeLaunchIx(
      dao,
      minRaise,
      maxRaise,
      USDC,
      META
    ).preInstructions([
      createSetAuthorityInstruction(
        META,
        this.payer.publicKey,
        AuthorityType.MintTokens,
        launchSigner
      )
    ]).rpc();

    await launchpadClient.startLaunchIx(launch).rpc();

    // Setup funder accounts
    await this.createTokenAccount(META, this.payer.publicKey);
    await this.createTokenAccount(USDC, this.payer.publicKey);

    await this.mintTo(USDC, this.payer.publicKey, this.payer, 1_000_000000);

    const fundAmount = new BN(1000_000000); // 1000 USDC

    // Fund the launch
    await launchpadClient.fundIx(
      launch,
      fundAmount,
      USDC,
    ).rpc();
  });

  it("successfully claims tokens after launch completion", async function () {
    // // Advance clock and complete launch
    await this.advanceBySlots(SLOTS_PER_DAY * 7n);
    await launchpadClient.completeLaunchIx(launch, USDC, META, daoTreasury).preInstructions([ComputeBudgetProgram.setComputeUnitLimit({ units: 1_000_000 })]).rpc();

    const initialTokenBalance = await this.getTokenBalance(META, this.payer.publicKey);
    console.log("initialTokenBalance", initialTokenBalance.toString());

    // Claim tokens
    await launchpadClient.claimIx(launch, META).rpc();

    const finalTokenBalance = await this.getTokenBalance(META, this.payer.publicKey);
    const expectedTokens = new BN(10_000_000 * 1_000_000); // full supply

    assert.equal(finalTokenBalance.toString(), expectedTokens.toString());

    // Verify funding record is closed
    const [fundingRecord] = getFundingRecordAddr(
      launchpadClient.getProgramId(),
      launch,
      this.payer.publicKey
    );

    try {
      await launchpadClient.fetchFundingRecord(fundingRecord);
      assert.fail("Funding record should be closed");
    } catch (e) {
      assert.include(e.message, "Could not find");
    }
  });

  it("fails when launch is not complete", async function () {
    try {
      await launchpadClient.claimIx(launch, META).rpc();
      assert.fail("Should have thrown error");
    } catch (e) {
      assert.include(e.message, "InvalidLaunchState");
    }
  });
} 