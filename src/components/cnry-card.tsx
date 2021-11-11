import * as React from 'react';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import { useTheme } from '@mui/material/styles';
import { cnryGetMetadataAtom, cnryContractTransactionAtom, cnryIsAliveAtom } from '@store/cnry';
import { cvToJSON, cvToHex, hexToCV, intToHexString } from '@stacks/transactions';
import { ContractCallTransaction } from '@blockstack/stacks-blockchain-api-types';

import { styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { green } from '@mui/material/colors';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import RestoreIcon from '@mui/icons-material/Restore';
import LaunchIcon from '@mui/icons-material/Launch';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { toDate, toRelativeTime } from '@utils/time';
import useWatch from '@hooks/use-watch';
import useKeepalive from '@hooks/use-keepalive';
import { networkAtom, userStxAddressesAtom } from '@micro-stacks/react';
import { ChainID } from 'micro-stacks/common';

import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

import { userPendingTxIdsAtom, userPendingTxAtom } from '@store/user-pending-transactions';
import { currentStacksExplorerState, currentChainState } from '@store/current-network-state';
import { t } from '@lingui/macro';
import CircularProgress from '@mui/material/CircularProgress';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }: { theme: any; expand: any }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const PendingCnryCardFromTxId = ({ txid }: { txid: string }) => {
  const [explorer] = useAtom(currentStacksExplorerState);
  const [chain] = useAtom(currentChainState);
  const tx = useAtomValue(userPendingTxAtom(txid));
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Card sx={{ m: 'auto', width: 292, maxWidth: 292 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="profile">
            #?
          </Avatar>
        }
        action={
          <Typography component="div">
            <Chip color="secondary" label="#?" variant="outlined" />
          </Typography>
        }
        title="Pending"
        subheader={`Hatching since ${toRelativeTime(tx.timestamp * 1000)}`}
      />
      {/* <CardMedia
        component="img"
        height="194"
        image=""
        alt="Image"
      /> */}

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Awaiting <strong>{tx.function}</strong> function
        </Typography>
        <CircularProgress />
      </CardContent>
      <CardActions disableSpacing>
        <IconButton disabled aria-label="watch">
          <FavoriteIcon />
        </IconButton>
        <IconButton disabled aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton disabled aria-label="keepalive">
          <RestoreIcon />
        </IconButton>

        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            Show additional metadata, transaction history (keepalives, name/statement edits, etc.)
            Also show watchers
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};
export { PendingCnryCardFromTxId };

const CnryCardFromTxId = ({ txid }: { txid: string }) => {
  const tx = useAtomValue(cnryContractTransactionAtom(txid));

  const tokenIdString =
    tx &&
    tx.tx_type === 'contract_call' &&
    tx.contract_call.function_name === 'hatch' &&
    (tx as ContractCallTransaction).tx_result?.repr
      ? (tx as ContractCallTransaction).tx_result?.repr
      : undefined;
  const tokenId =
    tokenIdString !== undefined
      ? Number(tokenIdString.replace('(ok u', '').replace(')', ''))
      : undefined;
  return tokenId === undefined ? <></> : <CnryCard tokenId={tokenId} />;
};
export { CnryCardFromTxId };

const CnryCard = ({ tokenId }: { tokenId: number }) => {
  const [expanded, setExpanded] = React.useState(false);
  const handleWatch = useWatch();
  const handleKeepalive = useKeepalive();
  const [network] = useAtom(networkAtom);
  const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
  const [userStxAddresses] = useAtom(userStxAddressesAtom);
  const userStxAddress = userStxAddresses?.[chain] || '';
  const [isAlive] = useAtom(cnryIsAliveAtom(tokenId));
  const [cnry] = useAtom(cnryGetMetadataAtom(tokenId));
  const hatchedDate = toDate(cnry.hatchedTimestamp.value * 1000);
  const keepaliveTimestamp = cnry.keepaliveTimestamp.value * 1000;
  const keepaliveExpiry = cnry.keepaliveExpiry.value * 1000;
  const daysRemainingUntilExpiry = toRelativeTime(keepaliveTimestamp + keepaliveExpiry);

  // cnry.cnryKeeper ===
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return cnry ? (
    <Card sx={{ m: 'auto', width: 292, maxWidth: 292 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: isAlive ? green[500] : red[500] }} aria-label="profile">
            {isAlive ? <CheckCircleOutlineIcon /> : <CancelOutlinedIcon />}
          </Avatar>
        }
        action={
          userStxAddress === cnry.cnryKeeper.value ? (
            <>
              <Typography component="div">
                <Chip
                  sx={{
                    color: 'success.dark',
                    fontWeight: 'medium',
                  }}
                  color="secondary"
                  label={`#${tokenId}`}
                  variant="outlined"
                />
              </Typography>
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Typography component="div">
                <Chip
                  sx={{
                    color: 'success.dark',
                    fontWeight: 'medium',
                  }}
                  color="secondary"
                  label={`#${tokenId}`}
                  variant="outlined"
                />
              </Typography>
            </>
          )
        }
        title={cnry.cnryName.value}
        subheader={`Hatched on ${hatchedDate}, expires ${daysRemainingUntilExpiry}`}
      />
      {/* <CardMedia
        component="img"
        height="194"
        image=""
        alt="Image"
      /> */}

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {cnry.cnryStatement.value}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="watch" onClick={() => handleWatch({ tokenId: cnry.index.value })}>
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share" target="_blank" href={`./?id=${cnry.index.value}`}>
          <ShareIcon />
        </IconButton>
        {userStxAddress === cnry.cnryKeeper.value ? (
          <IconButton
            aria-label="keepalive"
            onClick={() => handleKeepalive({ tokenId: cnry.index.value })}
          >
            <RestoreIcon />
          </IconButton>
        ) : (
          <></>
        )}
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            Show additional metadata, transaction history (keepalives, name/statement edits, etc.)
            Also show watchers
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  ) : (
    <></>
  );
};
export default CnryCard;
