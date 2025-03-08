import { ComputeBudgetProgram, Keypair, PublicKey } from "@solana/web3.js";
import { assert } from "chai";
import {
  AutocratClient,
  getFundingRecordAddr,
  getLaunchAddr,
  getLaunchSignerAddr,
  LaunchpadClient,
  MAINNET_USDC,
} from "@metadaoproject/futarchy/v0.4";
import { BN } from "bn.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

export default function suite() {
  let autocratClient: AutocratClient;
  let launchpadClient: LaunchpadClient;
  let dao: PublicKey;
  let daoTreasury: PublicKey;
  let METAKP: Keypair;
  let META: PublicKey;
  let launch: PublicKey;
  let launchSigner: PublicKey;
  let usdcVault: PublicKey;
  let funderUsdcAccount: PublicKey;

  const minRaise = new BN(100_000000); // 1000 USDC
  const SLOTS_PER_DAY = 216_000;

  before(async function () {
    autocratClient = this.autocratClient;
    launchpadClient = this.launchpadClient;
  });

  beforeEach(async function () {
    // Create test tokens
    METAKP = Keypair.generate();
    META = METAKP.publicKey;

    // Get accounts
    [launch] = getLaunchAddr(launchpadClient.getProgramId(), META);
    [launchSigner] = getLaunchSignerAddr(
      launchpadClient.getProgramId(),
      launch
    );
    usdcVault = getAssociatedTokenAddressSync(MAINNET_USDC, launchSigner, true);
    funderUsdcAccount = getAssociatedTokenAddressSync(
      MAINNET_USDC,
      this.payer.publicKey
    );

    // Initialize launch
    await launchpadClient
      .initializeLaunchIx(
        "MTN",
        "MTN",
        "https://example.com",
        minRaise,
        60 * 60 * 24 * 2,
        METAKP
      )
      .rpc();

    await launchpadClient.startLaunchIx(launch).rpc();

    await this.createTokenAccount(META, this.payer.publicKey);

    // Setup funder accounts

    const fundAmount = new BN(1000_000000); // 1000 USDC

    // Fund the launch
    await launchpadClient.fundIx(launch, fundAmount).rpc();
  });

  it("successfully claims tokens after launch completion", async function () {
    // // Advance clock and complete launch
    await this.advanceBySeconds(60 * 60 * 24 * 3);
    await launchpadClient
      .completeLaunchIx(launch, META)
      .preInstructions([
        ComputeBudgetProgram.setComputeUnitLimit({ units: 1_000_000 }),
      ])
      .rpc();

    const initialTokenBalance = await this.getTokenBalance(
      META,
      this.payer.publicKey
    );
    console.log("initialTokenBalance", initialTokenBalance.toString());

    // Claim tokens
    await launchpadClient.claimIx(launch, META).rpc();

    const finalTokenBalance = await this.getTokenBalance(
      META,
      this.payer.publicKey
    );
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
