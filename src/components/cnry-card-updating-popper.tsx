import * as React from 'react';
import { useEffect } from 'react';
import { t } from '@lingui/macro';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import { red } from '@mui/material/colors';
import { green } from '@mui/material/colors';
import LaunchIcon from '@mui/icons-material/Launch';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import { cnryGetMetadataAtom, cnryGetMetadataQueryAtom, currentUpdatingCnrysAtom } from '@store/cnry';
import { userPendingTxAtom } from '@store/transactions';
import { currentChainState, currentStacksExplorerState } from '@utils/helpers';
import { truncateMiddle } from '@utils/common';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { networkAtom, stacksSessionAtom } from '@micro-stacks/react';

const CnryUpdate = ({ txid, tokenId }: { txid: string; tokenId: number }) => {
  const tx = useAtomValue(userPendingTxAtom(txid));
  const timer = React.useRef<number>();
  const [explorer] = useAtom(currentStacksExplorerState);
  const [chain] = useAtom(currentChainState);
  const [updatingCnryIds, setUpdatingCnryIds] = useAtom(currentUpdatingCnrysAtom);
  const [network] = useAtom(networkAtom);
  const [session] = useAtom(stacksSessionAtom);
  const [cnryMetadata, dispatchCnryMetadata] = useAtom(cnryGetMetadataQueryAtom([tokenId, network, session]));

  useEffect(() => {
    const refetch = () => {
      dispatchCnryMetadata({ type: 'refetch' });
    };
    // if transaction status changes
    if (tx.txstatus === 'success') {
      // TODO: this timer is mostly for dev testing
      timer.current = window.setTimeout(() => {
        console.log('Transaction succeeded, remove from pending tx and update lists');
        const txs = updatingCnryIds[Number(tx)] === undefined ? [] : updatingCnryIds[Number(tx)];
        const updatedTxs = txs.filter(item => item !== tx.txid);
        setUpdatingCnryIds({ ...updatingCnryIds, [tokenId]: updatedTxs }); // remove Cnry updating status tracking
        refetch();
      }, 2000);
    }
  }, [dispatchCnryMetadata, setUpdatingCnryIds, tokenId, tx, txid, updatingCnryIds]);

  // useEffect(() => {
    //   // fetch latest data
    //   const refetch = () => {
    //     dispatchCnryWatchCount({ type: 'refetch' });
    //   };
    //   refetch();
    // }, [pendingTxIds, dispatchCnryWatchCount]);
    // {updatingCnryIds[Number(cnryMetadata.index)] === undefined ? '' : 'Updating'}

  return (
    <>
      <Typography variant="caption">
        {truncateMiddle(txid)}
        <IconButton
          target="_blank"
          href={`${explorer}/txid/${txid}?chain=${chain}`}
          aria-label="go"
        >
          <LaunchIcon fontSize="small" />
        </IconButton>
      </Typography>
    </>
  );
};

export const CnryCardUpdatingPopper = ({ tokenId }: { tokenId: number }) => {
  const [updatingCnryIds] = useAtom(currentUpdatingCnrysAtom);
  // TODO: refactor state
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<PopperPlacementType>();
  const handleClick =
    (newPlacement: PopperPlacementType) => (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen(prev => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
    };

  return (
    <>
      <IconButton onClick={handleClick('bottom-start')}>
        <Avatar sx={{ bgcolor: green[500] }} aria-label="profile">
          <AutorenewOutlinedIcon />

          <Popper
            key={`${tokenId}-updating-txs-popper`}
            open={open}
            anchorEl={anchorEl}
            placement={placement}
          >
            <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
              <Typography sx={{ m: 'auto' }}>Pending updates</Typography>
              <Stack spacing={2}>
                {updatingCnryIds[Number(tokenId)].map((txid, key) => (
                  <CnryUpdate key={key} txid={txid} tokenId={tokenId} />
                ))}
              </Stack>
            </Box>
          </Popper>

          <CircularProgress
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
              width: 0,
            }}
          />
        </Avatar>
      </IconButton>
    </>
  );
};
