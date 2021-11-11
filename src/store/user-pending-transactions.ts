import { atom } from 'jotai';
import { atomFamilyWithQuery } from 'jotai-query-toolkit';
import { networkAtom } from '@micro-stacks/react';
import type {
  ContractCallTransaction,
  MempoolTransaction,
  TokenTransferTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

// a simple array of pending transaction ids
export const userPendingTxIdsAtom = atom(Array<string>());

// a derived atom that returns the number of pending transaction ids in the array
export const userPendingTxsCountAtom = atom(get => {
  const uptxa = get(userPendingTxIdsAtom);
  return uptxa.length;
});

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
  { refetchInterval: 300000 }
); // every minute
