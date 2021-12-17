import { Network } from '@store/networks';

export const ENV = process.env.NEXT_PUBLIC_ENV || '';
export const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL || '';
export const IS_BROWSER = typeof document !== 'undefined';

export const DEFAULT_MAINNET_SERVER = process.env.NEXT_PUBLIC_MAINNET_API_SERVER || '';
export const DEFAULT_TESTNET_SERVER = process.env.NEXT_PUBLIC_TESTNET_API_SERVER || '';
export const DEFAULT_LOCALNET_SERVER = process.env.NEXT_PUBLIC_LOCALNET_API_SERVER || '';

export const DEFAULT_MAINNET_EXPLORER = process.env.NEXT_PUBLIC_MAINNET_EXPLORER || '';
export const DEFAULT_TESTNET_EXPLORER = process.env.NEXT_PUBLIC_TESTNET_EXPLORER || '';
export const DEFAULT_LOCALNET_EXPLORER = process.env.NEXT_PUBLIC_LOCALNET_EXPLORER || '';

export const DEFAULT_MAINNET_BITCOIN_EXPLORER =
  process.env.NEXT_PUBLIC_MAINNET_BITCOIN_EXPLORER || '';
export const DEFAULT_TESTNET_BITCOIN_EXPLORER =
  process.env.NEXT_PUBLIC_TESTNET_BITCOIN_EXPLORER || '';
export const DEFAULT_LOCALNET_BITCOIN_EXPLORER =
  process.env.NEXT_PUBLIC_LOCALNET_BITCOIN_EXPLORER || '';

export const DEFAULT_MAINNET_CNRY_CONTRACT = process.env.NEXT_PUBLIC_MAINNET_CNRY_CONTRACT || '';
export const DEFAULT_TESTNET_CNRY_CONTRACT = process.env.NEXT_PUBLIC_TESTNET_CNRY_CONTRACT || '';
export const DEFAULT_LOCALNET_CNRY_CONTRACT = process.env.NEXT_PUBLIC_LOCALNET_CNRY_CONTRACT || '';

export const DEFAULT_MAINNET_WATCHER_CONTRACT =
  process.env.NEXT_PUBLIC_MAINNET_WATCHER_CONTRACT || '';
export const DEFAULT_TESTNET_WATCHER_CONTRACT =
  process.env.NEXT_PUBLIC_TESTNET_WATCHER_CONTRACT || '';
export const DEFAULT_LOCALNET_WATCHER_CONTRACT =
  process.env.NEXT_PUBLIC_LOCALNET_WATCHER_CONTRACT || '';

export const DEFAULT_MAINNET_MAINTENANCE_CONTRACT =
  process.env.NEXT_PUBLIC_MAINNET_MAINTENANCE_CONTRACT || '';
export const DEFAULT_TESTNET_MAINTENANCE_CONTRACT =
  process.env.NEXT_PUBLIC_TESTNET_MAINTENANCE_CONTRACT || '';
export const DEFAULT_LOCALNET_MAINTENANCE_CONTRACT =
  process.env.NEXT_PUBLIC_LOCALNET_MAINTENANCE_CONTRACT || '';

export const ADD_MAINTENANCE_FUNCTION = 'addMaintenanceMode';
export const GET_MAINTENANCE_FUNCTION = 'getMaintenanceMode';

export const HATCH_FUNCTION = 'hatch';
export const WATCH_FUNCTION = 'watch';
export const METADATA_FUNCTION = 'get-metadata';
export const KEEPALIVE_FUNCTION = 'keepalive';
export const LASTID_FUNCTION = 'get-last-token-id';
export const ISALIVE_FUNCTION = 'is-alive';
export const GET_HATCHPRICE_FUNCTION = 'get-hatchPrice';
export const GET_KEEPALIVEPRICE_FUNCTION = 'get-keepalivePrice';
export const GET_WATCHPRICE_FUNCTION = 'get-watchPrice';
export const GET_WATCHERCOUNT_FUNCTION = 'get-watcher-count';

export const DEFAULT_NETWORK_LIST: Network[] = [
  {
    //index: 0,
    name: 'mainnet',
    label: 'stacks.co',
    chain: 'mainnet',
    url: DEFAULT_MAINNET_SERVER,
  },
  {
    //index: 1,
    name: 'testnet',
    label: 'stacks.co',
    chain: 'testnet',
    url: DEFAULT_TESTNET_SERVER,
  },
  {
    //index: 2,
    name: 'localnet',
    label: 'localhost',
    chain: 'testnet',
    url: DEFAULT_LOCALNET_SERVER,
  },
];
export const DEFAULT_NETWORK_INDEX = parseFloat(
  process.env.NEXT_PUBLIC_DEFAULT_NETWORK_INDEX || '0'
);
