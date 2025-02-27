import { PublicKey } from "@solana/web3.js";
import { assert } from "chai";
import {
  AutocratClient,
  getFundingRecordAddr,
  getLaunchAddr,
  getLaunchSignerAddr,
  LaunchpadClient,
} from "@metadaoproject/futarchy/v0.4";
import { createMint, mintTo, getAccount } from "spl-token-bankrun";
import { BN } from "bn.js";
import { createMintToInstruction, getAssociatedTokenAddressSync, createSetAuthorityInstruction, AuthorityType } from "@solana/spl-token";

export default function suite() {
  let autocratClient: AutocratClient;
  let launchpadClient: LaunchpadClient;
  let dao: PublicKey;
  let daoTreasury: PublicKey;
  let META: PublicKey;
  let USDC: PublicKey;
  let launch: PublicKey;
  let launchSigner: PublicKey;
  let tokenVault: PublicKey;
  let usdcVault: PublicKey;
  let funderTokenAccount: PublicKey;
  let funderUsdcAccount: PublicKey;

  const minRaise = new BN(1000_000000); // 1000 USDC
  const maxRaise = new BN(5000_000000); // 5000 USDC

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
    tokenVault = getAssociatedTokenAddressSync(META, launchSigner, true);
    usdcVault = getAssociatedTokenAddressSync(USDC, launchSigner, true);
    funderTokenAccount = getAssociatedTokenAddressSync(META, this.payer.publicKey);
    funderUsdcAccount = getAssociatedTokenAddressSync(USDC, this.payer.publicKey);

    // // Initialize launch
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

    await this.createTokenAccount(META, this.payer.publicKey);
    await this.createTokenAccount(USDC, this.payer.publicKey);
    await this.mintTo(USDC, this.payer.publicKey, this.payer, 1_000_000000);
    // await this.mintTo(META, this.payer.publicKey, this.payer, maxRaise.toNumber());
  });

  it("successfully funds the launch", async function () {
    const fundAmount = new BN(100_000000); // 100 USDC

    await launchpadClient.fundIx(
      launch,
      fundAmount,
      USDC,
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
      USDC,
    ).rpc();

    // Second funding
    await launchpadClient.fundIx(
      launch,
      fundAmount2,
      USDC,
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