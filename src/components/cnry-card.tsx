import * as React from 'react';
import { useEffect } from 'react';
import { t } from '@lingui/macro';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import { ChainID } from 'micro-stacks/common';
import { networkAtom, userStxAddressesAtom } from '@micro-stacks/react';
import { ContractCallTransaction } from '@blockstack/stacks-blockchain-api-types';
import { styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { green } from '@mui/material/colors';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CardHeader from '@mui/material/CardHeader';
import Badge, { BadgeProps } from '@mui/material/Badge';
//import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import RestoreIcon from '@mui/icons-material/Restore';
import LaunchIcon from '@mui/icons-material/Launch';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import { currentStacksExplorerState, currentChainState } from '@store/helpers';
import {
  cnryGetMetadataAtom,
  cnryContractTransactionAtom,
  cnryIsAliveAtom,
  cnryUserPendingTxIdsAtom,
  userPendingTxAtom,
  cnryWatchCountAtom,
} from '@store/cnry';
import cnryListTabStateAtom from '@store/ui/cnry-list-tab-state';
import useWatch from '@hooks/use-watch';
import useKeepalive from '@hooks/use-keepalive';
import { toDate, toRelativeTime } from '@utils/time';
import CnryMetadataTable from '@components/cnry-metadata-table';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }: { theme: any }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

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
  const [pendingTxIds, setPendingTxIds] = useAtom(cnryUserPendingTxIdsAtom);
  const [expanded, setExpanded] = React.useState(false);
  const [value, setValue] = useAtom(cnryListTabStateAtom);

  // Remove transactions from the pending list
  useEffect(() => {
    if (tx.txstatus === 'success') {
      const txs = pendingTxIds.filter(item => item !== txid);
      setPendingTxIds(txs); // remove from array
      userPendingTxAtom.remove(txid); // remove from queries
      //console.log('Removing within cnry-card: ' + txid);
      setValue('two');
    }
  }, [tx]);

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
        title={t`Pending`}
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
          Running <strong>{tx.function}</strong> function
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
        <IconButton disabled aria-label="share">
          <ContentCopyOutlinedIcon />
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
            {t`Your warrant canary has been submitted to the blockchain.`}
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
  const [cnryWatchCount] = useAtom(cnryWatchCountAtom(tokenId));
  const hatchedDate = toDate(cnry.hatchedTimestamp.value * 1000);
  const keepaliveTimestamp = cnry.keepaliveTimestamp.value * 1000;
  const keepaliveExpiry = cnry.keepaliveExpiry.value * 1000;
  const daysRemainingUntilExpiry = toRelativeTime(keepaliveTimestamp + keepaliveExpiry);

  const handleCopyToClipboard = ({ link }: { link: string }) => {
    const uri = `${typeof window !== 'undefined' ? window.location.href.split('#')[0] : ''}${link}`;
    navigator.clipboard.writeText(uri);
  };

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
        subheader={t`Hatched on ${hatchedDate}, expires ${daysRemainingUntilExpiry}`}
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
        <Tooltip title={t`Watch Cnry`}>
          <IconButton aria-label="watch" onClick={() => handleWatch({ tokenId: cnry.index.value })}>
            <StyledBadge showZero={false} color="secondary" badgeContent={cnryWatchCount && cnryWatchCount > 0 ? cnryWatchCount : 0}>
              <FavoriteIcon />
            </StyledBadge>
          </IconButton>
        </Tooltip>
        <Tooltip title={t`Open in new tab`}>
          <IconButton target="_blank" href={`./?id=${cnry.index.value}`} aria-label="share">
            <ShareIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t`Copy permalink to clipboard`}>
          <IconButton
            aria-label="copy"
            onClick={() => handleCopyToClipboard({ link: `./?id=${cnry.index.value}` })}
          >
            <ContentCopyOutlinedIcon />
          </IconButton>
        </Tooltip>
        {userStxAddress === cnry.cnryKeeper.value ? (
          <Tooltip title={t`Run keepalive`}>
            <IconButton
              aria-label="keepalive"
              onClick={() => handleKeepalive({ tokenId: cnry.index.value })}
            >
              <RestoreIcon />
            </IconButton>
          </Tooltip>
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
          <CnryMetadataTable cnry={cnry} />
        </CardContent>
      </Collapse>
    </Card>
  ) : (
    <></>
  );
};
export default CnryCard;
