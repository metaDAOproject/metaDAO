import { PublicKey, Keypair } from "@solana/web3.js";
import { assert } from "chai";
import {
  AutocratClient,
  getLaunchAddr,
  getLaunchSignerAddr,
  getMetadataAddr,
  LaunchpadClient,
} from "@metadaoproject/futarchy/v0.4";
import { createMint, mintTo } from "spl-token-bankrun";
import { BN } from "bn.js";
import {
  createMintToInstruction,
  createTransferInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import * as token from "@solana/spl-token";
import {
  MAINNET_USDC,
  MPL_TOKEN_METADATA_PROGRAM_ID,
} from "@metadaoproject/futarchy/v0.4";

export default function suite() {
  let autocratClient: AutocratClient;
  let launchpadClient: LaunchpadClient;
  let METAKP: Keypair;
  let META: PublicKey;
  let USDC: PublicKey;
  let launch: PublicKey;

  before(async function () {
    autocratClient = this.autocratClient;
    launchpadClient = this.launchpadClient;
  });

  beforeEach(async function () {
    METAKP = Keypair.generate();
    META = METAKP.publicKey;
    [launch] = getLaunchAddr(launchpadClient.getProgramId(), META);
  });

  it("initializes a launch with valid parameters", async function () {
    const minRaise = new BN(1000_000000); // 1000 USDC
    const secondsForLaunch = 60 * 60 * 24 * 7; // 1 week
    const [, pdaBump] = getLaunchAddr(launchpadClient.getProgramId(), META);
    const [launchSigner, launchSignerPdaBump] = getLaunchSignerAddr(
      launchpadClient.getProgramId(),
      launch
    );

    await launchpadClient
      .initializeLaunchIx(
        "META",
        "META",
        "https://example.com",
        minRaise,
        secondsForLaunch,
        METAKP
      )
      .rpc();

    const storedLaunch = await launchpadClient.fetchLaunch(launch);

    assert.equal(
      storedLaunch.minimumRaiseAmount.toString(),
      minRaise.toString()
    );
    assert.ok(storedLaunch.launchAuthority.equals(this.payer.publicKey));
    assert.ok(storedLaunch.launchSigner.equals(launchSigner));
    assert.equal(storedLaunch.launchSignerPdaBump, launchSignerPdaBump);
    assert.ok(
      storedLaunch.launchUsdcVault.equals(
        token.getAssociatedTokenAddressSync(MAINNET_USDC, launchSigner, true)
      )
    );
    assert.ok(
      storedLaunch.launchTokenVault.equals(
        token.getAssociatedTokenAddressSync(META, launchSigner, true)
      )
    );
    assert.ok(storedLaunch.tokenMint.equals(META));
    assert.equal(storedLaunch.pdaBump, pdaBump);
    assert.equal(storedLaunch.totalCommittedAmount.toString(), "0");
    assert.equal(storedLaunch.seqNum.toString(), "0");
    assert.exists(storedLaunch.state.initialized);
    assert.equal(storedLaunch.unixTimestampStarted.toString(), "0");
    assert.equal(storedLaunch.dao, null);
    assert.equal(storedLaunch.daoTreasury, null);
  });

  it("fails when launch signer is faked", async function () {
    const minimumRaiseAmount = new BN(1000_000000); // 1000 USDC
    const secondsForLaunch = 60 * 60 * 24 * 7; // 1 week
    const fakeLaunchSigner = Keypair.generate();

    const [tokenMetadata] = getMetadataAddr(META);

    try {
      await launchpadClient.launchpad.methods
        .initializeLaunch({
          tokenName: "MetaDAO",
          tokenSymbol: "META",
          tokenUri: "https://example.com",
          minimumRaiseAmount,
          secondsForLaunch,
        })
        .accounts({
          launch,
          launchSigner: fakeLaunchSigner.publicKey,
          usdcVault: token.getAssociatedTokenAddressSync(
            MAINNET_USDC,
            fakeLaunchSigner.publicKey,
            true
          ),
          tokenVault: token.getAssociatedTokenAddressSync(
            META,
            fakeLaunchSigner.publicKey,
            true
          ),
          launchAuthority: this.payer.publicKey,
          usdcMint: MAINNET_USDC,
          tokenMint: META,
          tokenMetadata,
          tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
        })
        .preInstructions([
          token.createAssociatedTokenAccountIdempotentInstruction(
            this.payer.publicKey,
            getAssociatedTokenAddressSync(
              MAINNET_USDC,
              fakeLaunchSigner.publicKey,
              true
            ),
            fakeLaunchSigner.publicKey,
            MAINNET_USDC
          ),
        ])
        .remainingAccounts([
          {
            pubkey: fakeLaunchSigner.publicKey,
            isWritable: false,
            isSigner: true,
          },
        ])
        .signers([fakeLaunchSigner, METAKP])
        .rpc();
      assert.fail("Should have thrown error");
    } catch (e) {
      assert.include(e.message, "ConstraintSeeds");
    }
  });
}
