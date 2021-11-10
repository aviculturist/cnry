import { proxy, BaseProvider, Contract } from '@clarigen/core';
import type { WatcherContract } from './types';
import { WatcherInterface } from './abi';
export type { WatcherContract } from './types';

export const watcherContract = (provider: BaseProvider) => {
  const contract = proxy<WatcherContract>(WatcherInterface, provider);
  return contract;
};

export const watcherInfo: Contract<WatcherContract> = {
  contract: watcherContract,
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractFile: 'contracts/watcher.clar',
};
