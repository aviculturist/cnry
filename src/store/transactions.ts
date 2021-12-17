import { Atom, atom, Getter, SetStateAction, Setter, WritableAtom } from 'jotai';
import { atomWithQuery, atomFamilyWithQuery } from 'jotai-query-toolkit';
import { networkAtom, stacksSessionAtom, userStxAddressesAtom } from '@micro-stacks/react';
import { fetchReadOnlyFunction, fetchTransaction } from 'micro-stacks/api';
import { ChainID } from 'micro-stacks/common';
import { uintCV } from 'micro-stacks/clarity';
import {
  TransactionResults, // interface
} from '@stacks/stacks-blockchain-api-types';
import type {
  ContractCallTransaction,
  Transaction,
  MempoolTransaction,
  AddressNftListResponse,
} from '@stacks/stacks-blockchain-api-types';
import { accountsClientAtom } from '@store/api';
import { currentCnryContractState } from '@store/helpers';
import {
  WATCH_FUNCTION,
  LASTID_FUNCTION,
  METADATA_FUNCTION,
  ISALIVE_FUNCTION,
} from '@utils/constants';
import { StacksNetwork } from 'micro-stacks/network';
import { StacksSessionState } from 'micro-stacks/connect';
import { atomFamily, atomWithStorage } from 'jotai/utils';

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

const anyPendingTxIdsAtom = atomWithStorage(
  'anyPendingTransactions',
  <{ [key: string]: Array<string> }>{}
);

const anyPendingTxIdsAtomFamily = atomFamily<
  [StacksNetwork, StacksSessionState | null],
  WritableAtom<Array<string>, Array<string>>
>(param =>
  atom(
    get => {
      const [network, session] = param;
      // index is a concatination of the api url and user address
      const idx = session
        ? network.getCoreApiUrl() +
          '-' +
          session.addresses[network.isMainnet() ? 'mainnet' : 'testnet']
        : network.getCoreApiUrl();
      const pendingTxIdsList = get(anyPendingTxIdsAtom);
      const pendingList = pendingTxIdsList[idx] === undefined ? [] : pendingTxIdsList[idx];
      return pendingList;
    },
    (get, set, newArray: Array<string>) => {
      const [network, session] = param;
      // index is a concatination of the api url and user address
      const idx = session
        ? network.getCoreApiUrl() +
          '-' +
          session.addresses[network.isMainnet() ? 'mainnet' : 'testnet']
        : network.getCoreApiUrl();
      const prev = get(anyPendingTxIdsAtom);
      set(anyPendingTxIdsAtom, { ...prev, [idx]: newArray });
    }
  )
);

export const currentPendingTxIdsAtom = atom<Array<string>, Array<string>>(
  get => {
    const network = get(networkAtom);
    const session = get(stacksSessionAtom);
    return get(anyPendingTxIdsAtomFamily([network, session]));
  },
  (get, set, newArray: Array<string>) => {
    const network = get(networkAtom);
    const session = get(stacksSessionAtom);
    set(anyPendingTxIdsAtomFamily([network, session]), newArray);
  }
);

export const currentPendingTxsCountAtom = atom(get => {
  const userPendingTxsIds = get(currentPendingTxIdsAtom);
  return userPendingTxsIds.length;
});

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

export const cnryContractTransactionAtom = atomFamilyWithQuery<
  string,
  Transaction | MempoolTransaction | undefined
>(
  'contract-transaction-id',
  async (get, txid) => {
    const network = get(networkAtom);
    try {
      return await fetchTransaction({ url: network.getCoreApiUrl(), txid });
    } catch (_e) {
      console.log(_e);
    }
    return undefined;
  },
  { refetchInterval: 300000 } // five minutes in milliseconds (5000 = 5 seconds)
); // every minute
