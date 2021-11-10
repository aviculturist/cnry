import { networkAtom, userStxAddressesAtom } from '@micro-stacks/react';
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
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { currentCnryContractState } from '@store/current-network-state';
import { METADATA_FUNCTION } from '@utils/constants';
import { ChainID } from 'micro-stacks/common';

export const queryAtom = atom('');

export interface ResultType {
  icon?: string;
  slug?: string;
  primary_description: string;
  secondary_description: string;
  timestamp?: number;
}

export const searchQueryAtom = atom('');
export const searchResultAtom = atom<SearchErrorResult | SearchSuccessResult | undefined>(
  undefined
);
export const searchHistoryAtom = atomWithStorage(
  'searchHistory',
  <{ [key: string]: ResultType }>{}
);
export const searchFavoritesAtom = atomWithStorage(
  'searchFavorites',
  <{ [key: string]: ResultType }>{}
);

const DEFAULT_FETCH_OPTIONS: RequestInit = {
  referrer: 'no-referrer',
  referrerPolicy: 'no-referrer',
};

async function fetchPrivate(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  return fetch(input, { ...DEFAULT_FETCH_OPTIONS, ...init });
}

export const searchResultsAtom = atomFamilyWithQuery<
  string,
  SearchErrorResult | SearchSuccessResult
>(
  'search-results',
  async (get, query) => {
    const networkUrl = get(networkAtom).getCoreApiUrl();
    //const query = get(queryAtom); //'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

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
  { refetchInterval: 10000 }
); // every minute
