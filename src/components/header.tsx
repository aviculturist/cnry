import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ToggleDarkModeIconButton from '@components/toggle-darkmode-iconbutton';
import ToggleActivityDrawerIconButton from '@components/toggle-activity-drawer-iconbutton';
import ToggleSelectNetworkDialogButton from '@components/toggle-select-network-dialog-button';
import WalletConnectButton from '@components/wallet-connect-button';
import ChooseLanguageButton from '@components/choose-language-button';
import ToggleSearchDialogIconButton from '@components/toggle-search-dialog-iconbutton';
import TogglePrivacySettingsIconbutton from '@components/toggle-privacy-settings-iconbutton';

const Header = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="relative" color="transparent" elevation={0}>
        <Toolbar sx={{ columnGap: 1 }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            🐦 Cnry
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <ToggleDarkModeIconButton />
          <ToggleSearchDialogIconButton />
          <TogglePrivacySettingsIconbutton />
          <ToggleSelectNetworkDialogButton />
          <WalletConnectButton />
          <ChooseLanguageButton />
          <ToggleActivityDrawerIconButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
};
export default Header;
