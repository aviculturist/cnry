import * as React from 'react';
import { useEffect } from 'react';
import { t } from '@lingui/macro';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import LaunchIcon from '@mui/icons-material/Launch';
import { userPendingTxIdsAtom, userPendingTxAtom } from '@store/user-pending-transactions';
import { currentStacksExplorerState, currentChainState } from '@store/helpers';
import { toRelativeTime } from '@utils/time';

const UserPendingTxItem = ({ txid }: { txid: string }) => {
  const [explorer] = useAtom(currentStacksExplorerState);
  const [chain] = useAtom(currentChainState);
  const [pendingTxIds, setPendingTxIds] = useAtom(userPendingTxIdsAtom);
  const tx = useAtomValue(userPendingTxAtom(txid));

  // Remove transactions from the pending list
  useEffect(() => {
    if (tx.txstatus === 'success') {
      const txs = pendingTxIds.filter(item => item !== txid);
      setPendingTxIds(txs); // remove from array
      userPendingTxAtom.remove(txid); // remove from queries
      //console.log('Removing: ' + txid);
    }
  });

  // TODO: This can fire before the transaction has been received by the node
  // is there a way to know if this is the first init?
  // const TxComponent = ({txid}) => {
  //   const txData = useAtomValue(txQueryFamily(txid));
  //   const placeholderTxData = useAtomValue(placeholderTxData(rawTx));
  //   if(!txData) return <PlaceholderTx data={placeholderTxData} />
  //   return <TxDataComponent data={txData} />
  // }

  return (
    <ListItem button key={tx.txid}>
      <ListItemIcon>
        <Tooltip key={tx.txid} title={tx.txstatus}>
          {tx.txstatus === 'success' ? (
            <CheckCircleOutlineIcon color="success" />
          ) : tx.txstatus === 'submitted' || tx.txstatus === 'pending' ? (
            <ChangeCircleOutlinedIcon color="info" />
          ) : tx.txstatus === 'aborted' || tx.txstatus === 'dropped' ? (
            <CancelOutlinedIcon color="error" />
          ) : (
            <HelpOutlineOutlinedIcon color="error" />
          )}
        </Tooltip>
      </ListItemIcon>
      <Tooltip key={tx.txid} title={tx.txid}>
        <ListItemText
          primary={
            <React.Fragment>
              {tx.function}{' '}
              <IconButton
                target="_blank"
                href={`${explorer}/txid/${tx.txid}?chain=${chain}`}
                aria-label="go"
              >
                <LaunchIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
          secondary={<React.Fragment>{toRelativeTime(tx.timestamp * 1000)}</React.Fragment>}
        />
      </Tooltip>
    </ListItem>
  );
};

export default UserPendingTxItem;
