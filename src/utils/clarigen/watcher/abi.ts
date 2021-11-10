import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const WatcherInterface: ClarityAbi = {
  "functions": [
    {
      "access": "private",
      "args": [],
      "name": "called-from-watched",
      "outputs": {
        "type": "bool"
      }
    },
    {
      "access": "public",
      "args": [],
      "name": "add-watched-contract",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "principal"
          }
        }
      }
    },
    {
      "access": "public",
      "args": [],
      "name": "get-watched-contract",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": {
              "optional": "principal"
            }
          }
        }
      }
    },
    {
      "access": "public",
      "args": [
        {
          "name": "tokenId",
          "type": "uint128"
        },
        {
          "name": "sender",
          "type": "principal"
        },
        {
          "name": "recipient",
          "type": "principal"
        }
      ],
      "name": "transfer",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "none"
          }
        }
      }
    },
    {
      "access": "public",
      "args": [
        {
          "name": "contract-name",
          "type": {
            "string-ascii": {
              "length": 80
            }
          }
        },
        {
          "name": "tokenId",
          "type": "uint128"
        },
        {
          "name": "watcherAddress",
          "type": "principal"
        }
      ],
      "name": "watch-token",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "uint128"
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [],
      "name": "get-last-token-id",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": "uint128"
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "tokenId",
          "type": "uint128"
        }
      ],
      "name": "get-metadata",
      "outputs": {
        "type": {
          "optional": {
            "tuple": [
              {
                "name": "contractTokenId",
                "type": "uint128"
              },
              {
                "name": "watcherAddress",
                "type": "principal"
              }
            ]
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "tokenId",
          "type": "uint128"
        }
      ],
      "name": "get-owner",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": {
              "optional": "principal"
            }
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "id",
          "type": "uint128"
        }
      ],
      "name": "get-token-uri",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": {
              "optional": {
                "string-ascii": {
                  "length": 210
                }
              }
            }
          }
        }
      }
    }
  ],
  "fungible_tokens": [],
  "maps": [
    {
      "key": "bool",
      "name": "watched-contract",
      "value": "principal"
    },
    {
      "key": {
        "tuple": [
          {
            "name": "tokenId",
            "type": "uint128"
          }
        ]
      },
      "name": "watchers",
      "value": {
        "tuple": [
          {
            "name": "contractTokenId",
            "type": "uint128"
          },
          {
            "name": "watcherAddress",
            "type": "principal"
          }
        ]
      }
    }
  ],
  "non_fungible_tokens": [
    {
      "name": "WATCHER",
      "type": "uint128"
    }
  ],
  "variables": [
    {
      "access": "constant",
      "name": "CONTRACT_OWNER",
      "type": "principal"
    },
    {
      "access": "constant",
      "name": "ERR-NOT_CALLED_FROM_CONTRACT",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_WATCHED_CONTRACT_SET",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "variable",
      "name": "baseUri",
      "type": {
        "string-ascii": {
          "length": 210
        }
      }
    },
    {
      "access": "variable",
      "name": "lastId",
      "type": "uint128"
    }
  ]
};
