import { CoreNodeInfoResponse, ServerStatusResponse } from '@stacks/stacks-blockchain-api-types';
import { fetchCoreApiInfo, fetchStatus } from 'micro-stacks/api';
import { atom } from 'jotai';
import { atomFamily, atomWithStorage } from 'jotai/utils';
import { atomFamilyWithQuery } from 'jotai-query-toolkit';
import { DEFAULT_NETWORK_LIST, DEFAULT_NETWORK_INDEX } from '@utils/constants';
import { networkAtom } from '@micro-stacks/react';
import { atomWithQuery } from 'jotai-query-toolkit';
import { StacksMainnet } from 'micro-stacks/network';

// TODO: eventually rewrite this using the micro-stacks client
interface NetworkInfo {
  peer_version: number;
  pox_consensus: string;
  burn_block_height: number;
  stable_pox_consensus: string;
  stable_burn_block_height: number;
  server_version: string;
  network_id: number;
  parent_network_id: string;
  stacks_tip_height: number;
  stacks_tip: string;
  stacks_tip_consensus_hash: string;
  unanchored_tip: string;
  exit_at_block_height: number | null;
}

const DEFAULT_FETCH_OPTIONS: RequestInit = {
  referrer: 'no-referrer',
  referrerPolicy: 'no-referrer',
};

async function fetchPrivate(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  return fetch(input, { ...DEFAULT_FETCH_OPTIONS, ...init });
}

export interface Network {
  name: string;
  label: string;
  chain: string;
  url: string;
}

export enum NetworkModes {
  Testnet = 'testnet',
  Mainnet = 'mainnet',
}

export type NetworkMode = NetworkModes.Mainnet | NetworkModes.Testnet | null;

export const networkModeState = atom<NetworkMode>(NetworkModes.Mainnet);

export const customNetworksAtom = atomWithStorage('customNetworks', <Network[]>[]);

export const networksAtom = atom<Network[]>(get => {
  const customItems = get(customNetworksAtom);
  return [...DEFAULT_NETWORK_LIST, ...customItems];
});

export const currentNetworkIndexAtom = atomWithStorage(
  'currentNetworkIndex',
  DEFAULT_NETWORK_INDEX
);

export const currentNetworkAtom = atom<Network>(get => {
  const networks = get(networksAtom);
  const index = get(currentNetworkIndexAtom);
  return networks[index];
});

export const anyNetworkInfoAtom = atomFamilyWithQuery<string, CoreNodeInfoResponse>(
  'any-network-info',
  async (get, networkName) => {
    const networks = get(networksAtom);
    const network = networks.find(function (net) {
      return net['name'] === networkName;
    }) || { url: '' }; // TODO implement better default values
    const networkUrl = network.url || '';
    try {
      const res = await fetchCoreApiInfo({ url: networkUrl });
      return res;
    } catch (_e) {
      console.log(_e);
    }
    return {} as CoreNodeInfoResponse;
  },
  { refetchInterval: 600000 }
); // ten minutes

export const anyNetworkStatusAtom = atomFamilyWithQuery<string, ServerStatusResponse>(
  'any-network-status',
  async (get, networkName) => {
    const networks = get(networksAtom);
    const network = networks.find(function (net) {
      return net['name'] === networkName;
    }) || { url: '' }; // TODO implement better default values
    const networkUrl = network.url || '';
    try {
      const res = await fetchStatus({ url: networkUrl });
      return res;
    } catch (_e) {
      console.log(_e);
    }
    return {} as ServerStatusResponse;
  },
  { refetchInterval: 600000 }
); // ten minutes

export const anyNetworkIsLoadingFamily = atomFamily((networkName: string) => atom(false));

export const currentNetworkIsSwitchingAtom = atom(false);

export const networkIsOfflineAtom = atom(get =>
  // TODO: a better way to handle network offline
  JSON.stringify(get(networkInfoAtom)) === '{}' ? true : false
);

export const networkInfoAtom = atomWithQuery<NetworkInfo>(
  'network-info',
  async get => {
    const network = get(networkAtom);

    const requestHeaders = {
      Accept: 'application/json',
    };

    const fetchOptions = {
      method: 'GET',
      headers: requestHeaders,
    };

    const defaultNetwork = new StacksMainnet();
    const url = network ? network.getInfoUrl() : defaultNetwork.getInfoUrl();
    try {
      const response = await fetchPrivate(url, fetchOptions);
      const networkInfoResult: NetworkInfo = await response.json();
      return networkInfoResult;
    } catch (_e) {
      console.log(_e);
    }
    return {} as NetworkInfo;
  },
  { refetchInterval: 300000 } // onSuccess: () => handleSuccess() TODO
); // every minute
