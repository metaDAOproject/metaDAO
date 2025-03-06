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
import { createMetadataAccountV3 } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import { ComputeBudgetProgram, Keypair } from "@solana/web3.js";
import * as fs from 'fs';

// Use the RPC endpoint of your choice.

const provider = anchor.AnchorProvider.env();
const payer = provider.wallet["payer"];

const umi = createUmi(provider.connection.rpcEndpoint).use(mplTokenMetadata())
umi.use(walletAdapterIdentity(provider.wallet));

const autocrat: AutocratClient = AutocratClient.createClient({ provider });
const vaultProgram: ConditionalVaultClient =
    ConditionalVaultClient.createClient({ provider });
const launchpad: LaunchpadClient = LaunchpadClient.createClient({ provider });

async function main() {
    // const keypairFile = fs.readFileSync('./target/mtn.json');
    // const keypairData = JSON.parse(keypairFile.toString());
    const mtnKeypair = Keypair.generate();
    console.log(mtnKeypair.publicKey.toBase58());
    
    // const MTN = await token.createMint(provider.connection, payer, payer.publicKey, null, 6, mtnKeypair);
    // const MTN = mtnKeypair.publicKey;

    const [launchAddr] = getLaunchAddr(launchpad.getProgramId(), mtnKeypair.publicKey);
    const [launchSigner] = getLaunchSignerAddr(launchpad.getProgramId(), launchAddr);

    const usdcVault = await token.getOrCreateAssociatedTokenAccount(provider.connection, payer, DEVNET_MUSDC, launchSigner, true);

    console.log(usdcVault.address.toBase58());
    console.log(usdcVault.amount);

    await launchpad.initializeLaunchIx(
        "Pileks test",
        "MTN",
        "https://example.com",
        new BN(10),
        5,
        mtnKeypair,
        payer.publicKey,
        true
    ).preInstructions([
        ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 }),
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1_000 })
    ]).rpc();

    console.log("launched");

    await launchpad.startLaunchIx(launchAddr, payer.publicKey).rpc();

    console.log("started");
    await launchpad.fundIx(launchAddr, new BN(5), payer.publicKey, true).rpc();

    console.log("funded");

    await new Promise(resolve => setTimeout(resolve, 5000));

    await launchpad.completeLaunchIx(launchAddr, mtnKeypair.publicKey, true)
        .preInstructions([ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 })]).rpc();

    console.log("completed");
    await launchpad.refundIx(launchAddr, payer.publicKey).rpc();
    // await launchpad.claimIx(launchAddr, mtnKeypair.publicKey, payer.publicKey).rpc();

    console.log("claimed");
    console.log(launchAddr.toBase58());

    return;
}

main();
