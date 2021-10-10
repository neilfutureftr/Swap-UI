export const RandomIdl = {
  "version": "0.0.0",
  "name": "ftrDistributor",
  "instructions": [
    {
      "name": "createUser",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializePool",
      "accounts": [
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ftrMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolFtr",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "usdcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolUsdc",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fixedRateMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolFixedRate",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "distributionAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "getFixedRate",
      "accounts": [
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolUsdc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFtr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFixedRate",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userUsdc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userFtr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userFixedRate",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "usdcToSend",
          "type": "u64"
        },
        {
          "name": "ftrToSend",
          "type": "u64"
        },
        {
          "name": "expectedNbOfContract",
          "type": "u64"
        }
      ]
    },
    {
      "name": "redeemFixedRate",
      "accounts": [
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFtr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFixedRate",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolUsdc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userFtr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userUsdc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userFixedRate",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "numberOfContractToRedeem",
          "type": "u64"
        }
      ]
    },
    {
      "name": "retreiveUsdcNdCo",
      "accounts": [
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatorAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolFtr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFixedRate",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolUsdc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creatorFtr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creatorUsdc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creatorFixedRate",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "outUsdc",
          "type": "u64"
        },
        {
          "name": "outFtr",
          "type": "u64"
        },
        {
          "name": "outFixedRate",
          "type": "u64"
        }
      ]
    },
    {
      "name": "feedUsdcNdCo",
      "accounts": [
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatorAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolFtr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFixedRate",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolUsdc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creatorFtr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creatorUsdc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creatorFixedRate",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "inUsdc",
          "type": "u64"
        },
        {
          "name": "inFtr",
          "type": "u64"
        },
        {
          "name": "inFixedRate",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updatePriceNdCo",
      "accounts": [
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatorAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolFtr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFixedRate",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolUsdc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creatorFtr",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creatorUsdc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creatorFixedRate",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ftrPerContract",
          "type": "u64"
        },
        {
          "name": "fixedRatePriceBuy",
          "type": "u64"
        },
        {
          "name": "fixedRatePriceSell",
          "type": "u64"
        },
        {
          "name": "maturityTime",
          "type": "u64"
        },
        {
          "name": "maturityPrice",
          "type": "u64"
        },
        {
          "name": "halted",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "PoolAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ftrMint",
            "type": "publicKey"
          },
          {
            "name": "poolFtr",
            "type": "publicKey"
          },
          {
            "name": "usdcMint",
            "type": "publicKey"
          },
          {
            "name": "poolUsdc",
            "type": "publicKey"
          },
          {
            "name": "fixedRateMint",
            "type": "publicKey"
          },
          {
            "name": "poolFixedRate",
            "type": "publicKey"
          },
          {
            "name": "distributionAuthority",
            "type": "publicKey"
          },
          {
            "name": "creatorAuthority",
            "type": "publicKey"
          },
          {
            "name": "ftrPerContract",
            "type": "u64"
          },
          {
            "name": "fixedRatePriceBuy",
            "type": "u64"
          },
          {
            "name": "fixedRatePriceSell",
            "type": "u64"
          },
          {
            "name": "maturityTime",
            "type": "u64"
          },
          {
            "name": "maturityPrice",
            "type": "u64"
          },
          {
            "name": "lockedFtrPool",
            "type": "u64"
          },
          {
            "name": "issuedFixedRate",
            "type": "u64"
          },
          {
            "name": "investedUsdcByUsers",
            "type": "u64"
          },
          {
            "name": "gainsUsers",
            "type": "i64"
          },
          {
            "name": "netUsdcAddedByTeam",
            "type": "u64"
          },
          {
            "name": "lastUpdateTime",
            "type": "u64"
          },
          {
            "name": "halted",
            "type": "bool"
          },
          {
            "name": "nonce",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "User",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userAuthority",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "lockedFtr",
            "type": "u64"
          },
          {
            "name": "lockedUsdc",
            "type": "u64"
          },
          {
            "name": "possessedFixedRate",
            "type": "u64"
          },
          {
            "name": "profitUser",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 300,
      "name": "IdoFuture",
      "msg": "IDO must start in the future"
    },
    {
      "code": 301,
      "name": "CheckError",
      "msg": "We get there"
    },
    {
      "code": 302,
      "name": "SeqTimes",
      "msg": "IDO times are non-sequential"
    },
    {
      "code": 303,
      "name": "ExistingVote",
      "msg": "Already existing vote please cancel before resubmitting a vote"
    },
    {
      "code": 304,
      "name": "StartIdoTime",
      "msg": "IDO has not started"
    },
    {
      "code": 305,
      "name": "EndDepositsTime",
      "msg": "Deposits period has ended"
    },
    {
      "code": 306,
      "name": "EndIdoTime",
      "msg": "IDO has ended"
    },
    {
      "code": 307,
      "name": "IdoNotOver",
      "msg": "IDO has not finished yet"
    },
    {
      "code": 308,
      "name": "LowUsdcUser",
      "msg": "Insufficient USDC in your wallet"
    },
    {
      "code": 309,
      "name": "LowUsdcPool",
      "msg": "Insufficient USDC in the pool wallet"
    },
    {
      "code": 310,
      "name": "LowFRUser",
      "msg": "Insufficient FR in your wallet"
    },
    {
      "code": 311,
      "name": "LowFRPool",
      "msg": "Insufficient FR in the pool wallet"
    },
    {
      "code": 312,
      "name": "LowFTRUser",
      "msg": "Insufficient FTR in your wallet"
    },
    {
      "code": 313,
      "name": "LowFTRPool",
      "msg": "Insufficient FTR in the pool wallet"
    },
    {
      "code": 314,
      "name": "NoVote",
      "msg": "No vote or locked funds registered at your address"
    },
    {
      "code": 315,
      "name": "LowFTR",
      "msg": "Insufficient FTR"
    },
    {
      "code": 316,
      "name": "LowRedeemable",
      "msg": "Insufficient redeemable tokens"
    },
    {
      "code": 317,
      "name": "UsdcNotEqRedeem",
      "msg": "USDC total and redeemable total don't match"
    },
    {
      "code": 318,
      "name": "InvalidNonce",
      "msg": "Given nonce is invalid"
    },
    {
      "code": 319,
      "name": "Unknown"
    }
  ]
};
