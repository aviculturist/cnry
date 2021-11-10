import { proxy, BaseProvider, Contract } from '@clarigen/core';
import type { MaintenanceContract } from './types';
import { MaintenanceInterface } from './abi';
export type { MaintenanceContract } from './types';

export const maintenanceContract = (provider: BaseProvider) => {
  const contract = proxy<MaintenanceContract>(MaintenanceInterface, provider);
  return contract;
};

export const maintenanceInfo: Contract<MaintenanceContract> = {
  contract: maintenanceContract,
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractFile: 'contracts/maintenance.clar',
};
