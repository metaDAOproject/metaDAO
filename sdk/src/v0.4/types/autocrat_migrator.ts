/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/autocrat_migrator.json`.
 */
export type AutocratMigrator = {
  address: "MigRDW6uxyNMDBD8fX2njCRyJC4YZk2Rx9pDUZiAESt";
  metadata: {
    name: "autocratMigrator";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "multiTransfer2";
      discriminator: [6, 45, 88, 213, 180, 15, 246, 159];
      accounts: [
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "from0";
          writable: true;
        },
        {
          name: "to0";
          writable: true;
        },
        {
          name: "from1";
          writable: true;
        },
        {
          name: "to1";
          writable: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "lamportReceiver";
          writable: true;
        }
      ];
      args: [];
    },
    {
      name: "multiTransfer4";
      discriminator: [29, 178, 202, 118, 127, 161, 104, 136];
      accounts: [
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "from0";
          writable: true;
        },
        {
          name: "to0";
          writable: true;
        },
        {
          name: "from1";
          writable: true;
        },
        {
          name: "to1";
          writable: true;
        },
        {
          name: "from2";
          writable: true;
        },
        {
          name: "to2";
          writable: true;
        },
        {
          name: "from3";
          writable: true;
        },
        {
          name: "to3";
          writable: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "lamportReceiver";
          writable: true;
        }
      ];
      args: [];
    }
  ];
};
