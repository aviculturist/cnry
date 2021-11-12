import * as React from 'react';
import { t } from '@lingui/macro';
import { useAtom } from 'jotai';
import Tooltip from '@mui/material/Tooltip';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import IconButton from '@mui/material/IconButton';
import { searchDialogIsOpenAtom } from '@store/search-dialog-is-open';
import SearchDialog from '@components/search/search-dialog';
import SafeSuspense from '@components/safe-suspense';
import SearchIcon from '@mui/icons-material/Search';

const ToggleSearchDialogIconButton = () => {
  const [open, setOpen] = useAtom(searchDialogIsOpenAtom);

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <SafeSuspense
      fallback={
        <IconButton size="small">
          <SearchOutlinedIcon fontSize="small" />
        </IconButton>
      }
    >
      <IconButton
        size="small"
        onClick={handleClickOpen}
        color="primary"
        id="settings-button"
        aria-controls="settings-menu"
        aria-haspopup="true"
      >
        <Tooltip title={t`Search`}>
          <SearchOutlinedIcon fontSize="small" />
        </Tooltip>
      </IconButton>
      <SearchDialog />
    </SafeSuspense>
  );
};
export default ToggleSearchDialogIconButton;
