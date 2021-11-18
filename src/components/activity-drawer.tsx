import * as React from 'react';
import { t } from '@lingui/macro';
import { useAtom } from 'jotai';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import useTransactionsDrawerIsOpen from '@hooks/use-transactions-drawer-is-open';
import {
  cnryContractTransactionIdsAtom,
  userPendingTxIdsAtom,
  userPendingTxAtom,
} from '@store/cnry';
import UserPendingTxItem from '@components/user-pending-tx-item';
import TxItem from '@components/tx-item';

const ActivityDrawer = () => {
  const { transactionsDrawerIsOpen, setTransactionsDrawerIsOpen } = useTransactionsDrawerIsOpen();
  const [userPendingTxIds] = useAtom(userPendingTxIdsAtom);
  const [cnryTransactionIds] = useAtom(cnryContractTransactionIdsAtom);
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setTransactionsDrawerIsOpen(open);
  };

  const userPendingTransactionslist = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        subheader={
          userPendingTxIds.length > 0 ? <ListSubheader>{t`Pending`}</ListSubheader> : <></>
        }
      >
        {userPendingTxIds.map(txid => (
          <UserPendingTxItem key={txid} txid={txid} />
        ))}
      </List>
      {/* <Pagination count={10} siblingCount={0} boundaryCount={0} /> */}
    </Box>
  );

  const cnryTransactionslist = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        subheader={<ListSubheader>{t`Activity`}</ListSubheader>}
      >
        {cnryTransactionIds.map(txid => (
          <TxItem key={txid} txid={txid} />
        ))}
      </List>
      {/* <Pagination count={10} siblingCount={0} boundaryCount={0} /> */}
    </Box>
  );

  return (
    <div>
      <Drawer anchor="right" open={transactionsDrawerIsOpen} onClose={toggleDrawer(false)}>
        {userPendingTransactionslist()}
        {cnryTransactionslist()}
      </Drawer>
    </div>
  );
};
export default ActivityDrawer;
