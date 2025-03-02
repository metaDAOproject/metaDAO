export type Launchpad = {
  version: "0.4.0";
  name: "launchpad";
  instructions: [
    {
      name: "initializeLaunch";
      accounts: [
        {
          name: "launch";
          isMut: true;
          isSigner: false;
        },
        {
          name: "launchSigner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "usdcVault";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenVault";
          isMut: false;
          isSigner: false;
        },
        {
          name: "creator";
          isMut: true;
          isSigner: true;
        },
        {
          name: "usdcMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "eventAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "program";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "args";
          type: {
            defined: "InitializeLaunchArgs";
          };
        }
      ];
    },
    {
      name: "startLaunch";
      accounts: [
        {
          name: "launch";
          isMut: true;
          isSigner: false;
        },
        {
          name: "creator";
          isMut: false;
          isSigner: true;
        },
        {
          name: "eventAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "program";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "fund";
      accounts: [
        {
          name: "launch";
          isMut: true;
          isSigner: false;
        },
        {
          name: "fundingRecord";
          isMut: true;
          isSigner: false;
        },
        {
          name: "launchSigner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "launchUsdcVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "funder";
          isMut: true;
          isSigner: true;
        },
        {
          name: "funderUsdcAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "eventAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "program";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "completeLaunch";
      accounts: [
        {
          name: "launch";
          isMut: true;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "launchSigner";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "launchUsdcVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "launchTokenVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "treasuryUsdcAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "ammConfig";
          isMut: true;
          isSigner: false;
          docs: [
            "Use the lowest fee pool, can see fees at https://api-v3.raydium.io/main/cpmm-config"
          ];
        },
        {
          name: "poolState";
          isMut: true;
          isSigner: true;
        },
        {
          name: "tokenMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "usdcMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "lpMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "lpVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "poolTokenVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "poolUsdcVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "createPoolFee";
          isMut: true;
          isSigner: false;
          docs: ["create pool fee account"];
        },
        {
          name: "observationState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "dao";
          isMut: true;
          isSigner: true;
        },
        {
          name: "daoTreasury";
          isMut: false;
          isSigner: false;
        },
        {
          name: "cpSwapProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "autocratProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "autocratEventAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "eventAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "program";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "refund";
      accounts: [
        {
          name: "launch";
          isMut: true;
          isSigner: false;
        },
        {
          name: "fundingRecord";
          isMut: true;
          isSigner: false;
        },
        {
          name: "launchUsdcVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "launchSigner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "funder";
          isMut: true;
          isSigner: true;
        },
        {
          name: "funderUsdcAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "eventAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "program";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "claim";
      accounts: [
        {
          name: "launch";
          isMut: true;
          isSigner: false;
        },
        {
          name: "fundingRecord";
          isMut: true;
          isSigner: false;
        },
        {
          name: "launchSigner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "launchTokenVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "funder";
          isMut: false;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "funderTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "eventAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "program";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "fundingRecord";
      type: {
        kind: "struct";
        fields: [
          {
            name: "pdaBump";
            docs: ["The PDA bump."];
            type: "u8";
          },
          {
            name: "funder";
            docs: ["The funder."];
            type: "publicKey";
          },
          {
            name: "launch";
            docs: ["The launch."];
            type: "publicKey";
          },
          {
            name: "committedAmount";
            docs: ["The amount of USDC that has been committed by the funder."];
            type: "u64";
          },
          {
            name: "seqNum";
            docs: [
              "The sequence number of this funding record. Useful for sorting events."
            ];
            type: "u64";
          }
        ];
      };
    },
    {
      name: "launch";
      type: {
        kind: "struct";
        fields: [
          {
            name: "pdaBump";
            docs: ["The PDA bump."];
            type: "u8";
          },
          {
            name: "minimumRaiseAmount";
            docs: [
              "The minimum amount of USDC that must be raised, otherwise",
              "everyone can get their USDC back."
            ];
            type: "u64";
          },
          {
            name: "creator";
            docs: ["The creator of the launch."];
            type: "publicKey";
          },
          {
            name: "launchSigner";
            docs: [
              "The launch signer address. Needed because Raydium pools need a SOL payer and this PDA can't hold SOL."
            ];
            type: "publicKey";
          },
          {
            name: "launchSignerPdaBump";
            docs: ["The PDA bump for the launch signer."];
            type: "u8";
          },
          {
            name: "launchUsdcVault";
            docs: [
              "The USDC vault that will hold the USDC raised until the launch is over."
            ];
            type: "publicKey";
          },
          {
            name: "launchTokenVault";
            docs: ["The token vault, used to send tokens to Raydium."];
            type: "publicKey";
          },
          {
            name: "tokenMint";
            docs: [
              "The token that will be minted to funders and that will control the DAO."
            ];
            type: "publicKey";
          },
          {
            name: "usdcMint";
            docs: ["The USDC mint."];
            type: "publicKey";
          },
          {
            name: "slotStarted";
            docs: ["The slot when the launch was started."];
            type: "u64";
          },
          {
            name: "totalCommittedAmount";
            docs: ["The amount of USDC that has been committed by the users."];
            type: "u64";
          },
          {
            name: "state";
            docs: ["The state of the launch."];
            type: {
              defined: "LaunchState";
            };
          },
          {
            name: "seqNum";
            docs: [
              "The sequence number of this launch. Useful for sorting events."
            ];
            type: "u64";
          },
          {
            name: "slotsForLaunch";
            docs: ["The number of slots for the launch."];
            type: "u64";
          },
          {
            name: "dao";
            docs: ["The DAO, if the launch is complete."];
            type: {
              option: "publicKey";
            };
          },
          {
            name: "daoTreasury";
            docs: [
              "The DAO treasury that USDC / LP is sent to, if the launch is complete."
            ];
            type: {
              option: "publicKey";
            };
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "CommonFields";
      type: {
        kind: "struct";
        fields: [
          {
            name: "slot";
            type: "u64";
          },
          {
            name: "unixTimestamp";
            type: "i64";
          },
          {
            name: "launchSeqNum";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "InitializeLaunchArgs";
      type: {
        kind: "struct";
        fields: [
          {
            name: "minimumRaiseAmount";
            type: "u64";
          },
          {
            name: "slotsForLaunch";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "LaunchState";
      type: {
        kind: "enum";
        variants: [
          {
            name: "Initialized";
          },
          {
            name: "Live";
          },
          {
            name: "Complete";
          },
          {
            name: "Refunding";
          }
        ];
      };
    }
  ];
  events: [
    {
      name: "LaunchInitializedEvent";
      fields: [
        {
          name: "common";
          type: {
            defined: "CommonFields";
          };
          index: false;
        },
        {
          name: "launch";
          type: "publicKey";
          index: false;
        },
        {
          name: "tokenMint";
          type: "publicKey";
          index: false;
        },
        {
          name: "creator";
          type: "publicKey";
          index: false;
        },
        {
          name: "usdcMint";
          type: "publicKey";
          index: false;
        },
        {
          name: "pdaBump";
          type: "u8";
          index: false;
        }
      ];
    },
    {
      name: "LaunchStartedEvent";
      fields: [
        {
          name: "common";
          type: {
            defined: "CommonFields";
          };
          index: false;
        },
        {
          name: "launch";
          type: "publicKey";
          index: false;
        },
        {
          name: "creator";
          type: "publicKey";
          index: false;
        },
        {
          name: "slotStarted";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "LaunchFundedEvent";
      fields: [
        {
          name: "common";
          type: {
            defined: "CommonFields";
          };
          index: false;
        },
        {
          name: "fundingRecord";
          type: "publicKey";
          index: false;
        },
        {
          name: "launch";
          type: "publicKey";
          index: false;
        },
        {
          name: "funder";
          type: "publicKey";
          index: false;
        },
        {
          name: "amount";
          type: "u64";
          index: false;
        },
        {
          name: "totalCommittedByFunder";
          type: "u64";
          index: false;
        },
        {
          name: "totalCommitted";
          type: "u64";
          index: false;
        },
        {
          name: "fundingRecordSeqNum";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "LaunchCompletedEvent";
      fields: [
        {
          name: "common";
          type: {
            defined: "CommonFields";
          };
          index: false;
        },
        {
          name: "launch";
          type: "publicKey";
          index: false;
        },
        {
          name: "finalState";
          type: {
            defined: "LaunchState";
          };
          index: false;
        },
        {
          name: "totalCommitted";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "LaunchRefundedEvent";
      fields: [
        {
          name: "common";
          type: {
            defined: "CommonFields";
          };
          index: false;
        },
        {
          name: "launch";
          type: "publicKey";
          index: false;
        },
        {
          name: "funder";
          type: "publicKey";
          index: false;
        },
        {
          name: "usdcRefunded";
          type: "u64";
          index: false;
        },
        {
          name: "fundingRecord";
          type: "publicKey";
          index: false;
        }
      ];
    },
    {
      name: "LaunchClaimEvent";
      fields: [
        {
          name: "common";
          type: {
            defined: "CommonFields";
          };
          index: false;
        },
        {
          name: "launch";
          type: "publicKey";
          index: false;
        },
        {
          name: "funder";
          type: "publicKey";
          index: false;
        },
        {
          name: "tokensClaimed";
          type: "u64";
          index: false;
        },
        {
          name: "fundingRecord";
          type: "publicKey";
          index: false;
        }
      ];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "InvalidAmount";
      msg: "Invalid amount";
    },
    {
      code: 6001;
      name: "SupplyNonZero";
      msg: "Supply must be zero";
    },
    {
      code: 6002;
      name: "InsufficientFunds";
      msg: "Insufficient funds";
    },
    {
      code: 6003;
      name: "InvalidLaunchState";
      msg: "Invalid launch state";
    },
    {
      code: 6004;
      name: "LaunchPeriodNotOver";
      msg: "Launch period not over";
    },
    {
      code: 6005;
      name: "LaunchNotRefunding";
      msg: "Launch needs to be in refunding state to get a refund";
    },
    {
      code: 6006;
      name: "LaunchNotInitialized";
      msg: "Launch must be initialized to be started";
    },
    {
      code: 6007;
      name: "FreezeAuthoritySet";
      msg: "Freeze authority can't be set on launchpad tokens";
    }
  ];
};

export const IDL: Launchpad = {
  version: "0.4.0",
  name: "launchpad",
  instructions: [
    {
      name: "initializeLaunch",
      accounts: [
        {
          name: "launch",
          isMut: true,
          isSigner: false,
        },
        {
          name: "launchSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "usdcVault",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenVault",
          isMut: false,
          isSigner: false,
        },
        {
          name: "creator",
          isMut: true,
          isSigner: true,
        },
        {
          name: "usdcMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "eventAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "program",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "args",
          type: {
            defined: "InitializeLaunchArgs",
          },
        },
      ],
    },
    {
      name: "startLaunch",
      accounts: [
        {
          name: "launch",
          isMut: true,
          isSigner: false,
        },
        {
          name: "creator",
          isMut: false,
          isSigner: true,
        },
        {
          name: "eventAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "program",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "fund",
      accounts: [
        {
          name: "launch",
          isMut: true,
          isSigner: false,
        },
        {
          name: "fundingRecord",
          isMut: true,
          isSigner: false,
        },
        {
          name: "launchSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "launchUsdcVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "funder",
          isMut: true,
          isSigner: true,
        },
        {
          name: "funderUsdcAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "eventAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "program",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "completeLaunch",
      accounts: [
        {
          name: "launch",
          isMut: true,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "launchSigner",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "launchUsdcVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "launchTokenVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "treasuryUsdcAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "ammConfig",
          isMut: true,
          isSigner: false,
          docs: [
            "Use the lowest fee pool, can see fees at https://api-v3.raydium.io/main/cpmm-config",
          ],
        },
        {
          name: "poolState",
          isMut: true,
          isSigner: true,
        },
        {
          name: "tokenMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "usdcMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lpMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "lpVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "poolTokenVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "poolUsdcVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "createPoolFee",
          isMut: true,
          isSigner: false,
          docs: ["create pool fee account"],
        },
        {
          name: "observationState",
          isMut: true,
          isSigner: false,
        },
        {
          name: "dao",
          isMut: true,
          isSigner: true,
        },
        {
          name: "daoTreasury",
          isMut: false,
          isSigner: false,
        },
        {
          name: "cpSwapProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "autocratProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "autocratEventAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "eventAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "program",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "refund",
      accounts: [
        {
          name: "launch",
          isMut: true,
          isSigner: false,
        },
        {
          name: "fundingRecord",
          isMut: true,
          isSigner: false,
        },
        {
          name: "launchUsdcVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "launchSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "funder",
          isMut: true,
          isSigner: true,
        },
        {
          name: "funderUsdcAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "eventAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "program",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "claim",
      accounts: [
        {
          name: "launch",
          isMut: true,
          isSigner: false,
        },
        {
          name: "fundingRecord",
          isMut: true,
          isSigner: false,
        },
        {
          name: "launchSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "launchTokenVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "funder",
          isMut: false,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "funderTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "eventAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "program",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "fundingRecord",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pdaBump",
            docs: ["The PDA bump."],
            type: "u8",
          },
          {
            name: "funder",
            docs: ["The funder."],
            type: "publicKey",
          },
          {
            name: "launch",
            docs: ["The launch."],
            type: "publicKey",
          },
          {
            name: "committedAmount",
            docs: ["The amount of USDC that has been committed by the funder."],
            type: "u64",
          },
          {
            name: "seqNum",
            docs: [
              "The sequence number of this funding record. Useful for sorting events.",
            ],
            type: "u64",
          },
        ],
      },
    },
    {
      name: "launch",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pdaBump",
            docs: ["The PDA bump."],
            type: "u8",
          },
          {
            name: "minimumRaiseAmount",
            docs: [
              "The minimum amount of USDC that must be raised, otherwise",
              "everyone can get their USDC back.",
            ],
            type: "u64",
          },
          {
            name: "creator",
            docs: ["The creator of the launch."],
            type: "publicKey",
          },
          {
            name: "launchSigner",
            docs: [
              "The launch signer address. Needed because Raydium pools need a SOL payer and this PDA can't hold SOL.",
            ],
            type: "publicKey",
          },
          {
            name: "launchSignerPdaBump",
            docs: ["The PDA bump for the launch signer."],
            type: "u8",
          },
          {
            name: "launchUsdcVault",
            docs: [
              "The USDC vault that will hold the USDC raised until the launch is over.",
            ],
            type: "publicKey",
          },
          {
            name: "launchTokenVault",
            docs: ["The token vault, used to send tokens to Raydium."],
            type: "publicKey",
          },
          {
            name: "tokenMint",
            docs: [
              "The token that will be minted to funders and that will control the DAO.",
            ],
            type: "publicKey",
          },
          {
            name: "usdcMint",
            docs: ["The USDC mint."],
            type: "publicKey",
          },
          {
            name: "slotStarted",
            docs: ["The slot when the launch was started."],
            type: "u64",
          },
          {
            name: "totalCommittedAmount",
            docs: ["The amount of USDC that has been committed by the users."],
            type: "u64",
          },
          {
            name: "state",
            docs: ["The state of the launch."],
            type: {
              defined: "LaunchState",
            },
          },
          {
            name: "seqNum",
            docs: [
              "The sequence number of this launch. Useful for sorting events.",
            ],
            type: "u64",
          },
          {
            name: "slotsForLaunch",
            docs: ["The number of slots for the launch."],
            type: "u64",
          },
          {
            name: "dao",
            docs: ["The DAO, if the launch is complete."],
            type: {
              option: "publicKey",
            },
          },
          {
            name: "daoTreasury",
            docs: [
              "The DAO treasury that USDC / LP is sent to, if the launch is complete.",
            ],
            type: {
              option: "publicKey",
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "CommonFields",
      type: {
        kind: "struct",
        fields: [
          {
            name: "slot",
            type: "u64",
          },
          {
            name: "unixTimestamp",
            type: "i64",
          },
          {
            name: "launchSeqNum",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "InitializeLaunchArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "minimumRaiseAmount",
            type: "u64",
          },
          {
            name: "slotsForLaunch",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "LaunchState",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Initialized",
          },
          {
            name: "Live",
          },
          {
            name: "Complete",
          },
          {
            name: "Refunding",
          },
        ],
      },
    },
  ],
  events: [
    {
      name: "LaunchInitializedEvent",
      fields: [
        {
          name: "common",
          type: {
            defined: "CommonFields",
          },
          index: false,
        },
        {
          name: "launch",
          type: "publicKey",
          index: false,
        },
        {
          name: "tokenMint",
          type: "publicKey",
          index: false,
        },
        {
          name: "creator",
          type: "publicKey",
          index: false,
        },
        {
          name: "usdcMint",
          type: "publicKey",
          index: false,
        },
        {
          name: "pdaBump",
          type: "u8",
          index: false,
        },
      ],
    },
    {
      name: "LaunchStartedEvent",
      fields: [
        {
          name: "common",
          type: {
            defined: "CommonFields",
          },
          index: false,
        },
        {
          name: "launch",
          type: "publicKey",
          index: false,
        },
        {
          name: "creator",
          type: "publicKey",
          index: false,
        },
        {
          name: "slotStarted",
          type: "u64",
          index: false,
        },
      ],
    },
    {
      name: "LaunchFundedEvent",
      fields: [
        {
          name: "common",
          type: {
            defined: "CommonFields",
          },
          index: false,
        },
        {
          name: "fundingRecord",
          type: "publicKey",
          index: false,
        },
        {
          name: "launch",
          type: "publicKey",
          index: false,
        },
        {
          name: "funder",
          type: "publicKey",
          index: false,
        },
        {
          name: "amount",
          type: "u64",
          index: false,
        },
        {
          name: "totalCommittedByFunder",
          type: "u64",
          index: false,
        },
        {
          name: "totalCommitted",
          type: "u64",
          index: false,
        },
        {
          name: "fundingRecordSeqNum",
          type: "u64",
          index: false,
        },
      ],
    },
    {
      name: "LaunchCompletedEvent",
      fields: [
        {
          name: "common",
          type: {
            defined: "CommonFields",
          },
          index: false,
        },
        {
          name: "launch",
          type: "publicKey",
          index: false,
        },
        {
          name: "finalState",
          type: {
            defined: "LaunchState",
          },
          index: false,
        },
        {
          name: "totalCommitted",
          type: "u64",
          index: false,
        },
      ],
    },
    {
      name: "LaunchRefundedEvent",
      fields: [
        {
          name: "common",
          type: {
            defined: "CommonFields",
          },
          index: false,
        },
        {
          name: "launch",
          type: "publicKey",
          index: false,
        },
        {
          name: "funder",
          type: "publicKey",
          index: false,
        },
        {
          name: "usdcRefunded",
          type: "u64",
          index: false,
        },
        {
          name: "fundingRecord",
          type: "publicKey",
          index: false,
        },
      ],
    },
    {
      name: "LaunchClaimEvent",
      fields: [
        {
          name: "common",
          type: {
            defined: "CommonFields",
          },
          index: false,
        },
        {
          name: "launch",
          type: "publicKey",
          index: false,
        },
        {
          name: "funder",
          type: "publicKey",
          index: false,
        },
        {
          name: "tokensClaimed",
          type: "u64",
          index: false,
        },
        {
          name: "fundingRecord",
          type: "publicKey",
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidAmount",
      msg: "Invalid amount",
    },
    {
      code: 6001,
      name: "SupplyNonZero",
      msg: "Supply must be zero",
    },
    {
      code: 6002,
      name: "InsufficientFunds",
      msg: "Insufficient funds",
    },
    {
      code: 6003,
      name: "InvalidLaunchState",
      msg: "Invalid launch state",
    },
    {
      code: 6004,
      name: "LaunchPeriodNotOver",
      msg: "Launch period not over",
    },
    {
      code: 6005,
      name: "LaunchNotRefunding",
      msg: "Launch needs to be in refunding state to get a refund",
    },
    {
      code: 6006,
      name: "LaunchNotInitialized",
      msg: "Launch must be initialized to be started",
    },
    {
      code: 6007,
      name: "FreezeAuthoritySet",
      msg: "Freeze authority can't be set on launchpad tokens",
    },
  ],
};
