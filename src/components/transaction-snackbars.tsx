import * as React from 'react';
import { useAtom } from 'jotai';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LaunchIcon from '@mui/icons-material/Launch';
import { currentStacksExplorerState, currentChainState } from '@utils/helpers';
import { currentPendingTxIdsAtom, userPendingTxAtom } from '@store/transactions';
import { truncateMiddle } from '@utils/common';

const SingleTransactionSnackbar = ({ txid }: { txid: string }) => {
  const [dismissed, setDismissed] = React.useState(false);
  const [tx, setTx] = useAtom(userPendingTxAtom(txid));
  const [explorer] = useAtom(currentStacksExplorerState);
  const [chain] = useAtom(currentChainState);

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setDismissed(true);
  };

  const action = (
    <React.Fragment>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Snackbar
      key={`${txid}-tx-sb`}
      open={
        !dismissed &&
        (tx.txstatus === 'submitted' ||
          tx.txstatus == 'pending' ||
          tx.txstatus === 'aborted' ||
          tx.txstatus === 'dropped' ||
          tx.txstatus === 'success')
      }
      //autoHideDuration={6000}
    >
      <Alert
        action={action}
        severity={tx.txstatus === 'submitted' || tx.txstatus === 'pending' ? 'info' : 'success'}
        onClose={handleClose}
        sx={{ width: '100%' }}
      >
        <AlertTitle>Transaction {tx.txstatus}</AlertTitle>
        <strong>{truncateMiddle(txid)}</strong>
        <IconButton
          target="_blank"
          href={`${explorer}/txid/${txid}?chain=${chain}`}
          aria-label="go"
        >
          <LaunchIcon fontSize="small" />
        </IconButton>
      </Alert>
    </Snackbar>
  );
};

// TODO: not entirely sure if looping through all pending transactions is the best pattern
const TransactionSnackbars = () => {
  const [currentPendingTxIds] = useAtom(currentPendingTxIdsAtom);
  console.log('TransactionSnackbars');
  console.log(currentPendingTxIds);
  return (
    <div>
      {currentPendingTxIds.map(txid => (
        <SingleTransactionSnackbar key={`${txid}-single-tx-sb`} txid={txid} />
      ))}
    </div>
  );
};
export default TransactionSnackbars;
