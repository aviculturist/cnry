import * as React from 'react';
import { useEffect, useCallback } from 'react';
import { t } from '@lingui/macro';
import { useAtom } from 'jotai';
import { useAuth } from '@micro-stacks/react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Skeleton from '@mui/material/Skeleton';
import {
  myCnryTokenIdsAtom,
  myWatchingTokenIdsAtom,
  browseCurrentPageAllCnryTokenIdsAtom,
  userHasCnrysAtom,
  userIsWatchingCnrysAtom,
} from '@store/cnry';
import { myNftTransactionsAtom, cnryUserPendingTxIdsAtom } from '@store/transactions';
import cnryListTabStateAtom from '@store/ui/cnry-list-tab-state';
import { PendingCnryCardFromTxId } from '@components/cnry-card';
import CnryCard from '@components/cnry-card';
import HatchCnryForm from '@components/forms/hatch-cnry-form';
import SafeSuspense from '@components/safe-suspense';
import { currentPendingTxIdsAtom } from '@store/transactions';
import MaintenanceAlert from '@components/maintenance-alert';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import BasicPagination from '@components/pagination';
import CnryCardSkeleton from '@components/cnry-card-skeleton';

interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cnry-tabpanel-${index}`}
      aria-labelledby={`cnry-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
};

const CnryList = () => {
  const { session } = useAuth();
  const [, dispatchMyNftTransactions] = useAtom(myNftTransactionsAtom);
  const [myWatchingTokenIds, dispatchMyWatchingTokenIds] = useAtom(myWatchingTokenIdsAtom);
  const [userPendingTxids] = useAtom(cnryUserPendingTxIdsAtom);
  const [cnryAllTokenIds] = useAtom(browseCurrentPageAllCnryTokenIdsAtom);
  const [cnryListTabState, setCnryListTabState] = useAtom(cnryListTabStateAtom);
  const [userHasCnrys] = useAtom(userHasCnrysAtom);
  const [userIsWatchingCnrys] = useAtom(userIsWatchingCnrysAtom);
  const [myCnryIds] = useAtom(myCnryTokenIdsAtom);
  const [pendingTxIds] = useAtom(currentPendingTxIdsAtom);

  // fetch latest data
  // https://typeofnan.dev/fix-the-maximum-update-depth-exceeded-error-in-react/
  const refetch = useCallback(() => {
    dispatchMyNftTransactions({ type: 'refetch' });
    dispatchMyWatchingTokenIds({ type: 'refetch' });
  }, []);

  // immediately refetch user queries upon signin/signout/transaction
  useEffect(() => {
    refetch();
  }, [dispatchMyNftTransactions, session, pendingTxIds, dispatchMyWatchingTokenIds, refetch]);

  useEffect(() => {
    if (userHasCnrys) {
      setCnryListTabState('two');
    } else {
      setCnryListTabState('one');
    }
  }, [setCnryListTabState, userHasCnrys]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setCnryListTabState(newValue);
  };

  const horizontalMyPendingCnrysList = () => (
    <ImageList
      sx={{
        gridAutoFlow: 'column',
        gridTemplateColumns: 'repeat(auto-fit, minmax(292px,1fr)) !important',
        gridAutoColumns: 'minmax(292px, 1fr)',
      }}
    >
      <Stack component="div" direction="row" spacing={2}>
        {userPendingTxids.map(txid => (
          <ImageListItem key={txid}>
            <PendingCnryCardFromTxId key={txid} txid={txid} />
          </ImageListItem>
        ))}
      </Stack>
    </ImageList>
  );

  const verticalMyCnrysList = () => (
    <ImageList variant="masonry" cols={2} sx={{ mt: 0 }}>
      {myCnryIds.map(tokenId => (
        <ImageListItem sx={{ width: '100%', m: 'auto' }} key={tokenId.toString()}>
          <SafeSuspense key={tokenId.toString()} fallback={<CnryCardSkeleton />}>
            <CnryCard key={tokenId.toString()} tokenId={tokenId} />
          </SafeSuspense>
        </ImageListItem>
      ))}
    </ImageList>
  );

  const verticalWatchingCnrysList = () => (
    <ImageList variant="masonry" cols={2} sx={{ mt: 0 }}>
      {myWatchingTokenIds.map(tokenId => (
        <ImageListItem sx={{ width: '100%', m: 'auto' }} key={tokenId.toString()}>
          <SafeSuspense key={tokenId.toString()} fallback={<CnryCardSkeleton />}>
            <CnryCard key={tokenId.toString()} tokenId={tokenId} />
          </SafeSuspense>
        </ImageListItem>
      ))}
    </ImageList>
  );
  const verticalAllCnrysList = () => (
    <>
      <ImageList variant="masonry" cols={2} sx={{ mt: 0 }}>
        {cnryAllTokenIds.map(tokenId => (
          <ImageListItem sx={{ width: '100%', m: 'auto' }} key={tokenId.toString()}>
            <SafeSuspense key={tokenId.toString()} fallback={<CnryCardSkeleton />}>
              <CnryCard key={tokenId.toString()} tokenId={tokenId} />
            </SafeSuspense>
          </ImageListItem>
        ))}
      </ImageList>
      <BasicPagination />
    </>
  );

  return (
    <div>
      <Tabs value={cnryListTabState} onChange={handleChange} centered>
        <Tab value="one" label={t`New`} />
        <Tab value="two" label={t`My Cnrys`} disabled={!userHasCnrys} />
        <Tab value="three" label={t`Watching`} disabled={!userIsWatchingCnrys} />
        <Tab value="four" label={t`Browse`} />
      </Tabs>
      <TabPanel value={cnryListTabState} index="one">
        <>
          <SafeSuspense
            fallback={
              <>
                <Skeleton sx={{ m: 'auto' }} variant="rectangular" width={600} height={400} />
              </>
            }
          >
            <HatchCnryForm />
          </SafeSuspense>

          <Stack maxWidth="sm" sx={{ m: 'auto' }}>
            <SafeSuspense
              fallback={
                <>
                  <Skeleton sx={{ m: 'auto' }} variant="rectangular" width={600} height={300} />
                </>
              }
            >
              {horizontalMyPendingCnrysList()}
            </SafeSuspense>
          </Stack>

          <Stack sx={{ mt: 3 }} spacing={2}>
            <Box>
              <Stack maxWidth="sm" sx={{ m: 'auto' }} spacing={2}>
                <SafeSuspense fallback={<></>}>
                  <MaintenanceAlert />
                </SafeSuspense>
                <Alert severity="info">
                  <AlertTitle>{t`About Cnry`}</AlertTitle>
                  {t`Cnry makes it easy to publish and keep track of warrant canaries. Transactions settle on Bitcoin via Stacks.`}{' '}
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
        </>
      </TabPanel>
      <TabPanel value={cnryListTabState} index="two">
        <Stack maxWidth="sm" sx={{ m: 'auto' }}>
          {verticalMyCnrysList()}
        </Stack>
      </TabPanel>
      <TabPanel value={cnryListTabState} index="three">
        <Stack maxWidth="sm" sx={{ m: 'auto' }}>
          {verticalWatchingCnrysList()}
        </Stack>
      </TabPanel>
      <TabPanel value={cnryListTabState} index="four">
        <Stack maxWidth="sm" sx={{ m: 'auto' }}>
          {verticalAllCnrysList()}
        </Stack>
      </TabPanel>
    </div>
  );
};
export default CnryList;

// const tokenIds = txs?.nft_events
// .filter(
//   tx => tx.asset_identifier === `${cnryContract}::CNRY`
//   // || tx.asset_identifier === `${contractAddress}.cnry::CNRY` // v1
// )
// .map(tx => {
//   const content = tx.value.repr.replace(`u`, '');
//   re
// const verticalMyCnrysList = () => (
//   <ImageList variant="masonry" cols={2} sx={{ mt: 0 }}>
//     {accountTransactions
//       .filter(
//         tx =>
//           (tx)?.tx_type === 'contract_call' &&
//           tx?.contract_call.contract_id === cnryContract &&
//           tx?.contract_call.function_name === 'hatch' &&
//           tx?.tx_status === 'success'
//       )
//       //       .map(tx => {
//       //         const content = (tx as ContractCallTransaction).tx_result.repr
//       //           .replace(`(ok u`, '')
//       //           .replace(`)`, '');
//       //         return Number(content);
//       //       });
//       .map(tokenId => (
//         <ImageListItem sx={{ width: '100%', m: 'auto' }} key={tokenId.toString()}>
//           <CnryCard key={tokenId.toString()} tokenId={tokenId} />
//         </ImageListItem>
//       ))}
//   </ImageList>
// );
