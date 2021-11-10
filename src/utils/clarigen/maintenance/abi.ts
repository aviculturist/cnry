import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const MaintenanceInterface: ClarityAbi = {
  "functions": [
    {
      "access": "public",
      "args": [
        {
          "name": "commitHash",
          "type": {
            "string-ascii": {
              "length": 7
            }
          }
        },
        {
          "name": "maintenance",
          "type": "bool"
        },
        {
          "name": "wall",
          "type": {
            "string-ascii": {
              "length": 280
            }
          }
        }
      ],
      "name": "addMaintenanceMode",
      "outputs": {
        "type": {
          "response": {
            "error": {
              "response": {
                "error": "uint128",
                "ok": "none"
              }
            },
            "ok": "uint128"
          }
        }
      }
    },
    {
      "access": "public",
      "args": [
        {
          "name": "commitHash",
          "type": {
            "string-ascii": {
              "length": 7
            }
          }
        },
        {
          "name": "maintenance",
          "type": "bool"
        }
      ],
      "name": "setMaintenance",
      "outputs": {
        "type": {
          "response": {
            "error": {
              "response": {
                "error": "uint128",
                "ok": "none"
              }
            },
            "ok": "uint128"
          }
        }
      }
    },
    {
      "access": "public",
      "args": [
        {
          "name": "commitHash",
          "type": {
            "string-ascii": {
              "length": 7
            }
          }
        },
        {
          "name": "wall",
          "type": {
            "string-ascii": {
              "length": 280
            }
          }
        }
      ],
      "name": "setWall",
      "outputs": {
        "type": {
          "response": {
            "error": {
              "response": {
                "error": "uint128",
                "ok": "none"
              }
            },
            "ok": "uint128"
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "commitHash",
          "type": {
            "string-ascii": {
              "length": 7
            }
          }
        }
      ],
      "name": "getMaintenanceMode",
      "outputs": {
        "type": {
          "optional": {
            "tuple": [
              {
                "name": "maintenance",
                "type": "bool"
              },
              {
                "name": "wall",
                "type": {
                  "string-ascii": {
                    "length": 280
                  }
                }
              }
            ]
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
            "name": "commitHash",
            "type": {
              "string-ascii": {
                "length": 7
              }
            }
          }
        ]
      },
      "name": "maintenanceMode",
      "value": {
        "tuple": [
          {
            "name": "maintenance",
            "type": "bool"
          },
          {
            "name": "wall",
            "type": {
              "string-ascii": {
                "length": 280
              }
            }
          }
        ]
      }
    }
  ],
  "non_fungible_tokens": [],
  "variables": [
    {
      "access": "constant",
      "name": "CONTRACT_OWNER",
      "type": "principal"
    },
    {
      "access": "constant",
      "name": "ERR_FOUND",
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
    }
  ]
};
