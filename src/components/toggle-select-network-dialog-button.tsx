import * as React from 'react';
import { useAtom } from 'jotai';
import Tooltip from '@mui/material/Tooltip';
import BlurOnTwoToneIcon from '@mui/icons-material/BlurOnTwoTone';
import Button from '@mui/material/Button';
import { networkDialogIsOpenAtom } from '@store/network-dialog-is-open';
import SelectNetworkDialog from '@components/select-network-dialog';
import { useNetworks } from '@hooks/use-networks';

const ToggleSelectNetworkDialogButton = () => {
  const [, setNetworkDialogIsOpen] = useAtom(networkDialogIsOpenAtom);
  const { networks, currentNetworkIndex } = useNetworks();
  const currentNetwork = networks[currentNetworkIndex];
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
}
export default ToggleSelectNetworkDialogButton;
