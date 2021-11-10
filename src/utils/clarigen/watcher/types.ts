import { ClarityTypes, Transaction } from '@clarigen/core';

// prettier-ignore
export interface WatcherContract {

  addWatchedContract: () => Transaction<string, bigint>;
  getWatchedContract: () => Transaction<string | null, null>;
  transfer: (tokenId: number | bigint, sender: string, recipient: string) => Transaction<null, bigint>;
  watchToken: (contractName: string, tokenId: number | bigint, watcherAddress: string) => Transaction<bigint, bigint>;
  getLastTokenId: () => Promise<ClarityTypes.Response<bigint, null>>;
  getMetadata: (tokenId: number | bigint) => Promise<{
  "contractTokenId": bigint;
  "watcherAddress": string
    } | null>;
  getOwner: (tokenId: number | bigint) => Promise<ClarityTypes.Response<string | null, null>>;
  getTokenUri: (id: number | bigint) => Promise<ClarityTypes.Response<string | null, null>>;
}
