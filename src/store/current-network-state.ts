import { atom } from 'jotai';
import { networkAtom } from '@micro-stacks/react';

import {
  DEFAULT_MAINNET_SERVER,
  DEFAULT_TESTNET_SERVER,
  DEFAULT_REGTEST_SERVER,
  DEFAULT_LOCALNET_SERVER,
  DEFAULT_MAINNET_EXPLORER,
  DEFAULT_TESTNET_EXPLORER,
  DEFAULT_REGTEST_EXPLORER,
  DEFAULT_LOCALNET_EXPLORER,
  DEFAULT_LOCALNET_BITCOIN_EXPLORER,
  DEFAULT_TESTNET_BITCOIN_EXPLORER,
  DEFAULT_MAINNET_BITCOIN_EXPLORER,
  DEFAULT_MAINNET_CNRY_CONTRACT,
  DEFAULT_REGTEST_CNRY_CONTRACT,
  DEFAULT_TESTNET_CNRY_CONTRACT,
  DEFAULT_LOCALNET_CNRY_CONTRACT,
  DEFAULT_MAINNET_WATCHER_CONTRACT,
  DEFAULT_REGTEST_WATCHER_CONTRACT,
  DEFAULT_TESTNET_WATCHER_CONTRACT,
  DEFAULT_LOCALNET_WATCHER_CONTRACT,
  DEFAULT_MAINNET_MAINTENANCE_CONTRACT,
  DEFAULT_REGTEST_MAINTENANCE_CONTRACT,
  DEFAULT_TESTNET_MAINTENANCE_CONTRACT,
  DEFAULT_LOCALNET_MAINTENANCE_CONTRACT,
} from '@utils/constants';

export const currentCnryContractState = atom(get => {
  const network = get(networkAtom);
  const cnryContract =
    network.getCoreApiUrl() === DEFAULT_LOCALNET_SERVER
      ? DEFAULT_LOCALNET_CNRY_CONTRACT
      : network.getCoreApiUrl() === DEFAULT_REGTEST_SERVER
      ? DEFAULT_REGTEST_CNRY_CONTRACT
      : network.getCoreApiUrl() === DEFAULT_TESTNET_SERVER
      ? DEFAULT_TESTNET_CNRY_CONTRACT
      : DEFAULT_MAINNET_CNRY_CONTRACT;
  return cnryContract;
});

export const currentWatcherContractState = atom(get => {
  const network = get(networkAtom);
  const watcherContract =
    network.getCoreApiUrl() === DEFAULT_LOCALNET_SERVER
      ? DEFAULT_LOCALNET_WATCHER_CONTRACT
      : network.getCoreApiUrl() === DEFAULT_REGTEST_SERVER
      ? DEFAULT_REGTEST_WATCHER_CONTRACT
      : network.getCoreApiUrl() === DEFAULT_TESTNET_SERVER
      ? DEFAULT_TESTNET_WATCHER_CONTRACT
      : DEFAULT_MAINNET_WATCHER_CONTRACT;
  return watcherContract;
});

export const currentMaintenanceContractState = atom(get => {
  const network = get(networkAtom);
  const maintenanceContract =
    network.getCoreApiUrl() === DEFAULT_LOCALNET_SERVER
      ? DEFAULT_LOCALNET_MAINTENANCE_CONTRACT
      : network.getCoreApiUrl() === DEFAULT_REGTEST_SERVER
      ? DEFAULT_REGTEST_MAINTENANCE_CONTRACT
      : network.getCoreApiUrl() === DEFAULT_TESTNET_SERVER
      ? DEFAULT_TESTNET_MAINTENANCE_CONTRACT
      : DEFAULT_MAINNET_MAINTENANCE_CONTRACT;
  return maintenanceContract;
});

export const currentStacksExplorerState = atom(get => {
  const network = get(networkAtom);
  const defaultStacksExplorer =
    network.getCoreApiUrl() === DEFAULT_LOCALNET_SERVER
      ? DEFAULT_LOCALNET_EXPLORER
      : network.getCoreApiUrl() === DEFAULT_REGTEST_SERVER
      ? DEFAULT_REGTEST_EXPLORER
      : network.getCoreApiUrl() === DEFAULT_TESTNET_SERVER
      ? DEFAULT_TESTNET_EXPLORER
      : DEFAULT_MAINNET_EXPLORER;
  return defaultStacksExplorer;
});

export const currentBitcoinExplorerState = atom(get => {
  const network = get(networkAtom);
  const defaultBitcoinExplorer =
    network.getCoreApiUrl() === DEFAULT_LOCALNET_SERVER
      ? DEFAULT_LOCALNET_BITCOIN_EXPLORER
      : network.getCoreApiUrl() === DEFAULT_REGTEST_SERVER
      ? ''
      : network.getCoreApiUrl() === DEFAULT_TESTNET_SERVER
      ? DEFAULT_TESTNET_BITCOIN_EXPLORER
      : DEFAULT_MAINNET_BITCOIN_EXPLORER;
  return defaultBitcoinExplorer;
});

// TODO: this needs to be deprecated, other mainnets could be added
export const currentChainState = atom(get => {
  const network = get(networkAtom);
  const defaultChain = network.getCoreApiUrl() === DEFAULT_MAINNET_SERVER ? 'mainnet' : 'testnet';
  return defaultChain;
});
