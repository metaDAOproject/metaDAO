import { AnchorProvider } from "@coral-xyz/anchor";
import { PublicKey, Transaction } from "@solana/web3.js";
import BN from "bn.js";
import { AmmClient, SwapType } from "./AmmClient.js";
import { AutocratClient } from "./AutocratClient.js";
import { ConditionalVaultClient } from "./ConditionalVaultClient.js";
import {
  getAmmAddr,
  getVaultAddr,
  getVaultFinalizeMintAddr,
  getVaultRevertMintAddr,
} from "./utils/pda.js";

export class FutarchyClient {
  public readonly provider: AnchorProvider;
  public readonly ammClient: AmmClient;
  public readonly autocratClient: AutocratClient;
  public readonly conditionalVaultClient: ConditionalVaultClient;

  constructor(provider: AnchorProvider) {
    this.provider = provider;
    this.ammClient = AmmClient.createClient({ provider });
    this.autocratClient = AutocratClient.createClient({ provider });
    this.conditionalVaultClient = ConditionalVaultClient.createClient({
      provider,
    });
  }

  public static createClient(provider: AnchorProvider): FutarchyClient {
    return new FutarchyClient(provider);
  }

  public async createMintAndSwapTx({
    proposal,
    inputAmount,
    underlyingTokenMint,
    user,
    payer,
    swapType,
    outcome,
  }: {
    proposal: PublicKey;
    inputAmount: BN;
    underlyingTokenMint: PublicKey;
    user: PublicKey;
    payer: PublicKey;
    swapType: SwapType;
    outcome: "pass" | "fail";
  }): Promise<Transaction> {
    const [vault] = getVaultAddr(
      this.conditionalVaultClient.vaultProgram.programId,
      proposal,
      underlyingTokenMint
    );

    const mintTx = await this.conditionalVaultClient
      .mintConditionalTokensIx(
        vault,
        underlyingTokenMint,
        inputAmount,
        user,
        payer
      )
      .transaction();

    const [pUSDC] = getVaultFinalizeMintAddr(
      this.conditionalVaultClient.vaultProgram.programId,
      vault
    );
    const [pTOKE] = getVaultFinalizeMintAddr(
      this.conditionalVaultClient.vaultProgram.programId,
      vault
    );

    const [fUSDC] = getVaultRevertMintAddr(
      this.conditionalVaultClient.vaultProgram.programId,
      vault
    );
    const [fTOKE] = getVaultRevertMintAddr(
      this.conditionalVaultClient.vaultProgram.programId,
      vault
    );

    const [passMarket] = getAmmAddr(
      this.ammClient.program.programId,
      pTOKE,
      pUSDC
    );
    const [failMarket] = getAmmAddr(
      this.ammClient.program.programId,
      fTOKE,
      fUSDC
    );

    const [market, baseMint, quoteMint] =
      outcome === "pass"
        ? [passMarket, pTOKE, pUSDC]
        : [failMarket, fTOKE, fUSDC];

    const swapTx = await this.ammClient
      .swapIx(
        market,
        baseMint,
        quoteMint,
        swapType,
        inputAmount,
        new BN(0),
        user,
        payer
      )
      .transaction();

    return new Transaction().add(mintTx, swapTx);
  }
}
