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
          isMut: true;
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
          name: "usdcMint";
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
            type: "u64";
          },
          {
            name: "maximumRaiseAmount";
            type: "u64";
          },
          {
            name: "isApproved";
            type: "bool";
          },
          {
            name: "creator";
            type: "publicKey";
          },
          {
            name: "usdcVault";
            type: "publicKey";
          },
          {
            name: "committedAmount";
            type: "u64";
          },
          {
            name: "pdaBump";
            type: "u8";
          },
          {
            name: "dao";
            type: "publicKey";
          },
          {
            name: "daoTreasury";
            type: "publicKey";
          }
        ];
      };
    }
  ];
  types: [
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
            name: "maximumRaiseAmount";
            type: "u64";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "InvalidRaiseAmount";
      msg: "Maximum raise amount must be greater than minimum";
    },
    {
      code: 6001;
      name: "LaunchNotApproved";
      msg: "Launch has not been approved";
    },
    {
      code: 6002;
      name: "ExceedsMaximumRaise";
      msg: "Amount would exceed maximum raise amount";
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
          isMut: true,
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
          name: "usdcMint",
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
  ],
  accounts: [
    {
      name: "launch",
      type: {
        kind: "struct",
        fields: [
          {
            name: "minimumRaiseAmount",
            type: "u64",
          },
          {
            name: "maximumRaiseAmount",
            type: "u64",
          },
          {
            name: "isApproved",
            type: "bool",
          },
          {
            name: "creator",
            type: "publicKey",
          },
          {
            name: "usdcVault",
            type: "publicKey",
          },
          {
            name: "committedAmount",
            type: "u64",
          },
          {
            name: "pdaBump",
            type: "u8",
          },
          {
            name: "dao",
            type: "publicKey",
          },
          {
            name: "daoTreasury",
            type: "publicKey",
          },
        ],
      },
    },
  ],
  types: [
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
            name: "maximumRaiseAmount",
            type: "u64",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidRaiseAmount",
      msg: "Maximum raise amount must be greater than minimum",
    },
    {
      code: 6001,
      name: "LaunchNotApproved",
      msg: "Launch has not been approved",
    },
    {
      code: 6002,
      name: "ExceedsMaximumRaise",
      msg: "Amount would exceed maximum raise amount",
    },
  ],
};
