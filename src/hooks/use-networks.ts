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
    useCallback((get, set, arg) => {
      void set(customNetworksAtom, [...customNetworks, arg]);
      void handleUpdateNetworkIndex(networks.length);
    }, [])
  );

  const handleRemoveNetwork = useAtomCallback<void, Network>(
    useCallback((get, set, arg) => {
      const networksSet = new Set(customNetworks);
      anyNetworkStatusAtom.remove(arg.name); // remove the status query
      networksSet.delete(arg);
      Array.from(networksSet);
      void set(customNetworksAtom, Array.from(networksSet));
      void handleUpdateNetworkIndex(0);
      handleSetNetwork(new StacksMainnet({ url: networks[0].url }));
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
