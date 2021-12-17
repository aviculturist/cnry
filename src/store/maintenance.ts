import { Atom, atom } from 'jotai';
import { atomFamilyWithQuery } from 'jotai-query-toolkit';
import { ChainID } from 'micro-stacks/common';
import { stringAsciiCV } from 'micro-stacks/clarity';
import { StacksNetwork } from 'micro-stacks/network';
import { StacksSessionState } from 'micro-stacks/connect';
import { networkAtom, stacksSessionAtom, userStxAddressesAtom } from '@micro-stacks/react';
import { fetchReadOnlyFunction } from 'micro-stacks/api';
import { currentMaintenanceContractState } from '@store/helpers';
import { GET_MAINTENANCE_FUNCTION } from '@utils/constants';
import { atomFamily } from 'jotai/utils';

export interface MaintenanceModeResponse {
  maintenance: boolean;
  wall: string;
}

export const maintenanceModeAtom = atomFamily<string, Atom<MaintenanceModeResponse | undefined>>(
  shortCommitHash =>
    atom<MaintenanceModeResponse | undefined>(get => {
      const network = get(networkAtom);
      const session = get(stacksSessionAtom);
      return get(maintenanceModeQueryAtom([shortCommitHash, network, session]));
    })
);

export const maintenanceModeQueryAtom = atomFamilyWithQuery<
  [string, StacksNetwork, StacksSessionState | null],
  MaintenanceModeResponse | undefined
>(
  'maintenanceModeAtom',
  async (get, params) => {
    const [shortCommitHash, network, session] = params;
    const maintenanceModeContract = get(currentMaintenanceContractState);
    const [contractAddress, contractName] = maintenanceModeContract.split('.');
    const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
    const userStxAddresses = get(userStxAddressesAtom);
    const senderAddress = userStxAddresses?.[chain] || contractAddress;

    try {
      const response = await fetchReadOnlyFunction<MaintenanceModeResponse | undefined>(
        {
          network,
          contractName,
          contractAddress,
          functionName: GET_MAINTENANCE_FUNCTION,
          functionArgs: [stringAsciiCV(shortCommitHash)],
          senderAddress,
        },
        true
      );
      return response;
    } catch (_e) {
      console.log(_e);
    }
    return undefined;
  },
  { refetchInterval: 300000 } // five minutes in milliseconds (5000 = 5 seconds)
);
