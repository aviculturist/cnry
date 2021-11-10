import { smartContractsClientAtom, accountsClientAtom, transactionsClientAtom } from '@store/api';
import { currentCnryContractState, currentWatcherContractState } from '@store/current-network-state';
import { HATCH_FUNCTION, LASTID_FUNCTION, METADATA_FUNCTION } from '@utils/constants';
import { atomWithQuery, atomFamilyWithQuery } from 'jotai-query-toolkit';
// TODO: this returns something differently
//import { cvToJSON, hexToCV } from 'micro-stacks/clarity';
//import { cvToJSON, hexToCV } from '@stacks/transactions';

import { networkAtom, userStxAddressesAtom } from '@micro-stacks/react';
import { cvToJSON, cvToHex, hexToCV, intToHexString } from '@stacks/transactions';
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

const defaultOptions = {
  refetchOnReconnect: true,
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  keepPreviousData: true,
};

// export const cnryTransactionsAtom = atomWithQuery<ContractCallTransaction[], string>(
//   'contract-transactions'
//   async get => {
//   ...(defaultOptions as any),
//   refetchInterval: 500,
//   queryFn: async (): Promise<ContractCallTransaction[]> => {
//     const client = get(accountsClientAtom);
//     const txClient = get(transactionsClientAtom);
//     const cnryContract = get(currentCnryContractState);

//     const txs = await client.getAccountTransactions({
//       limit: 50,
//       principal: cnryContract,
//     });
//     const txids = (txs as TransactionResults).results
//       .filter(
//         tx =>
//           tx.tx_type === 'contract_call' &&
//           tx.contract_call.function_name === HATCH_FUNCTION &&
//           tx.tx_status === 'success'
//       )
//       .map(tx => tx.tx_id);

//     const final = await Promise.all(txids.map(async txId => txClient.getTransactionById({ txId })));
//     return final as ContractCallTransaction[];
//   },
// });

//export const cnryTransactionIdsAtom = atomWithQuery<ContractCallTransaction[]>(
export const cnryTransactionIdsAtom = atomWithQuery<string[]>(
  'contract-transactions',
  async get => {
    const accountsClient = get(accountsClientAtom);
    const cnryContract = get(currentCnryContractState);
    const [contractAddress, contractName] = cnryContract.split('.');

    try {
      const txs = await accountsClient.getAccountTransactions({
        limit: 50,
        principal: cnryContract,
      });
      const txids = (txs as TransactionResults).results
        .filter(
          tx =>
            tx.tx_type === 'contract_call' &&
            //tx.contract_call.function_name === HATCH_FUNCTION &&
            tx.tx_status === 'success'
        )
        .map(tx => tx.tx_id);
        //console.log(txids);
      return txids;
      // const final = await Promise.all(
      //   txids.map(async txId => txClient.getTransactionById({ txId }))
      // );
      // return final as ContractCallTransaction[];
    } catch (_e) {
      console.log(_e);
    }
    return [];
  },
  { refetchInterval: 30000 }
);

export const cnryIdsAtom = atomWithQuery<string[]>(
  'cnry-ids',
  async get => {
    const accountsClient = get(accountsClientAtom);
    const cnryContract = get(currentCnryContractState);
    const [contractAddress, contractName] = cnryContract.split('.');

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
        //console.log(txids);
      return txids;
      // const final = await Promise.all(
      //   txids.map(async txId => txClient.getTransactionById({ txId }))
      // );
      // return final as ContractCallTransaction[];
    } catch (_e) {
      console.log(_e);
    }
    return [];
  },
  { refetchInterval: 30000 }
);

export const cnryTransactionIdAtom = atomFamilyWithQuery<string, Transaction | undefined>(
  'contract-transaction-id',
  async (get, txId) => {
    const txClient = get(transactionsClientAtom);
    try {
      const data = await txClient.getTransactionById({ txId });
      //console.log(data);
      return data as Transaction;
      // if (data.okay && data.result) {
      //   const result = cvToJSON(hexToCV(data.result as string));
      //   if (data.result === '0x09' && data.cause === undefined) {
      //     return result.value;
      //   }
      //   return result.value.value;
      // } // TODO: failed to fetch
    } catch (_e) {
      console.log(_e);
    }
    return undefined;
  },
  { refetchInterval: 30000 }
); // every minute

// TODO: switch to micro-stacks
// export const msCnryMetadataSearchResultsAtom = atomFamilyWithQuery<string, any>(
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

export const cnryMetadataResultAtom = atomFamilyWithQuery<string, any>(
  'cnry-get-metadata',
  async (get, query) => {
    const network = get(networkAtom);
    const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
    const userStxAddresses = get(userStxAddressesAtom);
    const userStxAddress = userStxAddresses?.[chain] || '';
    const client = get(smartContractsClientAtom);
    const cnryContract = get(currentCnryContractState);
    const [contractAddress, contractName] = cnryContract.split('.');
    const id = BigInt(query);
    try {
      const data = await client.callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: METADATA_FUNCTION,
        readOnlyFunctionArgs: {
          sender: userStxAddress,
          arguments: [cvToHex(uintCV(id))],
        },
      });
      if (data.okay && data.result) {
        const result = cvToJSON(hexToCV(data.result as string));
        if (data.result === '0x09' && data.cause === undefined) {
          return result.value;
        }
        return result.value.value;
      } // TODO: failed to fetch
    } catch (_e) {
      console.log(_e);
    }
    return {} as any;
  },
  { refetchInterval: 30000 }
); // every minute

/*
 * Users assets
 */

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
  {
    refetchInterval: 30000,
    // onSuccess: useToggleLoadingCount, // TODO
  }
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
  {
    refetchInterval: 30000,
    // onSuccess: useToggleLoadingCount, // TODO
  }
);
