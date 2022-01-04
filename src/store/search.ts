import { networkAtom, stacksSessionAtom, userStxAddressesAtom } from '@micro-stacks/react';
import { smartContractsClientAtom, transactionsClientAtom } from '@store/api';
import { cvToJSON, cvToHex, hexToCV, intToHexString } from '@stacks/transactions';
import { fetchReadOnlyFunction } from 'micro-stacks/api';
import { uintCV } from 'micro-stacks/clarity';
import {
  SearchErrorResult,
  SearchSuccessResult,
  ReadOnlyFunctionSuccessResponse,
  MapEntryResponse,
} from '@stacks/stacks-blockchain-api-types';
import { atomWithQuery, atomFamilyWithQuery } from 'jotai-query-toolkit';
import { Atom, atom, useAtom, WritableAtom } from 'jotai';
import { atomFamily, atomWithStorage } from 'jotai/utils';
import { currentCnryContractState } from '@utils/helpers';
import { GET_METADATA_FUNCTION } from '@utils/constants';
import { ChainID } from 'micro-stacks/common';
import { StacksNetwork } from 'micro-stacks/network';
import { StacksSessionState } from 'micro-stacks/connect';

export const queryAtom = atom('');

export interface ResultType {
  icon?: string;
  slug?: string;
  primary_description: string;
  secondary_description: string;
  timestamp?: number;
}

// TODO: use pendingTransactions as refactor guide
export const searchQueryAtom = atom('');
export const searchResultAtom = atom<SearchErrorResult | SearchSuccessResult | undefined>(
  undefined
);

export const anySearchHistoryAtom = atomWithStorage(
  'searchHistory',
  <{ [key: string]: { [key: string]: ResultType } }>{}
);
const anySearchHistoryAtomFamily = atomFamily<
  [StacksNetwork, StacksSessionState | null],
  WritableAtom<{ [key: string]: ResultType }, { [key: string]: ResultType }>
>(param =>
  atom(
    get => {
      const [network, session] = param;
      // index is a concatination of the api url and user address
      const idx = network.getCoreApiUrl();
      const anySearchHistory = get(anySearchHistoryAtom);
      const searchHistory = anySearchHistory[idx] === undefined ? {} : anySearchHistory[idx];
      return searchHistory;
    },
    (get, set, newArray: { [key: string]: ResultType }) => {
      const [network, session] = param;
      // index is a concatination of the api url and user address
      const idx = network.getCoreApiUrl();
      const prev = get(anySearchHistoryAtom);
      set(anySearchHistoryAtom, { ...prev, [idx]: newArray });
    }
  )
);
export const searchHistoryAtom = atom<{ [key: string]: ResultType }, { [key: string]: ResultType }>(
  get => {
    const network = get(networkAtom);
    const session = get(stacksSessionAtom);
    return get(anySearchHistoryAtomFamily([network, session]));
  },
  (get, set, newArray: { [key: string]: ResultType }) => {
    const network = get(networkAtom);
    const session = get(stacksSessionAtom);
    set(anySearchHistoryAtomFamily([network, session]), newArray);
  }
);

export const anySearchFavoritesAtom = atomWithStorage(
  'searchFavorites',
  <{ [key: string]: { [key: string]: ResultType } }>{}
);
const anySearchFavoritesAtomFamily = atomFamily<
  [StacksNetwork, StacksSessionState | null],
  WritableAtom<{ [key: string]: ResultType }, { [key: string]: ResultType }>
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
      const anySearchFavorites = get(anySearchFavoritesAtom);
      const searchFavorites = anySearchFavorites[idx] === undefined ? {} : anySearchFavorites[idx];
      return searchFavorites;
    },
    (get, set, newArray: { [key: string]: ResultType }) => {
      const [network, session] = param;
      // index is a concatination of the api url and user address
      const idx = session
        ? network.getCoreApiUrl() +
          '-' +
          session.addresses[network.isMainnet() ? 'mainnet' : 'testnet']
        : network.getCoreApiUrl();
      const prev = get(anySearchFavoritesAtom);
      set(anySearchFavoritesAtom, { ...prev, [idx]: newArray });
    }
  )
);
export const searchFavoritesAtom = atom<
  { [key: string]: ResultType },
  { [key: string]: ResultType }
>(
  get => {
    const network = get(networkAtom);
    const session = get(stacksSessionAtom);
    return get(anySearchFavoritesAtomFamily([network, session]));
  },
  (get, set, newArray: { [key: string]: ResultType }) => {
    const network = get(networkAtom);
    const session = get(stacksSessionAtom);
    set(anySearchFavoritesAtomFamily([network, session]), newArray);
  }
);

const DEFAULT_FETCH_OPTIONS: RequestInit = {
  referrer: 'no-referrer',
  referrerPolicy: 'no-referrer',
};

async function fetchPrivate(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  return fetch(input, { ...DEFAULT_FETCH_OPTIONS, ...init });
}

export const searchResultsAtom = atomFamily<
  string | undefined,
  Atom<SearchErrorResult | SearchSuccessResult>
>(query =>
  atom<SearchErrorResult | SearchSuccessResult>(get => {
    const network = get(networkAtom);
    const session = get(stacksSessionAtom);
    return get(searchResultsQueryAtom([query, network, session]));
  })
);
export const searchResultsQueryAtom = atomFamilyWithQuery<
  [string | undefined, StacksNetwork, StacksSessionState | null],
  SearchErrorResult | SearchSuccessResult
>(
  'search-results',
  async (get, params) => {
    const [query, network, session] = params;

    if (query === undefined) {
      return {} as SearchErrorResult;
    }
    const networkUrl = get(networkAtom).getCoreApiUrl();

    const requestHeaders = {
      Accept: 'application/json',
    };

    const fetchOptions = {
      method: 'GET',
      headers: requestHeaders,
    };

    const url = `${networkUrl}/extended/v1/search/${query}`;
    try {
      const response = await fetchPrivate(url, fetchOptions);
      const searchResult: SearchErrorResult | SearchSuccessResult = await response.json();
      return searchResult;
    } catch (_e) {
      console.log(_e);
    }
    return {} as SearchErrorResult | SearchSuccessResult;
  },
  { refetchInterval: 600000 } // ten minutes in milliseconds (5000 = 5 seconds)
);
