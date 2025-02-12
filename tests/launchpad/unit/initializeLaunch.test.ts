import * as anchor from "@coral-xyz/anchor";
import { BankrunProvider } from "anchor-bankrun";
import { startAnchor } from "solana-bankrun";
import { PublicKey, Keypair } from "@solana/web3.js";
import { assert } from "chai";
import {
  AutocratClient,
  getLaunchAddr,
  LaunchpadClient,
} from "@metadaoproject/futarchy/v0.4";
import { createMint, mintTo } from "spl-token-bankrun";
import { BN } from "bn.js";

export default function suite() {
  let autocratClient: AutocratClient;
  let launchpadClient: LaunchpadClient;
  let dao: PublicKey;
  let daoTreasury: PublicKey;
  let META: PublicKey;
  let USDC: PublicKey;

  before(async function () {
    autocratClient = this.autocratClient;
    launchpadClient = this.launchpadClient;
  });

  beforeEach(async function () {
    // Create test tokens
    META = await createMint(this.banksClient, this.payer, this.payer.publicKey, null, 9);
    USDC = await createMint(this.banksClient, this.payer, this.payer.publicKey, null, 6);

    // Initialize DAO first since we need it for the launch
    dao = await autocratClient.initializeDao(META, 400, 5, 5000, USDC);
    [daoTreasury] = PublicKey.findProgramAddressSync(
      [dao.toBuffer()],
      autocratClient.autocrat.programId
    );
  });

  describe("#initialize_launch", async function () {
    it("initializes a launch with valid parameters", async function () {
      const minRaise = new BN(1000_000000); // 1000 USDC
      const maxRaise = new BN(5000_000000); // 5000 USDC
      
      await launchpadClient.initializeLaunchIx(
        dao,
        minRaise,
        maxRaise,
        USDC
      ).rpc();

      const [launchAddr, pdaBump] = getLaunchAddr(launchpadClient.getProgramId(), dao);

      const launch = await launchpadClient.fetchLaunch(launchAddr);

      assert.equal(launch.minimumRaiseAmount.toString(), minRaise.toString());
      assert.equal(launch.maximumRaiseAmount.toString(), maxRaise.toString());
      assert.equal(launch.isApproved, false);
      assert.ok(launch.dao.equals(dao));
      assert.ok(launch.daoTreasury.equals(daoTreasury));
      assert.equal(launch.committedAmount.toString(), "0");
      assert.equal(launch.pdaBump, pdaBump);
    });

    it("fails when minimum raise is greater than maximum", async function () {
      const minRaise = new BN(5000_000000); // 5000 USDC
      const maxRaise = new BN(1000_000000); // 1000 USDC

      try {
        await launchpadClient.initializeLaunchIx(
          dao,
          minRaise,
          maxRaise,
          USDC
        ).rpc();
        assert.fail("Should have thrown error");
      } catch (e) {
        assert.include(e.message, "InvalidRaiseAmount");
      }
    });
  });
}
