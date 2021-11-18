import * as React from 'react';
import { t } from '@lingui/macro';
import { useAtom } from 'jotai';
import { useNetwork } from '@micro-stacks/react';
import { StacksMainnet, StacksRegtest, StacksMocknet, StacksTestnet } from 'micro-stacks/network';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
//import DialogContent from '@mui/material/DialogContent';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import CloudOffOutlinedIcon from '@mui/icons-material/CloudOffOutlined';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import AddNetworkDialog from '@components/add-network-dialog';
import { useNetworks } from '@hooks/use-networks';
import { Network } from '@store/networks';
import { anyNetworkStatusAtom, anyNetworkIsLoadingFamily } from '@store/networks';
import { networkDialogIsOpenAtom } from '@store/ui/network-dialog-is-open';
import { addNetworkDialogIsOpenAtom } from '@store/ui/add-network-dialog-is-open';
import SafeSuspense from '@components/safe-suspense';
import Chip from '@mui/material/Chip';

interface NetworkStatusCircularProgressProps {
  color: 'success' | 'warning';
}

const NetworkStatusCircularProgress = ({ color }: NetworkStatusCircularProgressProps) => {
  return (
    <CircularProgress
      color={color}
      size={40}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        width: 0,
      }}
    />
  );
};

const NetworkListItem = ({ network, index }: { network: any; index: number }) => {
  const {
    networks,
    setCustomNetworks,
    currentNetworkIndex,
    handleUpdateNetworkIndex,
    handleAddNetwork,
    handleRemoveNetwork,
  } = useNetworks();
  const { handleSetNetwork } = useNetwork();
  const [, setOpen] = useAtom(networkDialogIsOpenAtom);
  const [anyStatus, dispatchAnyStatus] = useAtom(anyNetworkStatusAtom(network.name));
  const color = anyStatus.status === 'ready' ? 'success' : 'warning';
  const isLoadingFamily = anyNetworkIsLoadingFamily(network);
  const [isLoading, setIsLoading] = useAtom(isLoadingFamily);

  const handleSelectNetwork = (index: number) => {
    // used to select and display user selections
    handleUpdateNetworkIndex(index);
    // sets the currently active network used by the wallet
    handleSetNetwork(
      index === 0
        ? new StacksMainnet({ url: networks[index].url })
        : index === 1
        ? new StacksTestnet({ url: networks[index].url })
        : index === 2
        ? new StacksRegtest({ url: networks[index].url })
        : new StacksMocknet({ url: networks[index].url })
    );
    setOpen(false);
  };

  const isCustom = index >= 4 ? true : false;

  // fetch status onClick
  const timer = React.useRef<number>();
  const refetch = () => {
    if (!isLoading) {
      setIsLoading(true);
      timer.current = window.setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
    try {
      dispatchAnyStatus({ type: 'refetch' });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ListItem key={index}>
      <ListItemButton
        disabled={anyStatus.status === 'ready' ? false : true}
        onClick={() => handleSelectNetwork(index)}
      >
        <ListItemAvatar>
          <Avatar color="warning">
            {anyStatus.status === 'ready' ? (
              <SafeSuspense fallback={<NetworkStatusCircularProgress color={color} />}>
                {currentNetworkIndex === index ? (
                  <CheckIcon color={color} />
                ) : (
                  <CloudQueueIcon color={color} />
                )}
              </SafeSuspense>
            ) : (
              <SafeSuspense fallback={<NetworkStatusCircularProgress color={color} />}>
                <IconButton sx={{ zIndex: 1600 }} size="medium" color={color}>
                  <CloudOffOutlinedIcon />
                </IconButton>
              </SafeSuspense>
            )}
            {isLoading && <NetworkStatusCircularProgress color={color} />}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <React.Fragment>
              {network.name}
              <Chip sx={{ ml: 1 }} size="small" label={network.chain} />
            </React.Fragment>
          }
          secondary={<React.Fragment>{network.label}</React.Fragment>}
        />
      </ListItemButton>
      {isCustom && (
        <ListItemIcon>
          <IconButton
            onClick={() => network.url && handleRemoveNetwork(network as Network)}
            edge="end"
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </ListItemIcon>
      )}
      <ListItemSecondaryAction>
        <IconButton onClick={() => refetch()} edge="end" aria-label="delete">
          <AutorenewOutlinedIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
const SelectNetworkDialog = () => {
  const [networkDialogIsOpen, setNetworkDialogIsOpen] = useAtom(networkDialogIsOpenAtom);
  const [, setAddNetworkDialogIsOpen] = useAtom(addNetworkDialogIsOpenAtom);
  const { networks } = useNetworks();

  const handleClose = () => {
    setNetworkDialogIsOpen(false);
  };
  const handleOpenAddNetworkDialog = () => {
    setAddNetworkDialogIsOpen(true);
  };
  return (
    <>
      <Dialog fullWidth={true} maxWidth="xs" onClose={handleClose} open={networkDialogIsOpen}>
        <DialogTitle>Select network</DialogTitle>
        <List sx={{ pt: 0 }}>
          {networks.map((network, key) => (
            <SafeSuspense key={key} fallback={<NetworkStatusCircularProgress color="success" />}>
              <NetworkListItem key={key} index={key} network={network} />
            </SafeSuspense>
          ))}
          <ListItem>
            <ListItemButton onClick={handleOpenAddNetworkDialog}>
              <ListItemAvatar>
                <Avatar>
                  <AddOutlinedIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<React.Fragment>{t`Add a network`}</React.Fragment>}
                secondary={<React.Fragment> </React.Fragment>}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Dialog>
      <AddNetworkDialog />
    </>
  );
};

export default SelectNetworkDialog;
