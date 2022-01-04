import * as React from 'react';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import { t } from '@lingui/macro';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import LaunchIcon from '@mui/icons-material/Launch';
import CircularProgress from '@mui/material/CircularProgress';
import { submittedTransactionDialogIsOpenAtom } from '@store/ui/submitted-transaction-dialog-is-open';
import {
  submittedTransactionAtom,
  currentPendingTxIdsAtom,
  userPendingTxAtom,
} from '@store/transactions';
import { currentStacksExplorerState, currentChainState } from '@utils/helpers';
import { truncateMiddle } from '@utils/common';
import { Typography } from '@mui/material';

const SubmittedTransactionDialog = () => {
  const [txId] = useAtom(submittedTransactionAtom);
  return txId ? <SubmittedTransactionDialogInner txId={txId} /> : <></>;
};
export default SubmittedTransactionDialog;

const SubmittedTransactionDialogInner = ({ txId }: { txId: string }) => {
  const [, setSubmittedTxId] = useAtom(submittedTransactionAtom);
  const [pendingTxIds, setPendingTxIds] = useAtom(currentPendingTxIdsAtom);
  const tx = useAtomValue(userPendingTxAtom(txId));
  const [submittedTransactionDialogIsOpen, setSubmittedTransactionDialogIsOpen] = useAtom(
    submittedTransactionDialogIsOpenAtom
  );
  const [explorer] = useAtom(currentStacksExplorerState);
  const [chain] = useAtom(currentChainState);

  const timer = React.useRef<number>();

  useEffect(() => {
    if (tx.txstatus === 'pending') {
      // TODO: this timer is mostly for dev testing
      timer.current = window.setTimeout(() => {
        const newPendingTxIds = [...pendingTxIds, txId];
        const deduplicatedPendingTxIds = [...new Set(newPendingTxIds)];
        setPendingTxIds(deduplicatedPendingTxIds); // adds this txid to the array of pending transactions
        setSubmittedTxId(undefined); // clears submittedTransactionAtom
      }, 2000);
    }
  }, [pendingTxIds, setPendingTxIds, setSubmittedTxId, tx, txId]);

  const handleClose = () => {
    setSubmittedTransactionDialogIsOpen(false);
  };

  return txId ? (
    <>
      <Dialog
        sx={{ m: 'auto' }}
        fullWidth={true}
        maxWidth="xs"
        onClose={handleClose}
        open={submittedTransactionDialogIsOpen}
      >
        <DialogTitle sx={{ m: 'auto' }}>{t`Submitting Transaction`}</DialogTitle>
        <Stack spacing={2} maxWidth="xs" sx={{ m: 'auto', p: 6 }}>
          <CircularProgress size={60} sx={{ m: 'auto' }} />
          <Typography>
            Awaiting acknowledgement receipt for transaction <strong>{truncateMiddle(txId)}</strong>
            <IconButton
              target="_blank"
              href={`${explorer}/txid/${txId}?chain=${chain}`}
              aria-label="go"
            >
              <LaunchIcon fontSize="small" />
            </IconButton>
          </Typography>
        </Stack>
      </Dialog>
    </>
  ) : (
    <></>
  );
};
