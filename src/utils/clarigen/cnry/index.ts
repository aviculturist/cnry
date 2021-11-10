import { proxy, BaseProvider, Contract } from '@clarigen/core';
import type { CnryContract } from './types';
import { CnryInterface } from './abi';
export type { CnryContract } from './types';

export const cnryContract = (provider: BaseProvider) => {
  const contract = proxy<CnryContract>(CnryInterface, provider);
  return contract;
};

export const cnryInfo: Contract<CnryContract> = {
  contract: cnryContract,
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractFile: 'contracts/cnry.clar',
};
