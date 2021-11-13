import { useAtom } from 'jotai';
import { networkIsOfflineAtom } from '@store/networks';

interface NetworkIsOfflineType {
  networkIsOffline: boolean;
  setNetworkIsOffline: (update: any) => void;
}

export function useNetworkIsOffline(): NetworkIsOfflineType {
  const [networkIsOffline, setNetworkIsOffline] = useAtom(networkIsOfflineAtom);
  return {
    networkIsOffline: networkIsOffline,
    setNetworkIsOffline: setNetworkIsOffline,
  };
}
