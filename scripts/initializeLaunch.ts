import * as token from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";
import {
  AutocratClient,
  ConditionalVaultClient,
  getDaoTreasuryAddr,
  getLaunchAddr,
  getLaunchSignerAddr,
  LaunchpadClient,
} from "@metadaoproject/futarchy/v0.4";
import { BN } from "bn.js";
import { DEVNET_MUSDC, USDC } from "./consts.js";
import { createMetadataAccountV3 } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";
import { ComputeBudgetProgram, Keypair } from "@solana/web3.js";
import * as fs from "fs";

// Use the RPC endpoint of your choice.

const provider = anchor.AnchorProvider.env();
const payer = provider.wallet["payer"];

const umi = createUmi(provider.connection.rpcEndpoint).use(mplTokenMetadata());
umi.use(walletAdapterIdentity(provider.wallet));

const autocrat: AutocratClient = AutocratClient.createClient({ provider });
const vaultProgram: ConditionalVaultClient =
  ConditionalVaultClient.createClient({ provider });
const launchpad: LaunchpadClient = LaunchpadClient.createClient({ provider });

async function main() {
  const keypairFile = fs.readFileSync("./target/mtn.json");
  const keypairData = JSON.parse(keypairFile.toString());
  // const mtnKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
  const mtnKeypair = Keypair.generate();
  console.log(mtnKeypair.publicKey.toBase58());

  // const MTN = await token.createMint(provider.connection, payer, payer.publicKey, null, 6, mtnKeypair);
  const MTN = mtnKeypair.publicKey;

  // createMetadataAccountV3(umi, {
  //     mint: fromWeb3JsPublicKey(MTN),
  //     mintAuthority: payer.publicKey,
  //     data: {
  //         name: 'Mountain Capital',
  //         symbol: 'MTN',
  //         uri: 'https://raw.githubusercontent.com/metaDAOproject/futarchy/refs/heads/launchpad/scripts/assets/MTN/MTN.json',
  //         sellerFeeBasisPoints: 0,
  //         creators: null,
  //         collection: null,
  //         uses: null,
  //     },
  //     isMutable: true,
  //     collectionDetails: null,
  // }).sendAndConfirm(umi, {
  //     send: {
  //         skipPreflight: true,
  //     }
  // });

  const [launchAddr] = getLaunchAddr(launchpad.getProgramId(), MTN);
  const [launchSigner] = getLaunchSignerAddr(
    launchpad.getProgramId(),
    launchAddr
  );

  await launchpad
    .initializeLaunchIx(
      "MTN",
      "MTN",
      "https://raw.githubusercontent.com/metaDAOproject/futarchy/refs/heads/launchpad/scripts/assets/MTN/MTN.json",
      new BN(10),
      60,
      mtnKeypair,
      payer.publicKey,
      true
    )
    .preInstructions([
      ComputeBudgetProgram.setComputeUnitLimit({ units: 200_000 }),
      ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1_000 }),
    ])
    .rpc();

  await launchpad.startLaunchIx(launchAddr, payer.publicKey).rpc();

  await launchpad.fundIx(launchAddr, new BN(10), payer.publicKey, true).rpc();

  // await launchpad.completeLaunchIx(launchAddr, USDC, MTN)
  //     .preInstructions([ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 })]).rpc();

  // await launchpad.refundIx(launchAddr, DEVNET_MUSDC, pORE, payer.publicKey).rpc();
  // await launchpad.claimIx(launchAddr, MTN, payer.publicKey).rpc();

  console.log(launchAddr.toBase58());

  return;
}

main();
