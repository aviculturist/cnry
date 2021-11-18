import { atom } from 'jotai';
import { atomWithQuery, atomFamilyWithQuery } from 'jotai-query-toolkit';
import { networkAtom, userStxAddressesAtom } from '@micro-stacks/react';
import { fetchReadOnlyFunction } from 'micro-stacks/api'; // TODO: seemingly broken
import { accountBalancesClientAtom, accountTransactionsListClientAtom } from '@micro-stacks/query';

import { ChainID } from 'micro-stacks/common';
import { uintCV } from 'micro-stacks/clarity';
// TODO: these return differently
//import { cvToJSON, hexToCV } from 'micro-stacks/clarity';
//import { cvToJSON, hexToCV } from '@stacks/transactions';
import { cvToJSON, cvToHex, cvToValue, hexToCV, intToHexString } from '@stacks/transactions';
import {
  TransactionResults, // interface
} from '@stacks/stacks-blockchain-api-types';
import type {
  ContractCallTransaction,
  Transaction,
  MempoolTransaction,
  TokenTransferTransaction,
  AddressNftListResponse,
  AddressBalanceResponse,
} from '@stacks/stacks-blockchain-api-types';
import { smartContractsClientAtom, accountsClientAtom, transactionsClientAtom } from '@store/api';
import { currentCnryContractState, currentWatcherContractState } from '@store/helpers';
import {
  WATCH_FUNCTION,
  LASTID_FUNCTION,
  METADATA_FUNCTION,
  ISALIVE_FUNCTION,
} from '@utils/constants';
import { paginate, range } from '@utils/paginate';

const DEFAULT_FETCH_OPTIONS: RequestInit = {
  referrer: 'no-referrer',
  referrerPolicy: 'no-referrer',
};

async function fetchPrivate(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  return fetch(input, { ...DEFAULT_FETCH_OPTIONS, ...init });
}

export interface UserTransaction {
  txid: string;
  sender: string;
  function?: string;
  timestamp: number;
  txstatus: 'submitted' | 'pending' | 'aborted' | 'dropped' | 'success'; // "submitted" is before node accepts
}

function isTokenTransferTransaction(
  tx: Transaction | MempoolTransaction | { error: string }
): tx is TokenTransferTransaction {
  return (tx as TokenTransferTransaction).burn_block_time !== undefined;
}

// a simple array of pending transaction ids
export const userPendingTxIdsAtom = atom(Array<string>());

// a derived atom that returns the number of pending transaction ids in the array
export const userPendingTxsCountAtom = atom(get => {
  const userPendingTxsIds = get(userPendingTxIdsAtom);
  return userPendingTxsIds.length;
});

// An atomFamilyWithQuery for a specific transaction id
// TODO: is there a way to find all the queries?
// if so, could make the above array a derived atom instead.
export const userPendingTxAtom = atomFamilyWithQuery<string, UserTransaction>(
  'pending-tx',
  async (get, txid) => {
    const networkUrl = get(networkAtom).getCoreApiUrl();
    const requestHeaders = {
      Accept: 'application/json',
    };

    const fetchOptions = {
      method: 'GET',
      headers: requestHeaders,
    };

    const url = `${networkUrl}/extended/v1/tx/0x${txid}`;

    try {
      const res = await fetchPrivate(url, fetchOptions);
      const tx: Transaction | MempoolTransaction | { error: string } = await res.json();

      // TODO: wrongly assumes this is before tx was received, but there could be other errors
      // such as a network change
      if ('error' in tx) {
        return {
          txid,
          sender: 'error in tx',
          timestamp: Math.floor(Date.now() / 1000),
          txstatus: 'submitted',
        } as UserTransaction;
      }

      return {
        txid,
        sender: tx.sender_address,
        function: (tx as ContractCallTransaction).contract_call.function_name
          ? (tx as ContractCallTransaction).contract_call.function_name
          : undefined,
        timestamp: (tx as Transaction).burn_block_time
          ? (tx as Transaction).burn_block_time
          : (tx as MempoolTransaction).receipt_time,
        txstatus:
          tx.tx_status === 'dropped_replace_by_fee' ||
          tx.tx_status === 'dropped_replace_across_fork' ||
          tx.tx_status === 'dropped_too_expensive' ||
          tx.tx_status === 'dropped_stale_garbage_collect'
            ? 'dropped'
            : tx.tx_status === 'abort_by_response' || tx.tx_status === 'abort_by_post_condition'
            ? 'aborted'
            : tx.tx_status,
      } as UserTransaction;
    } catch (_e) {
      console.log(_e);
    }
    // TODO: When there's an error, does this even return?
    return {
      txid,
      sender: '',
      function: 'error?',
      timestamp: Math.floor(Date.now() / 1000),
      txstatus: 'submitted',
    } as UserTransaction;
  },
  { refetchInterval: 30000 } // thirty seconds in milliseconds (5000 = 5 seconds)
); // every minute

// search queries
export const queryAtom = atom('');

// a simple array of pending transaction ids
export const cnryUserPendingTxIdsAtom = atom(Array<string>());

// a derived atom that returns the number of pending transaction ids in the array
export const cnryUserPendingTxsCountAtom = atom(get => {
  const uptxa = get(cnryUserPendingTxIdsAtom);
  return uptxa.length;
});

// Get the user's first 50 NFT Transactions
// limit: number;
// offset: number;
// total: number;
// nft_events: NftEvent[];
export const myNftTransactionsAtom = atomWithQuery<AddressNftListResponse>(
  'my-nft-transactions',
  async get => {
    const network = get(networkAtom);
    const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
    const userStxAddresses = get(userStxAddressesAtom);
    const principal = userStxAddresses?.[chain];
    const accountsClient = get(accountsClientAtom);
    if (principal === undefined) return { limit: 0, offset: 0, total: 0, nft_events: [] };

    try {
      const txs = await accountsClient.getAccountNft({
        limit: 50,
        principal: principal,
      });
      return txs as AddressNftListResponse;
    } catch (_e) {
      console.log(_e);
    }
    return { limit: 0, offset: 0, total: 0, nft_events: [] };
  },
  { refetchInterval: 300000 } // five minutes in milliseconds (5000 = 5 seconds)
);

// a derived atom that filters the myNftTransactionsAtom
// to extract the CNRY tokenIds
export const myCnryTokenIdsAtom = atom(get => {
  const txs = get(myNftTransactionsAtom);
  if (txs.total === 0) return [];
  const cnryContract = get(currentCnryContractState);
  const tokenIds = txs?.nft_events
    .filter(
      tx => tx.asset_identifier === `${cnryContract}::CNRY`
      // || tx.asset_identifier === `${contractAddress}.cnry::CNRY` // v1
    )
    .map(tx => {
      const content = tx.value.repr.replace(`u`, ''); // TODO: use CV deserializing?
      return Number(content);
    });
  return tokenIds.length === 0 ? [] : tokenIds;
});

// a derived atom that filters the myNftTransactionsAtom
// to extract the WATCHER tokenIds
// export const myWatchedTokenIdsAtom = atom(get => {
//   const txs = get(myNftTransactionsAtom);
//   const watcherContract = get(currentWatcherContractState);
//   console.log(txs);
//   const watcherTokenIds = txs?.nft_events.filter(
//     tx => tx.asset_identifier === `${watcherContract}::WATCHER`
//     // || tx.asset_identifier === `${contractAddress}.watcher::WATCHER` // v1
//   );
//   // .map(tx => {
//   //   const content = tx.value.repr.replace(`u`, '');
//   //   return Number(content);
//   // });
//   //const final = await Promise.all(watcherTokenIds.map(async tokenId => txClient.getTransactionById({ txId })));

//   console.log(watcherTokenIds);
//   return watcherTokenIds;
// });

export const userHasCnrysAtom = atom(get => {
  const myCnryIds = get(myCnryTokenIdsAtom);
  const userHasCnrys = myCnryIds.length === 0 ? false : true;
  return userHasCnrys;
});

export const userIsWatchingCnrysAtom = atom(get => {
  const myWatchingCnryIds = get(myWatchingTokenIdsAtom);
  const userIsWatchingCnrys = myWatchingCnryIds.length === 0 ? false : true;
  return userIsWatchingCnrys;
});

// const userHasCnrys = myCnrysIds === undefined || myCnrysIds.length === 0 ? false : true;
//   const userHasWatching =
//     myWatchingTokenIds === undefined || myWatchingTokenIds.length === 0 ? false : true;

// The token ids a user has watched
// TODO: this only works for the last 50 user transactions
// This doesn't need to have a parameter, just grab the principal from currently sigend in user if applicable
export const myWatchingTokenIdsAtom = atomWithQuery<number[]>(
  'my-watching-token-ids',
  async get => {
    const network = get(networkAtom);
    const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
    const userStxAddresses = get(userStxAddressesAtom);
    const principal = userStxAddresses?.[chain] || '';
    const accountsClient = get(accountsClientAtom);
    const txClient = get(transactionsClientAtom);
    const cnryContract = get(currentCnryContractState);
    const watcherContract = get(currentWatcherContractState);
    if (principal === '') return [];

    try {
      const txs = await accountsClient.getAccountTransactions({
        limit: 50,
        principal: cnryContract,
      });
      const userWatchedCnryTokenIds = (txs as TransactionResults).results
        .filter(
          tx =>
            tx.sender_address === principal &&
            tx.tx_type === 'contract_call' &&
            tx.contract_call.function_name === WATCH_FUNCTION &&
            tx.tx_status === 'success'
        )
        .map(tx => {
          const content = (
            tx as ContractCallTransaction
          ).contract_call.function_args?.[0].repr.replace(`u`, '');
          return Number(content);
        });
      const deduplicatedUserWatchedCnryTokenIds = [...new Set(userWatchedCnryTokenIds)];

      return deduplicatedUserWatchedCnryTokenIds;
    } catch (_e) {
      console.log(_e);
    }
    return [];
  },
  { refetchInterval: 300000 } // five minutes in milliseconds (5000 = 5 seconds)
); // every minute

// // TODO: WIP
export const browseCurrentPageAtom = atom(1);
export const browseCurrentPageAllCnryTokenIdsAtom = atom(get => {
  const totalItems = get(cnryLastIdAtom);
  const currentPage = get(browseCurrentPageAtom);
  const { totalPages, startPage, endPage, startIndex, endIndex, pages } = paginate({
    totalItems,
    currentPage,
    pageSize: 10,
    maxPages: 10,
  });
  // TODO: testnet indexes from 0
  const currentPageTokenIds = Array.from(range(startIndex + 1, endIndex + 1));
  return currentPageTokenIds;
});

// All transactions for the activity drawer
// Convert to infinite query with pagination, etc.
export const cnryContractTransactionIdsAtom = atomWithQuery<string[]>(
  'contract-transactions',
  async get => {
    const accountsClient = get(accountsClientAtom);
    const cnryContract = get(currentCnryContractState);

    try {
      const txs = await accountsClient.getAccountTransactions({
        limit: 50,
        principal: cnryContract,
      });
      const txids = (txs as TransactionResults).results
        .filter(
          tx =>
            tx.tx_type === 'contract_call' &&
            // TODO filter by the list of functions we care about in activity
            //tx.contract_call.function_name === HATCH_FUNCTION &&
            tx.tx_status === 'success'
        )
        .map(tx => tx.tx_id);
      return txids;
    } catch (_e) {
      console.log(_e);
    }
    return [];
  },
  { refetchInterval: 30000 } // thirty seconds in milliseconds (5000 = 5 seconds)
);

// TODO: double check it always returns Transaction, may be other scenarios
export const cnryContractTransactionAtom = atomFamilyWithQuery<string, Transaction | undefined>(
  'contract-transaction-id',
  async (get, txId) => {
    const txClient = get(transactionsClientAtom);
    try {
      const data = await txClient.getTransactionById({ txId });
      return data as Transaction;
    } catch (_e) {
      console.log(_e);
    }
    return undefined;
  },
  { refetchInterval: 300000 } // five minutes in milliseconds (5000 = 5 seconds)
); // every minute

export const cnryWatchCountAtom = atomFamilyWithQuery<number, number | undefined>(
  'ms-get-watcher-count',
  async (get, tokenId) => {
    const network = get(networkAtom);
    const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
    const userStxAddresses = get(userStxAddressesAtom);
    const cnryContract = get(currentCnryContractState);
    const [contractAddress, contractName] = cnryContract.split('.');
    const senderAddress = userStxAddresses?.[chain] || contractAddress; // bcuz when user is not logged in, queries fail
    const client = get(smartContractsClientAtom);
    const networkUrl = network.getCoreApiUrl();
    // try {
    //   const response = await fetchReadOnlyFunction({
    //     url: networkUrl,
    //     contractName,
    //     contractAddress,
    //     functionName: 'get-watcher-count',
    //     functionArgs: [uintCV(tokenId)],
    //     senderAddress,
    //   });
    //   console.log(response);
    //   return 1; //response;
    // } catch (_e) {
    //   console.log(_e);
    // }
    try {
      const data = await client.callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-watcher-count',
        readOnlyFunctionArgs: {
          sender: senderAddress,
          arguments: [cvToHex(uintCV(tokenId))],
        },
      });
      if (data.okay && data.result) {
        const result = cvToJSON(hexToCV(data.result as string));
        return result.value.value.count.value as number; // this is ridiculous
      } // TODO: failed to fetch

      // if (data.okay && data.result) {
      //   if (data.cause && data.cause === undefined) {
      //     return undefined;
      //   }
      //   const result = cvToJSON(hexToCV(data.result as string));
      //   return result && result.value && result.value.value ? result.value.value : undefined;
      // } // TODO: failed to fetch
    } catch (_e) {
      console.log(_e);
    }
    return undefined; //{} as any;
  },
  { refetchInterval: 600000 } // ten minutes in milliseconds (5000 = 5 seconds)
); // every minute

export const cnryGetMetadataAtom = atomFamilyWithQuery<number | undefined, any | undefined>(
  'cnry-get-metadata',
  async (get, tokenId) => {
    if (tokenId === undefined) return undefined;
    const network = get(networkAtom);
    const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
    const userStxAddresses = get(userStxAddressesAtom);
    const cnryContract = get(currentCnryContractState);
    const [contractAddress, contractName] = cnryContract.split('.');
    const userStxAddress = userStxAddresses?.[chain] || contractAddress; // bcuz when user is not logged in, queries fail
    const client = get(smartContractsClientAtom);

    try {
      const data = await client.callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: METADATA_FUNCTION,
        readOnlyFunctionArgs: {
          sender: userStxAddress,
          arguments: [cvToHex(uintCV(tokenId))],
        },
      });
      if (data.okay && data.result) {
        if (data.cause && data.cause === undefined) {
          return undefined;
        }
        const result = cvToJSON(hexToCV(data.result as string));
        return result && result.value && result.value.value ? result.value.value : undefined;
      } // TODO: failed to fetch
    } catch (_e) {
      console.log(_e);
    }
    return undefined;
  },
  { refetchInterval: 86400000 } // one day in milliseconds (5000 = 5 seconds)
);

export const watcherGetMetadataAtom = atomFamilyWithQuery<number | undefined, any | undefined>(
  'watcher-get-metadata',
  async (get, tokenId) => {
    if (tokenId === undefined) return undefined;
    const network = get(networkAtom);
    const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
    const userStxAddresses = get(userStxAddressesAtom);
    const watcherContract = get(currentWatcherContractState);
    const [contractAddress, contractName] = watcherContract.split('.');
    const userStxAddress = userStxAddresses?.[chain] || '';
    const client = get(smartContractsClientAtom);

    try {
      const data = await client.callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: METADATA_FUNCTION,
        readOnlyFunctionArgs: {
          sender: userStxAddress,
          arguments: [cvToHex(uintCV(tokenId))],
        },
      });
      if (data.okay && data.result) {
        if (data.cause && data.cause === undefined) {
          return undefined;
        }
        const result = cvToJSON(hexToCV(data.result as string));
        return result && result.value && result.value.value ? result.value.value : undefined;
      } // TODO: failed to fetch
    } catch (_e) {
      console.log(_e);
    }
    return undefined;
  },
  { refetchInterval: 86400000 } // one day in milliseconds (5000 = 5 seconds)
);

/*
 * Total number of cnrys
 */
export const cnryLastIdAtom = atomWithQuery<number>(
  'cnry-get-last-id',
  async get => {
    const client = get(smartContractsClientAtom);
    const cnryContract = get(currentCnryContractState);
    const [contractAddress, contractName] = cnryContract.split('.');

    try {
      const data = await client.callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: LASTID_FUNCTION,
        readOnlyFunctionArgs: {
          sender: contractAddress,
          arguments: [],
        },
      });
      if (data.okay && data.result) {
        const result = cvToJSON(hexToCV(data.result as string));
        return result.value.value as number;
      } // TODO: failed to fetch
    } catch (_e) {
      console.log(_e);
    }
    return 0;
  },
  { refetchInterval: 120000 } // two minutes in milliseconds (5000 = 5 seconds)
);

/*
 * Total number of watchers
 */
export const watcherLastIdAtom = atomWithQuery<number>(
  'watcher-get-last-id',
  async get => {
    const client = get(smartContractsClientAtom);
    const watcherContract = get(currentWatcherContractState);
    const [contractAddress, contractName] = watcherContract.split('.');

    try {
      const data = await client.callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: LASTID_FUNCTION,
        readOnlyFunctionArgs: {
          sender: contractAddress,
          arguments: [],
        },
      });
      if (data.okay && data.result) {
        const result = cvToJSON(hexToCV(data.result as string));
        return result.value.value as number;
      } // TODO: failed to fetch
    } catch (_e) {
      console.log(_e);
    }
    return 0;
  },
  { refetchInterval: 300000 } // five minutes in milliseconds (5000 = 5 seconds)
);

/*
 * Check if a specific cnry is alive
 */
export const cnryIsAliveAtom = atomFamilyWithQuery<number, boolean>(
  'cnry-is-alive',
  async (get, tokenId) => {
    const client = get(smartContractsClientAtom);
    const cnryContract = get(currentCnryContractState);
    const [contractAddress, contractName] = cnryContract.split('.');

    try {
      const data = await client.callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: ISALIVE_FUNCTION,
        readOnlyFunctionArgs: {
          sender: contractAddress,
          arguments: [cvToHex(uintCV(tokenId))],
        },
      });
      if (data.okay && data.result) {
        if (data.cause && data.cause === undefined) {
          return undefined;
        }
        const result = cvToJSON(hexToCV(data.result as string));
        return result && result.value && result.value.value ? result.value.value : false;
      } // TODO: failed to fetch
    } catch (_e) {
      console.log(_e);
    }
    return false;
  },
  { refetchInterval: 86400000 } // one day in milliseconds (5000 = 5 seconds)
);

// TODO: this hard codes a 50 item limit to the query
// export const oldmyCnryTokenIdsAtom = atom(get => {
//   const network = get(networkAtom);
//   const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
//   const userStxAddresses = get(userStxAddressesAtom);
//   const cnryContract = get(currentCnryContractState);
//   const [contractAddress, contractName] = cnryContract.split('.');
//   const principal = userStxAddresses?.[chain] || contractAddress; // bcuz when user is not logged in, queries fail
//   const client = get(smartContractsClientAtom);
//   const networkUrl = network.getCoreApiUrl();

//   const txs = get(accountTransactionsListClientAtom([principal, { limit: 50 }, networkUrl]));
//   try {
//     const tokenIds = txs?.pages[0].results
//       .filter(
//         tx =>
//           tx?.tx_type === 'contract_call' &&
//           tx?.contract_call.contract_id === cnryContract &&
//           tx?.contract_call.function_name === 'hatch' &&
//           tx?.tx_status === 'success'
//       )
//       .map(tx => {
//         const content = (tx as ContractCallTransaction).tx_result.repr
//           .replace(`(ok u`, '')
//           .replace(`)`, '');
//         return Number(content);
//       });
//     return tokenIds === undefined ? [] : tokenIds;
//   } catch (_e) {
//     console.log(_e);
//   }
//   return [];
// });

// // TODO: only grabs 50, convert to infinitequery
// export const oldcnryUserTokenIdsAtom = atomFamilyWithQuery<string, number[]>(
//   'user-cnry-token-ids',
//   async (get, principal) => {
//     const accountsClient = get(accountsClientAtom);
//     const cnryContract = get(currentCnryContractState);

//     try {
//       const txs = await accountsClient.getAccountTransactions({
//         limit: 50,
//         principal: cnryContract,
//       });
//       const tokenIds = (txs as TransactionResults).results
//         .filter(
//           tx =>
//             tx.sender_address === principal &&
//             tx.tx_type === 'contract_call' &&
//             tx.contract_call.function_name === HATCH_FUNCTION &&
//             tx.tx_status === 'success'
//         )
//         .map(tx => {
//           const content = (tx as ContractCallTransaction).tx_result.repr
//             .replace(`(ok u`, '')
//             .replace(`)`, '');
//           return Number(content);
//         });
//       return tokenIds;
//     } catch (_e) {
//       console.log(_e);
//     }
//     return [];
//   },
//   { refetchInterval: 300000 } // five minutes in milliseconds (5000 = 5 seconds)
// ); // every minute

// TODO: switch to micro-stacks !!
//
// export const cnryGetMetadataAtom = atomFamilyWithQuery<string, any>(
//   'ms-metadata-search-results',
//   async (get, query) => {
//     const networkUrl = get(networkAtom).getCoreApiUrl();
//     const id = query;//BitInt(query);
//     try {
//       const response = await fetchReadOnlyFunction({
//         url: networkUrl,
//         contractName: 'cnry',
//         contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
//         functionName: 'get-metadata',
//         functionArgs: [cvToHex(uintCV(id))],
//       });
//       console.log(response);
//       return response;
//     } catch (_e) {
//       console.log(_e);
//     }
//     return {} as any;
//   },
//   { refetchInterval: 10000 }
// ); // every minute
// Get CNRY tokens
// export const oldmyCnryTokenIdsAtom = atomFamilyWithQuery<string, number[]>(
//   'user-cnry-txs',
//   async (get, principal) => {
//     const accountsClient = get(accountsClientAtom);
//     const cnryContract = get(currentCnryContractState);
//     const [contractAddress, contractName] = cnryContract.split('.');
//     try {
//       const txs = await accountsClient.getAccountNft({
//         limit: 50,
//         principal: principal,
//       });
//       const tokenIds = txs.nft_events
//         .filter(
//           tx => tx.asset_identifier === `${cnryContract}::CNRY`
//           // || tx.asset_identifier === `${contractAddress}.cnry::CNRY` // v1
//         )
//         .map(tx => {
//           const content = tx.value.repr.replace(`u`, '');
//           return Number(content);
//         });
//       return tokenIds;
//     } catch (_e) {
//       console.log(_e);
//     }
//     return [];
//   },
//   { refetchInterval: 300000 } // five minutes in milliseconds (5000 = 5 seconds)
// );
