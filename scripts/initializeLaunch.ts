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
import { DEVNET_MUSDC } from "./consts.js";
import { createMetadataAccountV3 } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import { ComputeBudgetProgram } from "@solana/web3.js";

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
    const pORE = await token.createMint(provider.connection, payer, payer.publicKey, null, 6);

    createMetadataAccountV3(umi, {
        mint: fromWeb3JsPublicKey(pORE),
        mintAuthority: payer.publicKey,
        data: {
            name: 'Pass ORE',
            symbol: 'pORE',
            uri: 'https://raw.githubusercontent.com/metaDAOproject/futarchy/refs/heads/develop/scripts/assets/ORE/pORE.json',
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
        },
        isMutable: true,
        collectionDetails: null,
    }).sendAndConfirm(umi, {
        send: {
            skipPreflight: true,
        }
    });

    const dao = await autocrat.initializeDao(pORE, 0.001, 100 * 1_000, 100, DEVNET_MUSDC);
    const [daoTreasury] = getDaoTreasuryAddr(autocrat.getProgramId(), dao);


    const [launchAddr] = getLaunchAddr(launchpad.getProgramId(), dao);
    const [launchSigner] = getLaunchSignerAddr(launchpad.getProgramId(), launchAddr);

    const tx = await launchpad.initializeLaunchIx(
        dao,
        new BN(5),
        new BN(0),
        DEVNET_MUSDC,
        pORE
    ).preInstructions([
        token.createSetAuthorityInstruction(
            pORE,
            payer.publicKey,
            token.AuthorityType.MintTokens,
            launchSigner
        ),
    ]).rpc();

    await launchpad.startLaunchIx(launchAddr, payer.publicKey).rpc();

    await launchpad.fundIx(launchAddr, new BN(10), DEVNET_MUSDC, payer.publicKey).rpc();

    await launchpad.completeLaunchIx(launchAddr, DEVNET_MUSDC, pORE, daoTreasury, true)
        .preInstructions([ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 })]).rpc();

    // await launchpad.refundIx(launchAddr, DEVNET_MUSDC, pORE, payer.publicKey).rpc();
    await launchpad.claimIx(launchAddr, pORE, payer.publicKey).rpc();

    console.log(launchAddr.toBase58());

    console.log(dao.toBase58());

    console.log(tx);
    return;
}

main();
