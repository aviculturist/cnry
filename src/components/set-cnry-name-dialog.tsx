import { useAtom } from 'jotai';
import { t } from '@lingui/macro';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import { DialogTitle } from '@mui/material';
import { anyCnryNameDialogIsOpenAtomFamily } from '@store/ui/set-cnry-name-dialog-is-open';
import SetCnryNameForm from '@components/forms/set-cnry-name-form';
import { cnryGetMetadataAtom } from '@store/cnry';

export const SetCnryNameDialog = ({ tokenId }: { tokenId: number }) => {
  const [cnryMetadata] = useAtom(cnryGetMetadataAtom(tokenId));
  const [setCnryNameDialogIsOpen, setSetCnryNameDialogisOpen] = useAtom(
    anyCnryNameDialogIsOpenAtomFamily(tokenId)
  );
  const handleClose = () => {
    setSetCnryNameDialogisOpen(false);
  };

  return cnryMetadata ? (
    <>
      <Dialog fullWidth={true} maxWidth="sm" onClose={handleClose} open={setCnryNameDialogIsOpen}>
        <DialogTitle>{t`Edit Name`}</DialogTitle>
        <Stack maxWidth="sm" sx={{ m: 'auto', p: 6 }}>
          <SetCnryNameForm
            key={tokenId.toString()}
            tokenId={tokenId}
            cnryName={cnryMetadata.cnryName}
          />
        </Stack>
      </Dialog>
    </>
  ) : (
    <></>
  );
};
