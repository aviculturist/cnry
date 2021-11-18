import * as React from 'react';
import { useEffect } from 'react';
import { t } from '@lingui/macro';
import { useAtom } from 'jotai';
import { useAuth } from '@micro-stacks/react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Skeleton from '@mui/material/Skeleton';
import {
  myNftTransactionsAtom,
  cnryUserPendingTxIdsAtom,
  myCnryTokenIdsAtom,
  myWatchingTokenIdsAtom,
  browseCurrentPageAllCnryTokenIdsAtom,
  userHasCnrysAtom,
  userIsWatchingCnrysAtom,
} from '@store/cnry';
import cnryListTabStateAtom from '@store/ui/cnry-list-tab-state';
import { PendingCnryCardFromTxId } from '@components/cnry-card';
import CnryCard from '@components/cnry-card';
import HatchCnryForm from '@components/forms/hatch-cnry-form';
import SafeSuspense from '@components/safe-suspense';
import { userPendingTxIdsAtom, userPendingTxsCountAtom } from '@store/cnry';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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
  const { isSignedIn, handleSignIn, handleSignOut, isLoading, session } = useAuth();
  const [myNftTransactions, dispatchMyNftTransactions] = useAtom(myNftTransactionsAtom);
  const [myWatchingTokenIds, dispatchMyWatchingTokenIds] = useAtom(myWatchingTokenIdsAtom);
  const [userPendingTxids] = useAtom(cnryUserPendingTxIdsAtom);
  const [cnryAllTokenIds] = useAtom(browseCurrentPageAllCnryTokenIdsAtom);
  const [value, setValue] = useAtom(cnryListTabStateAtom);
  const [userHasCnrys] = useAtom(userHasCnrysAtom);
  const [userIsWatchingCnrys] = useAtom(userIsWatchingCnrysAtom);
  const [myCnryIds] = useAtom(myCnryTokenIdsAtom);
  const [pendingTxIds, setPendingTxIds] = useAtom(userPendingTxIdsAtom);

  // immediately refetch user queries upon signin/signout/transaction
  useEffect(() => {
    // fetch latest data
    const refetch = () => {
      dispatchMyNftTransactions({ type: 'refetch' });
      dispatchMyWatchingTokenIds({ type: 'refetch' });
    };
    refetch();
  }, [dispatchMyNftTransactions, session, pendingTxIds, dispatchMyWatchingTokenIds]);

  useEffect(() => {
    if (userHasCnrys) {
      setValue('two');
    } else {
      setValue('one');
    }
  }, [setValue, userHasCnrys]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
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
        <ImageListItem sx={{ width: '100%', m: 'auto' }} key={tokenId}>
          <CnryCard key={tokenId} tokenId={tokenId} />
        </ImageListItem>
      ))}
    </ImageList>
  );

  const verticalWatchingCnrysList = () => (
    <ImageList variant="masonry" cols={2} sx={{ mt: 0 }}>
      {myWatchingTokenIds.map(tokenId => (
        <ImageListItem sx={{ width: '100%', m: 'auto' }} key={tokenId}>
          <CnryCard key={tokenId} tokenId={tokenId} />
        </ImageListItem>
      ))}
    </ImageList>
  );
  const verticalAllCnrysList = () => (
    <ImageList variant="masonry" cols={2} sx={{ mt: 0 }}>
      {cnryAllTokenIds.map(tokenId => (
        <ImageListItem sx={{ width: '100%', m: 'auto' }} key={tokenId}>
          <CnryCard key={tokenId} tokenId={tokenId} />
        </ImageListItem>
      ))}
    </ImageList>
  );

  return (
    <div>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab value="one" label={t`New`} />
        <Tab value="two" label={t`My Cnrys`} disabled={!userHasCnrys} />
        <Tab value="three" label={t`Watching`} disabled={!userIsWatchingCnrys} />
        <Tab value="four" label={t`Browse`} />
      </Tabs>
      <TabPanel value={value} index="one">
        <SafeSuspense
          fallback={
            <>
              <Skeleton sx={{ m: 'auto' }} variant="rectangular" width={600} height={400} />
            </>
          }
        >
          <HatchCnryForm />
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
        </SafeSuspense>
      </TabPanel>
      <TabPanel value={value} index="two">
        <Stack maxWidth="sm" sx={{ m: 'auto' }}>
          <SafeSuspense fallback={<CircularProgress sx={{ m: 'auto' }} />}>
            {verticalMyCnrysList()}
          </SafeSuspense>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index="three">
        <Stack maxWidth="sm" sx={{ m: 'auto' }}>
          <SafeSuspense fallback={<CircularProgress sx={{ m: 'auto' }} />}>
            {verticalWatchingCnrysList()}
          </SafeSuspense>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index="four">
        <Stack maxWidth="sm" sx={{ m: 'auto' }}>
          <SafeSuspense fallback={<CircularProgress sx={{ m: 'auto' }} />}>
            {verticalAllCnrysList()}
          </SafeSuspense>
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
//         <ImageListItem sx={{ width: '100%', m: 'auto' }} key={tokenId}>
//           <CnryCard key={tokenId} tokenId={tokenId} />
//         </ImageListItem>
//       ))}
//   </ImageList>
// );
