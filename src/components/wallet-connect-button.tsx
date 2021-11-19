import * as React from 'react';
import { useEffect } from 'react';
import { t } from '@lingui/macro';
import { useAtom } from 'jotai';
import { useAuth } from '@micro-stacks/react';
import Button from '@mui/material/Button';
import { installWalletDialogIsOpenAtom } from '@store/ui/install-wallet-dialog-is-open';

const WalletConnectButton = () => {
  const { isSignedIn, handleSignIn, handleSignOut, isLoading, session } = useAuth();
  const [, setOpen] = useAtom(installWalletDialogIsOpenAtom);

  useEffect(() => {
    session && setOpen(false);
  }, [session, setOpen]);

  // prevents wipeout of localStorage upon signout (by @micro-stacks/react)
  const handleHandleSignOut = () => {
    const darkMode = localStorage.getItem('darkMode') || '';
    const customNetworks = localStorage.getItem('customNetworks') || '';
    const currentNetworkIndex = localStorage.getItem('currentNetworkIndex') || '';
    const locale = localStorage.getItem('locale') || '';

    handleSignOut();

    if (darkMode !== '') {
      localStorage.setItem('darkMode', darkMode);
    }
    if (customNetworks !== '') {
      localStorage.setItem('customNetworks', customNetworks);
    }
    if (currentNetworkIndex !== '') {
      localStorage.setItem('currentNetworkIndex', currentNetworkIndex);
    }
    if (locale !== '') {
      localStorage.setItem('locale', locale);
    }
  };
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={
        isSignedIn
          ? () => handleHandleSignOut()
          : () => {
              try {
                // TODO: fix coming upstream
                handleSignIn();
              } catch (_e) {
                console.log(_e);
              }
              !session && setOpen(true);
            }
      }
    >
      {isLoading ? t`Loading...` : isSignedIn ? t`Sign out` : t`Connect Stacks Wallet`}
    </Button>
  );
};

export default WalletConnectButton;
