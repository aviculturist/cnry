import { CoreNodeInfoResponse, ServerStatusResponse } from '@stacks/stacks-blockchain-api-types';
import { fetchCoreApiInfo, fetchStatus } from 'micro-stacks/api';
import { atom } from 'jotai';
import { atomFamily, atomWithStorage } from 'jotai/utils';
import { atomFamilyWithQuery } from 'jotai-query-toolkit';
import { DEFAULT_NETWORK_LIST, DEFAULT_NETWORK_INDEX } from '@utils/constants';

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
