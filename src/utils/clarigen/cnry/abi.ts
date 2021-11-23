import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const CnryInterface: ClarityAbi = {
  "functions": [
    {
      "access": "private",
      "args": [
        {
          "name": "id",
          "type": "uint128"
        }
      ],
      "name": "get-base-uri",
      "outputs": {
        "type": {
          "string-ascii": {
            "length": 210
          }
        }
      }
    },
    {
      "access": "private",
      "args": [],
      "name": "get-time",
      "outputs": {
        "type": "uint128"
      }
    },
    {
      "access": "private",
      "args": [
        {
          "name": "tokenId",
          "type": "uint128"
        }
      ],
      "name": "is-owner",
      "outputs": {
        "type": "bool"
      }
    },
    {
      "access": "private",
      "args": [
        {
          "name": "keepaliveTimestamp",
          "type": "uint128"
        },
        {
          "name": "keepaliveExpiry",
          "type": "uint128"
        },
        {
          "name": "tokenId",
          "type": "uint128"
        }
      ],
      "name": "is-within-keepaliveExpiry",
      "outputs": {
        "type": "bool"
      }
    },
    {
      "access": "public",
      "args": [
        {
          "name": "cnryName",
          "type": {
            "string-utf8": {
              "length": 32
            }
          }
        },
        {
          "name": "cnryStatement",
          "type": {
            "string-utf8": {
              "length": 280
            }
          }
        }
      ],
      "name": "hatch",
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
      "access": "public",
      "args": [
        {
          "name": "tokenId",
          "type": "uint128"
        }
      ],
      "name": "keepalive",
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
      "access": "public",
      "args": [
        {
          "name": "new-base-uri",
          "type": {
            "string-ascii": {
              "length": 210
            }
          }
        }
      ],
      "name": "set-base-uri",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "bool"
          }
        }
      }
    },
    {
      "access": "public",
      "args": [
        {
          "name": "new-hatchPrice",
          "type": "uint128"
        }
      ],
      "name": "set-hatchPrice",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "bool"
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
          "name": "keepaliveExpiry",
          "type": "uint128"
        }
      ],
      "name": "set-keepaliveExpiry",
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
      "access": "public",
      "args": [
        {
          "name": "new-keepalivePrice",
          "type": "uint128"
        }
      ],
      "name": "set-keepalivePrice",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "bool"
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
          "name": "cnryName",
          "type": {
            "string-utf8": {
              "length": 32
            }
          }
        }
      ],
      "name": "set-name",
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
      "access": "public",
      "args": [
        {
          "name": "tokenId",
          "type": "uint128"
        },
        {
          "name": "cnryProof",
          "type": {
            "string-ascii": {
              "length": 210
            }
          }
        }
      ],
      "name": "set-proof",
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
      "access": "public",
      "args": [
        {
          "name": "tokenId",
          "type": "uint128"
        },
        {
          "name": "cnryStatement",
          "type": {
            "string-utf8": {
              "length": 280
            }
          }
        }
      ],
      "name": "set-statement",
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
      "access": "public",
      "args": [
        {
          "name": "tokenId",
          "type": "uint128"
        },
        {
          "name": "cnryUri",
          "type": {
            "string-ascii": {
              "length": 210
            }
          }
        }
      ],
      "name": "set-uri",
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
      "access": "public",
      "args": [
        {
          "name": "new-watchPrice",
          "type": "uint128"
        }
      ],
      "name": "set-watchPrice",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "bool"
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
          "name": "tokenId",
          "type": "uint128"
        }
      ],
      "name": "watch",
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
      "name": "get-hatchPrice",
      "outputs": {
        "type": "uint128"
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
      "name": "get-keepaliveExpiry",
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
      "name": "get-keepalivePrice",
      "outputs": {
        "type": "uint128"
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
      "name": "get-keepaliveTimestamp",
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
                "name": "cnryKeeper",
                "type": "principal"
              },
              {
                "name": "cnryName",
                "type": {
                  "string-utf8": {
                    "length": 32
                  }
                }
              },
              {
                "name": "cnryProof",
                "type": {
                  "optional": {
                    "string-ascii": {
                      "length": 210
                    }
                  }
                }
              },
              {
                "name": "cnryStatement",
                "type": {
                  "string-utf8": {
                    "length": 280
                  }
                }
              },
              {
                "name": "cnryUri",
                "type": {
                  "optional": {
                    "string-ascii": {
                      "length": 210
                    }
                  }
                }
              },
              {
                "name": "hatchedTimestamp",
                "type": "uint128"
              },
              {
                "name": "index",
                "type": "uint128"
              },
              {
                "name": "keepaliveExpiry",
                "type": "uint128"
              },
              {
                "name": "keepaliveTimestamp",
                "type": "uint128"
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
          "name": "tokenId",
          "type": "uint128"
        }
      ],
      "name": "get-token-uri",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
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
    },
    {
      "access": "read_only",
      "args": [],
      "name": "get-watchPrice",
      "outputs": {
        "type": "uint128"
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
      "name": "get-watcher-count",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": {
              "tuple": [
                {
                  "name": "count",
                  "type": "uint128"
                }
              ]
            }
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
      "name": "is-alive",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "bool"
          }
        }
      }
    }
  ],
  "fungible_tokens": [],
  "maps": [
    {
      "key": {
        "tuple": [
          {
            "name": "tokenId",
            "type": "uint128"
          }
        ]
      },
      "name": "cnrys",
      "value": {
        "tuple": [
          {
            "name": "cnryKeeper",
            "type": "principal"
          },
          {
            "name": "cnryName",
            "type": {
              "string-utf8": {
                "length": 32
              }
            }
          },
          {
            "name": "cnryProof",
            "type": {
              "optional": {
                "string-ascii": {
                  "length": 210
                }
              }
            }
          },
          {
            "name": "cnryStatement",
            "type": {
              "string-utf8": {
                "length": 280
              }
            }
          },
          {
            "name": "cnryUri",
            "type": {
              "optional": {
                "string-ascii": {
                  "length": 210
                }
              }
            }
          },
          {
            "name": "hatchedTimestamp",
            "type": "uint128"
          },
          {
            "name": "index",
            "type": "uint128"
          },
          {
            "name": "keepaliveExpiry",
            "type": "uint128"
          },
          {
            "name": "keepaliveTimestamp",
            "type": "uint128"
          }
        ]
      }
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
      "name": "watcher-count",
      "value": {
        "tuple": [
          {
            "name": "count",
            "type": "uint128"
          }
        ]
      }
    }
  ],
  "non_fungible_tokens": [
    {
      "name": "CNRY",
      "type": "uint128"
    }
  ],
  "variables": [
    {
      "access": "constant",
      "name": "AVICULTURIST",
      "type": "principal"
    },
    {
      "access": "constant",
      "name": "DEFAULT_KEEPALIVE_EXPIRY",
      "type": "uint128"
    },
    {
      "access": "constant",
      "name": "ERR_CNRY_EXISTS",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_CNRY_EXPIRED",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_CONTRACT_CALL",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_COUNT",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_FAILED_TO_TRANSFER",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_INSUFFICIENT_BALANCE",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_NOT_AUTHORIZED",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_NOT_FOUND",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "variable",
      "name": "base-uri",
      "type": {
        "string-ascii": {
          "length": 210
        }
      }
    },
    {
      "access": "variable",
      "name": "hatchPrice",
      "type": "uint128"
    },
    {
      "access": "variable",
      "name": "keepalivePrice",
      "type": "uint128"
    },
    {
      "access": "variable",
      "name": "lastId",
      "type": "uint128"
    },
    {
      "access": "variable",
      "name": "watchPrice",
      "type": "uint128"
    }
  ]
};
