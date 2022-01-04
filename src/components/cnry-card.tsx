import * as React from 'react';
import { useEffect } from 'react';
import { t } from '@lingui/macro';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import { ChainID } from 'micro-stacks/common';
import { useAuth, networkAtom, userStxAddressesAtom } from '@micro-stacks/react';
import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';
import { styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { green } from '@mui/material/colors';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import LaunchIcon from '@mui/icons-material/Launch';
import CardHeader from '@mui/material/CardHeader';
import Badge, { BadgeProps } from '@mui/material/Badge';
//import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import RestoreIcon from '@mui/icons-material/Restore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Popper, { PopperPlacementType } from '@mui/material/Popper';

import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import {
  cnryGetMetadataAtom,
  cnryIsAliveAtom,
  cnryWatchCountAtom,
  currentUpdatingCnrysAtom,
} from '@store/cnry';
import {
  cnryUserPendingTxIdsAtom,
  userPendingTxAtom,
  cnryContractTransactionAtom,
} from '@store/transactions';
import cnryListTabStateAtom from '@store/ui/cnry-list-tab-state';
import useWatch from '@hooks/use-watch';
import useKeepalive from '@hooks/use-keepalive';
import { toDate, toRelativeTime } from '@utils/time';
import CnryMetadataTable from '@components/cnry-metadata-table';
import EditCnryIconButton from '@components/edit-cnry-iconbutton';
import useInstallWalletDialog from '@hooks/use-install-wallet-dialog';
import { currentPendingTxIdsAtom } from '@store/transactions';
import { currentChainState, currentStacksExplorerState } from '@utils/helpers';
import { truncateMiddle } from '@utils/common';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { CnryCardUpdatingPopper } from '@components/cnry-card-updating-popper';

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

const PendingCnryCardFromTxId = ({ txId }: { txId: string }) => {
  const tx = useAtomValue(userPendingTxAtom(txId));
  const [pendingTxIds, setPendingTxIds] = useAtom(cnryUserPendingTxIdsAtom);
  const [expanded, setExpanded] = React.useState(false);
  const [, setValue] = useAtom(cnryListTabStateAtom);

  // Remove transactions from the pending list
  // TODO: missing dependencies
  useEffect(() => {
    if (tx.txstatus === 'success') {
      const txs = pendingTxIds.filter(item => item !== txId);
      setPendingTxIds(txs); // remove from array
      userPendingTxAtom.remove(txId); // remove from queries
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
          <VisibilityOutlinedIcon />
        </IconButton>
        <IconButton disabled aria-label="share">
          <ShareIcon fontSize="small" />
        </IconButton>
        <IconButton disabled aria-label="copy">
          <ContentCopyOutlinedIcon fontSize="small" />
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

const CnryCardFromTxId = ({ txId }: { txId: string }) => {
  const tx = useAtomValue(cnryContractTransactionAtom(txId));

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
  return tokenId === undefined ? <></> : <CnryCard key={tokenId.toString()} tokenId={tokenId} />;
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
  const [cnryMetadata] = useAtom(cnryGetMetadataAtom(tokenId));
  const [cnryWatchCount] = useAtom(cnryWatchCountAtom(tokenId));
  const hatchedDate = cnryMetadata ? toDate(Number(cnryMetadata.hatchedTimestamp) * 1000) : NaN;
  const keepaliveTimestamp = cnryMetadata ? Number(cnryMetadata.keepaliveTimestamp) * 1000 : NaN;
  const keepaliveExpiry = cnryMetadata ? Number(cnryMetadata.keepaliveExpiry) * 1000 : NaN;
  const daysRemainingUntilExpiry = toRelativeTime(keepaliveTimestamp + keepaliveExpiry);
  const { isSignedIn, handleSignIn, session } = useAuth();
  const { setInstallWalletDialogIsOpen } = useInstallWalletDialog();
  const [updatingCnryIds] = useAtom(currentUpdatingCnrysAtom);

  // useEffect(() => {
  //   // fetch latest data
  //   const refetch = () => {
  //     dispatchCnryWatchCount({ type: 'refetch' });
  //   };
  //   refetch();
  // }, [pendingTxIds, dispatchCnryWatchCount]);
  // {updatingCnryIds[Number(cnryMetadata.index)] === undefined ? '' : 'Updating'}

  useEffect(() => {
    const txs =
      updatingCnryIds[Number(cnryMetadata?.index)] === undefined
        ? []
        : updatingCnryIds[Number(cnryMetadata?.index)];
  }, [cnryMetadata?.index, updatingCnryIds]);

  const handleCopyToClipboard = ({ link }: { link: string }) => {
    const uri = `${typeof window !== 'undefined' ? window.location.href.split('#')[0] : ''}${link}`;
    navigator.clipboard.writeText(uri);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const blurMetadata = cnryMetadata
    ? updatingCnryIds[Number(cnryMetadata.index)] === undefined ||
      updatingCnryIds[Number(cnryMetadata.index)].length === 0
      ? false
      : true
    : false;
  return cnryMetadata ? (
    <Card sx={{ m: 'auto', width: 292, maxWidth: 292 }}>
      <CardHeader
        avatar={
          updatingCnryIds[Number(cnryMetadata.index)] === undefined ||
          updatingCnryIds[Number(cnryMetadata.index)].length === 0 ? (
            <Avatar sx={{ bgcolor: isAlive ? green[500] : red[500] }} aria-label="profile">
              {isAlive ? <CheckCircleOutlineIcon /> : <CancelOutlinedIcon />}
            </Avatar>
          ) : (
            <CnryCardUpdatingPopper key={`${tokenId}-updating-popper`} tokenId={tokenId} />
          )
        }
        action={
          userStxAddress === cnryMetadata.cnryKeeper ? (
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
              <EditCnryIconButton tokenId={Number(cnryMetadata.index)} />
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
        title={
          <React.Fragment>
            <Typography variant='inherit' sx={{ filter: blurMetadata ? 'blur(3px)' : 'none' }}>
              {cnryMetadata.cnryName}
            </Typography>
          </React.Fragment>
        }
        subheader={
          <React.Fragment>
            <Typography variant='inherit' sx={{ filter: blurMetadata ? 'blur(3px)' : 'none' }}>
              Hatched on {hatchedDate}, expiry {daysRemainingUntilExpiry}
            </Typography>
          </React.Fragment>
        }
      />
      {/* <CardMedia
        component="img"
        height="194"
        image=""
        alt="Image"
      /> */}

      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ filter: blurMetadata ? 'blur(3px)' : 'none' }}>
          {cnryMetadata.cnryStatement}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Tooltip title={t`Watch Cnry`}>
          <IconButton
            aria-label="watch"
            onClick={() => {
              isSignedIn ? void handleWatch(tokenId) : handleSignIn();
              !session && setInstallWalletDialogIsOpen(true);
            }}
          >
            <StyledBadge
              showZero={false}
              color="secondary"
              badgeContent={cnryWatchCount && cnryWatchCount > 0 ? cnryWatchCount : 0}
            >
              <VisibilityOutlinedIcon />
            </StyledBadge>
          </IconButton>
        </Tooltip>
        <Tooltip title={t`Open in new tab`}>
          <IconButton
            size="small"
            target="_blank"
            href={`./?id=${cnryMetadata.index}`}
            aria-label="share"
          >
            <ShareIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={t`Copy permalink to clipboard`}>
          <IconButton
            size="small"
            aria-label="copy"
            onClick={() => handleCopyToClipboard({ link: `./?id=${cnryMetadata.index}` })}
          >
            <ContentCopyOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {userStxAddress === cnryMetadata.cnryKeeper ? (
          <Tooltip title={t`Publish keepalive`}>
            <IconButton
              aria-label="keepalive"
              onClick={() => handleKeepalive({ tokenId: cnryMetadata.index })}
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
          <CnryMetadataTable cnry={cnryMetadata} />
        </CardContent>
      </Collapse>
    </Card>
  ) : (
    <></>
  );
};
export default CnryCard;
