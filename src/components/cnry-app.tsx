import * as React from 'react';
import { useEffect } from 'react';
import { t } from '@lingui/macro';
import { useAtom } from 'jotai';
import Box from '@mui/system/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import SafeSuspense from '@components/safe-suspense';
import { useIdQuery } from '@hooks/use-queries';
import { cnryGetMetadataAtom } from '@store/cnry';
import useSingleCnryDialogIsOpen from '@hooks/use-metadata-dialog-is-open';
import { SingleCnryErrorDialog, SingleCnryDialog } from '@components/single-cnry-dialog';
import HatchCnryDialog from '@components/hatch-cnry';
import ActivityDrawer from '@components/activity-drawer';
import InstallWalletDialog from '@components/install-wallet-dialog';
import TransactionSnackbars from '@components/transaction-snackbars';
import CnryList from '@components/cnry-list';
import MaintenanceAlert from '@components/maintenance-alert';

const CnryItemQueryPopup = () => {
  const tokenId = useIdQuery();
  const [metadataResult] = useAtom(cnryGetMetadataAtom(tokenId));
  const { setSingleCnryDialogIsOpen: setMetadataDialogIsOpen } = useSingleCnryDialogIsOpen();

  useEffect(() => {
    tokenId && setMetadataDialogIsOpen(true);
  }, [tokenId, metadataResult, setMetadataDialogIsOpen]);

  if (metadataResult) {
    return <SingleCnryDialog />;
  } else {
    return <SingleCnryErrorDialog />;
  }
};

const CnryApp = () => {
  const tokenId = useIdQuery();

  return (
    <>
      <main style={{ width: '100%' }}>
        <Stack sx={{ mt: 2 }} spacing={2}>
          <SafeSuspense fallback={<CircularProgress />}>
            <CnryList />
          </SafeSuspense>
          <Box>
            <Stack maxWidth="sm" sx={{ m: 'auto' }} spacing={2}>
              <MaintenanceAlert />
              <Alert severity="info">
                <AlertTitle>{t`About Cnry`}</AlertTitle>
                {t`Cnry makes it easy to publish and keep track of warrant canaries.`}{' '}
                <strong>
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href="https://github.com/aviculturist/cnry#-cnry"
                  >
                    Learn more.
                  </a>
                </strong>
              </Alert>
            </Stack>
          </Box>
        </Stack>
      </main>

      <SafeSuspense fallback={<CircularProgress />}>
        <ActivityDrawer />
      </SafeSuspense>
      {tokenId !== undefined ? (
        <SafeSuspense fallback={<CircularProgress />}>
          <CnryItemQueryPopup />
        </SafeSuspense>
      ) : (
        ''
      )}
      <SafeSuspense fallback={<CircularProgress />}>
        <HatchCnryDialog />
      </SafeSuspense>
      <SafeSuspense fallback={<CircularProgress />}>
        <TransactionSnackbars />
      </SafeSuspense>

      <InstallWalletDialog />
    </>
  );
};
export default CnryApp;
