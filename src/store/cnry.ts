import { Atom, atom, Getter, SetStateAction, Setter, WritableAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { atomWithQuery, atomFamilyWithQuery } from 'jotai-query-toolkit';
import { StacksNetwork } from 'micro-stacks/network';
import { StacksSessionState } from 'micro-stacks/connect';
import { networkAtom, stacksSessionAtom, userStxAddressesAtom } from '@micro-stacks/react';
import { fetchReadOnlyFunction, fetchTransaction } from 'micro-stacks/api';
import { ChainID } from 'micro-stacks/common';
import { uintCV } from 'micro-stacks/clarity';
import {
  TransactionResults, // interface
} from '@stacks/stacks-blockchain-api-types';
import type { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';
import { accountsClientAtom } from '@store/api';
import { myNftTransactionsAtom } from '@store/transactions';
import { currentCnryContractState, currentWatcherContractState } from '@store/helpers';
import {
  WATCH_FUNCTION,
  LASTID_FUNCTION,
  METADATA_FUNCTION,
  ISALIVE_FUNCTION,
  GET_HATCHPRICE_FUNCTION,
  GET_KEEPALIVEPRICE_FUNCTION,
  GET_WATCHPRICE_FUNCTION,
  GET_WATCHERCOUNT_FUNCTION,
} from '@utils/constants';
import { paginate, range } from '@utils/paginate';

export interface CnryMetadata {
  index: bigint;
  cnryName: string;
  cnryStatement: string;
  cnryUri?: string;
  cnryProof?: string;
  cnryKeeper: string;
  keepaliveExpiry: bigint;
  keepaliveTimestamp: bigint;
  hatchedTimestamp: bigint;
}

// pagination
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
  // TODO: testnet indexes from 0, devnet from 1
  const currentPageTokenIds = Array.from(range(startIndex + 1, endIndex + 1));
  return currentPageTokenIds;
});

// a derived atom that filters the myNftTransactionsAtom
// to extract the CNRY tokenIds
// TODO: refactor with micro-stacks
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
      const content = tx.value.repr.replace(`u`, '');
      return Number(content);
    });
  return tokenIds.length === 0 ? [] : tokenIds;
});

export const userHasCnrysAtom = atom(get => {
  const myCnryIds = get(myCnryTokenIdsAtom);
  const userHasCnrys = myCnryIds.length === 0 ? false : true;
  return userHasCnrys;
});

// TODO: this only works for the last 50 user transactions
// and has a clumsy deduplication mechanism
// TODO: refactor with micro-stacks
export const myWatchingTokenIdsAtom = atomWithQuery<number[]>(
  'my-watching-token-ids',
  async get => {
    const network = get(networkAtom);
    const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
    const userStxAddresses = get(userStxAddressesAtom);
    const principal = userStxAddresses?.[chain] || '';
    const accountsClient = get(accountsClientAtom);
    const cnryContract = get(currentCnryContractState);
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
          return content ? Number(content) : 0;
        });
      const deduplicatedUserWatchedCnryTokenIds = [...new Set(userWatchedCnryTokenIds)];
      return deduplicatedUserWatchedCnryTokenIds;
    } catch (_e) {
      console.log(_e);
    }
    return [];
  },
  { refetchInterval: 300000 } // five minutes in milliseconds (5000 = 5 seconds)
);

export const userIsWatchingCnrysAtom = atom(get => {
  const myWatchingCnryIds = get(myWatchingTokenIdsAtom);
  const userIsWatchingCnrys = myWatchingCnryIds.length === 0 ? false : true;
  return userIsWatchingCnrys;
});

export const cnryWatchCountAtom = atomFamily<number, Atom<number>>(tokenId =>
  atom<number>(get => {
    const network = get(networkAtom);
    const session = get(stacksSessionAtom);
    return get(cnryWatchCountQueryAtom([tokenId, network, session]));
  })
);

export const cnryWatchCountQueryAtom = atomFamilyWithQuery<
  [number, StacksNetwork, StacksSessionState | null],
  number
>(
  'ms-get-watcher-count',
  async (get, params) => {
    const [tokenId, network, session] = params;
    const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
    const userStxAddresses = get(userStxAddressesAtom);
    const cnryContract = get(currentCnryContractState);
    const [contractAddress, contractName] = cnryContract.split('.');
    const senderAddress = userStxAddresses?.[chain] || contractAddress;
    try {
      const response = await fetchReadOnlyFunction<{ count: number }>(
        {
          network,
          contractName,
          contractAddress,
          functionName: GET_WATCHERCOUNT_FUNCTION,
          functionArgs: [uintCV(tokenId)],
          senderAddress,
        },
        true
      );
      return Number(response.count);
    } catch (_e) {
      console.log(_e);
    }
    return 0;
  },
  { refetchInterval: 600000 } // ten minutes in milliseconds (5000 = 5 seconds)
);

// tokenId can be undefined because query params that may not be valid numbers will return undefined
// TODO: perhaps there's a cleaner way to handle this case
export const cnryGetMetadataAtom = atomFamily<number | undefined, Atom<CnryMetadata | undefined>>(
  tokenId =>
    atom<CnryMetadata | undefined>(get => {
      const network = get(networkAtom);
      const session = get(stacksSessionAtom);
      return get(cnryGetMetadataQueryAtom([tokenId, network, session]));
    })
);
export const cnryGetMetadataQueryAtom = atomFamilyWithQuery<
  [number | undefined, StacksNetwork, StacksSessionState | null],
  CnryMetadata | undefined
>(
  'cnry-get-metadata',
  async (get, params) => {
    const [tokenId, network, session] = params;
    if (tokenId === undefined) return undefined;
    const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
    const userStxAddresses = get(userStxAddressesAtom);
    const cnryContract = get(currentCnryContractState);
    const [contractAddress, contractName] = cnryContract.split('.');
    const senderAddress = userStxAddresses?.[chain] || contractAddress;
    try {
      const response = await fetchReadOnlyFunction<CnryMetadata>(
        {
          network,
          contractName,
          contractAddress,
          functionName: METADATA_FUNCTION,
          functionArgs: [uintCV(tokenId)],
          senderAddress,
        },
        true
      );
      return response;
    } catch (_e) {
      console.log(_e);
    }
    return undefined;
  },
  { refetchInterval: 86400000 } // one day in milliseconds (5000 = 5 seconds)
);

export const cnryLastIdAtom = atom<number>(get => {
  const network = get(networkAtom);
  const session = get(stacksSessionAtom);
  return get(cnryLastIdQueryAtom([network, session]));
});
export const cnryLastIdQueryAtom = atomFamilyWithQuery<
  [StacksNetwork, StacksSessionState | null],
  number
>(
  'cnry-get-last-id',
  async (get, params) => {
    const [network, session] = params;
    const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
    const userStxAddresses = get(userStxAddressesAtom);
    const cnryContract = get(currentCnryContractState);
    const [contractAddress, contractName] = cnryContract.split('.');
    const senderAddress = userStxAddresses?.[chain] || contractAddress;
    try {
      const response = await fetchReadOnlyFunction<bigint>(
        {
          network,
          contractName,
          contractAddress,
          functionName: LASTID_FUNCTION,
          functionArgs: [],
          senderAddress,
        },
        true
      );
      return Number(response);
    } catch (_e) {
      console.log(_e);
    }
    return 1;
  },
  { refetchInterval: 120000 } // two minutes in milliseconds (5000 = 5 seconds)
);

export const watcherLastIdAtom = atom<number>(get => {
  const network = get(networkAtom);
  const session = get(stacksSessionAtom);
  return get(watcherLastIdQueryAtom([network, session]));
});
export const watcherLastIdQueryAtom = atomFamilyWithQuery<
  [StacksNetwork, StacksSessionState | null],
  number
>(
  'watcher-get-last-id',
  async (get, params) => {
    const [network, session] = params;
    const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
    const userStxAddresses = get(userStxAddressesAtom);
    const watcherContract = get(currentWatcherContractState);
    const [contractAddress, contractName] = watcherContract.split('.');
    const senderAddress = userStxAddresses?.[chain] || contractAddress;
    try {
      const response = await fetchReadOnlyFunction(
        {
          network,
          contractName,
          contractAddress,
          functionName: LASTID_FUNCTION,
          functionArgs: [],
          senderAddress,
        },
        true
      );
      return Number(response);
    } catch (_e) {
      console.log(_e);
    }
    return 0;
  },
  { refetchInterval: 300000 } // five minutes in milliseconds (5000 = 5 seconds)
);

export const hatchPriceAtom = atom<bigint>(get => {
  const network = get(networkAtom);
  const session = get(stacksSessionAtom);
  return get(hatchPriceQueryAtom([network, session]));
});
export const hatchPriceQueryAtom = atomFamilyWithQuery<
  [StacksNetwork, StacksSessionState | null],
  bigint
>(
  'cnry-get-hatch-price',
  async (get, params) => {
    const [network, session] = params;
    const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
    const userStxAddresses = get(userStxAddressesAtom);
    const cnryContract = get(currentCnryContractState);
    const [contractAddress, contractName] = cnryContract.split('.');
    const senderAddress = userStxAddresses?.[chain] || contractAddress;
    try {
      const response = await fetchReadOnlyFunction<bigint>({
        network,
        contractName,
        contractAddress,
        functionName: GET_HATCHPRICE_FUNCTION,
        functionArgs: [],
        senderAddress,
      });
      return response;
    } catch (_e) {
      console.log(_e);
    }
    return 0n;
  },
  { refetchInterval: 3600000 } // one hour in milliseconds (5000 = 5 seconds)
);

export const keepalivePriceAtom = atom<bigint>(get => {
  const network = get(networkAtom);
  const session = get(stacksSessionAtom);
  return get(keepalivePriceQueryAtom([network, session]));
});
export const keepalivePriceQueryAtom = atomFamilyWithQuery<
  [StacksNetwork, StacksSessionState | null],
  bigint
>(
  'cnry-get-keepalive-price',
  async (get, params) => {
    const [network, session] = params;
    const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
    const userStxAddresses = get(userStxAddressesAtom);
    const cnryContract = get(currentCnryContractState);
    const [contractAddress, contractName] = cnryContract.split('.');
    const senderAddress = userStxAddresses?.[chain] || contractAddress;
    try {
      const response = await fetchReadOnlyFunction<bigint>({
        network,
        contractName,
        contractAddress,
        functionName: GET_KEEPALIVEPRICE_FUNCTION,
        functionArgs: [],
        senderAddress,
      });
      return response;
    } catch (_e) {
      console.log(_e);
    }
    return 0n;
  },
  { refetchInterval: 3600000 } // one hour in milliseconds (5000 = 5 seconds)
);

export const watchPriceAtom = atom<bigint>(get => {
  const network = get(networkAtom);
  const session = get(stacksSessionAtom);
  return get(watchPriceQueryAtom([network, session]));
});
export const watchPriceQueryAtom = atomFamilyWithQuery<
  [StacksNetwork, StacksSessionState | null],
  bigint
>(
  'cnry-get-keepalive-price',
  async (get, params) => {
    const [network, session] = params;
    const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
    const userStxAddresses = get(userStxAddressesAtom);
    const cnryContract = get(currentCnryContractState);
    const [contractAddress, contractName] = cnryContract.split('.');
    const senderAddress = userStxAddresses?.[chain] || contractAddress;
    try {
      const response = await fetchReadOnlyFunction<bigint>({
        network,
        contractName,
        contractAddress,
        functionName: GET_WATCHPRICE_FUNCTION,
        functionArgs: [],
        senderAddress,
      });
      return response;
    } catch (_e) {
      console.log(_e);
    }
    return 0n;
  },
  { refetchInterval: 3600000 } // one hour in milliseconds (5000 = 5 seconds)
);

export const cnryIsAliveAtom = atomFamily<number, Atom<boolean>>(tokenId =>
  atom<boolean>(get => {
    const network = get(networkAtom);
    const session = get(stacksSessionAtom);
    return get(cnryIsAliveQueryAtom([tokenId, network, session]));
  })
);
export const cnryIsAliveQueryAtom = atomFamilyWithQuery<
  [number, StacksNetwork, StacksSessionState | null],
  boolean
>(
  'cnry-is-alive',
  async (get, params) => {
    const [tokenId, network, session] = params;
    const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
    const userStxAddresses = get(userStxAddressesAtom);
    const cnryContract = get(currentCnryContractState);
    const [contractAddress, contractName] = cnryContract.split('.');
    const senderAddress = userStxAddresses?.[chain] || contractAddress;
    try {
      const response = await fetchReadOnlyFunction<boolean>(
        {
          network,
          contractName,
          contractAddress,
          functionName: ISALIVE_FUNCTION,
          functionArgs: [uintCV(tokenId)],
          senderAddress,
        },
        true
      );
      return response;
    } catch (_e) {
      console.log(_e);
    }
    return false;
  },
  { refetchInterval: 86400000 } // one day in milliseconds (5000 = 5 seconds)
);
