import * as React from 'react';
import { useAtom } from 'jotai';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { userPendingTxIdsAtom } from '@store/user-pending-transactions';
import { cnryTokenIdsAtom, userCnryTokenIdsAtom } from '@store/cnry';
import { PendingCnryCardFromTxId, CnryCardFromTxId } from '@components/cnry-card';
import HatchCnryForm from '@components/hatch-cnry-form';
import SafeSuspense from '@components/safe-suspense';
import cnryListTabStateAtom from '@store/cnry-list-tab-state';
import { t } from '@lingui/macro';
import Skeleton from '@mui/material/Skeleton';
import { networkAtom, userStxAddressesAtom } from '@micro-stacks/react';
import { ChainID } from 'micro-stacks/common';

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
  const [userPendingTxIds] = useAtom(userPendingTxIdsAtom);
  const [cnryTransactionIds] = useAtom(cnryTokenIdsAtom);
  const [userCnryTokenIds] = useAtom(userCnryTokenIdsAtom(userStxAddress));
  const [value, setValue] = useAtom(cnryListTabStateAtom);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const userPendingHatchesList = () => (
    <Box component="div" sx={{ width: 250 }} role="presentation">
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        //subheader={<ListSubheader>{t`Transactions`}</ListSubheader>}
      >
        {userPendingTxIds.map(txid => (
          <PendingCnryCardFromTxId key={txid} txid={txid} />
        ))}
      </List>
    </Box>
  );
  const userWatchingCnrysList = () => (
    <ImageList
      sx={{
        gridAutoFlow: 'column',
        gridTemplateColumns: 'repeat(auto-fit, minmax(292px,1fr)) !important',
        gridAutoColumns: 'minmax(292px, 1fr)',
      }}
    >
      <Stack component="div" direction="row" spacing={2}>
        {cnryTransactionIds.map(txid => (
          <ImageListItem key={txid}>
            <CnryCardFromTxId key={txid} txid={txid} />
          </ImageListItem>
        ))}
      </Stack>
    </ImageList>
  );

  const horizontalBrowseUserPendingCnrysList = () => (
    <ImageList
      sx={{
        gridAutoFlow: 'column',
        gridTemplateColumns: 'repeat(auto-fit, minmax(292px,1fr)) !important',
        gridAutoColumns: 'minmax(292px, 1fr)',
      }}
    >
      <Stack component="div" direction="row" spacing={2}>
        {userPendingTxIds.map(txid => (
          <ImageListItem key={txid}>
            <PendingCnryCardFromTxId key={txid} txid={txid} />
          </ImageListItem>
        ))}
      </Stack>
    </ImageList>
  );
  const verticalBrowseCnrysList = () => (
    <ImageList cols={2} sx={{ mt: 0 }}>
      {/* <Stack  sx={{justifyContent: 'center'}} component="div" direction="column" spacing={2}> */}
      {cnryTransactionIds.map(txid => (
        <ImageListItem sx={{ width: '100%', m: 'auto' }} key={txid}>
          <CnryCardFromTxId key={txid} txid={txid} />
        </ImageListItem>
      ))}
      {/* </Stack> */}
    </ImageList>
  );

  const verticalBrowseUserCnrysList = () => (
    <ImageList cols={2} sx={{ mt: 0 }}>
      {/* <Stack  sx={{justifyContent: 'center'}} component="div" direction="column" spacing={2}> */}
      {userCnryTokenIds.map(txid => (
        <ImageListItem sx={{ width: '100%', m: 'auto' }} key={txid}>
          <CnryCardFromTxId key={txid} txid={txid} />
        </ImageListItem>
      ))}
      {/* </Stack> */}
    </ImageList>
  );
  const cnryList = () => (
    <ImageList
      sx={{
        gridAutoFlow: 'column',
        gridTemplateColumns: 'repeat(auto-fit, minmax(292px,1fr)) !important',
        gridAutoColumns: 'minmax(292px, 1fr)',
      }}
    >
      <Stack maxWidth="sm" component="div" direction="row" spacing={2}>
        {cnryTransactionIds.map(txid => (
          <ImageListItem key={txid}>
            <CnryCardFromTxId key={txid} txid={txid} />
          </ImageListItem>
        ))}
      </Stack>
    </ImageList>
  );
  const userHasCnrys = true;
  const userHasWatching = true;

  return (
    <div>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab value="one" label="New" />
        <Tab value="two" label="My Cnrys" disabled={userHasCnrys ? false : true} />
        <Tab value="three" label="Watching" disabled={userHasWatching ? false : true} />
        <Tab value="four" label="Browse" />
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
            <SafeSuspense fallback={<CircularProgress />}>
              {horizontalBrowseUserPendingCnrysList()}
            </SafeSuspense>
          </Stack>
        </SafeSuspense>
      </TabPanel>
      <TabPanel value={value} index="two">
        <Stack maxWidth="sm" sx={{ m: 'auto' }}>
          <SafeSuspense fallback={<CircularProgress />}>{verticalBrowseUserCnrysList()}</SafeSuspense>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index="three">
        <Stack maxWidth="sm" sx={{ m: 'auto' }}>
          <SafeSuspense fallback={<CircularProgress />}>{verticalBrowseCnrysList()}</SafeSuspense>{' '}
        </Stack>
      </TabPanel>
      <TabPanel value={value} index="four">
        <Stack maxWidth="sm" sx={{ m: 'auto' }}>
          <SafeSuspense fallback={<CircularProgress />}>{verticalBrowseCnrysList()}</SafeSuspense>{' '}
        </Stack>
      </TabPanel>
    </div>
  );
};
export default CnryList;
