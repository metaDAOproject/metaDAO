import { Keypair, PublicKey } from "@solana/web3.js";
import { assert } from "chai";
import {
  AutocratClient,
  getFundingRecordAddr,
  getLaunchAddr,
  getLaunchSignerAddr,
  LaunchpadClient,
  MAINNET_USDC,
} from "@metadaoproject/futarchy/v0.4";
import { createMint, mintTo, getAccount } from "spl-token-bankrun";
import { BN } from "bn.js";
import { createMintToInstruction, getAssociatedTokenAddressSync, createSetAuthorityInstruction, AuthorityType } from "@solana/spl-token";

export default function suite() {
  let autocratClient: AutocratClient;
  let launchpadClient: LaunchpadClient;
  let dao: PublicKey;
  let daoTreasury: PublicKey;
  let METAKP: Keypair;
  let META: PublicKey;
  let launch: PublicKey;
  let launchSigner: PublicKey;
  let tokenVault: PublicKey;
  let usdcVault: PublicKey;
  let funderTokenAccount: PublicKey;
  let funderUsdcAccount: PublicKey;

  const minRaise = new BN(1000_000000); // 1000 USDC

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
    [launchSigner] = getLaunchSignerAddr(launchpadClient.getProgramId(), launch);
    tokenVault = getAssociatedTokenAddressSync(META, launchSigner, true);
    usdcVault = getAssociatedTokenAddressSync(MAINNET_USDC, launchSigner, true);
    funderTokenAccount = getAssociatedTokenAddressSync(META, this.payer.publicKey);
    funderUsdcAccount = getAssociatedTokenAddressSync(MAINNET_USDC, this.payer.publicKey);

    // // Initialize launch
    await launchpadClient.initializeLaunchIx(
      "MTN",
      "MTN",
      "https://example.com",
      minRaise,
      new BN(400),
      METAKP
    ).rpc();

    await launchpadClient.startLaunchIx(launch).rpc();

    await this.createTokenAccount(META, this.payer.publicKey);
    // await this.mintTo(META, this.payer.publicKey, this.payer, maxRaise.toNumber());
  });

  it("successfully funds the launch", async function () {
    const fundAmount = new BN(100_000000); // 100 USDC

    await launchpadClient.fundIx(
      launch,
      fundAmount,
    ).rpc();

    const launchAccount = await launchpadClient.fetchLaunch(launch);
    assert.equal(launchAccount.totalCommittedAmount.toString(), fundAmount.toString());

    const usdcVaultAccount = await getAccount(this.banksClient, usdcVault);
    assert.equal(usdcVaultAccount.amount.toString(), fundAmount.toString());

    const [fundingRecord, pdaBump] = getFundingRecordAddr(
      launchpadClient.getProgramId(),
      launch,
      this.payer.publicKey
    );

    const fundingRecordAccount = await launchpadClient.fetchFundingRecord(fundingRecord);
    assert.equal(fundingRecordAccount.committedAmount.toString(), fundAmount.toString());
    assert.equal(fundingRecordAccount.pdaBump, pdaBump);
    assert.ok(fundingRecordAccount.funder.equals(this.payer.publicKey));
    assert.ok(fundingRecordAccount.seqNum.eqn(0));
  });

  it("successfully funds the launch multiple times", async function () {
    const fundAmount1 = new BN(100_000000); // 100 USDC
    const fundAmount2 = new BN(200_000000); // 200 USDC
    const totalAmount = fundAmount1.add(fundAmount2);

    // First funding
    await launchpadClient.fundIx(
      launch,
      fundAmount1,
    ).rpc();

    // Second funding
    await launchpadClient.fundIx(
      launch,
      fundAmount2,
    ).rpc();

    const launchAccount = await launchpadClient.fetchLaunch(launch);
    assert.equal(launchAccount.totalCommittedAmount.toString(), totalAmount.toString());

    const usdcVaultAccount = await getAccount(this.banksClient, usdcVault);
    assert.equal(usdcVaultAccount.amount.toString(), totalAmount.toString());

    const [fundingRecord] = getFundingRecordAddr(
      launchpadClient.getProgramId(),
      launch,
      this.payer.publicKey
    );

    const fundingRecordAccount = await launchpadClient.fetchFundingRecord(fundingRecord);
    assert.equal(fundingRecordAccount.committedAmount.toString(), totalAmount.toString());
    assert.ok(fundingRecordAccount.seqNum.eqn(1));
  });
} 