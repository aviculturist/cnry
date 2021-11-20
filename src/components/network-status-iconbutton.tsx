import * as React from 'react';
import { t } from '@lingui/macro';
import { useAtom } from 'jotai';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { networkOfflineSnackbarIsDismissedAtom } from '@store/ui/network-offline-snackbar-is-dismissed';
import { useNetworkIsOffline } from '@hooks/use-network-is-offline';
import ProgressIcon from '@components/progress-icon';
import { networkInfoAtom } from '@store/networks';
import { networkInfoIsLoadingAtom } from '@store/ui/network-info-is-loading';

const NetworkStatusIconButton = () => {
  const { networkIsOffline } = useNetworkIsOffline();
  const [, setDismissNetworkOfflineSnackbar] = useAtom(networkOfflineSnackbarIsDismissedAtom);
  const [, dispatchNetworkInfo] = useAtom(networkInfoAtom);
  const [isLoadingInfo, setIsLoadingInfo] = useAtom(networkInfoIsLoadingAtom);

  const timer = React.useRef<number>();

  // fetch latest data
  const refetch = () => {
    if (!isLoadingInfo) {
      setIsLoadingInfo(true);
      timer.current = window.setTimeout(() => {
        setIsLoadingInfo(false);
      }, 2000);
    }
    dispatchNetworkInfo({ type: 'refetch' });
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setDismissNetworkOfflineSnackbar(false);
  };

  return (
    <Tooltip title={networkIsOffline ? 'Network Offline' : 'Network Online'}>
      <IconButton
        onClick={() => refetch()}
        size="small"
        color={networkIsOffline ? 'error' : 'success'}
      >
        <ProgressIcon size={18} left={8} top={8} />
      </IconButton>
    </Tooltip>
  );
};
export default NetworkStatusIconButton;
