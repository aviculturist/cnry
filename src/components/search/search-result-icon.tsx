import * as React from 'react';
import Box from '@mui/material/Box';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import ViewAgendaOutlinedIcon from '@mui/icons-material/ViewAgendaOutlined';

const SearchResultIcon = ({ icon }: { icon: string | undefined }) => {
  switch (icon) {
    case 'standard_address':
      return (
        <Box component={AccountBalanceWalletOutlinedIcon} sx={{ color: 'text.secondary', mr: 2 }} />
      );

    case 'block_hash':
      return <Box component={ViewAgendaOutlinedIcon} sx={{ color: 'text.secondary', mr: 2 }} />;

    case 'contract_address':
      return <Box component={GavelOutlinedIcon} sx={{ color: 'text.secondary', mr: 2 }} />;

    case 'mempool_tx_id':
      return <Box component={ListOutlinedIcon} sx={{ color: 'text.secondary', mr: 2 }} />;

    case 'tx_id':
      return <Box component={ReceiptOutlinedIcon} sx={{ color: 'text.secondary', mr: 2 }} />;

    case 'error':
      return <Box component={ErrorOutlineOutlinedIcon} sx={{ color: 'text.secondary', mr: 2 }} />;

    default:
      return <Box component={ErrorOutlineOutlinedIcon} sx={{ color: 'text.secondary', mr: 2 }} />;
  }
};
export default SearchResultIcon;
