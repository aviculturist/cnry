import * as React from 'react';
import { useAtom } from 'jotai';
import { useNetwork } from '@micro-stacks/react';
import { StacksMainnet, StacksMocknet, StacksTestnet } from 'micro-stacks/network';
import Tooltip from '@mui/material/Tooltip';
import BlurOnTwoToneIcon from '@mui/icons-material/BlurOnTwoTone';
import Button from '@mui/material/Button';
import { networkDialogIsOpenAtom } from '@store/ui/network-dialog-is-open';
import SelectNetworkDialog from '@components/select-network-dialog';
import { useNetworks } from '@hooks/use-networks';
import { useEffect } from 'react';
import { DEFAULT_NETWORK_INDEX } from '@utils/constants';
import { StacksProvider } from 'micro-stacks/connect';
import { getGlobalObject } from 'micro-stacks/common';

const ToggleSelectNetworkDialogButton = () => {
  const [, setNetworkDialogIsOpen] = useAtom(networkDialogIsOpenAtom);
  const { networks, currentNetworkIndex, handleUpdateNetworkIndex } = useNetworks();
  const currentNetwork = networks[currentNetworkIndex];
  const { handleSetNetwork } = useNetwork();

  const handleSelectNetwork = (index: number) => {
    // used to select and display user selections
    handleUpdateNetworkIndex(index);
    // sets the currently active network used by the wallet
    handleSetNetwork(
      index === 0
        ? new StacksMainnet({ url: networks[index].url })
        : index === 1
        ? new StacksTestnet({ url: networks[index].url })
        : new StacksMocknet({ url: networks[index].url })
    );
  };
  const getNetworkIndex = (url: string): number => {
    for (let i = 0; i < networks.length; i++) {
      const network = networks[i];
      if (network.url === url) return i;
    }
    return DEFAULT_NETWORK_INDEX;
  };

  // listen for changeNetwork message
  useEffect(() => {
    const injectChangeNetwork = (event: any) => {
      if (event.data.method === 'changeNetwork') {
        const index = getNetworkIndex(JSON.parse(event.data.message).url);
        handleSelectNetwork(index);
      }
    };
    window.addEventListener('message', injectChangeNetwork);
    return () => window.removeEventListener('message', injectChangeNetwork);
  }, []);

  // on first render, get wallet network
  useEffect(() => {
    const maybeGetStacksProvider = () => {
      const Provider: StacksProvider | undefined = getGlobalObject('StacksProvider', {
        returnEmptyObject: false,
        usageDesc: 'maybeGetStacksProvider',
        throwIfUnavailable: false,
      });
      return Provider;
    };
    const Provider: StacksProvider | undefined = maybeGetStacksProvider();

    // This relies on a version of micro-stacks that hasn't yet been released
    if (typeof Provider !== 'undefined' && 'getCurrentNetwork' in Provider) {
      //const index = getNetworkIndex(Provider.getCurrentNetwork().url);
      //handleSelectNetwork(index);
    }
  }, []);

  const handleOpenNetworkDialog = () => {
    setNetworkDialogIsOpen(true);
  };

  return (
    <>
      <Tooltip title={`Switch Networks`}>
        <Button
          variant="outlined"
          startIcon={<BlurOnTwoToneIcon fontSize="small" />}
          onClick={handleOpenNetworkDialog}
          color="primary"
        >
          {currentNetwork.name}
        </Button>
      </Tooltip>
      <SelectNetworkDialog />
    </>
  );
};
export default ToggleSelectNetworkDialogButton;
