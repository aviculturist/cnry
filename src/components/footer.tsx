import * as React from 'react';
import { t } from '@lingui/macro';
import { Suspense } from 'react';
import { useAtom } from 'jotai';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {
  BitcoinBlockHeightButtonSkeleton,
  BitcoinBlockHeightButton,
} from '@components/bitcoin-block-height-button';
import {
  StacksChainTipButtonSkeleton,
  StacksChainTipButton,
} from '@components/stacks-chain-tip-button';
import NetworkOfflineSnackbar from '@components/network-offline-snackbar';
import NetworkStatusIconButton from '@components/network-status-iconbutton';
import SafeSuspense from '@components/safe-suspense';
import { cnryLastIdAtom, watcherLastIdAtom } from '@store/cnry';
import { GITHUB_URL } from '@utils/constants';

const CountBlurb = () => {
  const [cnryLastId] = useAtom(cnryLastIdAtom);
  const [watcherLastId] = useAtom(watcherLastIdAtom);
  return (
    <Button
      disabled
      sx={{ m: 'auto', textTransform: 'none' }}
      size="small"
      color="secondary"
      variant="text"
    >{`${cnryLastId} cnrys hatched with ${watcherLastId} watchers`}</Button>
  );
};

const CountBlurbSkeleton = () => {
  return (
    <Button
      disabled
      sx={{ m: 'auto', textTransform: 'none' }}
      size="small"
      color="secondary"
      variant="text"
    >{`? cnrys hatched with ? watchers`}</Button>
  );
};

const Footer = () => {
  const buildHash = process.env.NEXT_PUBLIC_COMMIT_HASH || '';
  const buildHashShort = buildHash.slice(0, 7);

  return (
    <AppBar position="fixed" color="transparent" elevation={3} sx={{ top: 'auto', bottom: 0 }}>
      {/* Footer */}
      <Toolbar>
        <Suspense fallback={<></>}>
          <NetworkStatusIconButton />
        </Suspense>
        <Button
          sx={{ textTransform: 'none' }}
          size="small"
          color="secondary"
          variant="text"
          target="_blank"
          href={`${GITHUB_URL}/commit/${buildHash}`}
        >{`${buildHashShort}`}</Button>
        <Button
          size="small"
          color="inherit"
          target="_blank"
          href={`${GITHUB_URL}/graphs/contributors`}
        >
          {'© '}
          {t`contributors`}
          <Tooltip title={t`Made with Love`}>
            <FavoriteIcon sx={{ ml: 1 }} color="error" fontSize="inherit" />
          </Tooltip>
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <SafeSuspense fallback={<CountBlurbSkeleton />}>
          <CountBlurb />
        </SafeSuspense>
        <Suspense fallback={<BitcoinBlockHeightButtonSkeleton />}>
          <BitcoinBlockHeightButton />
        </Suspense>
        <Suspense fallback={<StacksChainTipButtonSkeleton />}>
          <StacksChainTipButton />
        </Suspense>
      </Toolbar>
      {/* End footer */}
      <Suspense fallback={<></>}>
        <NetworkOfflineSnackbar />
      </Suspense>
    </AppBar>
  );
};
export default Footer;
