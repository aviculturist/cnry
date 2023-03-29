import { useAtom } from 'jotai';
import { t } from '@lingui/macro';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import { DialogTitle } from '@mui/material';
import { anyCnryStatementDialogIsOpenAtomFamily } from '@store/ui/set-cnry-statement-dialog-is-open';
import SetCnryStatementForm from '@components/forms/set-cnry-statement-form';
import { cnryGetMetadataAtom } from '@store/cnry';

export const SetCnryStatementDialog = ({ tokenId }: { tokenId: number }) => {
  const [cnryMetadata] = useAtom(cnryGetMetadataAtom(tokenId));
  const [setCnryStatementDialogIsOpen, setSetCnryStatementDialogisOpen] = useAtom(
    anyCnryStatementDialogIsOpenAtomFamily(tokenId)
  );
  const handleClose = () => {
    setSetCnryStatementDialogisOpen(false);
  };

  return cnryMetadata ? (
    <>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        onClose={handleClose}
        open={setCnryStatementDialogIsOpen}
      >
        <DialogTitle>{t`Edit Statement`}</DialogTitle>
        <Stack maxWidth="sm" sx={{ m: 'auto', p: 6 }}>
          <SetCnryStatementForm
            key={tokenId.toString()}
            tokenId={tokenId}
            cnryStatement={cnryMetadata.cnryStatement}
          />
        </Stack>
      </Dialog>
    </>
  ) : (
    <></>
  );
};
