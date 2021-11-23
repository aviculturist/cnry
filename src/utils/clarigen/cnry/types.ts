import { ClarityTypes, Transaction } from '@clarigen/core';

// prettier-ignore
export interface CnryContract {

  hatch: (cnryName: string, cnryStatement: string) => Transaction<bigint, bigint>;
  keepalive: (tokenId: number | bigint) => Transaction<bigint, bigint>;
  setBaseUri: (newBaseUri: string) => Transaction<boolean, bigint>;
  setHatchPrice: (newHatchPrice: number | bigint) => Transaction<boolean, bigint>;
  setKeepaliveExpiry: (tokenId: number | bigint, keepaliveExpiry: number | bigint) => Transaction<bigint, bigint>;
  setKeepalivePrice: (newKeepalivePrice: number | bigint) => Transaction<boolean, bigint>;
  setName: (tokenId: number | bigint, cnryName: string) => Transaction<bigint, bigint>;
  setProof: (tokenId: number | bigint, cnryProof: string) => Transaction<bigint, bigint>;
  setStatement: (tokenId: number | bigint, cnryStatement: string) => Transaction<bigint, bigint>;
  setUri: (tokenId: number | bigint, cnryUri: string) => Transaction<bigint, bigint>;
  setWatchPrice: (newWatchPrice: number | bigint) => Transaction<boolean, bigint>;
  transfer: (tokenId: number | bigint, sender: string, recipient: string) => Transaction<null, bigint>;
  watch: (tokenId: number | bigint) => Transaction<bigint, bigint>;
  getHatchPrice: () => Promise<bigint>;
  getKeepaliveExpiry: (tokenId: number | bigint) => Promise<ClarityTypes.Response<bigint, bigint>>;
  getKeepalivePrice: () => Promise<bigint>;
  getKeepaliveTimestamp: (tokenId: number | bigint) => Promise<ClarityTypes.Response<bigint, bigint>>;
  getLastTokenId: () => Promise<ClarityTypes.Response<bigint, null>>;
  getMetadata: (tokenId: number | bigint) => Promise<{
  "cnryKeeper": string;
  "cnryName": string;
  "cnryProof": string | null;
  "cnryStatement": string;
  "cnryUri": string | null;
  "hatchedTimestamp": bigint;
  "index": bigint;
  "keepaliveExpiry": bigint;
  "keepaliveTimestamp": bigint
    } | null>;
  getOwner: (tokenId: number | bigint) => Promise<ClarityTypes.Response<string | null, null>>;
  getTokenUri: (tokenId: number | bigint) => Promise<ClarityTypes.Response<string | null, bigint>>;
  getWatchPrice: () => Promise<bigint>;
  getWatcherCount: (tokenId: number | bigint) => Promise<ClarityTypes.Response<{
  "count": bigint
    }, null>>;
  isAlive: (tokenId: number | bigint) => Promise<ClarityTypes.Response<boolean, bigint>>;
}
