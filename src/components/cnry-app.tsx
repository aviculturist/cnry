import * as React from 'react';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useAuth } from '@micro-stacks/react';
import {
  useCurrentAccountBalances,
  useCurrentAccountAssetsList,
  useCurrentAccountTransactionsList,
} from '@micro-stacks/query';
import Box from '@mui/system/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import SafeSuspense from '@components/safe-suspense';
import { useQuery } from '@hooks/use-query';
import { cnryMetadataResultAtom } from '@store/cnry';
import useMetadataDialogIsOpen from '@hooks/use-metadata-dialog-is-open';
import { CnryMetadataErrorDialog, CnryMetadataDialog } from '@components/cnry-metadata-dialog';
import { hatchCnryDialogIsOpenAtom } from '@store/hatch-cnry-dialog-is-open';
import HatchCnryDialog from '@components/hatch-cnry';
import ActivityDrawer from '@components/activity-drawer';
import HatchCnryForm from '@components/hatch-cnry-form';
import InstallWalletDialog from '@components/install-wallet-dialog';
import TransactionSnackbars from '@components/transaction-snackbars';
import CnryList from '@components/cnry-list';
import MaintenanceAlert from '@components/maintenance-alert';
import { t } from '@lingui/macro';

const CnryItemQueryPopup = () => {
  const id = useQuery();
  const [metadataResult] = useAtom(cnryMetadataResultAtom(id));
  const { metadataDialogIsOpen, setMetadataDialogIsOpen } = useMetadataDialogIsOpen();

  useEffect(() => {
    id && setMetadataDialogIsOpen(true);
  }, [id, metadataResult, setMetadataDialogIsOpen]);

  if (metadataResult) {
    return <CnryMetadataDialog />;
  } else {
    return <CnryMetadataErrorDialog />;
  }
};

const CnryApp = () => {
  //const [{ stx, non_fungible_tokens }] = useCurrentAccountBalances();
  //const accountTransactions = useCurrentAccountTransactionsList();

  //const [{ stx, non_fungible_tokens }] = useCurrentAccountAssetsList();
  //useCurrentAccountTransactionsList()
  //useCurrentAccountMempoolTransactionsList
  //useCurrentAccountAssetsList
  //console.log(non_fungible_tokens);
  const id = useQuery();
  const [open, setOpen] = useAtom(hatchCnryDialogIsOpenAtom);
  const { isSignedIn, handleSignIn, handleSignOut, isLoading, session } = useAuth();

  return (
    <>
      <main style={{ width: '100%' }}>
        <Stack sx={{ mt: 2 }} spacing={2}>
          <SafeSuspense fallback={<CircularProgress />}>
            <CnryList />
          </SafeSuspense>
          <Box>
            <Stack maxWidth="sm" sx={{ m: 'auto' }} spacing={2}>
              {isSignedIn ? <MaintenanceAlert /> : <></>}
              <Alert severity="info">
                <AlertTitle>About Cnry</AlertTitle>
                {t`Cnry makes it easy to publish and keep track of warrant canaries.`}{' '}
                <strong>
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href="https://github.com/aviculturist/cnry#--cnry"
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
      {id && id !== undefined ? (
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
