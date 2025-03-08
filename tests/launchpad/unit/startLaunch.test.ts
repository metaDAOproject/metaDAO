import { Keypair, PublicKey } from "@solana/web3.js";
import { assert } from "chai";
import {
  AutocratClient,
  getLaunchAddr,
  getLaunchSignerAddr,
  LaunchpadClient,
} from "@metadaoproject/futarchy/v0.4";
import { createMint } from "spl-token-bankrun";
import { BN } from "bn.js";
import {
  createSetAuthorityInstruction,
  AuthorityType,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

export default function suite() {
  let autocratClient: AutocratClient;
  let launchpadClient: LaunchpadClient;
  let dao: PublicKey;
  let METAKP: Keypair;
  let META: PublicKey;
  let launch: PublicKey;
  let launchSigner: PublicKey;
  const minRaise = new BN(1000_000000); // 1000 USDC

  before(async function () {
    autocratClient = this.autocratClient;
    launchpadClient = this.launchpadClient;
  });

  beforeEach(async function () {
    // Create test tokens
    METAKP = Keypair.generate();
    META = METAKP.publicKey;
    [launch] = getLaunchAddr(launchpadClient.getProgramId(), META);

    // Initialize launch
    await launchpadClient
      .initializeLaunchIx(
        "META",
        "MTA",
        "https://example.com",
        minRaise,
        60 * 60 * 24 * 2,
        METAKP
      )
      .rpc();
  });

  it("starts launch correctly", async function () {
    // Check initial state
    let launchAccount = await launchpadClient.fetchLaunch(launch);
    assert.equal(launchAccount.unixTimestampStarted.toString(), "0");
    assert.exists(launchAccount.state.initialized);

    // Get current slot for comparison
    const clock = await this.banksClient.getClock();

    // Start the launch
    await launchpadClient.startLaunchIx(launch).rpc();

    // Check final state
    launchAccount = await launchpadClient.fetchLaunch(launch);
    assert.equal(
      launchAccount.unixTimestampStarted.toString(),
      clock.unixTimestamp.toString()
    );
    assert.exists(launchAccount.state.live);
  });
}
