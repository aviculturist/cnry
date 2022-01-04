import * as React from 'react';
import { useEffect } from 'react';
import { t } from '@lingui/macro';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import {
  Transaction,
  MempoolTransaction,
  TokenTransferTransaction,
  MempoolTokenTransferTransaction,
  SmartContractTransaction,
  MempoolSmartContractTransaction,
  ContractCallTransaction,
  MempoolContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import LaunchIcon from '@mui/icons-material/Launch';
import { cnryContractTransactionAtom } from '@store/transactions';
import { currentStacksExplorerState, currentChainState } from '@utils/helpers';
import { toRelativeTime } from '@utils/time';

const TransactionTypeSelector = ({ tx }: { tx: Transaction | MempoolTransaction }) => {
  switch (tx.tx_type) {
    // TokenTransferTransaction
    case 'token_transfer':
      return <TokenTransferTransactionItem tx={tx} />;

    // SmartContractTransaction
    case 'smart_contract':
      return <SmartContractTransactionItem tx={tx} />;

    // ContractCallTransaction
    case 'contract_call':
      return <ContractCallTransactionItem tx={tx} />;

    // PoisonMicroblockTransaction
    case 'poison_microblock':
      return <></>;

    // CoinbaseTransaction
    case 'coinbase':
      return <></>;

    default:
      return <></>;
  }
};

const TokenTransferTransactionItem = ({
  tx,
}: {
  tx: TokenTransferTransaction | MempoolTokenTransferTransaction;
}) => {
  const [explorer] = useAtom(currentStacksExplorerState);
  const [chain] = useAtom(currentChainState);

  return (
    <ListItemText
      primary={
        <React.Fragment>
          Transfer
          <IconButton
            target="_blank"
            href={`${explorer}/txid/${tx.tx_id}?chain=${chain}`}
            aria-label="go"
          >
            <LaunchIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
      secondary={
        <React.Fragment>
          {'burn_block_time' in tx ? toRelativeTime(tx.burn_block_time * 1000) : ''}
        </React.Fragment>
      }
    />
  );
};

const SmartContractTransactionItem = ({
  tx,
}: {
  tx: SmartContractTransaction | MempoolSmartContractTransaction;
}) => {
  const [explorer] = useAtom(currentStacksExplorerState);
  const [chain] = useAtom(currentChainState);

  return (
    <ListItemText
      primary={
        <React.Fragment>
          SmartContract
          <IconButton
            target="_blank"
            href={`${explorer}/txid/${tx.tx_id}?chain=${chain}`}
            aria-label="go"
          >
            <LaunchIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
      secondary={
        <React.Fragment>
          {'burn_block_time' in tx ? toRelativeTime(tx.burn_block_time * 1000) : ''}
        </React.Fragment>
      }
    />
  );
};

const ContractCallTransactionItem = ({
  tx,
}: {
  tx: ContractCallTransaction | MempoolContractCallTransaction;
}) => {
  const [explorer] = useAtom(currentStacksExplorerState);
  const [chain] = useAtom(currentChainState);

  return (
    <ListItemText
      primary={
        <React.Fragment>
          {tx.contract_call.function_name}
          <IconButton
            target="_blank"
            href={`${explorer}/txid/${tx.tx_id}?chain=${chain}`}
            aria-label="go"
          >
            <LaunchIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
      secondary={
        <React.Fragment>
          {'burn_block_time' in tx ? toRelativeTime(tx.burn_block_time * 1000) : ''}
        </React.Fragment>
      }
    />
  );
};

const TxItem = ({ txid }: { txid: string }) => {
  const tx = useAtomValue(cnryContractTransactionAtom(txid));

  // Remove query
  useEffect(() => {
    if (tx?.tx_status === 'success') {
      cnryContractTransactionAtom.remove(txid); // remove from queries
    }
  });

  return tx ? (
    <ListItem button key={tx.tx_id}>
      <ListItemIcon>
        {tx.tx_status === 'success' ? (
          <CheckCircleOutlineIcon color="success" />
        ) : tx.tx_status === 'abort_by_response' ? (
          <CancelOutlinedIcon color="error" />
        ) : tx.tx_status === 'abort_by_post_condition' ? (
          <CancelOutlinedIcon color="error" />
        ) : (
          <HelpOutlineOutlinedIcon color="error" />
        )}
      </ListItemIcon>
      <TransactionTypeSelector key={tx.tx_id} tx={tx} />
    </ListItem>
  ) : (
    <></>
  );
};

export default TxItem;
