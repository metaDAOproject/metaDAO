import { ComputeBudgetProgram, Keypair, PublicKey } from "@solana/web3.js";
import { assert } from "chai";
import {
  AutocratClient,
  getLaunchAddr,
  getLaunchSignerAddr,
  LaunchpadClient,
  RAYDIUM_CP_SWAP_PROGRAM_ID,
} from "@metadaoproject/futarchy/v0.4";
import { createMint } from "spl-token-bankrun";
import { BN } from "bn.js";
import { createSetAuthorityInstruction, AuthorityType, getAssociatedTokenAddressSync } from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";

export default function suite() {
  let autocratClient: AutocratClient;
  let launchpadClient: LaunchpadClient;
  let METAKP: Keypair;
  let META: PublicKey;
  let USDC: PublicKey;
  let launch: PublicKey;
  let launchSigner: PublicKey;

  const minRaise = new BN(1000_000000); // 1000 USDC
  const SLOTS_PER_DAY = 216_000; // (24 * 60 * 60 * 1000) / 400

  before(async function () {
    autocratClient = this.autocratClient;
    launchpadClient = this.launchpadClient;
    USDC = await createMint(this.banksClient, this.payer, this.payer.publicKey, null, 6);
    await this.createTokenAccount(USDC, this.payer.publicKey);
  });

  beforeEach(async function () {
    // Create test tokens
    METAKP = Keypair.generate();
    META = METAKP.publicKey;

    // Get accounts
    [launch] = getLaunchAddr(launchpadClient.getProgramId(), META);
    [launchSigner] = getLaunchSignerAddr(launchpadClient.getProgramId(), launch);

    // Initialize launch
    await launchpadClient.initializeLaunchIx(
      "MTN",
      "MTN",
      "https://example.com",
      minRaise,
      new BN(SLOTS_PER_DAY * 5),
      USDC,
      METAKP
    ).rpc();

    await launchpadClient.startLaunchIx(launch).rpc();
    await this.createTokenAccount(META, this.payer.publicKey);
    await this.mintTo(USDC, this.payer.publicKey, this.payer, minRaise.toNumber());
  });

  it("completes launch successfully when minimum raise is met and time has passed", async function () {
    // Fund the launch with exactly minimum raise

    await launchpadClient.fundIx(
      launch,
      minRaise,
      USDC,
    ).rpc();

    // Advance clock past 7 days
    await this.advanceBySlots(BigInt(SLOTS_PER_DAY * 7));

    // Complete the launch
    await launchpadClient.completeLaunchIx(launch, USDC, META).preInstructions([ComputeBudgetProgram.setComputeUnitLimit({ units: 1_000_000 })]).rpc();

    const launchAccount = await launchpadClient.fetchLaunch(launch);
    const treasuryBalance = await this.getTokenBalance(USDC, launchAccount.daoTreasury);

    assert.exists(launchAccount.state.complete);
    assert.equal(treasuryBalance.toString(), minRaise.muln(9).divn(10).toString());

    const mint = await this.getMint(META);
    assert.isTrue(mint.mintAuthority.equals(launchAccount.daoTreasury));
    assert.exists(launchAccount.dao);
  });

  it("fails when launch period has not passed", async function () {
    // Fund the launch with exactly minimum raise

    await launchpadClient.fundIx(
      launch,
      minRaise,
      USDC,
    ).rpc();

    // Try to complete immediately (should fail)
    try {
      await launchpadClient.completeLaunchIx(launch, USDC, META).rpc();
      assert.fail("Should have thrown error");
    } catch (e) {
      assert.include(e.message, "LaunchPeriodNotOver");
    }

    // Advance by 3 days (still not enough)
    await this.advanceBySlots(BigInt(SLOTS_PER_DAY * 3));

    try {
      await launchpadClient.completeLaunchIx(launch, USDC, META).preInstructions([ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1 })]).rpc();
      assert.fail("Should have thrown error");
    } catch (e) {
      assert.include(e.message, "LaunchPeriodNotOver");
    }
  });

  it("moves to refunding state when minimum raise is not met after period", async function () {
    // Fund the launch with less than minimum raise
    const partialAmount = minRaise.divn(2);

    await launchpadClient.fundIx(
      launch,
      partialAmount,
      USDC,
    ).rpc();

    // Advance clock past 7 days
    await this.advanceBySlots(BigInt(SLOTS_PER_DAY * 7));

    // Complete the launch
    // I'm only 5 bytes under the limit, so make sure we don't go over
    await launchpadClient.completeLaunchIx(launch, USDC, META)
      .preInstructions([
        ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 }),
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1 }),
      ]).rpc();

    const launchAccount = await launchpadClient.fetchLaunch(launch);
    // const treasuryBalance = await this.getTokenBalance(USDC, daoTreasury);

    assert.exists(launchAccount.state.refunding);
    // assert.equal(treasuryBalance.toString(), "0");
  });

  it("fails when launch is not in live state", async function () {
    // Advance clock past 7 days
    await this.advanceBySlots(BigInt(SLOTS_PER_DAY * 7));

    // Complete launch first time
    await launchpadClient.completeLaunchIx(launch, USDC, META).rpc();

    // Try to complete again
    try {
      // CU price so that the VM doesn't think it's a duplicate tx
      await launchpadClient.completeLaunchIx(launch, USDC, META).preInstructions([ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1 }), ComputeBudgetProgram.setComputeUnitLimit({ units: 1_000_000 })]).rpc();
      assert.fail("Should have thrown error");
    } catch (e) {
      assert.include(e.message, "InvalidLaunchState");
    }
  });
} 