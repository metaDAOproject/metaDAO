import { sha256 } from "@metadaoproject/futarchy";
import { ConditionalVaultClient } from "@metadaoproject/futarchy/v0.4";
import { Keypair, PublicKey } from "@solana/web3.js";
import { assert } from "chai";
import {
  createAssociatedTokenAccount,
  createMint,
  getAccount,
  getMint,
  mintTo,
} from "spl-token-bankrun";
import * as anchor from "@coral-xyz/anchor";
import * as token from "@solana/spl-token";
import { expectError } from "../../utils.js";
import { BN } from "bn.js";

export default function suite() {
  let vaultClient: ConditionalVaultClient;
  let question: PublicKey;
  let vault: PublicKey;
  let underlyingTokenMint: PublicKey;

  before(function () {
    vaultClient = this.vaultClient;
  });

  beforeEach(async function () {
    let questionId = sha256(new Uint8Array([5, 2, 1]));
    let oracle = Keypair.generate();

    question = await vaultClient.initializeQuestion(
      questionId,
      oracle.publicKey,
      2
    );

    underlyingTokenMint = await this.createMint(this.payer.publicKey, 8);

    vault = await vaultClient.initializeVault(question, underlyingTokenMint, 2);

    await this.createTokenAccount(underlyingTokenMint, this.payer.publicKey);

    await this.mintTo(
      underlyingTokenMint,
      this.payer.publicKey,
      this.payer,
      10_000_000_000n
    );
  });

  it("splits tokens", async function () {
    await vaultClient
      .splitTokensIx(question, vault, underlyingTokenMint, new BN(1000), 2)
      .rpc();

    const storedVault = await vaultClient.fetchVault(vault);

    assert.equal(storedVault.seqNum.toString(), "1");

    this.assertBalance(underlyingTokenMint, vault, 1000);

    const storedConditionalTokenMints = storedVault.conditionalTokenMints;
    for (let mint of storedConditionalTokenMints) {
      let storedMint = await getMint(this.banksClient, mint);
      assert.equal(storedMint.supply.toString(), "1000");
      await this.assertBalance(mint, this.payer.publicKey, 1000);
    }
  });

  it("throws error if conditional token accounts don't exist", async function () {
    let { remainingAccounts } =
      vaultClient.getConditionalTokenAccountsAndInstructions(
        vault,
        2,
        this.payer.publicKey
      );

    const callbacks = expectError(
      "BadConditionalTokenAccount",
      "split succeeded despite conditional token account not existing"
    );

    await vaultClient.vaultProgram.methods
      .splitTokens(new BN(1000))
      .accounts({
        question,
        authority: this.payer.publicKey,
        vault,
        vaultUnderlyingTokenAccount: token.getAssociatedTokenAddressSync(
          underlyingTokenMint,
          vault,
          true
        ),
        userUnderlyingTokenAccount: token.getAssociatedTokenAddressSync(
          underlyingTokenMint,
          this.payer.publicKey,
          true
        ),
      })
      .remainingAccounts(remainingAccounts)
      .rpc()
      .then(callbacks[0], callbacks[1]);
  });

  it("throws error if the conditional mints are wrong", async function () {
    const callbacks = expectError(
      "ConditionalMintMismatch",
      "split succeeded despite conditional mint not being in vault"
    );

    const fakeConditionalMint1 = await this.createMint(vault, 8);

    const fakeConditionalMint2 = await this.createMint(vault, 8);

    const fakeConditionalTokenAccount1 = await this.createTokenAccount(
      fakeConditionalMint1,
      this.payer.publicKey
    );

    const fakeConditionalTokenAccount2 = await this.createTokenAccount(
      fakeConditionalMint2,
      this.payer.publicKey
    );

    // Attempt to split tokens using the original vault but with the malicious vault's conditional token accounts
    await vaultClient.vaultProgram.methods
      .splitTokens(new BN(1000))
      .accounts({
        question,
        authority: this.payer.publicKey,
        vault,
        vaultUnderlyingTokenAccount: token.getAssociatedTokenAddressSync(
          underlyingTokenMint,
          vault,
          true
        ),
        userUnderlyingTokenAccount: token.getAssociatedTokenAddressSync(
          underlyingTokenMint,
          this.payer.publicKey,
          true
        ),
      })
      .remainingAccounts(
        vaultClient.getRemainingAccounts(
          [fakeConditionalMint1, fakeConditionalMint2],
          [fakeConditionalTokenAccount1, fakeConditionalTokenAccount2]
        )
      )
      .rpc()
      .then(callbacks[0], callbacks[1]);
  });

  it("throws error when using an invalid vault underlying token account", async function () {
    const fakeUnderlyingTokenMint = await this.createMint(vault, 8);
    const invalidVaultUnderlyingTokenAccount = await this.createTokenAccount(
      fakeUnderlyingTokenMint,
      vault
    );

    const callbacks = expectError(
      "InvalidVaultUnderlyingTokenAccount",
      "split succeeded despite invalid vault underlying token account"
    );

    await vaultClient
      .splitTokensIx(question, vault, underlyingTokenMint, new BN(1000), 2)
      .accounts({
        vaultUnderlyingTokenAccount: invalidVaultUnderlyingTokenAccount,
      })
      .rpc()
      .then(callbacks[0], callbacks[1]);
  });

  it("throws error when providing invalid number of conditional accounts", async function () {
    const callbacks = expectError(
      "InvalidConditionals",
      "split succeeded despite invalid number of conditional accounts"
    );

    const { remainingAccounts } =
      vaultClient.getConditionalTokenAccountsAndInstructions(
        vault,
        1, // Incorrect number of outcomes
        this.payer.publicKey
      );

    await vaultClient.vaultProgram.methods
      .splitTokens(new BN(1000))
      .accounts({
        question,
        authority: this.payer.publicKey,
        vault,
        vaultUnderlyingTokenAccount: token.getAssociatedTokenAddressSync(
          underlyingTokenMint,
          vault,
          true
        ),
        userUnderlyingTokenAccount: token.getAssociatedTokenAddressSync(
          underlyingTokenMint,
          this.payer.publicKey,
          true
        ),
      })
      .remainingAccounts(remainingAccounts)
      .rpc()
      .then(callbacks[0], callbacks[1]);
  });

  it("successfully calls splitTokens consecutively", async function () {
    await vaultClient
      .splitTokensIx(question, vault, underlyingTokenMint, new BN(1000), 2)
      .rpc();

    let storedVault = await vaultClient.fetchVault(vault);

    assert.equal(storedVault.seqNum.toString(), "1");

    this.assertBalance(underlyingTokenMint, vault, 1000);

    let storedConditionalTokenMints = storedVault.conditionalTokenMints;
    for (let mint of storedConditionalTokenMints) {
      let storedMint = await getMint(this.banksClient, mint);
      assert.equal(storedMint.supply.toString(), "1000");
      await this.assertBalance(mint, this.payer.publicKey, 1000);
    }

    await vaultClient
      .splitTokensIx(question, vault, underlyingTokenMint, new BN(1000), 2)
      .rpc();

    storedVault = await vaultClient.fetchVault(vault);

    assert.equal(storedVault.seqNum.toString(), "2");

    this.assertBalance(underlyingTokenMint, vault, 2000);

    storedConditionalTokenMints = storedVault.conditionalTokenMints;
    for (let mint of storedConditionalTokenMints) {
      let storedMint = await getMint(this.banksClient, mint);
      assert.equal(storedMint.supply.toString(), "2000");
      await this.assertBalance(mint, this.payer.publicKey, 2000);
    }
  });
}
