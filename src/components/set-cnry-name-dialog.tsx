import { useAtom } from 'jotai';
import { t } from '@lingui/macro';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import { DialogTitle } from '@mui/material';
import { anyCnryNameDialogIsOpenAtomFamily } from '@store/ui/set-cnry-name-dialog-is-open';
import SetCnryNameForm from '@components/forms/set-cnry-name-form';

export const SetCnryNameDialog = ({ tokenId, cnryName }: { tokenId: number; cnryName: string }) => {
  const [setCnryNameDialogIsOpen, setSetCnryNameDialogisOpen] = useAtom(
    anyCnryNameDialogIsOpenAtomFamily(tokenId)
  );
  const handleClose = () => {
    setSetCnryNameDialogisOpen(false);
  };

  return (
    <>
      <Dialog fullWidth={true} maxWidth="sm" onClose={handleClose} open={setCnryNameDialogIsOpen}>
        <DialogTitle>{t`Edit Cnry Name`}</DialogTitle>
        <Stack maxWidth="sm" sx={{ m: 'auto', p: 6 }}>
          <SetCnryNameForm key={tokenId} tokenId={tokenId} cnryName={cnryName} />
        </Stack>
      </Dialog>
    </>
  );
};
