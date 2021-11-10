import * as React from 'react';
import { useAtom } from 'jotai';
import { useNetwork } from '@micro-stacks/react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { networkOfflineSnackbarIsDismissedAtom } from '@store/network-offline-snackbar-is-dismissed';
import { useNetworkIsOffline } from '@hooks/use-network-is-offline';
import { t } from '@lingui/macro';

const NetworkOfflineSnackbar = () => {
  const { networkIsOffline } = useNetworkIsOffline();
  const { network } = useNetwork();
  const [dismissNetworkOfflineSnackbar, setDismissNetworkOfflineSnackbar] = useAtom(
    networkOfflineSnackbarIsDismissedAtom
  );

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setDismissNetworkOfflineSnackbar(true);
  };

  const action = (
    <React.Fragment>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Snackbar
      open={networkIsOffline && dismissNetworkOfflineSnackbar === false}
      autoHideDuration={60000}
      onClose={handleClose}
    >
      <Alert action={action} severity="error">
        <AlertTitle>{t`Network Problem`}</AlertTitle>
        {network.getCoreApiUrl()} is unreachable.
      </Alert>
    </Snackbar>
  );
};
export default NetworkOfflineSnackbar;
