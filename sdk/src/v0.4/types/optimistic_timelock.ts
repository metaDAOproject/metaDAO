/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/optimistic_timelock.json`.
 */
export type OptimisticTimelock = {
  address: "tiME1hz9F5C5ZecbvE5z6Msjy8PKfTqo1UuRYXfndKF";
  metadata: {
    name: "optimisticTimelock";
    version: "0.3.0";
    spec: "0.1.0";
    description: "Optimistic timelock";
    repository: "https://github.com/metaDAOproject/futarchy";
  };
  instructions: [
    {
      name: "addOptimisticProposer";
      discriminator: [93, 205, 243, 6, 64, 133, 100, 83];
      accounts: [
        {
          name: "timelockSigner";
          signer: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "timelock";
              }
            ];
          };
        },
        {
          name: "timelock";
          writable: true;
        }
      ];
      args: [
        {
          name: "enqueuer";
          type: "pubkey";
        }
      ];
    },
    {
      name: "addTransaction";
      discriminator: [48, 96, 174, 112, 81, 30, 239, 89];
      accounts: [
        {
          name: "transactionBatchAuthority";
          signer: true;
          relations: ["transactionBatch"];
        },
        {
          name: "transactionBatch";
          writable: true;
        }
      ];
      args: [
        {
          name: "programId";
          type: "pubkey";
        },
        {
          name: "accounts";
          type: {
            vec: {
              defined: {
                name: "transactionAccount";
              };
            };
          };
        },
        {
          name: "data";
          type: "bytes";
        }
      ];
    },
    {
      name: "cancelTransactionBatch";
      discriminator: [190, 143, 202, 59, 12, 129, 248, 187];
      accounts: [
        {
          name: "authority";
          signer: true;
        },
        {
          name: "timelock";
          writable: true;
          relations: ["transactionBatch"];
        },
        {
          name: "transactionBatch";
          writable: true;
        }
      ];
      args: [];
    },
    {
      name: "createTimelock";
      discriminator: [243, 10, 110, 170, 71, 251, 210, 87];
      accounts: [
        {
          name: "timelockSigner";
          pda: {
            seeds: [
              {
                kind: "account";
                path: "timelock";
              }
            ];
          };
        },
        {
          name: "timelock";
          writable: true;
          signer: true;
        }
      ];
      args: [
        {
          name: "authority";
          type: "pubkey";
        },
        {
          name: "delayInSlots";
          type: "u64";
        },
        {
          name: "enqueuers";
          type: {
            vec: "pubkey";
          };
        },
        {
          name: "enqueuerCooldownSlots";
          type: "u64";
        }
      ];
    },
    {
      name: "createTransactionBatch";
      discriminator: [68, 250, 48, 173, 135, 15, 30, 147];
      accounts: [
        {
          name: "transactionBatchAuthority";
          signer: true;
        },
        {
          name: "timelock";
        },
        {
          name: "transactionBatch";
          writable: true;
          signer: true;
        }
      ];
      args: [];
    },
    {
      name: "enqueueTransactionBatch";
      discriminator: [3, 107, 2, 52, 126, 155, 230, 210];
      accounts: [
        {
          name: "authority";
          signer: true;
        },
        {
          name: "timelock";
          writable: true;
          relations: ["transactionBatch"];
        },
        {
          name: "transactionBatch";
          writable: true;
        }
      ];
      args: [];
    },
    {
      name: "executeTransactionBatch";
      discriminator: [142, 236, 149, 53, 195, 112, 253, 222];
      accounts: [
        {
          name: "timelockSigner";
          pda: {
            seeds: [
              {
                kind: "account";
                path: "timelock";
              }
            ];
          };
        },
        {
          name: "timelock";
          relations: ["transactionBatch"];
        },
        {
          name: "transactionBatch";
          writable: true;
        }
      ];
      args: [];
    },
    {
      name: "removeOptimisticProposer";
      discriminator: [227, 181, 91, 29, 1, 230, 136, 104];
      accounts: [
        {
          name: "timelockSigner";
          signer: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "timelock";
              }
            ];
          };
        },
        {
          name: "timelock";
          writable: true;
        }
      ];
      args: [
        {
          name: "optimisticProposer";
          type: "pubkey";
        }
      ];
    },
    {
      name: "sealTransactionBatch";
      discriminator: [54, 214, 150, 11, 55, 140, 173, 49];
      accounts: [
        {
          name: "transactionBatchAuthority";
          signer: true;
          relations: ["transactionBatch"];
        },
        {
          name: "transactionBatch";
          writable: true;
        }
      ];
      args: [];
    },
    {
      name: "setAuthority";
      discriminator: [133, 250, 37, 21, 110, 163, 26, 121];
      accounts: [
        {
          name: "timelockSigner";
          signer: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "timelock";
              }
            ];
          };
        },
        {
          name: "timelock";
          writable: true;
        }
      ];
      args: [
        {
          name: "authority";
          type: "pubkey";
        }
      ];
    },
    {
      name: "setDelayInSlots";
      discriminator: [85, 96, 182, 146, 20, 10, 5, 59];
      accounts: [
        {
          name: "timelockSigner";
          signer: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "timelock";
              }
            ];
          };
        },
        {
          name: "timelock";
          writable: true;
        }
      ];
      args: [
        {
          name: "delayInSlots";
          type: "u64";
        }
      ];
    },
    {
      name: "setOptimisticProposerCooldownSlots";
      discriminator: [32, 223, 131, 84, 138, 12, 56, 120];
      accounts: [
        {
          name: "timelockSigner";
          signer: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "timelock";
              }
            ];
          };
        },
        {
          name: "timelock";
          writable: true;
        }
      ];
      args: [
        {
          name: "cooldownSlots";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "timelock";
      discriminator: [189, 33, 78, 75, 205, 31, 4, 177];
    },
    {
      name: "transactionBatch";
      discriminator: [39, 221, 32, 82, 209, 112, 56, 68];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "notReady";
      msg: "This transaction is not yet ready to be executed";
    },
    {
      code: 6001;
      name: "cannotAddTransactions";
      msg: "Can only add instructions when transaction batch status is `Created`";
    },
    {
      code: 6002;
      name: "cannotSealTransactionBatch";
      msg: "Can only seal the transaction batch when status is `Created`";
    },
    {
      code: 6003;
      name: "cannotEnqueueTransactionBatch";
      msg: "Can only enqueue the timelock running once the status is `Sealed`";
    },
    {
      code: 6004;
      name: "cannotCancelTimelock";
      msg: "Can only cancel the transactions if the status `Enqueued`";
    },
    {
      code: 6005;
      name: "canOnlyCancelDuringTimelockPeriod";
      msg: "Can only cancel the transactions during the timelock period";
    },
    {
      code: 6006;
      name: "cannotExecuteTransactions";
      msg: "Can only execute the transactions if the status is `Enqueued`";
    },
    {
      code: 6007;
      name: "noAuthority";
      msg: "The signer is neither the timelock authority nor an optimistic proposer";
    },
    {
      code: 6008;
      name: "insufficientPermissions";
      msg: "Optimistic proposers can't cancel transaction batches enqueued by the timelock authority";
    },
    {
      code: 6009;
      name: "optimisticProposerCooldown";
      msg: "This optimistic proposer is still in its cooldown period";
    }
  ];
  types: [
    {
      name: "authorityType";
      type: {
        kind: "enum";
        variants: [
          {
            name: "optimisticProposer";
          },
          {
            name: "timelockAuthority";
          }
        ];
      };
    },
    {
      name: "optimisticProposer";
      type: {
        kind: "struct";
        fields: [
          {
            name: "pubkey";
            type: "pubkey";
          },
          {
            name: "lastSlotEnqueued";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "timelock";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "signerBump";
            type: "u8";
          },
          {
            name: "delayInSlots";
            type: "u64";
          },
          {
            name: "optimisticProposers";
            type: {
              vec: {
                defined: {
                  name: "optimisticProposer";
                };
              };
            };
          },
          {
            name: "optimisticProposerCooldownSlots";
            docs: [
              "The cooldown period for enqueuers to prevent spamming the timelock."
            ];
            type: "u64";
          }
        ];
      };
    },
    {
      name: "transaction";
      type: {
        kind: "struct";
        fields: [
          {
            name: "programId";
            type: "pubkey";
          },
          {
            name: "accounts";
            type: {
              vec: {
                defined: {
                  name: "transactionAccount";
                };
              };
            };
          },
          {
            name: "data";
            type: "bytes";
          },
          {
            name: "didExecute";
            type: "bool";
          }
        ];
      };
    },
    {
      name: "transactionAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "pubkey";
            type: "pubkey";
          },
          {
            name: "isSigner";
            type: "bool";
          },
          {
            name: "isWritable";
            type: "bool";
          }
        ];
      };
    },
    {
      name: "transactionBatch";
      type: {
        kind: "struct";
        fields: [
          {
            name: "status";
            type: {
              defined: {
                name: "transactionBatchStatus";
              };
            };
          },
          {
            name: "transactions";
            type: {
              vec: {
                defined: {
                  name: "transaction";
                };
              };
            };
          },
          {
            name: "timelock";
            type: "pubkey";
          },
          {
            name: "enqueuedSlot";
            type: "u64";
          },
          {
            name: "transactionBatchAuthority";
            type: "pubkey";
          },
          {
            name: "enqueuerType";
            type: {
              defined: {
                name: "authorityType";
              };
            };
          }
        ];
      };
    },
    {
      name: "transactionBatchStatus";
      type: {
        kind: "enum";
        variants: [
          {
            name: "created";
          },
          {
            name: "sealed";
          },
          {
            name: "enqueued";
          },
          {
            name: "cancelled";
          },
          {
            name: "executed";
          }
        ];
      };
    }
  ];
};
