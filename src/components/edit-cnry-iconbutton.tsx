import * as React from 'react';
import { t } from '@lingui/macro';
import { useAtom } from 'jotai';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { editCnryMenuAnchorElAtom, editCnryMenuIsOpenAtom } from '@store/ui/edit-cnry-menu-is-open';
import { anyCnryNameDialogIsOpenAtomFamily } from '@store/ui/set-cnry-name-dialog-is-open';
import { anyCnryStatementDialogIsOpenAtomFamily } from '@store/ui/set-cnry-statement-dialog-is-open';
import { anyCnryKeepaliveExpiryDialogIsOpenAtomFamily } from '@store/ui/set-cnry-keepalive-expiry-dialog-is-open';

import { SetCnryNameDialog } from '@components/set-cnry-name-dialog';
import { SetCnryStatementDialog } from '@components/set-cnry-statement-dialog';
import { SetCnryKeepaliveExpiryDialog } from '@components/set-cnry-keepalive-expiry-dialog';

import { cnryGetMetadataAtom } from '@store/cnry';

// TODO: remove cnryName param
const EditCnryMenu = ({ tokenId }: { tokenId: number }) => {
  const [cnryMetadata] = useAtom(cnryGetMetadataAtom(tokenId));
  const [anchorEl, setAnchorEl] = useAtom(editCnryMenuAnchorElAtom(tokenId));
  const [menuIsOpen, setMenuIsOpen] = useAtom(editCnryMenuIsOpenAtom(tokenId));
  const [setCnryNameDialogIsOpen, setSetCnryNameDialogIsOpen] = useAtom(
    anyCnryNameDialogIsOpenAtomFamily(tokenId)
  );
  const [setCnryStatementDialogIsOpen, setSetCnryStatementDialogIsOpen] = useAtom(
    anyCnryStatementDialogIsOpenAtomFamily(tokenId)
  );
  const [setCnryKeepaliveExpiryDialogIsOpen, setSetCnryKeepaliveExpiryDialogIsOpen] = useAtom(
    anyCnryKeepaliveExpiryDialogIsOpenAtomFamily(tokenId)
  );
  const handleOpenSetNameDialog = () => {
    setMenuIsOpen(false);
    setSetCnryNameDialogIsOpen(true);
  };
  const handleOpenSetStatementDialog = () => {
    setMenuIsOpen(false);
    setSetCnryStatementDialogIsOpen(true);
  };
  const handleOpenSetKeepaliveExpiryDialog = () => {
    setMenuIsOpen(false);
    setSetCnryKeepaliveExpiryDialogIsOpen(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setMenuIsOpen(false);
  };

  return (
    <>
      <Menu
        id={`edit-cnry-menu-${tokenId}`}
        anchorEl={anchorEl}
        open={menuIsOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        keepMounted
        MenuListProps={{
          'aria-labelledby': `edit-cnry-button-${tokenId}`,
        }}
      >
        <MenuList dense>
          <MenuItem key={`name-${tokenId}`} onClick={handleOpenSetNameDialog}>
            <ListItemText>Edit Name</ListItemText>
          </MenuItem>
          <MenuItem key={`statement-${tokenId}`} onClick={handleOpenSetStatementDialog}>
            <ListItemText>Edit Statement</ListItemText>
          </MenuItem>
          <MenuItem key={`keepaliveExpiry-${tokenId}`} onClick={handleOpenSetKeepaliveExpiryDialog}>
            <ListItemText>Edit Keepalive Expiry Frequency</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
      <SetCnryNameDialog tokenId={tokenId} />
      <SetCnryStatementDialog tokenId={tokenId} />
      <SetCnryKeepaliveExpiryDialog tokenId={tokenId} />
    </>
  );
};
// alternative to moving this prop around so many times? atom?
const EditCnryIconButton = ({ tokenId }: { tokenId: number }) => {
  const [menuIsOpen, setMenuIsOpen] = useAtom(editCnryMenuIsOpenAtom(tokenId));
  const [, setAnchorEl] = useAtom(editCnryMenuAnchorElAtom(tokenId));

  const handleEditCnry = (event: React.MouseEvent<HTMLElement>, tokenId: number) => {
    setAnchorEl(event.currentTarget);
    setMenuIsOpen(true);
  };

  return (
    <div>
      <IconButton
        size="small"
        onClick={event => handleEditCnry(event, tokenId)}
        color="primary"
        id={`edit-cnry-button-${tokenId}`}
        aria-controls={`edit-cnry-menu-${tokenId}`}
        aria-haspopup="true"
        aria-expanded={menuIsOpen ? 'true' : undefined}
      >
        <Tooltip title={t`Edit Cnry`}>
          <MoreVertIcon fontSize="small" />
        </Tooltip>
      </IconButton>
      <EditCnryMenu key={tokenId.toString()} tokenId={tokenId} />
    </div>
  );
};
export default EditCnryIconButton;
