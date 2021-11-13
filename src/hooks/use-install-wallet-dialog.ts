import { useAtom } from 'jotai';
import { installWalletDialogIsOpenAtom } from '@store/ui/install-wallet-dialog-is-open';

interface InstallWalletDialogIsOpenType {
  installWalletDialogIsOpen: boolean;
  setInstallWalletDialogIsOpen: (update: any) => void;
}

const useInstallWalletDialog = (): InstallWalletDialogIsOpenType => {
  const [installWalletDialogIsOpen, setInstallWalletDialogIsOpen] = useAtom(
    installWalletDialogIsOpenAtom
  );
  return { installWalletDialogIsOpen, setInstallWalletDialogIsOpen };
};
export default useInstallWalletDialog;
