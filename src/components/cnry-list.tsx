import * as React from 'react';
import { useAtom } from 'jotai';
import {
  useCurrentAccountBalances,
  useCurrentAccountAssetsList,
  useCurrentAccountTransactionsList,
} from '@micro-stacks/query';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import ListSubheader from '@mui/material/ListSubheader';
import { userPendingTxIdsAtom } from '@store/user-pending-transactions';
import { cnryIdsAtom } from '@store/cnry';
import PendingCnryCardFromTxId from '@components/user-pending-tx-item';
import { CnryCardFromTxId } from '@components/cnry-card';
import HatchCnryForm from '@components/hatch-cnry-form';
import SafeSuspense from '@components/safe-suspense';
import { t } from '@lingui/macro';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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
  const [userPendingTxIds] = useAtom(userPendingTxIdsAtom);
  const [cnryTransactionIds] = useAtom(cnryIdsAtom);
  const [value, setValue] = React.useState(0);
  //const [assetsList, dispatchAssetsList] = useCurrentAccountAssetsList();
  // TODO: set a flag for each owned asset to determine which tabs should be disabled
  // const assetList = assetsList?.pages[0].results.map(k => k.asset);
  // const assetNew = assetList?.filter(m => m.asset_event_type === 'mint');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
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
            <CnryCardFromTxId key={txid} txid={txid} />
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
      <Tabs value={value} onChange={handleChange} aria-label="disabled tabs example" centered>
        <Tab label="New" />
        <Tab label="My Cnrys" disabled={userHasCnrys ? false : true} />
        <Tab label="Watching" disabled={userHasWatching ? false : true} />
        <Tab label="Browse" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <HatchCnryForm />
        <Stack maxWidth="sm" sx={{ m: 'auto' }}>
          <SafeSuspense fallback={<CircularProgress />}>
            {horizontalBrowseUserPendingCnrysList()}
          </SafeSuspense>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Stack maxWidth="sm" sx={{ m: 'auto' }}>
          <SafeSuspense fallback={<CircularProgress />}>{verticalBrowseCnrysList()}</SafeSuspense>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Stack maxWidth="sm" sx={{ m: 'auto' }}>
          <SafeSuspense fallback={<CircularProgress />}>{verticalBrowseCnrysList()}</SafeSuspense>{' '}
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Stack maxWidth="sm" sx={{ m: 'auto' }}>
          <SafeSuspense fallback={<CircularProgress />}>{verticalBrowseCnrysList()}</SafeSuspense>{' '}
        </Stack>
      </TabPanel>
    </div>
  );
};
export default CnryList;
