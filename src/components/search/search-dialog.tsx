import * as React from 'react';
import { useAtom } from 'jotai';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import AutocompleteSearch from '@components/search/autocomplete-search';
import SearchHistory from '@components/search/search-history';
import SearchFavorites from '@components/search/search-favorites';
import { searchDialogIsOpenAtom } from '@store/search-dialog-is-open';

const SearchDialog = () => {
  const [open, setOpen] = useAtom(searchDialogIsOpenAtom);

  return (
    <Dialog
      fullWidth={true}
      maxWidth="md"
      onClose={() => setOpen(false)}
      open={open}
      sx={{ borderRadius: 8 }}
    >
      <DialogTitle>
        <AutocompleteSearch />
      </DialogTitle>
      <SearchHistory />
      <SearchFavorites />
    </Dialog>
  );
}
export default SearchDialog;
