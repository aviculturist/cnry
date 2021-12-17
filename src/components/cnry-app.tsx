import * as React from 'react';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import SafeSuspense from '@components/safe-suspense';
import { useIdQuery } from '@hooks/use-queries';
import { cnryGetMetadataAtom } from '@store/cnry';
import useSingleCnryDialogIsOpen from '@hooks/use-metadata-dialog-is-open';
import { SingleCnryErrorDialog, SingleCnryDialog } from '@components/single-cnry-dialog';
import HatchCnryDialog from '@components/hatch-cnry-dialog';
import ActivityDrawer from '@components/activity-drawer';
import InstallWalletDialog from '@components/install-wallet-dialog';
import TransactionSnackbars from '@components/transaction-snackbars';
import CnryList from '@components/cnry-list';
import CnryListSkeleton from '@components/cnry-list-skeleton';

const CnryItemQueryPopup = () => {
  const tokenId = useIdQuery();
  const [cnryMetadata] = useAtom(cnryGetMetadataAtom(tokenId));
  const { setSingleCnryDialogIsOpen: setMetadataDialogIsOpen } = useSingleCnryDialogIsOpen();

  useEffect(() => {
    tokenId && setMetadataDialogIsOpen(true);
  }, [tokenId, cnryMetadata, setMetadataDialogIsOpen]);

  if (cnryMetadata) {
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
          <SafeSuspense fallback={<CnryListSkeleton />}>
            <CnryList />
          </SafeSuspense>
        </Stack>
      </main>

      <SafeSuspense fallback={<></>}>
        <ActivityDrawer />
      </SafeSuspense>
      {tokenId !== undefined ? (
        <SafeSuspense fallback={<></>}>
          <CnryItemQueryPopup />
        </SafeSuspense>
      ) : (
        ''
      )}
      <SafeSuspense fallback={<></>}>
        <HatchCnryDialog />
      </SafeSuspense>
      <SafeSuspense fallback={<></>}>
        <TransactionSnackbars />
      </SafeSuspense>

      <InstallWalletDialog />
    </>
  );
};
export default CnryApp;
