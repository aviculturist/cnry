import { atom } from 'jotai';
import { networkAtom } from '@micro-stacks/react';

import {
  DEFAULT_MAINNET_SERVER,
  DEFAULT_TESTNET_SERVER,
  DEFAULT_DEVNET_SERVER,
  DEFAULT_MAINNET_EXPLORER,
  DEFAULT_TESTNET_EXPLORER,
  DEFAULT_DEVNET_EXPLORER,
  DEFAULT_DEVNET_BITCOIN_EXPLORER,
  DEFAULT_TESTNET_BITCOIN_EXPLORER,
  DEFAULT_MAINNET_BITCOIN_EXPLORER,
  DEFAULT_MAINNET_CNRY_CONTRACT,
  DEFAULT_TESTNET_CNRY_CONTRACT,
  DEFAULT_DEVNET_CNRY_CONTRACT,
  DEFAULT_MAINNET_WATCHER_CONTRACT,
  DEFAULT_TESTNET_WATCHER_CONTRACT,
  DEFAULT_DEVNET_WATCHER_CONTRACT,
  DEFAULT_MAINNET_MAINTENANCE_CONTRACT,
  DEFAULT_TESTNET_MAINTENANCE_CONTRACT,
  DEFAULT_DEVNET_MAINTENANCE_CONTRACT,
} from '@utils/constants';

export const currentCnryContractState = atom(get => {
  const network = get(networkAtom);
  const cnryContract =
    network.getCoreApiUrl() === DEFAULT_DEVNET_SERVER
      ? DEFAULT_DEVNET_CNRY_CONTRACT
      : network.getCoreApiUrl() === DEFAULT_TESTNET_SERVER
      ? DEFAULT_TESTNET_CNRY_CONTRACT
      : DEFAULT_MAINNET_CNRY_CONTRACT;
  return cnryContract;
});

export const currentWatcherContractState = atom(get => {
  const network = get(networkAtom);
  const watcherContract =
    network.getCoreApiUrl() === DEFAULT_DEVNET_SERVER
      ? DEFAULT_DEVNET_WATCHER_CONTRACT
      : network.getCoreApiUrl() === DEFAULT_TESTNET_SERVER
      ? DEFAULT_TESTNET_WATCHER_CONTRACT
      : DEFAULT_MAINNET_WATCHER_CONTRACT;
  return watcherContract;
});

export const currentMaintenanceContractState = atom(get => {
  const network = get(networkAtom);
  const maintenanceContract =
    network.getCoreApiUrl() === DEFAULT_DEVNET_SERVER
      ? DEFAULT_DEVNET_MAINTENANCE_CONTRACT
      : network.getCoreApiUrl() === DEFAULT_TESTNET_SERVER
      ? DEFAULT_TESTNET_MAINTENANCE_CONTRACT
      : DEFAULT_MAINNET_MAINTENANCE_CONTRACT;
  return maintenanceContract;
});

export const currentStacksExplorerState = atom(get => {
  const network = get(networkAtom);
  const defaultStacksExplorer =
    network.getCoreApiUrl() === DEFAULT_DEVNET_SERVER
      ? DEFAULT_DEVNET_EXPLORER
      : network.getCoreApiUrl() === DEFAULT_TESTNET_SERVER
      ? DEFAULT_TESTNET_EXPLORER
      : DEFAULT_MAINNET_EXPLORER;
  return defaultStacksExplorer;
});

export const currentBitcoinExplorerState = atom(get => {
  const network = get(networkAtom);
  const defaultBitcoinExplorer =
    network.getCoreApiUrl() === DEFAULT_DEVNET_SERVER
      ? DEFAULT_DEVNET_BITCOIN_EXPLORER
      : network.getCoreApiUrl() === DEFAULT_TESTNET_SERVER
      ? DEFAULT_TESTNET_BITCOIN_EXPLORER
      : DEFAULT_MAINNET_BITCOIN_EXPLORER;
  return defaultBitcoinExplorer;
});

// TODO: refactor to allow other mainnet endpoints
export const currentChainState = atom(get => {
  const network = get(networkAtom);
  const defaultChain = network.getCoreApiUrl() === DEFAULT_MAINNET_SERVER ? 'mainnet' : 'testnet';
  return defaultChain;
});
