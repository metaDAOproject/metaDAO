export type AmmV3 = {
  "version": "0.1.0",
  "name": "amm_v3",
  "instructions": [
    {
      "name": "createAmmConfig",
      "docs": [
        "# Arguments",
        "",
        "* `ctx`- The accounts needed by instruction.",
        "* `index` - The index of amm config, there may be multiple config.",
        "* `tick_spacing` - The tickspacing binding with config, cannot be changed.",
        "* `trade_fee_rate` - Trade fee rate, can be changed.",
        "* `protocol_fee_rate` - The rate of protocol fee within tarde fee.",
        "* `fund_fee_rate` - The rate of fund fee within tarde fee.",
        ""
      ],
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Address to be set as protocol owner."
          ]
        },
        {
          "name": "ammConfig",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Initialize config state account to store protocol owner address and fee rates."
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u16"
        },
        {
          "name": "tickSpacing",
          "type": "u16"
        },
        {
          "name": "tradeFeeRate",
          "type": "u32"
        },
        {
          "name": "protocolFeeRate",
          "type": "u32"
        },
        {
          "name": "fundFeeRate",
          "type": "u32"
        }
      ]
    },
    {
      "name": "updateAmmConfig",
      "docs": [
        "Updates the owner of the amm config",
        "Must be called by the current owner or admin",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `trade_fee_rate`- The new trade fee rate of amm config, be set when `param` is 0",
        "* `protocol_fee_rate`- The new protocol fee rate of amm config, be set when `param` is 1",
        "* `fund_fee_rate`- The new fund fee rate of amm config, be set when `param` is 2",
        "* `new_owner`- The config's new owner, be set when `param` is 3",
        "* `new_fund_owner`- The config's new fund owner, be set when `param` is 4",
        "* `param`- The vaule can be 0 | 1 | 2 | 3 | 4, otherwise will report a error",
        ""
      ],
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "The amm config owner or admin"
          ]
        },
        {
          "name": "ammConfig",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Amm config account to be changed"
          ]
        }
      ],
      "args": [
        {
          "name": "param",
          "type": "u8"
        },
        {
          "name": "value",
          "type": "u32"
        }
      ]
    },
    {
      "name": "createPool",
      "docs": [
        "Creates a pool for the given token pair and the initial price",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `sqrt_price_x64` - the initial sqrt price (amount_token_1 / amount_token_0) of the pool as a Q64.64",
        ""
      ],
      "accounts": [
        {
          "name": "poolCreator",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Address paying to create the pool. Can be anyone"
          ]
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Which config the pool belongs to."
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Initialize an account to store the pool state"
          ]
        },
        {
          "name": "tokenMint0",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token_0 mint, the key must be greater then token_1 mint."
          ]
        },
        {
          "name": "tokenMint1",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token_1 mint"
          ]
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token_0 vault for the pool"
          ]
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token_1 vault for the pool"
          ]
        },
        {
          "name": "observationState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArrayBitmap",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Initialize an account to store if a tick array is initialized."
          ]
        },
        {
          "name": "tokenProgram0",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Spl token program or token program 2022"
          ]
        },
        {
          "name": "tokenProgram1",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Spl token program or token program 2022"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "To create a new program account"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Sysvar for program account"
          ]
        }
      ],
      "args": [
        {
          "name": "sqrtPriceX64",
          "type": "u128"
        },
        {
          "name": "openTime",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updatePoolStatus",
      "docs": [
        "Update pool status for given vaule",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `status` - The vaule of status",
        ""
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "status",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createOperationAccount",
      "docs": [
        "Creates an operation account for the program",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        ""
      ],
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Address to be set as operation account owner."
          ]
        },
        {
          "name": "operationState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Initialize operation state account to store operation owner address and white list mint."
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateOperationAccount",
      "docs": [
        "Update the operation account",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `param`- The vaule can be 0 | 1 | 2 | 3, otherwise will report a error",
        "* `keys`- update operation owner when the `param` is 0",
        "remove operation owner when the `param` is 1",
        "update whitelist mint when the `param` is 2",
        "remove whitelist mint when the `param` is 3",
        ""
      ],
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Address to be set as operation account owner."
          ]
        },
        {
          "name": "operationState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Initialize operation state account to store operation owner address and white list mint."
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "param",
          "type": "u8"
        },
        {
          "name": "keys",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "transferRewardOwner",
      "docs": [
        "Transfer reward owner",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `new_owner`- new owner pubkey",
        ""
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Address to be set as operation account owner."
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newOwner",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "initializeReward",
      "docs": [
        "Initialize a reward info for a given pool and reward index",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `reward_index` - the index to reward info",
        "* `open_time` - reward open timestamp",
        "* `end_time` - reward end timestamp",
        "* `emissions_per_second_x64` - Token reward per second are earned per unit of liquidity.",
        ""
      ],
      "accounts": [
        {
          "name": "rewardFunder",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "The founder deposit reward token to vault"
          ]
        },
        {
          "name": "funderTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "For check the reward_funder authority"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Set reward for this pool"
          ]
        },
        {
          "name": "operationState",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "load info from the account to judge reward permission"
          ]
        },
        {
          "name": "rewardTokenMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Reward mint"
          ]
        },
        {
          "name": "rewardTokenVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "A pda, reward vault"
          ]
        },
        {
          "name": "rewardTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "param",
          "type": {
            "defined": "InitializeRewardParam"
          }
        }
      ]
    },
    {
      "name": "collectRemainingRewards",
      "docs": [
        "Collect remaining reward token for reward founder",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `reward_index` - the index to reward info",
        ""
      ],
      "accounts": [
        {
          "name": "rewardFunder",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "The founder who init reward info in berfore"
          ]
        },
        {
          "name": "funderTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The funder's reward token account"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Set reward for this pool"
          ]
        },
        {
          "name": "rewardTokenVault",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Reward vault transfer remaining token to founder token account"
          ]
        },
        {
          "name": "rewardVaultMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of reward token vault"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram2022",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token program 2022"
          ]
        },
        {
          "name": "memoProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "memo program"
          ]
        }
      ],
      "args": [
        {
          "name": "rewardIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "updateRewardInfos",
      "docs": [
        "Update rewards info of the given pool, can be called for everyone",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        ""
      ],
      "accounts": [
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The liquidity pool for which reward info to update"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "setRewardParams",
      "docs": [
        "Restset reward param, start a new reward cycle or extend the current cycle.",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `reward_index` - The index of reward token in the pool.",
        "* `emissions_per_second_x64` - The per second emission reward, when extend the current cycle,",
        "new value can't be less than old value",
        "* `open_time` - reward open timestamp, must be set when state a new cycle",
        "* `end_time` - reward end timestamp",
        ""
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Address to be set as protocol owner. It pays to create factory state account."
          ]
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "operationState",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "load info from the account to judge reward permission"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token program"
          ]
        },
        {
          "name": "tokenProgram2022",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token program 2022"
          ]
        }
      ],
      "args": [
        {
          "name": "rewardIndex",
          "type": "u8"
        },
        {
          "name": "emissionsPerSecondX64",
          "type": "u128"
        },
        {
          "name": "openTime",
          "type": "u64"
        },
        {
          "name": "endTime",
          "type": "u64"
        }
      ]
    },
    {
      "name": "collectProtocolFee",
      "docs": [
        "Collect the protocol fee accrued to the pool",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `amount_0_requested` - The maximum amount of token_0 to send, can be 0 to collect fees in only token_1",
        "* `amount_1_requested` - The maximum amount of token_1 to send, can be 0 to collect fees in only token_0",
        ""
      ],
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Only admin or config owner can collect fee now"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Pool state stores accumulated protocol fee amount"
          ]
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Amm config account stores owner"
          ]
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_0"
          ]
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_1"
          ]
        },
        {
          "name": "vault0Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 0"
          ]
        },
        {
          "name": "vault1Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 1"
          ]
        },
        {
          "name": "recipientTokenAccount0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that receives the collected token_0 protocol fees"
          ]
        },
        {
          "name": "recipientTokenAccount1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that receives the collected token_1 protocol fees"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The SPL program to perform token transfers"
          ]
        },
        {
          "name": "tokenProgram2022",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The SPL program 2022 to perform token transfers"
          ]
        }
      ],
      "args": [
        {
          "name": "amount0Requested",
          "type": "u64"
        },
        {
          "name": "amount1Requested",
          "type": "u64"
        }
      ]
    },
    {
      "name": "collectFundFee",
      "docs": [
        "Collect the fund fee accrued to the pool",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `amount_0_requested` - The maximum amount of token_0 to send, can be 0 to collect fees in only token_1",
        "* `amount_1_requested` - The maximum amount of token_1 to send, can be 0 to collect fees in only token_0",
        ""
      ],
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Only admin or fund_owner can collect fee now"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Pool state stores accumulated protocol fee amount"
          ]
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Amm config account stores fund_owner"
          ]
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_0"
          ]
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_1"
          ]
        },
        {
          "name": "vault0Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 0"
          ]
        },
        {
          "name": "vault1Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 1"
          ]
        },
        {
          "name": "recipientTokenAccount0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that receives the collected token_0 protocol fees"
          ]
        },
        {
          "name": "recipientTokenAccount1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that receives the collected token_1 protocol fees"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The SPL program to perform token transfers"
          ]
        },
        {
          "name": "tokenProgram2022",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The SPL program 2022 to perform token transfers"
          ]
        }
      ],
      "args": [
        {
          "name": "amount0Requested",
          "type": "u64"
        },
        {
          "name": "amount1Requested",
          "type": "u64"
        }
      ]
    },
    {
      "name": "openPosition",
      "docs": [
        "Creates a new position wrapped in a NFT",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `tick_lower_index` - The low boundary of market",
        "* `tick_upper_index` - The upper boundary of market",
        "* `tick_array_lower_start_index` - The start index of tick array which include tick low",
        "* `tick_array_upper_start_index` - The start index of tick array which include tick upper",
        "* `liquidity` - The liquidity to be added",
        "* `amount_0_max` - The max amount of token_0 to spend, which serves as a slippage check",
        "* `amount_1_max` - The max amount of token_1 to spend, which serves as a slippage check",
        ""
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Pays to mint the position"
          ]
        },
        {
          "name": "positionNftOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "positionNftMint",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Unique token mint address"
          ]
        },
        {
          "name": "positionNftAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token account where position NFT will be minted",
            "This account created in the contract by cpi to avoid large stack variables"
          ]
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "To store metaplex metadata"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Add liquidity for this pool"
          ]
        },
        {
          "name": "protocolPosition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Store the information of market marking in range"
          ]
        },
        {
          "name": "tickArrayLower",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArrayUpper",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "personal position state"
          ]
        },
        {
          "name": "tokenAccount0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The token_0 account deposit token to the pool"
          ]
        },
        {
          "name": "tokenAccount1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The token_1 account deposit token to the pool"
          ]
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_0"
          ]
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_1"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Sysvar for token mint and ATA creation"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create the position manager state account"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create mint account and mint tokens"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create an ATA for receiving position NFT"
          ]
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create NFT metadata"
          ]
        }
      ],
      "args": [
        {
          "name": "tickLowerIndex",
          "type": "i32"
        },
        {
          "name": "tickUpperIndex",
          "type": "i32"
        },
        {
          "name": "tickArrayLowerStartIndex",
          "type": "i32"
        },
        {
          "name": "tickArrayUpperStartIndex",
          "type": "i32"
        },
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Max",
          "type": "u64"
        },
        {
          "name": "amount1Max",
          "type": "u64"
        }
      ]
    },
    {
      "name": "openPositionV2",
      "docs": [
        "Creates a new position wrapped in a NFT, support Token2022",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `tick_lower_index` - The low boundary of market",
        "* `tick_upper_index` - The upper boundary of market",
        "* `tick_array_lower_start_index` - The start index of tick array which include tick low",
        "* `tick_array_upper_start_index` - The start index of tick array which include tick upper",
        "* `liquidity` - The liquidity to be added, if zero, and the base_flage is specified, calculate liquidity base amount_0_max or amount_1_max according base_flag, otherwise open position with zero liquidity",
        "* `amount_0_max` - The max amount of token_0 to spend, which serves as a slippage check",
        "* `amount_1_max` - The max amount of token_1 to spend, which serves as a slippage check",
        "* `base_flag` - if the liquidity specified as zero, true: calculate liquidity base amount_0_max otherwise base amount_1_max",
        ""
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Pays to mint the position"
          ]
        },
        {
          "name": "positionNftOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "positionNftMint",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Unique token mint address"
          ]
        },
        {
          "name": "positionNftAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token account where position NFT will be minted",
            "This account created in the contract by cpi to avoid large stack variables"
          ]
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "To store metaplex metadata"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Add liquidity for this pool"
          ]
        },
        {
          "name": "protocolPosition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Store the information of market marking in range"
          ]
        },
        {
          "name": "tickArrayLower",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArrayUpper",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "personal position state"
          ]
        },
        {
          "name": "tokenAccount0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The token_0 account deposit token to the pool"
          ]
        },
        {
          "name": "tokenAccount1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The token_1 account deposit token to the pool"
          ]
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_0"
          ]
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_1"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Sysvar for token mint and ATA creation"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create the position manager state account"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create mint account and mint tokens"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create an ATA for receiving position NFT"
          ]
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create NFT metadata"
          ]
        },
        {
          "name": "tokenProgram2022",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create mint account and mint tokens"
          ]
        },
        {
          "name": "vault0Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 0"
          ]
        },
        {
          "name": "vault1Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 1"
          ]
        }
      ],
      "args": [
        {
          "name": "tickLowerIndex",
          "type": "i32"
        },
        {
          "name": "tickUpperIndex",
          "type": "i32"
        },
        {
          "name": "tickArrayLowerStartIndex",
          "type": "i32"
        },
        {
          "name": "tickArrayUpperStartIndex",
          "type": "i32"
        },
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Max",
          "type": "u64"
        },
        {
          "name": "amount1Max",
          "type": "u64"
        },
        {
          "name": "withMatedata",
          "type": "bool"
        },
        {
          "name": "baseFlag",
          "type": {
            "option": "bool"
          }
        }
      ]
    },
    {
      "name": "closePosition",
      "docs": [
        "Close a position, the nft mint and nft account",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        ""
      ],
      "accounts": [
        {
          "name": "nftOwner",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "The position nft owner"
          ]
        },
        {
          "name": "positionNftMint",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Unique token mint address"
          ]
        },
        {
          "name": "positionNftAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token account where position NFT will be minted"
          ]
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "To store metaplex metadata",
            "Metadata for the tokenized position"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create the position manager state account"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create mint account and mint tokens"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "increaseLiquidity",
      "docs": [
        "Increases liquidity with a exist position, with amount paid by `payer`",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `liquidity` - The desired liquidity to be added, can't be zero",
        "* `amount_0_max` - The max amount of token_0 to spend, which serves as a slippage check",
        "* `amount_1_max` - The max amount of token_1 to spend, which serves as a slippage check",
        ""
      ],
      "accounts": [
        {
          "name": "nftOwner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Pays to mint the position"
          ]
        },
        {
          "name": "nftAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token account for nft"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Increase liquidity for this position"
          ]
        },
        {
          "name": "tickArrayLower",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Stores init state for the lower tick"
          ]
        },
        {
          "name": "tickArrayUpper",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Stores init state for the upper tick"
          ]
        },
        {
          "name": "tokenAccount0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The payer's token account for token_0"
          ]
        },
        {
          "name": "tokenAccount1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The token account spending token_1 to mint the position"
          ]
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_0"
          ]
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_1"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create mint account and mint tokens"
          ]
        }
      ],
      "args": [
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Max",
          "type": "u64"
        },
        {
          "name": "amount1Max",
          "type": "u64"
        }
      ]
    },
    {
      "name": "increaseLiquidityV2",
      "docs": [
        "Increases liquidity with a exist position, with amount paid by `payer`, support Token2022",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `liquidity` - The desired liquidity to be added, if zero, calculate liquidity base amount_0 or amount_1 according base_flag",
        "* `amount_0_max` - The max amount of token_0 to spend, which serves as a slippage check",
        "* `amount_1_max` - The max amount of token_1 to spend, which serves as a slippage check",
        "* `base_flag` - must be specified if liquidity is zero, true: calculate liquidity base amount_0_max otherwise base amount_1_max",
        ""
      ],
      "accounts": [
        {
          "name": "nftOwner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Pays to mint the position"
          ]
        },
        {
          "name": "nftAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token account for nft"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Increase liquidity for this position"
          ]
        },
        {
          "name": "tickArrayLower",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Stores init state for the lower tick"
          ]
        },
        {
          "name": "tickArrayUpper",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Stores init state for the upper tick"
          ]
        },
        {
          "name": "tokenAccount0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The payer's token account for token_0"
          ]
        },
        {
          "name": "tokenAccount1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The token account spending token_1 to mint the position"
          ]
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_0"
          ]
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_1"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create mint account and mint tokens"
          ]
        },
        {
          "name": "tokenProgram2022",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token program 2022"
          ]
        },
        {
          "name": "vault0Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 0"
          ]
        },
        {
          "name": "vault1Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 1"
          ]
        }
      ],
      "args": [
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Max",
          "type": "u64"
        },
        {
          "name": "amount1Max",
          "type": "u64"
        },
        {
          "name": "baseFlag",
          "type": {
            "option": "bool"
          }
        }
      ]
    },
    {
      "name": "decreaseLiquidity",
      "docs": [
        "Decreases liquidity with a exist position",
        "",
        "# Arguments",
        "",
        "* `ctx` -  The context of accounts",
        "* `liquidity` - The amount by which liquidity will be decreased",
        "* `amount_0_min` - The minimum amount of token_0 that should be accounted for the burned liquidity",
        "* `amount_1_min` - The minimum amount of token_1 that should be accounted for the burned liquidity",
        ""
      ],
      "accounts": [
        {
          "name": "nftOwner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "The position owner or delegated authority"
          ]
        },
        {
          "name": "nftAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token account for the tokenized position"
          ]
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Decrease liquidity for this position"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token_0 vault"
          ]
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token_1 vault"
          ]
        },
        {
          "name": "tickArrayLower",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Stores init state for the lower tick"
          ]
        },
        {
          "name": "tickArrayUpper",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Stores init state for the upper tick"
          ]
        },
        {
          "name": "recipientTokenAccount0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The destination token account for receive amount_0"
          ]
        },
        {
          "name": "recipientTokenAccount1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The destination token account for receive amount_1"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL program to transfer out tokens"
          ]
        }
      ],
      "args": [
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Min",
          "type": "u64"
        },
        {
          "name": "amount1Min",
          "type": "u64"
        }
      ]
    },
    {
      "name": "decreaseLiquidityV2",
      "docs": [
        "Decreases liquidity with a exist position, support Token2022",
        "",
        "# Arguments",
        "",
        "* `ctx` -  The context of accounts",
        "* `liquidity` - The amount by which liquidity will be decreased",
        "* `amount_0_min` - The minimum amount of token_0 that should be accounted for the burned liquidity",
        "* `amount_1_min` - The minimum amount of token_1 that should be accounted for the burned liquidity",
        ""
      ],
      "accounts": [
        {
          "name": "nftOwner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "The position owner or delegated authority"
          ]
        },
        {
          "name": "nftAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token account for the tokenized position"
          ]
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Decrease liquidity for this position"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token_0 vault"
          ]
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token_1 vault"
          ]
        },
        {
          "name": "tickArrayLower",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Stores init state for the lower tick"
          ]
        },
        {
          "name": "tickArrayUpper",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Stores init state for the upper tick"
          ]
        },
        {
          "name": "recipientTokenAccount0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The destination token account for receive amount_0"
          ]
        },
        {
          "name": "recipientTokenAccount1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The destination token account for receive amount_1"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL program to transfer out tokens"
          ]
        },
        {
          "name": "tokenProgram2022",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token program 2022"
          ]
        },
        {
          "name": "memoProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "memo program"
          ]
        },
        {
          "name": "vault0Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 0"
          ]
        },
        {
          "name": "vault1Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 1"
          ]
        }
      ],
      "args": [
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Min",
          "type": "u64"
        },
        {
          "name": "amount1Min",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swap",
      "docs": [
        "Swaps one token for as much as possible of another token across a single pool",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `amount` - Arranged in pairs with other_amount_threshold. (amount_in, amount_out_minimum) or (amount_out, amount_in_maximum)",
        "* `other_amount_threshold` - For slippage check",
        "* `sqrt_price_limit` - The Q64.64 sqrt price √P limit. If zero for one, the price cannot",
        "* `is_base_input` - swap base input or swap base output",
        ""
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "The user performing the swap"
          ]
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The factory state to read protocol fees"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The program account of the pool in which the swap will be performed"
          ]
        },
        {
          "name": "inputTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The user token account for input token"
          ]
        },
        {
          "name": "outputTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The user token account for output token"
          ]
        },
        {
          "name": "inputVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The vault token account for input token"
          ]
        },
        {
          "name": "outputVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The vault token account for output token"
          ]
        },
        {
          "name": "observationState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The program account for the most recent oracle observation"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL program for token transfers"
          ]
        },
        {
          "name": "tickArray",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "otherAmountThreshold",
          "type": "u64"
        },
        {
          "name": "sqrtPriceLimitX64",
          "type": "u128"
        },
        {
          "name": "isBaseInput",
          "type": "bool"
        }
      ]
    },
    {
      "name": "swapV2",
      "docs": [
        "Swaps one token for as much as possible of another token across a single pool, support token program 2022",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `amount` - Arranged in pairs with other_amount_threshold. (amount_in, amount_out_minimum) or (amount_out, amount_in_maximum)",
        "* `other_amount_threshold` - For slippage check",
        "* `sqrt_price_limit` - The Q64.64 sqrt price √P limit. If zero for one, the price cannot",
        "* `is_base_input` - swap base input or swap base output",
        ""
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "The user performing the swap"
          ]
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The factory state to read protocol fees"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The program account of the pool in which the swap will be performed"
          ]
        },
        {
          "name": "inputTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The user token account for input token"
          ]
        },
        {
          "name": "outputTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The user token account for output token"
          ]
        },
        {
          "name": "inputVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The vault token account for input token"
          ]
        },
        {
          "name": "outputVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The vault token account for output token"
          ]
        },
        {
          "name": "observationState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The program account for the most recent oracle observation"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL program for token transfers"
          ]
        },
        {
          "name": "tokenProgram2022",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL program 2022 for token transfers"
          ]
        },
        {
          "name": "memoProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inputVaultMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 0"
          ]
        },
        {
          "name": "outputVaultMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 1"
          ]
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "otherAmountThreshold",
          "type": "u64"
        },
        {
          "name": "sqrtPriceLimitX64",
          "type": "u128"
        },
        {
          "name": "isBaseInput",
          "type": "bool"
        }
      ]
    },
    {
      "name": "swapRouterBaseIn",
      "docs": [
        "Swap token for as much as possible of another token across the path provided, base input",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `amount_in` - Token amount to be swapped in",
        "* `amount_out_minimum` - Panic if output amount is below minimum amount. For slippage.",
        ""
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "The user performing the swap"
          ]
        },
        {
          "name": "inputTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The token account that pays input tokens for the swap"
          ]
        },
        {
          "name": "inputTokenMint",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The mint of input token"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL program for token transfers"
          ]
        },
        {
          "name": "tokenProgram2022",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL program 2022 for token transfers"
          ]
        },
        {
          "name": "memoProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amountIn",
          "type": "u64"
        },
        {
          "name": "amountOutMinimum",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "ammConfig",
      "docs": [
        "Holds the current owner of the factory"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "Bump to identify PDA"
            ],
            "type": "u8"
          },
          {
            "name": "index",
            "type": "u16"
          },
          {
            "name": "owner",
            "docs": [
              "Address of the protocol owner"
            ],
            "type": "publicKey"
          },
          {
            "name": "protocolFeeRate",
            "docs": [
              "The protocol fee"
            ],
            "type": "u32"
          },
          {
            "name": "tradeFeeRate",
            "docs": [
              "The trade fee, denominated in hundredths of a bip (10^-6)"
            ],
            "type": "u32"
          },
          {
            "name": "tickSpacing",
            "docs": [
              "The tick spacing"
            ],
            "type": "u16"
          },
          {
            "name": "fundFeeRate",
            "docs": [
              "The fund fee, denominated in hundredths of a bip (10^-6)"
            ],
            "type": "u32"
          },
          {
            "name": "paddingU32",
            "type": "u32"
          },
          {
            "name": "fundOwner",
            "type": "publicKey"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                3
              ]
            }
          }
        ]
      }
    },
    {
      "name": "operationState",
      "docs": [
        "Holds the current owner of the factory"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "Bump to identify PDA"
            ],
            "type": "u8"
          },
          {
            "name": "operationOwners",
            "docs": [
              "Address of the operation owner"
            ],
            "type": {
              "array": [
                "publicKey",
                10
              ]
            }
          },
          {
            "name": "whitelistMints",
            "docs": [
              "The mint address of whitelist to emmit reward"
            ],
            "type": {
              "array": [
                "publicKey",
                100
              ]
            }
          }
        ]
      }
    },
    {
      "name": "observationState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "docs": [
              "Whether the ObservationState is initialized"
            ],
            "type": "bool"
          },
          {
            "name": "poolId",
            "type": "publicKey"
          },
          {
            "name": "observations",
            "docs": [
              "observation array"
            ],
            "type": {
              "array": [
                {
                  "defined": "Observation"
                },
                1000
              ]
            }
          },
          {
            "name": "padding",
            "docs": [
              "padding for feature update"
            ],
            "type": {
              "array": [
                "u128",
                5
              ]
            }
          }
        ]
      }
    },
    {
      "name": "personalPositionState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "Bump to identify PDA"
            ],
            "type": "u8"
          },
          {
            "name": "nftMint",
            "docs": [
              "Mint address of the tokenized position"
            ],
            "type": "publicKey"
          },
          {
            "name": "poolId",
            "docs": [
              "The ID of the pool with which this token is connected"
            ],
            "type": "publicKey"
          },
          {
            "name": "tickLowerIndex",
            "docs": [
              "The lower bound tick of the position"
            ],
            "type": "i32"
          },
          {
            "name": "tickUpperIndex",
            "docs": [
              "The upper bound tick of the position"
            ],
            "type": "i32"
          },
          {
            "name": "liquidity",
            "docs": [
              "The amount of liquidity owned by this position"
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthInside0LastX64",
            "docs": [
              "The token_0 fee growth of the aggregate position as of the last action on the individual position"
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthInside1LastX64",
            "docs": [
              "The token_1 fee growth of the aggregate position as of the last action on the individual position"
            ],
            "type": "u128"
          },
          {
            "name": "tokenFeesOwed0",
            "docs": [
              "The fees owed to the position owner in token_0, as of the last computation"
            ],
            "type": "u64"
          },
          {
            "name": "tokenFeesOwed1",
            "docs": [
              "The fees owed to the position owner in token_1, as of the last computation"
            ],
            "type": "u64"
          },
          {
            "name": "rewardInfos",
            "type": {
              "array": [
                {
                  "defined": "PositionRewardInfo"
                },
                3
              ]
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                8
              ]
            }
          }
        ]
      }
    },
    {
      "name": "poolState",
      "docs": [
        "The pool state",
        "",
        "PDA of `[POOL_SEED, config, token_mint_0, token_mint_1]`",
        ""
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "Bump to identify PDA"
            ],
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "ammConfig",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "tokenMint0",
            "docs": [
              "Token pair of the pool, where token_mint_0 address < token_mint_1 address"
            ],
            "type": "publicKey"
          },
          {
            "name": "tokenMint1",
            "type": "publicKey"
          },
          {
            "name": "tokenVault0",
            "docs": [
              "Token pair vault"
            ],
            "type": "publicKey"
          },
          {
            "name": "tokenVault1",
            "type": "publicKey"
          },
          {
            "name": "observationKey",
            "docs": [
              "observation account key"
            ],
            "type": "publicKey"
          },
          {
            "name": "mintDecimals0",
            "docs": [
              "mint0 and mint1 decimals"
            ],
            "type": "u8"
          },
          {
            "name": "mintDecimals1",
            "type": "u8"
          },
          {
            "name": "tickSpacing",
            "docs": [
              "The minimum number of ticks between initialized ticks"
            ],
            "type": "u16"
          },
          {
            "name": "liquidity",
            "docs": [
              "The currently in range liquidity available to the pool."
            ],
            "type": "u128"
          },
          {
            "name": "sqrtPriceX64",
            "docs": [
              "The current price of the pool as a sqrt(token_1/token_0) Q64.64 value"
            ],
            "type": "u128"
          },
          {
            "name": "tickCurrent",
            "docs": [
              "The current tick of the pool, i.e. according to the last tick transition that was run."
            ],
            "type": "i32"
          },
          {
            "name": "observationIndex",
            "docs": [
              "the most-recently updated index of the observations array"
            ],
            "type": "u16"
          },
          {
            "name": "observationUpdateDuration",
            "type": "u16"
          },
          {
            "name": "feeGrowthGlobal0X64",
            "docs": [
              "The fee growth as a Q64.64 number, i.e. fees of token_0 and token_1 collected per",
              "unit of liquidity for the entire life of the pool."
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthGlobal1X64",
            "type": "u128"
          },
          {
            "name": "protocolFeesToken0",
            "docs": [
              "The amounts of token_0 and token_1 that are owed to the protocol."
            ],
            "type": "u64"
          },
          {
            "name": "protocolFeesToken1",
            "type": "u64"
          },
          {
            "name": "swapInAmountToken0",
            "docs": [
              "The amounts in and out of swap token_0 and token_1"
            ],
            "type": "u128"
          },
          {
            "name": "swapOutAmountToken1",
            "type": "u128"
          },
          {
            "name": "swapInAmountToken1",
            "type": "u128"
          },
          {
            "name": "swapOutAmountToken0",
            "type": "u128"
          },
          {
            "name": "status",
            "docs": [
              "Bitwise representation of the state of the pool",
              "bit0, 1: disable open position and increase liquidity, 0: normal",
              "bit1, 1: disable decrease liquidity, 0: normal",
              "bit2, 1: disable collect fee, 0: normal",
              "bit3, 1: disable collect reward, 0: normal",
              "bit4, 1: disable swap, 0: normal"
            ],
            "type": "u8"
          },
          {
            "name": "padding",
            "docs": [
              "Leave blank for future use"
            ],
            "type": {
              "array": [
                "u8",
                7
              ]
            }
          },
          {
            "name": "rewardInfos",
            "type": {
              "array": [
                {
                  "defined": "RewardInfo"
                },
                3
              ]
            }
          },
          {
            "name": "tickArrayBitmap",
            "docs": [
              "Packed initialized tick array state"
            ],
            "type": {
              "array": [
                "u64",
                16
              ]
            }
          },
          {
            "name": "totalFeesToken0",
            "docs": [
              "except protocol_fee and fund_fee"
            ],
            "type": "u64"
          },
          {
            "name": "totalFeesClaimedToken0",
            "docs": [
              "except protocol_fee and fund_fee"
            ],
            "type": "u64"
          },
          {
            "name": "totalFeesToken1",
            "type": "u64"
          },
          {
            "name": "totalFeesClaimedToken1",
            "type": "u64"
          },
          {
            "name": "fundFeesToken0",
            "type": "u64"
          },
          {
            "name": "fundFeesToken1",
            "type": "u64"
          },
          {
            "name": "openTime",
            "type": "u64"
          },
          {
            "name": "padding1",
            "type": {
              "array": [
                "u64",
                25
              ]
            }
          },
          {
            "name": "padding2",
            "type": {
              "array": [
                "u64",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "protocolPositionState",
      "docs": [
        "Info stored for each user's position"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "Bump to identify PDA"
            ],
            "type": "u8"
          },
          {
            "name": "poolId",
            "docs": [
              "The ID of the pool with which this token is connected"
            ],
            "type": "publicKey"
          },
          {
            "name": "tickLowerIndex",
            "docs": [
              "The lower bound tick of the position"
            ],
            "type": "i32"
          },
          {
            "name": "tickUpperIndex",
            "docs": [
              "The upper bound tick of the position"
            ],
            "type": "i32"
          },
          {
            "name": "liquidity",
            "docs": [
              "The amount of liquidity owned by this position"
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthInside0LastX64",
            "docs": [
              "The token_0 fee growth per unit of liquidity as of the last update to liquidity or fees owed"
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthInside1LastX64",
            "docs": [
              "The token_1 fee growth per unit of liquidity as of the last update to liquidity or fees owed"
            ],
            "type": "u128"
          },
          {
            "name": "tokenFeesOwed0",
            "docs": [
              "The fees owed to the position owner in token_0"
            ],
            "type": "u64"
          },
          {
            "name": "tokenFeesOwed1",
            "docs": [
              "The fees owed to the position owner in token_1"
            ],
            "type": "u64"
          },
          {
            "name": "rewardGrowthInside",
            "docs": [
              "The reward growth per unit of liquidity as of the last update to liquidity"
            ],
            "type": {
              "array": [
                "u128",
                3
              ]
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                8
              ]
            }
          }
        ]
      }
    },
    {
      "name": "tickArrayState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolId",
            "type": "publicKey"
          },
          {
            "name": "startTickIndex",
            "type": "i32"
          },
          {
            "name": "ticks",
            "type": {
              "array": [
                {
                  "defined": "TickState"
                },
                60
              ]
            }
          },
          {
            "name": "initializedTickCount",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                115
              ]
            }
          }
        ]
      }
    },
    {
      "name": "tickArrayBitmapExtension",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolId",
            "type": "publicKey"
          },
          {
            "name": "positiveTickArrayBitmap",
            "docs": [
              "Packed initialized tick array state for start_tick_index is positive"
            ],
            "type": {
              "array": [
                {
                  "array": [
                    "u64",
                    8
                  ]
                },
                14
              ]
            }
          },
          {
            "name": "negativeTickArrayBitmap",
            "docs": [
              "Packed initialized tick array state for start_tick_index is negitive"
            ],
            "type": {
              "array": [
                {
                  "array": [
                    "u64",
                    8
                  ]
                },
                14
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitializeRewardParam",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "openTime",
            "docs": [
              "Reward open time"
            ],
            "type": "u64"
          },
          {
            "name": "endTime",
            "docs": [
              "Reward end time"
            ],
            "type": "u64"
          },
          {
            "name": "emissionsPerSecondX64",
            "docs": [
              "Token reward per second are earned per unit of liquidity"
            ],
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "Observation",
      "docs": [
        "The element of observations in ObservationState"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "blockTimestamp",
            "docs": [
              "The block timestamp of the observation"
            ],
            "type": "u32"
          },
          {
            "name": "sqrtPriceX64",
            "docs": [
              "the price of the observation timestamp, Q64.64"
            ],
            "type": "u128"
          },
          {
            "name": "cumulativeTimePriceX64",
            "docs": [
              "the cumulative of price during the duration time, Q64.64"
            ],
            "type": "u128"
          },
          {
            "name": "padding",
            "docs": [
              "padding for feature update"
            ],
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "PositionRewardInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "growthInsideLastX64",
            "type": "u128"
          },
          {
            "name": "rewardAmountOwed",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "RewardInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rewardState",
            "docs": [
              "Reward state"
            ],
            "type": "u8"
          },
          {
            "name": "openTime",
            "docs": [
              "Reward open time"
            ],
            "type": "u64"
          },
          {
            "name": "endTime",
            "docs": [
              "Reward end time"
            ],
            "type": "u64"
          },
          {
            "name": "lastUpdateTime",
            "docs": [
              "Reward last update time"
            ],
            "type": "u64"
          },
          {
            "name": "emissionsPerSecondX64",
            "docs": [
              "Q64.64 number indicates how many tokens per second are earned per unit of liquidity."
            ],
            "type": "u128"
          },
          {
            "name": "rewardTotalEmissioned",
            "docs": [
              "The total amount of reward emissioned"
            ],
            "type": "u64"
          },
          {
            "name": "rewardClaimed",
            "docs": [
              "The total amount of claimed reward"
            ],
            "type": "u64"
          },
          {
            "name": "tokenMint",
            "docs": [
              "Reward token mint."
            ],
            "type": "publicKey"
          },
          {
            "name": "tokenVault",
            "docs": [
              "Reward vault token account."
            ],
            "type": "publicKey"
          },
          {
            "name": "authority",
            "docs": [
              "The owner that has permission to set reward param"
            ],
            "type": "publicKey"
          },
          {
            "name": "rewardGrowthGlobalX64",
            "docs": [
              "Q64.64 number that tracks the total tokens earned per unit of liquidity since the reward",
              "emissions were turned on."
            ],
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "TickState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tick",
            "type": "i32"
          },
          {
            "name": "liquidityNet",
            "docs": [
              "Amount of net liquidity added (subtracted) when tick is crossed from left to right (right to left)"
            ],
            "type": "i128"
          },
          {
            "name": "liquidityGross",
            "docs": [
              "The total position liquidity that references this tick"
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthOutside0X64",
            "docs": [
              "Fee growth per unit of liquidity on the _other_ side of this tick (relative to the current tick)",
              "only has relative meaning, not absolute — the value depends on when the tick is initialized"
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthOutside1X64",
            "type": "u128"
          },
          {
            "name": "rewardGrowthsOutsideX64",
            "type": {
              "array": [
                "u128",
                3
              ]
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u32",
                13
              ]
            }
          }
        ]
      }
    },
    {
      "name": "PoolStatusBitIndex",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "OpenPositionOrIncreaseLiquidity"
          },
          {
            "name": "DecreaseLiquidity"
          },
          {
            "name": "CollectFee"
          },
          {
            "name": "CollectReward"
          },
          {
            "name": "Swap"
          }
        ]
      }
    },
    {
      "name": "PoolStatusBitFlag",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Enable"
          },
          {
            "name": "Disable"
          }
        ]
      }
    },
    {
      "name": "RewardState",
      "docs": [
        "State of reward"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Uninitialized"
          },
          {
            "name": "Initialized"
          },
          {
            "name": "Opening"
          },
          {
            "name": "Ended"
          }
        ]
      }
    },
    {
      "name": "TickArryBitmap",
      "type": {
        "kind": "alias",
        "value": {
          "array": [
            "u64",
            8
          ]
        }
      }
    }
  ],
  "events": [
    {
      "name": "ConfigChangeEvent",
      "fields": [
        {
          "name": "index",
          "type": "u16",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "protocolFeeRate",
          "type": "u32",
          "index": false
        },
        {
          "name": "tradeFeeRate",
          "type": "u32",
          "index": false
        },
        {
          "name": "tickSpacing",
          "type": "u16",
          "index": false
        },
        {
          "name": "fundFeeRate",
          "type": "u32",
          "index": false
        },
        {
          "name": "fundOwner",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "CreatePersonalPositionEvent",
      "fields": [
        {
          "name": "poolState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "minter",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "nftOwner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tickLowerIndex",
          "type": "i32",
          "index": false
        },
        {
          "name": "tickUpperIndex",
          "type": "i32",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "depositAmount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "depositAmount1",
          "type": "u64",
          "index": false
        },
        {
          "name": "depositAmount0TransferFee",
          "type": "u64",
          "index": false
        },
        {
          "name": "depositAmount1TransferFee",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "IncreaseLiquidityEvent",
      "fields": [
        {
          "name": "positionNftMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "amount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount1",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount0TransferFee",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount1TransferFee",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "DecreaseLiquidityEvent",
      "fields": [
        {
          "name": "positionNftMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "decreaseAmount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "decreaseAmount1",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount1",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardAmounts",
          "type": {
            "array": [
              "u64",
              3
            ]
          },
          "index": false
        },
        {
          "name": "transferFee0",
          "type": "u64",
          "index": false
        },
        {
          "name": "transferFee1",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "LiquidityCalculateEvent",
      "fields": [
        {
          "name": "poolLiquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "poolSqrtPriceX64",
          "type": "u128",
          "index": false
        },
        {
          "name": "poolTick",
          "type": "i32",
          "index": false
        },
        {
          "name": "calcAmount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "calcAmount1",
          "type": "u64",
          "index": false
        },
        {
          "name": "tradeFeeOwed0",
          "type": "u64",
          "index": false
        },
        {
          "name": "tradeFeeOwed1",
          "type": "u64",
          "index": false
        },
        {
          "name": "transferFee0",
          "type": "u64",
          "index": false
        },
        {
          "name": "transferFee1",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "CollectPersonalFeeEvent",
      "fields": [
        {
          "name": "positionNftMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "recipientTokenAccount0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "recipientTokenAccount1",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount1",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateRewardInfosEvent",
      "fields": [
        {
          "name": "rewardGrowthGlobalX64",
          "type": {
            "array": [
              "u128",
              3
            ]
          },
          "index": false
        }
      ]
    },
    {
      "name": "PoolCreatedEvent",
      "fields": [
        {
          "name": "tokenMint0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenMint1",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tickSpacing",
          "type": "u16",
          "index": false
        },
        {
          "name": "poolState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "sqrtPriceX64",
          "type": "u128",
          "index": false
        },
        {
          "name": "tick",
          "type": "i32",
          "index": false
        },
        {
          "name": "tokenVault0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenVault1",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "CollectProtocolFeeEvent",
      "fields": [
        {
          "name": "poolState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "recipientTokenAccount0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "recipientTokenAccount1",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount1",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "SwapEvent",
      "fields": [
        {
          "name": "poolState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "sender",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAccount0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAccount1",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "transferFee0",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount1",
          "type": "u64",
          "index": false
        },
        {
          "name": "transferFee1",
          "type": "u64",
          "index": false
        },
        {
          "name": "zeroForOne",
          "type": "bool",
          "index": false
        },
        {
          "name": "sqrtPriceX64",
          "type": "u128",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "tick",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "LiquidityChangeEvent",
      "fields": [
        {
          "name": "poolState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tick",
          "type": "i32",
          "index": false
        },
        {
          "name": "tickLower",
          "type": "i32",
          "index": false
        },
        {
          "name": "tickUpper",
          "type": "i32",
          "index": false
        },
        {
          "name": "liquidityBefore",
          "type": "u128",
          "index": false
        },
        {
          "name": "liquidityAfter",
          "type": "u128",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "LOK",
      "msg": "LOK"
    },
    {
      "code": 6001,
      "name": "NotApproved",
      "msg": "Not approved"
    },
    {
      "code": 6002,
      "name": "InvalidUpdateConfigFlag",
      "msg": "invalid update amm config flag"
    },
    {
      "code": 6003,
      "name": "AccountLack",
      "msg": "Account lack"
    },
    {
      "code": 6004,
      "name": "ClosePositionErr",
      "msg": "Remove liquitity, collect fees owed and reward then you can close position account"
    },
    {
      "code": 6005,
      "name": "ZeroMintAmount",
      "msg": "Minting amount should be greater than 0"
    },
    {
      "code": 6006,
      "name": "InvaildTickIndex",
      "msg": "Tick out of range"
    },
    {
      "code": 6007,
      "name": "TickInvaildOrder",
      "msg": "The lower tick must be below the upper tick"
    },
    {
      "code": 6008,
      "name": "TickLowerOverflow",
      "msg": "The tick must be greater, or equal to the minimum tick(-221818)"
    },
    {
      "code": 6009,
      "name": "TickUpperOverflow",
      "msg": "The tick must be lesser than, or equal to the maximum tick(221818)"
    },
    {
      "code": 6010,
      "name": "TickAndSpacingNotMatch",
      "msg": "tick % tick_spacing must be zero"
    },
    {
      "code": 6011,
      "name": "InvalidTickArray",
      "msg": "Invaild tick array account"
    },
    {
      "code": 6012,
      "name": "InvalidTickArrayBoundary",
      "msg": "Invaild tick array boundary"
    },
    {
      "code": 6013,
      "name": "SqrtPriceLimitOverflow",
      "msg": "Square root price limit overflow"
    },
    {
      "code": 6014,
      "name": "SqrtPriceX64",
      "msg": "sqrt_price_x64 out of range"
    },
    {
      "code": 6015,
      "name": "LiquiditySubValueErr",
      "msg": "Liquidity sub delta L must be smaller than before"
    },
    {
      "code": 6016,
      "name": "LiquidityAddValueErr",
      "msg": "Liquidity add delta L must be greater, or equal to before"
    },
    {
      "code": 6017,
      "name": "InvaildLiquidity",
      "msg": "Invaild liquidity when update position"
    },
    {
      "code": 6018,
      "name": "ForbidBothZeroForSupplyLiquidity",
      "msg": "Both token amount must not be zero while supply liquidity"
    },
    {
      "code": 6019,
      "name": "LiquidityInsufficient",
      "msg": "Liquidity insufficient"
    },
    {
      "code": 6020,
      "name": "TransactionTooOld",
      "msg": "Transaction too old"
    },
    {
      "code": 6021,
      "name": "PriceSlippageCheck",
      "msg": "Price slippage check"
    },
    {
      "code": 6022,
      "name": "TooLittleOutputReceived",
      "msg": "Too little output received"
    },
    {
      "code": 6023,
      "name": "TooMuchInputPaid",
      "msg": "Too much input paid"
    },
    {
      "code": 6024,
      "name": "InvaildSwapAmountSpecified",
      "msg": "Swap special amount can not be zero"
    },
    {
      "code": 6025,
      "name": "InvalidInputPoolVault",
      "msg": "Input pool vault is invalid"
    },
    {
      "code": 6026,
      "name": "TooSmallInputOrOutputAmount",
      "msg": "Swap input or output amount is too small"
    },
    {
      "code": 6027,
      "name": "NotEnoughTickArrayAccount",
      "msg": "Not enought tick array account"
    },
    {
      "code": 6028,
      "name": "InvalidFirstTickArrayAccount",
      "msg": "Invaild first tick array account"
    },
    {
      "code": 6029,
      "name": "InvalidRewardIndex",
      "msg": "Invalid reward index"
    },
    {
      "code": 6030,
      "name": "FullRewardInfo",
      "msg": "The init reward token reach to the max"
    },
    {
      "code": 6031,
      "name": "RewardTokenAlreadyInUse",
      "msg": "The init reward token already in use"
    },
    {
      "code": 6032,
      "name": "ExceptPoolVaultMint",
      "msg": "The reward tokens must contain one of pool vault mint except the last reward"
    },
    {
      "code": 6033,
      "name": "InvalidRewardInitParam",
      "msg": "Invalid reward init param"
    },
    {
      "code": 6034,
      "name": "InvalidRewardDesiredAmount",
      "msg": "Invalid collect reward desired amount"
    },
    {
      "code": 6035,
      "name": "InvalidRewardInputAccountNumber",
      "msg": "Invalid collect reward input account number"
    },
    {
      "code": 6036,
      "name": "InvalidRewardPeriod",
      "msg": "Invalid reward period"
    },
    {
      "code": 6037,
      "name": "NotApproveUpdateRewardEmissiones",
      "msg": "Modification of emissiones is allowed within 72 hours from the end of the previous cycle"
    },
    {
      "code": 6038,
      "name": "UnInitializedRewardInfo",
      "msg": "uninitialized reward info"
    },
    {
      "code": 6039,
      "name": "NotSupportMint",
      "msg": "Not support token_2022 mint extension"
    },
    {
      "code": 6040,
      "name": "MissingTickArrayBitmapExtensionAccount",
      "msg": "Missing tickarray bitmap extension account"
    },
    {
      "code": 6041,
      "name": "InsufficientLiquidityForDirection",
      "msg": "Insufficient liquidity for this direction"
    }
  ]
};

export const IDL: AmmV3 = {
  "version": "0.1.0",
  "name": "amm_v3",
  "instructions": [
    {
      "name": "createAmmConfig",
      "docs": [
        "# Arguments",
        "",
        "* `ctx`- The accounts needed by instruction.",
        "* `index` - The index of amm config, there may be multiple config.",
        "* `tick_spacing` - The tickspacing binding with config, cannot be changed.",
        "* `trade_fee_rate` - Trade fee rate, can be changed.",
        "* `protocol_fee_rate` - The rate of protocol fee within tarde fee.",
        "* `fund_fee_rate` - The rate of fund fee within tarde fee.",
        ""
      ],
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Address to be set as protocol owner."
          ]
        },
        {
          "name": "ammConfig",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Initialize config state account to store protocol owner address and fee rates."
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u16"
        },
        {
          "name": "tickSpacing",
          "type": "u16"
        },
        {
          "name": "tradeFeeRate",
          "type": "u32"
        },
        {
          "name": "protocolFeeRate",
          "type": "u32"
        },
        {
          "name": "fundFeeRate",
          "type": "u32"
        }
      ]
    },
    {
      "name": "updateAmmConfig",
      "docs": [
        "Updates the owner of the amm config",
        "Must be called by the current owner or admin",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `trade_fee_rate`- The new trade fee rate of amm config, be set when `param` is 0",
        "* `protocol_fee_rate`- The new protocol fee rate of amm config, be set when `param` is 1",
        "* `fund_fee_rate`- The new fund fee rate of amm config, be set when `param` is 2",
        "* `new_owner`- The config's new owner, be set when `param` is 3",
        "* `new_fund_owner`- The config's new fund owner, be set when `param` is 4",
        "* `param`- The vaule can be 0 | 1 | 2 | 3 | 4, otherwise will report a error",
        ""
      ],
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "The amm config owner or admin"
          ]
        },
        {
          "name": "ammConfig",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Amm config account to be changed"
          ]
        }
      ],
      "args": [
        {
          "name": "param",
          "type": "u8"
        },
        {
          "name": "value",
          "type": "u32"
        }
      ]
    },
    {
      "name": "createPool",
      "docs": [
        "Creates a pool for the given token pair and the initial price",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `sqrt_price_x64` - the initial sqrt price (amount_token_1 / amount_token_0) of the pool as a Q64.64",
        ""
      ],
      "accounts": [
        {
          "name": "poolCreator",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Address paying to create the pool. Can be anyone"
          ]
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Which config the pool belongs to."
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Initialize an account to store the pool state"
          ]
        },
        {
          "name": "tokenMint0",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token_0 mint, the key must be greater then token_1 mint."
          ]
        },
        {
          "name": "tokenMint1",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token_1 mint"
          ]
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token_0 vault for the pool"
          ]
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token_1 vault for the pool"
          ]
        },
        {
          "name": "observationState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArrayBitmap",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Initialize an account to store if a tick array is initialized."
          ]
        },
        {
          "name": "tokenProgram0",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Spl token program or token program 2022"
          ]
        },
        {
          "name": "tokenProgram1",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Spl token program or token program 2022"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "To create a new program account"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Sysvar for program account"
          ]
        }
      ],
      "args": [
        {
          "name": "sqrtPriceX64",
          "type": "u128"
        },
        {
          "name": "openTime",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updatePoolStatus",
      "docs": [
        "Update pool status for given vaule",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `status` - The vaule of status",
        ""
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "status",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createOperationAccount",
      "docs": [
        "Creates an operation account for the program",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        ""
      ],
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Address to be set as operation account owner."
          ]
        },
        {
          "name": "operationState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Initialize operation state account to store operation owner address and white list mint."
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateOperationAccount",
      "docs": [
        "Update the operation account",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `param`- The vaule can be 0 | 1 | 2 | 3, otherwise will report a error",
        "* `keys`- update operation owner when the `param` is 0",
        "remove operation owner when the `param` is 1",
        "update whitelist mint when the `param` is 2",
        "remove whitelist mint when the `param` is 3",
        ""
      ],
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Address to be set as operation account owner."
          ]
        },
        {
          "name": "operationState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Initialize operation state account to store operation owner address and white list mint."
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "param",
          "type": "u8"
        },
        {
          "name": "keys",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "transferRewardOwner",
      "docs": [
        "Transfer reward owner",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `new_owner`- new owner pubkey",
        ""
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Address to be set as operation account owner."
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newOwner",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "initializeReward",
      "docs": [
        "Initialize a reward info for a given pool and reward index",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `reward_index` - the index to reward info",
        "* `open_time` - reward open timestamp",
        "* `end_time` - reward end timestamp",
        "* `emissions_per_second_x64` - Token reward per second are earned per unit of liquidity.",
        ""
      ],
      "accounts": [
        {
          "name": "rewardFunder",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "The founder deposit reward token to vault"
          ]
        },
        {
          "name": "funderTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "For check the reward_funder authority"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Set reward for this pool"
          ]
        },
        {
          "name": "operationState",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "load info from the account to judge reward permission"
          ]
        },
        {
          "name": "rewardTokenMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Reward mint"
          ]
        },
        {
          "name": "rewardTokenVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "A pda, reward vault"
          ]
        },
        {
          "name": "rewardTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "param",
          "type": {
            "defined": "InitializeRewardParam"
          }
        }
      ]
    },
    {
      "name": "collectRemainingRewards",
      "docs": [
        "Collect remaining reward token for reward founder",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        "* `reward_index` - the index to reward info",
        ""
      ],
      "accounts": [
        {
          "name": "rewardFunder",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "The founder who init reward info in berfore"
          ]
        },
        {
          "name": "funderTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The funder's reward token account"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Set reward for this pool"
          ]
        },
        {
          "name": "rewardTokenVault",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Reward vault transfer remaining token to founder token account"
          ]
        },
        {
          "name": "rewardVaultMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of reward token vault"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram2022",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token program 2022"
          ]
        },
        {
          "name": "memoProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "memo program"
          ]
        }
      ],
      "args": [
        {
          "name": "rewardIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "updateRewardInfos",
      "docs": [
        "Update rewards info of the given pool, can be called for everyone",
        "",
        "# Arguments",
        "",
        "* `ctx`- The context of accounts",
        ""
      ],
      "accounts": [
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The liquidity pool for which reward info to update"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "setRewardParams",
      "docs": [
        "Restset reward param, start a new reward cycle or extend the current cycle.",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `reward_index` - The index of reward token in the pool.",
        "* `emissions_per_second_x64` - The per second emission reward, when extend the current cycle,",
        "new value can't be less than old value",
        "* `open_time` - reward open timestamp, must be set when state a new cycle",
        "* `end_time` - reward end timestamp",
        ""
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Address to be set as protocol owner. It pays to create factory state account."
          ]
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "operationState",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "load info from the account to judge reward permission"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token program"
          ]
        },
        {
          "name": "tokenProgram2022",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token program 2022"
          ]
        }
      ],
      "args": [
        {
          "name": "rewardIndex",
          "type": "u8"
        },
        {
          "name": "emissionsPerSecondX64",
          "type": "u128"
        },
        {
          "name": "openTime",
          "type": "u64"
        },
        {
          "name": "endTime",
          "type": "u64"
        }
      ]
    },
    {
      "name": "collectProtocolFee",
      "docs": [
        "Collect the protocol fee accrued to the pool",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `amount_0_requested` - The maximum amount of token_0 to send, can be 0 to collect fees in only token_1",
        "* `amount_1_requested` - The maximum amount of token_1 to send, can be 0 to collect fees in only token_0",
        ""
      ],
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Only admin or config owner can collect fee now"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Pool state stores accumulated protocol fee amount"
          ]
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Amm config account stores owner"
          ]
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_0"
          ]
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_1"
          ]
        },
        {
          "name": "vault0Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 0"
          ]
        },
        {
          "name": "vault1Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 1"
          ]
        },
        {
          "name": "recipientTokenAccount0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that receives the collected token_0 protocol fees"
          ]
        },
        {
          "name": "recipientTokenAccount1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that receives the collected token_1 protocol fees"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The SPL program to perform token transfers"
          ]
        },
        {
          "name": "tokenProgram2022",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The SPL program 2022 to perform token transfers"
          ]
        }
      ],
      "args": [
        {
          "name": "amount0Requested",
          "type": "u64"
        },
        {
          "name": "amount1Requested",
          "type": "u64"
        }
      ]
    },
    {
      "name": "collectFundFee",
      "docs": [
        "Collect the fund fee accrued to the pool",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `amount_0_requested` - The maximum amount of token_0 to send, can be 0 to collect fees in only token_1",
        "* `amount_1_requested` - The maximum amount of token_1 to send, can be 0 to collect fees in only token_0",
        ""
      ],
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Only admin or fund_owner can collect fee now"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Pool state stores accumulated protocol fee amount"
          ]
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Amm config account stores fund_owner"
          ]
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_0"
          ]
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_1"
          ]
        },
        {
          "name": "vault0Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 0"
          ]
        },
        {
          "name": "vault1Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 1"
          ]
        },
        {
          "name": "recipientTokenAccount0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that receives the collected token_0 protocol fees"
          ]
        },
        {
          "name": "recipientTokenAccount1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that receives the collected token_1 protocol fees"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The SPL program to perform token transfers"
          ]
        },
        {
          "name": "tokenProgram2022",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The SPL program 2022 to perform token transfers"
          ]
        }
      ],
      "args": [
        {
          "name": "amount0Requested",
          "type": "u64"
        },
        {
          "name": "amount1Requested",
          "type": "u64"
        }
      ]
    },
    {
      "name": "openPosition",
      "docs": [
        "Creates a new position wrapped in a NFT",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `tick_lower_index` - The low boundary of market",
        "* `tick_upper_index` - The upper boundary of market",
        "* `tick_array_lower_start_index` - The start index of tick array which include tick low",
        "* `tick_array_upper_start_index` - The start index of tick array which include tick upper",
        "* `liquidity` - The liquidity to be added",
        "* `amount_0_max` - The max amount of token_0 to spend, which serves as a slippage check",
        "* `amount_1_max` - The max amount of token_1 to spend, which serves as a slippage check",
        ""
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Pays to mint the position"
          ]
        },
        {
          "name": "positionNftOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "positionNftMint",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Unique token mint address"
          ]
        },
        {
          "name": "positionNftAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token account where position NFT will be minted",
            "This account created in the contract by cpi to avoid large stack variables"
          ]
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "To store metaplex metadata"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Add liquidity for this pool"
          ]
        },
        {
          "name": "protocolPosition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Store the information of market marking in range"
          ]
        },
        {
          "name": "tickArrayLower",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArrayUpper",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "personal position state"
          ]
        },
        {
          "name": "tokenAccount0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The token_0 account deposit token to the pool"
          ]
        },
        {
          "name": "tokenAccount1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The token_1 account deposit token to the pool"
          ]
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_0"
          ]
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_1"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Sysvar for token mint and ATA creation"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create the position manager state account"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create mint account and mint tokens"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create an ATA for receiving position NFT"
          ]
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create NFT metadata"
          ]
        }
      ],
      "args": [
        {
          "name": "tickLowerIndex",
          "type": "i32"
        },
        {
          "name": "tickUpperIndex",
          "type": "i32"
        },
        {
          "name": "tickArrayLowerStartIndex",
          "type": "i32"
        },
        {
          "name": "tickArrayUpperStartIndex",
          "type": "i32"
        },
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Max",
          "type": "u64"
        },
        {
          "name": "amount1Max",
          "type": "u64"
        }
      ]
    },
    {
      "name": "openPositionV2",
      "docs": [
        "Creates a new position wrapped in a NFT, support Token2022",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `tick_lower_index` - The low boundary of market",
        "* `tick_upper_index` - The upper boundary of market",
        "* `tick_array_lower_start_index` - The start index of tick array which include tick low",
        "* `tick_array_upper_start_index` - The start index of tick array which include tick upper",
        "* `liquidity` - The liquidity to be added, if zero, and the base_flage is specified, calculate liquidity base amount_0_max or amount_1_max according base_flag, otherwise open position with zero liquidity",
        "* `amount_0_max` - The max amount of token_0 to spend, which serves as a slippage check",
        "* `amount_1_max` - The max amount of token_1 to spend, which serves as a slippage check",
        "* `base_flag` - if the liquidity specified as zero, true: calculate liquidity base amount_0_max otherwise base amount_1_max",
        ""
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Pays to mint the position"
          ]
        },
        {
          "name": "positionNftOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "positionNftMint",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Unique token mint address"
          ]
        },
        {
          "name": "positionNftAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token account where position NFT will be minted",
            "This account created in the contract by cpi to avoid large stack variables"
          ]
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "To store metaplex metadata"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Add liquidity for this pool"
          ]
        },
        {
          "name": "protocolPosition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Store the information of market marking in range"
          ]
        },
        {
          "name": "tickArrayLower",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tickArrayUpper",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "personal position state"
          ]
        },
        {
          "name": "tokenAccount0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The token_0 account deposit token to the pool"
          ]
        },
        {
          "name": "tokenAccount1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The token_1 account deposit token to the pool"
          ]
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_0"
          ]
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_1"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Sysvar for token mint and ATA creation"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create the position manager state account"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create mint account and mint tokens"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create an ATA for receiving position NFT"
          ]
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create NFT metadata"
          ]
        },
        {
          "name": "tokenProgram2022",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create mint account and mint tokens"
          ]
        },
        {
          "name": "vault0Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 0"
          ]
        },
        {
          "name": "vault1Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 1"
          ]
        }
      ],
      "args": [
        {
          "name": "tickLowerIndex",
          "type": "i32"
        },
        {
          "name": "tickUpperIndex",
          "type": "i32"
        },
        {
          "name": "tickArrayLowerStartIndex",
          "type": "i32"
        },
        {
          "name": "tickArrayUpperStartIndex",
          "type": "i32"
        },
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Max",
          "type": "u64"
        },
        {
          "name": "amount1Max",
          "type": "u64"
        },
        {
          "name": "withMatedata",
          "type": "bool"
        },
        {
          "name": "baseFlag",
          "type": {
            "option": "bool"
          }
        }
      ]
    },
    {
      "name": "closePosition",
      "docs": [
        "Close a position, the nft mint and nft account",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        ""
      ],
      "accounts": [
        {
          "name": "nftOwner",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "The position nft owner"
          ]
        },
        {
          "name": "positionNftMint",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Unique token mint address"
          ]
        },
        {
          "name": "positionNftAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token account where position NFT will be minted"
          ]
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "To store metaplex metadata",
            "Metadata for the tokenized position"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create the position manager state account"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create mint account and mint tokens"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "increaseLiquidity",
      "docs": [
        "Increases liquidity with a exist position, with amount paid by `payer`",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `liquidity` - The desired liquidity to be added, can't be zero",
        "* `amount_0_max` - The max amount of token_0 to spend, which serves as a slippage check",
        "* `amount_1_max` - The max amount of token_1 to spend, which serves as a slippage check",
        ""
      ],
      "accounts": [
        {
          "name": "nftOwner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Pays to mint the position"
          ]
        },
        {
          "name": "nftAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token account for nft"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Increase liquidity for this position"
          ]
        },
        {
          "name": "tickArrayLower",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Stores init state for the lower tick"
          ]
        },
        {
          "name": "tickArrayUpper",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Stores init state for the upper tick"
          ]
        },
        {
          "name": "tokenAccount0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The payer's token account for token_0"
          ]
        },
        {
          "name": "tokenAccount1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The token account spending token_1 to mint the position"
          ]
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_0"
          ]
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_1"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create mint account and mint tokens"
          ]
        }
      ],
      "args": [
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Max",
          "type": "u64"
        },
        {
          "name": "amount1Max",
          "type": "u64"
        }
      ]
    },
    {
      "name": "increaseLiquidityV2",
      "docs": [
        "Increases liquidity with a exist position, with amount paid by `payer`, support Token2022",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `liquidity` - The desired liquidity to be added, if zero, calculate liquidity base amount_0 or amount_1 according base_flag",
        "* `amount_0_max` - The max amount of token_0 to spend, which serves as a slippage check",
        "* `amount_1_max` - The max amount of token_1 to spend, which serves as a slippage check",
        "* `base_flag` - must be specified if liquidity is zero, true: calculate liquidity base amount_0_max otherwise base amount_1_max",
        ""
      ],
      "accounts": [
        {
          "name": "nftOwner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Pays to mint the position"
          ]
        },
        {
          "name": "nftAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token account for nft"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Increase liquidity for this position"
          ]
        },
        {
          "name": "tickArrayLower",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Stores init state for the lower tick"
          ]
        },
        {
          "name": "tickArrayUpper",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Stores init state for the upper tick"
          ]
        },
        {
          "name": "tokenAccount0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The payer's token account for token_0"
          ]
        },
        {
          "name": "tokenAccount1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The token account spending token_1 to mint the position"
          ]
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_0"
          ]
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The address that holds pool tokens for token_1"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create mint account and mint tokens"
          ]
        },
        {
          "name": "tokenProgram2022",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token program 2022"
          ]
        },
        {
          "name": "vault0Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 0"
          ]
        },
        {
          "name": "vault1Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 1"
          ]
        }
      ],
      "args": [
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Max",
          "type": "u64"
        },
        {
          "name": "amount1Max",
          "type": "u64"
        },
        {
          "name": "baseFlag",
          "type": {
            "option": "bool"
          }
        }
      ]
    },
    {
      "name": "decreaseLiquidity",
      "docs": [
        "Decreases liquidity with a exist position",
        "",
        "# Arguments",
        "",
        "* `ctx` -  The context of accounts",
        "* `liquidity` - The amount by which liquidity will be decreased",
        "* `amount_0_min` - The minimum amount of token_0 that should be accounted for the burned liquidity",
        "* `amount_1_min` - The minimum amount of token_1 that should be accounted for the burned liquidity",
        ""
      ],
      "accounts": [
        {
          "name": "nftOwner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "The position owner or delegated authority"
          ]
        },
        {
          "name": "nftAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token account for the tokenized position"
          ]
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Decrease liquidity for this position"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token_0 vault"
          ]
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token_1 vault"
          ]
        },
        {
          "name": "tickArrayLower",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Stores init state for the lower tick"
          ]
        },
        {
          "name": "tickArrayUpper",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Stores init state for the upper tick"
          ]
        },
        {
          "name": "recipientTokenAccount0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The destination token account for receive amount_0"
          ]
        },
        {
          "name": "recipientTokenAccount1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The destination token account for receive amount_1"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL program to transfer out tokens"
          ]
        }
      ],
      "args": [
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Min",
          "type": "u64"
        },
        {
          "name": "amount1Min",
          "type": "u64"
        }
      ]
    },
    {
      "name": "decreaseLiquidityV2",
      "docs": [
        "Decreases liquidity with a exist position, support Token2022",
        "",
        "# Arguments",
        "",
        "* `ctx` -  The context of accounts",
        "* `liquidity` - The amount by which liquidity will be decreased",
        "* `amount_0_min` - The minimum amount of token_0 that should be accounted for the burned liquidity",
        "* `amount_1_min` - The minimum amount of token_1 that should be accounted for the burned liquidity",
        ""
      ],
      "accounts": [
        {
          "name": "nftOwner",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "The position owner or delegated authority"
          ]
        },
        {
          "name": "nftAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token account for the tokenized position"
          ]
        },
        {
          "name": "personalPosition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Decrease liquidity for this position"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token_0 vault"
          ]
        },
        {
          "name": "tokenVault1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token_1 vault"
          ]
        },
        {
          "name": "tickArrayLower",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Stores init state for the lower tick"
          ]
        },
        {
          "name": "tickArrayUpper",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Stores init state for the upper tick"
          ]
        },
        {
          "name": "recipientTokenAccount0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The destination token account for receive amount_0"
          ]
        },
        {
          "name": "recipientTokenAccount1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The destination token account for receive amount_1"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL program to transfer out tokens"
          ]
        },
        {
          "name": "tokenProgram2022",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token program 2022"
          ]
        },
        {
          "name": "memoProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "memo program"
          ]
        },
        {
          "name": "vault0Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 0"
          ]
        },
        {
          "name": "vault1Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 1"
          ]
        }
      ],
      "args": [
        {
          "name": "liquidity",
          "type": "u128"
        },
        {
          "name": "amount0Min",
          "type": "u64"
        },
        {
          "name": "amount1Min",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swap",
      "docs": [
        "Swaps one token for as much as possible of another token across a single pool",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `amount` - Arranged in pairs with other_amount_threshold. (amount_in, amount_out_minimum) or (amount_out, amount_in_maximum)",
        "* `other_amount_threshold` - For slippage check",
        "* `sqrt_price_limit` - The Q64.64 sqrt price √P limit. If zero for one, the price cannot",
        "* `is_base_input` - swap base input or swap base output",
        ""
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "The user performing the swap"
          ]
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The factory state to read protocol fees"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The program account of the pool in which the swap will be performed"
          ]
        },
        {
          "name": "inputTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The user token account for input token"
          ]
        },
        {
          "name": "outputTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The user token account for output token"
          ]
        },
        {
          "name": "inputVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The vault token account for input token"
          ]
        },
        {
          "name": "outputVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The vault token account for output token"
          ]
        },
        {
          "name": "observationState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The program account for the most recent oracle observation"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL program for token transfers"
          ]
        },
        {
          "name": "tickArray",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "otherAmountThreshold",
          "type": "u64"
        },
        {
          "name": "sqrtPriceLimitX64",
          "type": "u128"
        },
        {
          "name": "isBaseInput",
          "type": "bool"
        }
      ]
    },
    {
      "name": "swapV2",
      "docs": [
        "Swaps one token for as much as possible of another token across a single pool, support token program 2022",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `amount` - Arranged in pairs with other_amount_threshold. (amount_in, amount_out_minimum) or (amount_out, amount_in_maximum)",
        "* `other_amount_threshold` - For slippage check",
        "* `sqrt_price_limit` - The Q64.64 sqrt price √P limit. If zero for one, the price cannot",
        "* `is_base_input` - swap base input or swap base output",
        ""
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "The user performing the swap"
          ]
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The factory state to read protocol fees"
          ]
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The program account of the pool in which the swap will be performed"
          ]
        },
        {
          "name": "inputTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The user token account for input token"
          ]
        },
        {
          "name": "outputTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The user token account for output token"
          ]
        },
        {
          "name": "inputVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The vault token account for input token"
          ]
        },
        {
          "name": "outputVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The vault token account for output token"
          ]
        },
        {
          "name": "observationState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The program account for the most recent oracle observation"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL program for token transfers"
          ]
        },
        {
          "name": "tokenProgram2022",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL program 2022 for token transfers"
          ]
        },
        {
          "name": "memoProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inputVaultMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 0"
          ]
        },
        {
          "name": "outputVaultMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The mint of token vault 1"
          ]
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "otherAmountThreshold",
          "type": "u64"
        },
        {
          "name": "sqrtPriceLimitX64",
          "type": "u128"
        },
        {
          "name": "isBaseInput",
          "type": "bool"
        }
      ]
    },
    {
      "name": "swapRouterBaseIn",
      "docs": [
        "Swap token for as much as possible of another token across the path provided, base input",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context of accounts",
        "* `amount_in` - Token amount to be swapped in",
        "* `amount_out_minimum` - Panic if output amount is below minimum amount. For slippage.",
        ""
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "The user performing the swap"
          ]
        },
        {
          "name": "inputTokenAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The token account that pays input tokens for the swap"
          ]
        },
        {
          "name": "inputTokenMint",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The mint of input token"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL program for token transfers"
          ]
        },
        {
          "name": "tokenProgram2022",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL program 2022 for token transfers"
          ]
        },
        {
          "name": "memoProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amountIn",
          "type": "u64"
        },
        {
          "name": "amountOutMinimum",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "ammConfig",
      "docs": [
        "Holds the current owner of the factory"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "Bump to identify PDA"
            ],
            "type": "u8"
          },
          {
            "name": "index",
            "type": "u16"
          },
          {
            "name": "owner",
            "docs": [
              "Address of the protocol owner"
            ],
            "type": "publicKey"
          },
          {
            "name": "protocolFeeRate",
            "docs": [
              "The protocol fee"
            ],
            "type": "u32"
          },
          {
            "name": "tradeFeeRate",
            "docs": [
              "The trade fee, denominated in hundredths of a bip (10^-6)"
            ],
            "type": "u32"
          },
          {
            "name": "tickSpacing",
            "docs": [
              "The tick spacing"
            ],
            "type": "u16"
          },
          {
            "name": "fundFeeRate",
            "docs": [
              "The fund fee, denominated in hundredths of a bip (10^-6)"
            ],
            "type": "u32"
          },
          {
            "name": "paddingU32",
            "type": "u32"
          },
          {
            "name": "fundOwner",
            "type": "publicKey"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                3
              ]
            }
          }
        ]
      }
    },
    {
      "name": "operationState",
      "docs": [
        "Holds the current owner of the factory"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "Bump to identify PDA"
            ],
            "type": "u8"
          },
          {
            "name": "operationOwners",
            "docs": [
              "Address of the operation owner"
            ],
            "type": {
              "array": [
                "publicKey",
                10
              ]
            }
          },
          {
            "name": "whitelistMints",
            "docs": [
              "The mint address of whitelist to emmit reward"
            ],
            "type": {
              "array": [
                "publicKey",
                100
              ]
            }
          }
        ]
      }
    },
    {
      "name": "observationState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "docs": [
              "Whether the ObservationState is initialized"
            ],
            "type": "bool"
          },
          {
            "name": "poolId",
            "type": "publicKey"
          },
          {
            "name": "observations",
            "docs": [
              "observation array"
            ],
            "type": {
              "array": [
                {
                  "defined": "Observation"
                },
                1000
              ]
            }
          },
          {
            "name": "padding",
            "docs": [
              "padding for feature update"
            ],
            "type": {
              "array": [
                "u128",
                5
              ]
            }
          }
        ]
      }
    },
    {
      "name": "personalPositionState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "Bump to identify PDA"
            ],
            "type": "u8"
          },
          {
            "name": "nftMint",
            "docs": [
              "Mint address of the tokenized position"
            ],
            "type": "publicKey"
          },
          {
            "name": "poolId",
            "docs": [
              "The ID of the pool with which this token is connected"
            ],
            "type": "publicKey"
          },
          {
            "name": "tickLowerIndex",
            "docs": [
              "The lower bound tick of the position"
            ],
            "type": "i32"
          },
          {
            "name": "tickUpperIndex",
            "docs": [
              "The upper bound tick of the position"
            ],
            "type": "i32"
          },
          {
            "name": "liquidity",
            "docs": [
              "The amount of liquidity owned by this position"
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthInside0LastX64",
            "docs": [
              "The token_0 fee growth of the aggregate position as of the last action on the individual position"
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthInside1LastX64",
            "docs": [
              "The token_1 fee growth of the aggregate position as of the last action on the individual position"
            ],
            "type": "u128"
          },
          {
            "name": "tokenFeesOwed0",
            "docs": [
              "The fees owed to the position owner in token_0, as of the last computation"
            ],
            "type": "u64"
          },
          {
            "name": "tokenFeesOwed1",
            "docs": [
              "The fees owed to the position owner in token_1, as of the last computation"
            ],
            "type": "u64"
          },
          {
            "name": "rewardInfos",
            "type": {
              "array": [
                {
                  "defined": "PositionRewardInfo"
                },
                3
              ]
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                8
              ]
            }
          }
        ]
      }
    },
    {
      "name": "poolState",
      "docs": [
        "The pool state",
        "",
        "PDA of `[POOL_SEED, config, token_mint_0, token_mint_1]`",
        ""
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "Bump to identify PDA"
            ],
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "ammConfig",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "tokenMint0",
            "docs": [
              "Token pair of the pool, where token_mint_0 address < token_mint_1 address"
            ],
            "type": "publicKey"
          },
          {
            "name": "tokenMint1",
            "type": "publicKey"
          },
          {
            "name": "tokenVault0",
            "docs": [
              "Token pair vault"
            ],
            "type": "publicKey"
          },
          {
            "name": "tokenVault1",
            "type": "publicKey"
          },
          {
            "name": "observationKey",
            "docs": [
              "observation account key"
            ],
            "type": "publicKey"
          },
          {
            "name": "mintDecimals0",
            "docs": [
              "mint0 and mint1 decimals"
            ],
            "type": "u8"
          },
          {
            "name": "mintDecimals1",
            "type": "u8"
          },
          {
            "name": "tickSpacing",
            "docs": [
              "The minimum number of ticks between initialized ticks"
            ],
            "type": "u16"
          },
          {
            "name": "liquidity",
            "docs": [
              "The currently in range liquidity available to the pool."
            ],
            "type": "u128"
          },
          {
            "name": "sqrtPriceX64",
            "docs": [
              "The current price of the pool as a sqrt(token_1/token_0) Q64.64 value"
            ],
            "type": "u128"
          },
          {
            "name": "tickCurrent",
            "docs": [
              "The current tick of the pool, i.e. according to the last tick transition that was run."
            ],
            "type": "i32"
          },
          {
            "name": "observationIndex",
            "docs": [
              "the most-recently updated index of the observations array"
            ],
            "type": "u16"
          },
          {
            "name": "observationUpdateDuration",
            "type": "u16"
          },
          {
            "name": "feeGrowthGlobal0X64",
            "docs": [
              "The fee growth as a Q64.64 number, i.e. fees of token_0 and token_1 collected per",
              "unit of liquidity for the entire life of the pool."
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthGlobal1X64",
            "type": "u128"
          },
          {
            "name": "protocolFeesToken0",
            "docs": [
              "The amounts of token_0 and token_1 that are owed to the protocol."
            ],
            "type": "u64"
          },
          {
            "name": "protocolFeesToken1",
            "type": "u64"
          },
          {
            "name": "swapInAmountToken0",
            "docs": [
              "The amounts in and out of swap token_0 and token_1"
            ],
            "type": "u128"
          },
          {
            "name": "swapOutAmountToken1",
            "type": "u128"
          },
          {
            "name": "swapInAmountToken1",
            "type": "u128"
          },
          {
            "name": "swapOutAmountToken0",
            "type": "u128"
          },
          {
            "name": "status",
            "docs": [
              "Bitwise representation of the state of the pool",
              "bit0, 1: disable open position and increase liquidity, 0: normal",
              "bit1, 1: disable decrease liquidity, 0: normal",
              "bit2, 1: disable collect fee, 0: normal",
              "bit3, 1: disable collect reward, 0: normal",
              "bit4, 1: disable swap, 0: normal"
            ],
            "type": "u8"
          },
          {
            "name": "padding",
            "docs": [
              "Leave blank for future use"
            ],
            "type": {
              "array": [
                "u8",
                7
              ]
            }
          },
          {
            "name": "rewardInfos",
            "type": {
              "array": [
                {
                  "defined": "RewardInfo"
                },
                3
              ]
            }
          },
          {
            "name": "tickArrayBitmap",
            "docs": [
              "Packed initialized tick array state"
            ],
            "type": {
              "array": [
                "u64",
                16
              ]
            }
          },
          {
            "name": "totalFeesToken0",
            "docs": [
              "except protocol_fee and fund_fee"
            ],
            "type": "u64"
          },
          {
            "name": "totalFeesClaimedToken0",
            "docs": [
              "except protocol_fee and fund_fee"
            ],
            "type": "u64"
          },
          {
            "name": "totalFeesToken1",
            "type": "u64"
          },
          {
            "name": "totalFeesClaimedToken1",
            "type": "u64"
          },
          {
            "name": "fundFeesToken0",
            "type": "u64"
          },
          {
            "name": "fundFeesToken1",
            "type": "u64"
          },
          {
            "name": "openTime",
            "type": "u64"
          },
          {
            "name": "padding1",
            "type": {
              "array": [
                "u64",
                25
              ]
            }
          },
          {
            "name": "padding2",
            "type": {
              "array": [
                "u64",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "protocolPositionState",
      "docs": [
        "Info stored for each user's position"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "Bump to identify PDA"
            ],
            "type": "u8"
          },
          {
            "name": "poolId",
            "docs": [
              "The ID of the pool with which this token is connected"
            ],
            "type": "publicKey"
          },
          {
            "name": "tickLowerIndex",
            "docs": [
              "The lower bound tick of the position"
            ],
            "type": "i32"
          },
          {
            "name": "tickUpperIndex",
            "docs": [
              "The upper bound tick of the position"
            ],
            "type": "i32"
          },
          {
            "name": "liquidity",
            "docs": [
              "The amount of liquidity owned by this position"
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthInside0LastX64",
            "docs": [
              "The token_0 fee growth per unit of liquidity as of the last update to liquidity or fees owed"
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthInside1LastX64",
            "docs": [
              "The token_1 fee growth per unit of liquidity as of the last update to liquidity or fees owed"
            ],
            "type": "u128"
          },
          {
            "name": "tokenFeesOwed0",
            "docs": [
              "The fees owed to the position owner in token_0"
            ],
            "type": "u64"
          },
          {
            "name": "tokenFeesOwed1",
            "docs": [
              "The fees owed to the position owner in token_1"
            ],
            "type": "u64"
          },
          {
            "name": "rewardGrowthInside",
            "docs": [
              "The reward growth per unit of liquidity as of the last update to liquidity"
            ],
            "type": {
              "array": [
                "u128",
                3
              ]
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                8
              ]
            }
          }
        ]
      }
    },
    {
      "name": "tickArrayState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolId",
            "type": "publicKey"
          },
          {
            "name": "startTickIndex",
            "type": "i32"
          },
          {
            "name": "ticks",
            "type": {
              "array": [
                {
                  "defined": "TickState"
                },
                60
              ]
            }
          },
          {
            "name": "initializedTickCount",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                115
              ]
            }
          }
        ]
      }
    },
    {
      "name": "tickArrayBitmapExtension",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolId",
            "type": "publicKey"
          },
          {
            "name": "positiveTickArrayBitmap",
            "docs": [
              "Packed initialized tick array state for start_tick_index is positive"
            ],
            "type": {
              "array": [
                {
                  "array": [
                    "u64",
                    8
                  ]
                },
                14
              ]
            }
          },
          {
            "name": "negativeTickArrayBitmap",
            "docs": [
              "Packed initialized tick array state for start_tick_index is negitive"
            ],
            "type": {
              "array": [
                {
                  "array": [
                    "u64",
                    8
                  ]
                },
                14
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitializeRewardParam",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "openTime",
            "docs": [
              "Reward open time"
            ],
            "type": "u64"
          },
          {
            "name": "endTime",
            "docs": [
              "Reward end time"
            ],
            "type": "u64"
          },
          {
            "name": "emissionsPerSecondX64",
            "docs": [
              "Token reward per second are earned per unit of liquidity"
            ],
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "Observation",
      "docs": [
        "The element of observations in ObservationState"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "blockTimestamp",
            "docs": [
              "The block timestamp of the observation"
            ],
            "type": "u32"
          },
          {
            "name": "sqrtPriceX64",
            "docs": [
              "the price of the observation timestamp, Q64.64"
            ],
            "type": "u128"
          },
          {
            "name": "cumulativeTimePriceX64",
            "docs": [
              "the cumulative of price during the duration time, Q64.64"
            ],
            "type": "u128"
          },
          {
            "name": "padding",
            "docs": [
              "padding for feature update"
            ],
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "PositionRewardInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "growthInsideLastX64",
            "type": "u128"
          },
          {
            "name": "rewardAmountOwed",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "RewardInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rewardState",
            "docs": [
              "Reward state"
            ],
            "type": "u8"
          },
          {
            "name": "openTime",
            "docs": [
              "Reward open time"
            ],
            "type": "u64"
          },
          {
            "name": "endTime",
            "docs": [
              "Reward end time"
            ],
            "type": "u64"
          },
          {
            "name": "lastUpdateTime",
            "docs": [
              "Reward last update time"
            ],
            "type": "u64"
          },
          {
            "name": "emissionsPerSecondX64",
            "docs": [
              "Q64.64 number indicates how many tokens per second are earned per unit of liquidity."
            ],
            "type": "u128"
          },
          {
            "name": "rewardTotalEmissioned",
            "docs": [
              "The total amount of reward emissioned"
            ],
            "type": "u64"
          },
          {
            "name": "rewardClaimed",
            "docs": [
              "The total amount of claimed reward"
            ],
            "type": "u64"
          },
          {
            "name": "tokenMint",
            "docs": [
              "Reward token mint."
            ],
            "type": "publicKey"
          },
          {
            "name": "tokenVault",
            "docs": [
              "Reward vault token account."
            ],
            "type": "publicKey"
          },
          {
            "name": "authority",
            "docs": [
              "The owner that has permission to set reward param"
            ],
            "type": "publicKey"
          },
          {
            "name": "rewardGrowthGlobalX64",
            "docs": [
              "Q64.64 number that tracks the total tokens earned per unit of liquidity since the reward",
              "emissions were turned on."
            ],
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "TickState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tick",
            "type": "i32"
          },
          {
            "name": "liquidityNet",
            "docs": [
              "Amount of net liquidity added (subtracted) when tick is crossed from left to right (right to left)"
            ],
            "type": "i128"
          },
          {
            "name": "liquidityGross",
            "docs": [
              "The total position liquidity that references this tick"
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthOutside0X64",
            "docs": [
              "Fee growth per unit of liquidity on the _other_ side of this tick (relative to the current tick)",
              "only has relative meaning, not absolute — the value depends on when the tick is initialized"
            ],
            "type": "u128"
          },
          {
            "name": "feeGrowthOutside1X64",
            "type": "u128"
          },
          {
            "name": "rewardGrowthsOutsideX64",
            "type": {
              "array": [
                "u128",
                3
              ]
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u32",
                13
              ]
            }
          }
        ]
      }
    },
    {
      "name": "PoolStatusBitIndex",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "OpenPositionOrIncreaseLiquidity"
          },
          {
            "name": "DecreaseLiquidity"
          },
          {
            "name": "CollectFee"
          },
          {
            "name": "CollectReward"
          },
          {
            "name": "Swap"
          }
        ]
      }
    },
    {
      "name": "PoolStatusBitFlag",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Enable"
          },
          {
            "name": "Disable"
          }
        ]
      }
    },
    {
      "name": "RewardState",
      "docs": [
        "State of reward"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Uninitialized"
          },
          {
            "name": "Initialized"
          },
          {
            "name": "Opening"
          },
          {
            "name": "Ended"
          }
        ]
      }
    },
    {
      "name": "TickArryBitmap",
      "type": {
        "kind": "alias",
        "value": {
          "array": [
            "u64",
            8
          ]
        }
      }
    }
  ],
  "events": [
    {
      "name": "ConfigChangeEvent",
      "fields": [
        {
          "name": "index",
          "type": "u16",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "protocolFeeRate",
          "type": "u32",
          "index": false
        },
        {
          "name": "tradeFeeRate",
          "type": "u32",
          "index": false
        },
        {
          "name": "tickSpacing",
          "type": "u16",
          "index": false
        },
        {
          "name": "fundFeeRate",
          "type": "u32",
          "index": false
        },
        {
          "name": "fundOwner",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "CreatePersonalPositionEvent",
      "fields": [
        {
          "name": "poolState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "minter",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "nftOwner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tickLowerIndex",
          "type": "i32",
          "index": false
        },
        {
          "name": "tickUpperIndex",
          "type": "i32",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "depositAmount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "depositAmount1",
          "type": "u64",
          "index": false
        },
        {
          "name": "depositAmount0TransferFee",
          "type": "u64",
          "index": false
        },
        {
          "name": "depositAmount1TransferFee",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "IncreaseLiquidityEvent",
      "fields": [
        {
          "name": "positionNftMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "amount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount1",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount0TransferFee",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount1TransferFee",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "DecreaseLiquidityEvent",
      "fields": [
        {
          "name": "positionNftMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "decreaseAmount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "decreaseAmount1",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount1",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardAmounts",
          "type": {
            "array": [
              "u64",
              3
            ]
          },
          "index": false
        },
        {
          "name": "transferFee0",
          "type": "u64",
          "index": false
        },
        {
          "name": "transferFee1",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "LiquidityCalculateEvent",
      "fields": [
        {
          "name": "poolLiquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "poolSqrtPriceX64",
          "type": "u128",
          "index": false
        },
        {
          "name": "poolTick",
          "type": "i32",
          "index": false
        },
        {
          "name": "calcAmount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "calcAmount1",
          "type": "u64",
          "index": false
        },
        {
          "name": "tradeFeeOwed0",
          "type": "u64",
          "index": false
        },
        {
          "name": "tradeFeeOwed1",
          "type": "u64",
          "index": false
        },
        {
          "name": "transferFee0",
          "type": "u64",
          "index": false
        },
        {
          "name": "transferFee1",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "CollectPersonalFeeEvent",
      "fields": [
        {
          "name": "positionNftMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "recipientTokenAccount0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "recipientTokenAccount1",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount1",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateRewardInfosEvent",
      "fields": [
        {
          "name": "rewardGrowthGlobalX64",
          "type": {
            "array": [
              "u128",
              3
            ]
          },
          "index": false
        }
      ]
    },
    {
      "name": "PoolCreatedEvent",
      "fields": [
        {
          "name": "tokenMint0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenMint1",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tickSpacing",
          "type": "u16",
          "index": false
        },
        {
          "name": "poolState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "sqrtPriceX64",
          "type": "u128",
          "index": false
        },
        {
          "name": "tick",
          "type": "i32",
          "index": false
        },
        {
          "name": "tokenVault0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenVault1",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "CollectProtocolFeeEvent",
      "fields": [
        {
          "name": "poolState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "recipientTokenAccount0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "recipientTokenAccount1",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount1",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "SwapEvent",
      "fields": [
        {
          "name": "poolState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "sender",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAccount0",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAccount1",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount0",
          "type": "u64",
          "index": false
        },
        {
          "name": "transferFee0",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount1",
          "type": "u64",
          "index": false
        },
        {
          "name": "transferFee1",
          "type": "u64",
          "index": false
        },
        {
          "name": "zeroForOne",
          "type": "bool",
          "index": false
        },
        {
          "name": "sqrtPriceX64",
          "type": "u128",
          "index": false
        },
        {
          "name": "liquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "tick",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "LiquidityChangeEvent",
      "fields": [
        {
          "name": "poolState",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tick",
          "type": "i32",
          "index": false
        },
        {
          "name": "tickLower",
          "type": "i32",
          "index": false
        },
        {
          "name": "tickUpper",
          "type": "i32",
          "index": false
        },
        {
          "name": "liquidityBefore",
          "type": "u128",
          "index": false
        },
        {
          "name": "liquidityAfter",
          "type": "u128",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "LOK",
      "msg": "LOK"
    },
    {
      "code": 6001,
      "name": "NotApproved",
      "msg": "Not approved"
    },
    {
      "code": 6002,
      "name": "InvalidUpdateConfigFlag",
      "msg": "invalid update amm config flag"
    },
    {
      "code": 6003,
      "name": "AccountLack",
      "msg": "Account lack"
    },
    {
      "code": 6004,
      "name": "ClosePositionErr",
      "msg": "Remove liquitity, collect fees owed and reward then you can close position account"
    },
    {
      "code": 6005,
      "name": "ZeroMintAmount",
      "msg": "Minting amount should be greater than 0"
    },
    {
      "code": 6006,
      "name": "InvaildTickIndex",
      "msg": "Tick out of range"
    },
    {
      "code": 6007,
      "name": "TickInvaildOrder",
      "msg": "The lower tick must be below the upper tick"
    },
    {
      "code": 6008,
      "name": "TickLowerOverflow",
      "msg": "The tick must be greater, or equal to the minimum tick(-221818)"
    },
    {
      "code": 6009,
      "name": "TickUpperOverflow",
      "msg": "The tick must be lesser than, or equal to the maximum tick(221818)"
    },
    {
      "code": 6010,
      "name": "TickAndSpacingNotMatch",
      "msg": "tick % tick_spacing must be zero"
    },
    {
      "code": 6011,
      "name": "InvalidTickArray",
      "msg": "Invaild tick array account"
    },
    {
      "code": 6012,
      "name": "InvalidTickArrayBoundary",
      "msg": "Invaild tick array boundary"
    },
    {
      "code": 6013,
      "name": "SqrtPriceLimitOverflow",
      "msg": "Square root price limit overflow"
    },
    {
      "code": 6014,
      "name": "SqrtPriceX64",
      "msg": "sqrt_price_x64 out of range"
    },
    {
      "code": 6015,
      "name": "LiquiditySubValueErr",
      "msg": "Liquidity sub delta L must be smaller than before"
    },
    {
      "code": 6016,
      "name": "LiquidityAddValueErr",
      "msg": "Liquidity add delta L must be greater, or equal to before"
    },
    {
      "code": 6017,
      "name": "InvaildLiquidity",
      "msg": "Invaild liquidity when update position"
    },
    {
      "code": 6018,
      "name": "ForbidBothZeroForSupplyLiquidity",
      "msg": "Both token amount must not be zero while supply liquidity"
    },
    {
      "code": 6019,
      "name": "LiquidityInsufficient",
      "msg": "Liquidity insufficient"
    },
    {
      "code": 6020,
      "name": "TransactionTooOld",
      "msg": "Transaction too old"
    },
    {
      "code": 6021,
      "name": "PriceSlippageCheck",
      "msg": "Price slippage check"
    },
    {
      "code": 6022,
      "name": "TooLittleOutputReceived",
      "msg": "Too little output received"
    },
    {
      "code": 6023,
      "name": "TooMuchInputPaid",
      "msg": "Too much input paid"
    },
    {
      "code": 6024,
      "name": "InvaildSwapAmountSpecified",
      "msg": "Swap special amount can not be zero"
    },
    {
      "code": 6025,
      "name": "InvalidInputPoolVault",
      "msg": "Input pool vault is invalid"
    },
    {
      "code": 6026,
      "name": "TooSmallInputOrOutputAmount",
      "msg": "Swap input or output amount is too small"
    },
    {
      "code": 6027,
      "name": "NotEnoughTickArrayAccount",
      "msg": "Not enought tick array account"
    },
    {
      "code": 6028,
      "name": "InvalidFirstTickArrayAccount",
      "msg": "Invaild first tick array account"
    },
    {
      "code": 6029,
      "name": "InvalidRewardIndex",
      "msg": "Invalid reward index"
    },
    {
      "code": 6030,
      "name": "FullRewardInfo",
      "msg": "The init reward token reach to the max"
    },
    {
      "code": 6031,
      "name": "RewardTokenAlreadyInUse",
      "msg": "The init reward token already in use"
    },
    {
      "code": 6032,
      "name": "ExceptPoolVaultMint",
      "msg": "The reward tokens must contain one of pool vault mint except the last reward"
    },
    {
      "code": 6033,
      "name": "InvalidRewardInitParam",
      "msg": "Invalid reward init param"
    },
    {
      "code": 6034,
      "name": "InvalidRewardDesiredAmount",
      "msg": "Invalid collect reward desired amount"
    },
    {
      "code": 6035,
      "name": "InvalidRewardInputAccountNumber",
      "msg": "Invalid collect reward input account number"
    },
    {
      "code": 6036,
      "name": "InvalidRewardPeriod",
      "msg": "Invalid reward period"
    },
    {
      "code": 6037,
      "name": "NotApproveUpdateRewardEmissiones",
      "msg": "Modification of emissiones is allowed within 72 hours from the end of the previous cycle"
    },
    {
      "code": 6038,
      "name": "UnInitializedRewardInfo",
      "msg": "uninitialized reward info"
    },
    {
      "code": 6039,
      "name": "NotSupportMint",
      "msg": "Not support token_2022 mint extension"
    },
    {
      "code": 6040,
      "name": "MissingTickArrayBitmapExtensionAccount",
      "msg": "Missing tickarray bitmap extension account"
    },
    {
      "code": 6041,
      "name": "InsufficientLiquidityForDirection",
      "msg": "Insufficient liquidity for this direction"
    }
  ]
};
