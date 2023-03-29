import { atom } from 'jotai';
import {
  AccountsApi,
  Configuration,
  SmartContractsApi,
  TransactionsApi,
  InfoApi,
} from '@stacks/blockchain-api-client';
// can't use hook here, so use the atom directly
import { networkAtom } from '@micro-stacks/jotai';

// set network
const configAtom = atom(get => {
  const network = get(networkAtom);
  return new Configuration({ basePath: network.getCoreApiUrl() });
});

export const smartContractsClientAtom = atom(get => {
  const config = get(configAtom);
  return new SmartContractsApi(config);
});

export const accountsClientAtom = atom(get => {
  const config = get(configAtom);
  return new AccountsApi(config);
});

export const transactionsClientAtom = atom(get => {
  const config = get(configAtom);
  return new TransactionsApi(config);
});

export const infoClientAtom = atom(get => {
  const config = get(configAtom);
  return new InfoApi(config);
});
