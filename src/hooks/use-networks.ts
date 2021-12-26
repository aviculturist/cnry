import { useCallback } from 'react';
import {
  customNetworksAtom,
  currentNetworkIndexAtom,
  networksAtom,
  Network,
  anyNetworkStatusAtom,
} from '@store/networks';
import { useNetwork } from '@micro-stacks/react';
import { StacksMainnet } from 'micro-stacks/network';

import { useAtomCallback, useAtomValue } from 'jotai/utils';
import { useAtom } from 'jotai';
import { DEFAULT_NETWORK_INDEX } from '@utils/constants';

export const useNetworks = () => {
  const [customNetworks, setCustomNetworks] = useAtom(customNetworksAtom);
  const networks = useAtomValue(networksAtom);
  const [currentNetworkIndex, setCurrentNetworkIndex] = useAtom(currentNetworkIndexAtom);

  const { handleSetNetwork } = useNetwork();

  const handleUpdateNetworkIndex = useAtomCallback<void, number>(
    useCallback((get, set, arg) => {
      void set(currentNetworkIndexAtom, arg);
    }, [])
  );

  const handleAddNetwork = useAtomCallback<void, Network>(
    useCallback((get, set, newNetwork) => {
      void set(customNetworksAtom, [...customNetworks, newNetwork]);
      void handleUpdateNetworkIndex(networks.length);
    }, [])
  );

  const handleRemoveNetwork = useAtomCallback<void, Network>(
    useCallback((get, set, network) => {
      const customNetworksSet = new Set(customNetworks);
      anyNetworkStatusAtom.remove(network.name); // remove the status query
      customNetworksSet.delete(network);
      Array.from(customNetworksSet);
      void set(customNetworksAtom, Array.from(customNetworksSet));
      void handleUpdateNetworkIndex(0);
      handleSetNetwork(new StacksMainnet({ url: networks[DEFAULT_NETWORK_INDEX].url }));
    }, [])
  );

  return {
    networks,
    setCustomNetworks,
    currentNetworkIndex,
    setCurrentNetworkIndex,
    handleUpdateNetworkIndex,
    handleAddNetwork,
    handleRemoveNetwork,
  };
};
