import * as React from 'react';
import { t } from '@lingui/macro';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';

const ClearApplicationDataMenuItem = () => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event: Event | React.SyntheticEvent<any, Event>, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const action = (
    <React.Fragment>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  return (
    <>
      <MenuItem
        onClick={() => {
          localStorage.clear();
          sessionStorage.clear();
          handleClick();
        }}
      >
        <ListItemIcon>
          <Tooltip title={t`Clear Browser localStorage and sessionStorage`}>
            <IconButton color="secondary" size="small">
              <DeleteTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </ListItemIcon>
        <ListItemText inset={false}>{t`Clear Browser Data`}</ListItemText>
      </MenuItem>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} action={action}>
        <Alert severity="success">{t`Browser localStorage and sessionStorage Cleared`}</Alert>
      </Snackbar>
    </>
  );
};
export default ClearApplicationDataMenuItem;
