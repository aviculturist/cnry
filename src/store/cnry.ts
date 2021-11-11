import { smartContractsClientAtom, accountsClientAtom, transactionsClientAtom } from '@store/api';
import {
  currentCnryContractState,
  currentWatcherContractState,
} from '@store/current-network-state';
import {
  HATCH_FUNCTION,
  LASTID_FUNCTION,
  METADATA_FUNCTION,
  ISALIVE_FUNCTION,
} from '@utils/constants';
import { atomWithQuery, atomFamilyWithQuery } from 'jotai-query-toolkit';
// TODO: these return differently
//import { cvToJSON, hexToCV } from 'micro-stacks/clarity';
//import { cvToJSON, hexToCV } from '@stacks/transactions';

import { networkAtom, userStxAddressesAtom } from '@micro-stacks/react';
import { cvToJSON, cvToHex, cvToValue, hexToCV, intToHexString } from '@stacks/transactions';
import { fetchReadOnlyFunction } from 'micro-stacks/api';
import { ChainID } from 'micro-stacks/common';
import { uintCV } from 'micro-stacks/clarity';
import {
  ContractCallTransaction,
  MempoolTransactionListResponse,
  TransactionResults,
  Transaction,
} from '@blockstack/stacks-blockchain-api-types';
import { atom } from 'jotai';

export const queryAtom = atom('');

// TODO: convert this to an infinite query? Will need to enable pagination, etc.
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
  { refetchInterval: 300000 }
);

// TODO: convert to infinite query with pagination, etc.
export const cnryTokenIdsAtom = atomWithQuery<string[]>(
  'cnry-token-ids',
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
            tx.contract_call.function_name === HATCH_FUNCTION &&
            tx.tx_status === 'success'
        )
        .map(tx => tx.tx_id);
      return txids;
    } catch (_e) {
      console.log(_e);
    }
    return [];
  },
  { refetchInterval: 300000 }
);

// TODO: only grabs 50, convert to infinitequery
export const userCnryTokenIdsAtom = atomFamilyWithQuery<string, string[]>(
  'user-cnry-token-ids',
  async (get, txId) => {
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
            tx.sender_address === txId &&
            tx.tx_type === 'contract_call' &&
            tx.contract_call.function_name === HATCH_FUNCTION &&
            tx.tx_status === 'success'
        )
        .map(tx => tx.tx_id);
      return txids;
    } catch (_e) {
      console.log(_e);
    }
    return [];
  },
  { refetchInterval: 300000 }
); // every minute

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
  { refetchInterval: 300000 }
); // every minute

// TODO: switch to micro-stacks !!
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

export const cnryGetMetadataAtom = atomFamilyWithQuery<number | undefined, any | undefined>(
  'cnry-get-metadata',
  async (get, tokenId) => {
    if (tokenId === undefined) return undefined;
    const network = get(networkAtom);
    const cnryContract = get(currentCnryContractState);
    const [contractAddress, contractName] = cnryContract.split('.');
    const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
    const userStxAddresses = get(userStxAddressesAtom);
    const userStxAddress = userStxAddresses?.[chain] || contractAddress; // bcuz when user is not logged in, queries fail
    const client = get(smartContractsClientAtom);

    //const id = BigInt(query);
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
  { refetchInterval: 30000 } // 30 seconds in milliseconds (5000 = 5 seconds)
); // every minute

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
  { refetchInterval: 300000 }
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
  { refetchInterval: 300000 }
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

export const acnryContractTransactionAtom = atomFamilyWithQuery<string, Transaction | undefined>(
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
  { refetchInterval: 300000 }
); // every minute
