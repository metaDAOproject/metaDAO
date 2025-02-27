import * as token from "@solana/spl-token";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import {
    AutocratClient,
    ConditionalVaultClient,
    getLaunchAddr,
    getLaunchSignerAddr,
    LaunchpadClient,
} from "@metadaoproject/futarchy/v0.4";
import { BN } from "bn.js";
import { DEVNET_MUSDC } from "./consts.js";
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { createFungible, createFungibleAsset, createMetadataAccountV3, createV1, updateV1 } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';

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


    const [launchAddr] = getLaunchAddr(launchpad.getProgramId(), dao);
    const [launchSigner] = getLaunchSignerAddr(launchpad.getProgramId(), launchAddr);

    const tx = await launchpad.initializeLaunchIx(
        dao,
        new BN(100),
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



    console.log(dao.toBase58());

    console.log(tx);
    return;
}

main();
