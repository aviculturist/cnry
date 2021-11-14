import * as React from 'react';
import { useEffect } from 'react';
import { t } from '@lingui/macro';
import { useAtom } from 'jotai';
import { ChainID } from 'micro-stacks/common';
import { networkAtom, userStxAddressesAtom } from '@micro-stacks/react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Skeleton from '@mui/material/Skeleton';
import { cnryUserPendingTxIdsAtom } from '@store/cnry';
import { cnryTokenIdsAtom, cnryUserTokenIdsAtom, cnryUserWatcherTokenIdsAtom } from '@store/cnry';
import cnryListTabStateAtom from '@store/ui/cnry-list-tab-state';
import { PendingCnryCardFromTxId, CnryCardFromTxId } from '@components/cnry-card';
import CnryCard from '@components/cnry-card';
import HatchCnryForm from '@components/forms/hatch-cnry-form';
import SafeSuspense from '@components/safe-suspense';

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
  const [network] = useAtom(networkAtom);
  const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
  const [userStxAddresses] = useAtom(userStxAddressesAtom);
  const userStxAddress = userStxAddresses?.[chain] || '';
  const [userPendingTxids] = useAtom(cnryUserPendingTxIdsAtom);
  const [cnryAllTokenIds] = useAtom(cnryTokenIdsAtom);
  const [cnryUserTokenIds] = useAtom(cnryUserTokenIdsAtom(userStxAddress));
  const [watcherUserTokenIds] = useAtom(cnryUserWatcherTokenIdsAtom(userStxAddress));
  const [value, setValue] = useAtom(cnryListTabStateAtom);
  const userHasCnrys =
    cnryUserTokenIds === undefined || cnryUserTokenIds.length == 0 ? false : true;
  const userHasWatching =
    watcherUserTokenIds === undefined || watcherUserTokenIds.length == 0 ? false : true;

  // TODO: what happens if the user is not signed in?
  useEffect(() => {
    if (userHasCnrys) {
      setValue('two');
    } else {
      setValue('one');
    }
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const horizontalUserPendingCnrysList = () => (
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

  const verticalUserWatcherCnrysList = () => (
    <ImageList variant="masonry" cols={2} sx={{ mt: 0 }}>
      {watcherUserTokenIds.map(tokenId => (
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

  const verticalUserCnrysList = () => (
    <ImageList variant="masonry" cols={2} sx={{ mt: 0 }}>
      {cnryUserTokenIds.map(tokenId => (
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
        <Tab value="two" label={t`My Cnrys`} disabled={userHasCnrys ? false : true} />
        <Tab value="three" label={t`Watching`} disabled={userHasWatching ? false : true} />
        <Tab value="four" label={t`Browse`} />
      </Tabs>
      <TabPanel value={value} index="one">
        <SafeSuspense
          fallback={
            <>
              <Skeleton sx={{ m: 'auto' }} variant="rectangular" width={400} height={200} />
            </>
          }
        >
          <HatchCnryForm />
          <Stack maxWidth="sm" sx={{ m: 'auto' }}>
            <SafeSuspense fallback={<CircularProgress sx={{ m: 'auto' }} />}>
              {horizontalUserPendingCnrysList()}
            </SafeSuspense>
          </Stack>
        </SafeSuspense>
      </TabPanel>
      <TabPanel value={value} index="two">
        <Stack maxWidth="sm" sx={{ m: 'auto' }}>
          <SafeSuspense fallback={<CircularProgress sx={{ m: 'auto' }} />}>
            {verticalUserCnrysList()}
          </SafeSuspense>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index="three">
        <Stack maxWidth="sm" sx={{ m: 'auto' }}>
          <SafeSuspense fallback={<CircularProgress sx={{ m: 'auto' }} />}>
            {verticalUserWatcherCnrysList()}
          </SafeSuspense>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index="four">
        <Stack maxWidth="sm" sx={{ m: 'auto' }}>
          <SafeSuspense fallback={<CircularProgress sx={{ m: 'auto' }} />}>
            {verticalAllCnrysList()}
          </SafeSuspense>{' '}
        </Stack>
      </TabPanel>
    </div>
  );
};
export default CnryList;
