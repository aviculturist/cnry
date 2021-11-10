import * as React from 'react';
// can't use next/app router until i18n SSG is supported
//import { useRouter } from 'next/router';
// TODO: Currently missing any location information:
//import { useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Check from '@mui/icons-material/Check';
import LanguageTwoToneIcon from '@mui/icons-material/LanguageTwoTone';
import { SUPPORTED_LOCALES, Locale, CODE_TO_NAME } from '@store/user-locale';
import { useActiveLocale } from '@hooks/use-active-locale';
import { languageMenuAnchorElAtom, languageMenuIsOpenAtom } from '@store/language-menu-is-open';
import { useLocationLinkProps } from '@hooks/use-location-link-props';
import LanguageLink from '@components/language-link';
import { t } from '@lingui/macro';

const LanguageMenu = () => {
  const [isOpen, setIsOpen] = useAtom(languageMenuIsOpenAtom);
  const [anchorEl, setAnchorEl] = useAtom(languageMenuAnchorElAtom);

  const activeLocale = useActiveLocale();

  const handleClose = () => {
    setAnchorEl(null);
    setIsOpen(false);
  };

  return (
    <Menu
      id="language-menu"
      anchorEl={anchorEl}
      open={isOpen}
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
        'aria-labelledby': 'choose-language-button',
      }}
    >
      <MenuList dense>
        {SUPPORTED_LOCALES.map(locale => (
          <LanguageMenuItem locale={locale} active={activeLocale === locale} key={locale} />
        ))}
        {/* When next supports i18n with SSG asPath would be preferred here */}
      </MenuList>
    </Menu>
  );
};
//LanguageMenu.whyDidYouRender = true
//export { LanguageMenu };

const LanguageMenuItem = ({ locale, active }: { locale: Locale; active: boolean }) => {
  const { to, onClick } = useLocationLinkProps(locale);

  if (!to) return null;

  return (
    <MenuItem key={locale} onClick={onClick}>
      {active && (
        <ListItemIcon>
          <Check color="success" />
        </ListItemIcon>
      )}
      <LanguageLink to={to}>
        <ListItemText inset={!active}>{CODE_TO_NAME[locale]}</ListItemText>
      </LanguageLink>
    </MenuItem>
  );
};

const ChooseLanguageButton = () => {
  const [isOpen, setIsOpen] = useAtom(languageMenuIsOpenAtom);
  const [, setAnchorEl] = useAtom(languageMenuAnchorElAtom);
  const handleChooseLanguage = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  return (
    <div>
      <IconButton
        size="small"
        onClick={handleChooseLanguage}
        color="primary"
        id="choose-language-button"
        aria-controls="language-menu"
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
      >
        <Tooltip title={t`Choose Language`}>
          <LanguageTwoToneIcon fontSize="small" />
        </Tooltip>
      </IconButton>
      <LanguageMenu />
    </div>
  );
};
export default ChooseLanguageButton;
