import * as React from 'react';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useAuth } from '@micro-stacks/react';
import Button from '@mui/material/Button';
import { installWalletDialogIsOpenAtom } from '@store/install-wallet-dialog-is-open';
import { t } from '@lingui/macro';

const WalletConnectButton = () => {
  const { isSignedIn, handleSignIn, handleSignOut, isLoading, session } = useAuth();
  const [open, setOpen] = useAtom(installWalletDialogIsOpenAtom);

  useEffect(() => {
    session && setOpen(false);
  }, [session, setOpen]);

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={
        isSignedIn
          ? () => handleSignOut()
          : () => {
              try {
                // TODO: fix coming upstream
                handleSignIn({});
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
