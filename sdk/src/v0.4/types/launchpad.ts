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
          name: "dao";
          isMut: false;
          isSigner: false;
        },
        {
          name: "daoTreasury";
          isMut: false;
          isSigner: false;
        },
        {
          name: "treasuryUsdcAccount";
          isMut: false;
          isSigner: false;
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
      name: "fund";
      accounts: [
        {
          name: "launch";
          isMut: true;
          isSigner: false;
        },
        {
          name: "usdcVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenMint";
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
          name: "funderTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
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
          name: "usdcVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "treasuryUsdcAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "launch";
      type: {
        kind: "struct";
        fields: [
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
            name: "usdcVault";
            docs: [
              "The USDC vault that will hold the USDC raised until the launch is over."
            ];
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
            name: "pdaBump";
            docs: ["The PDA bump."];
            type: "u8";
          },
          {
            name: "dao";
            docs: [
              "The DAO that will receive the USDC raised once the launch is over."
            ];
            type: "publicKey";
          },
          {
            name: "daoTreasury";
            docs: ["The DAO's treasury address."];
            type: "publicKey";
          },
          {
            name: "treasuryUsdcAccount";
            docs: ["The DAO treasury's USDC account."];
            type: "publicKey";
          },
          {
            name: "committedAmount";
            docs: ["The amount of USDC that has been committed by the users."];
            type: "u64";
          },
          {
            name: "seqNum";
            docs: [
              "The sequence number of this launch. Useful for sorting events."
            ];
            type: "u64";
          },
          {
            name: "state";
            type: {
              defined: "LaunchState";
            };
          },
          {
            name: "slotInitialized";
            type: "u64";
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
          name: "dao";
          type: "publicKey";
          index: false;
        },
        {
          name: "daoTreasury";
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
      name: "InvalidLaunchState";
      msg: "Invalid launch state";
    },
    {
      code: 6003;
      name: "LaunchPeriodNotOver";
      msg: "Launch period not over";
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
          name: "dao",
          isMut: false,
          isSigner: false,
        },
        {
          name: "daoTreasury",
          isMut: false,
          isSigner: false,
        },
        {
          name: "treasuryUsdcAccount",
          isMut: false,
          isSigner: false,
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
      name: "fund",
      accounts: [
        {
          name: "launch",
          isMut: true,
          isSigner: false,
        },
        {
          name: "usdcVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenMint",
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
          name: "funderTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
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
          name: "usdcVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "treasuryUsdcAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "launch",
      type: {
        kind: "struct",
        fields: [
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
            name: "usdcVault",
            docs: [
              "The USDC vault that will hold the USDC raised until the launch is over.",
            ],
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
            name: "pdaBump",
            docs: ["The PDA bump."],
            type: "u8",
          },
          {
            name: "dao",
            docs: [
              "The DAO that will receive the USDC raised once the launch is over.",
            ],
            type: "publicKey",
          },
          {
            name: "daoTreasury",
            docs: ["The DAO's treasury address."],
            type: "publicKey",
          },
          {
            name: "treasuryUsdcAccount",
            docs: ["The DAO treasury's USDC account."],
            type: "publicKey",
          },
          {
            name: "committedAmount",
            docs: ["The amount of USDC that has been committed by the users."],
            type: "u64",
          },
          {
            name: "seqNum",
            docs: [
              "The sequence number of this launch. Useful for sorting events.",
            ],
            type: "u64",
          },
          {
            name: "state",
            type: {
              defined: "LaunchState",
            },
          },
          {
            name: "slotInitialized",
            type: "u64",
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
        ],
      },
    },
    {
      name: "LaunchState",
      type: {
        kind: "enum",
        variants: [
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
          name: "dao",
          type: "publicKey",
          index: false,
        },
        {
          name: "daoTreasury",
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
      name: "InvalidLaunchState",
      msg: "Invalid launch state",
    },
    {
      code: 6003,
      name: "LaunchPeriodNotOver",
      msg: "Launch period not over",
    },
  ],
};
