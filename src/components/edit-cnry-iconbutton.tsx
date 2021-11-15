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
import { SetCnryNameDialog } from '@components/set-cnry-name-dialog';

const EditCnryMenu = ({ tokenId, cnryName }: { tokenId: number; cnryName: string }) => {
  const [anchorEl, setAnchorEl] = useAtom(editCnryMenuAnchorElAtom(tokenId));
  const [menuIsOpen, setMenuIsOpen] = useAtom(editCnryMenuIsOpenAtom(tokenId));
  const [setCnryNameDialogIsOpen, setSetCnryNameDialogIsOpen] = useAtom(
    anyCnryNameDialogIsOpenAtomFamily(tokenId)
  );
  const handleOpenSetNameDialog = () => {
    setMenuIsOpen(false);
    setSetCnryNameDialogIsOpen(true);
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
          <MenuItem key={tokenId} onClick={handleOpenSetNameDialog}>
            <ListItemText>Edit Cnry Name</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
      <SetCnryNameDialog key={tokenId} tokenId={tokenId} cnryName={cnryName} />
    </>
  );
};
// alternative to moving this prop around so many times? atom?
const EditCnryIconButton = ({ tokenId, cnryName }: { tokenId: number; cnryName: string }) => {
  const [menuIsOpen, setMenuIsOpen] = useAtom(editCnryMenuIsOpenAtom(tokenId));
  const [, setAnchorEl] = useAtom(editCnryMenuAnchorElAtom(tokenId));

  const handleEditCnry = (
    event: React.MouseEvent<HTMLElement>,
    tokenId: number,
    cnryName: string
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuIsOpen(true);
  };

  return (
    <div>
      <IconButton
        size="small"
        onClick={event => handleEditCnry(event, tokenId, cnryName)}
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
      <EditCnryMenu key={tokenId} cnryName={cnryName} tokenId={tokenId} />
    </div>
  );
};
export default EditCnryIconButton;
