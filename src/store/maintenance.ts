import { smartContractsClientAtom, accountsClientAtom, transactionsClientAtom } from '@store/api';
import { currentMaintenanceContractState } from '@store/helpers';
import { GET_MAINTENANCE_FUNCTION } from '@utils/constants';
import { atomWithQuery, atomFamilyWithQuery } from 'jotai-query-toolkit';
// TODO: this returns something differently
//import { cvToJSON, hexToCV } from 'micro-stacks/clarity';
//import { cvToJSON, hexToCV } from '@stacks/transactions';

import { networkAtom, userStxAddressesAtom } from '@micro-stacks/react';
import { cvToJSON, cvToHex, hexToCV, intToHexString } from '@stacks/transactions';
import { fetchReadOnlyFunction } from 'micro-stacks/api';
import { ChainID } from 'micro-stacks/common';
import { uintCV, trueCV, stringAsciiCV } from 'micro-stacks/clarity';

export const maintenanceModeAtom = atomFamilyWithQuery<string, any>(
  'maintenanceModeAtom',
  async (get, query) => {
    const network = get(networkAtom);
    const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
    const userStxAddresses = get(userStxAddressesAtom);
    const userStxAddress = userStxAddresses?.[chain] || '';
    const client = get(smartContractsClientAtom);
    const maintenanceModeContract = get(currentMaintenanceContractState);
    const [contractAddress, contractName] = maintenanceModeContract.split('.');

    try {
      const data = await client.callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: GET_MAINTENANCE_FUNCTION,
        readOnlyFunctionArgs: {
          sender: userStxAddress,
          arguments: [cvToHex(stringAsciiCV(query))],
        },
      });
      if (data.okay && data.result) {
        const result = cvToJSON(hexToCV(data.result as string));
        if (data.result === '0x09' && data.cause === undefined) {
          return result.value;
        }
        return result.value.value;
      } // TODO: failed to fetch
    } catch (_e) {
      console.log(_e);
    }
    return {} as any;
  },
  { refetchInterval: 300000 }
); // every minute
