import { useAtom } from 'jotai';
import { t } from '@lingui/macro';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import { DialogTitle } from '@mui/material';
import { anyCnryKeepaliveExpiryDialogIsOpenAtomFamily } from '@store/ui/set-cnry-keepalive-expiry-dialog-is-open';
import SetCnryKeepaliveExpiryForm from '@components/forms/set-cnry-keepalive-expiry-form';
import { cnryGetMetadataAtom } from '@store/cnry';

export const SetCnryKeepaliveExpiryDialog = ({ tokenId }: { tokenId: number }) => {
  const [cnryMetadata] = useAtom(cnryGetMetadataAtom(tokenId));
  const [setCnryKeepaliveExpiryDialogIsOpen, setSetCnryKeepaliveExpiryDialogisOpen] = useAtom(
    anyCnryKeepaliveExpiryDialogIsOpenAtomFamily(tokenId)
  );
  const handleClose = () => {
    setSetCnryKeepaliveExpiryDialogisOpen(false);
  };

  return cnryMetadata ? (
    <>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        onClose={handleClose}
        open={setCnryKeepaliveExpiryDialogIsOpen}
      >
        <DialogTitle>{t`Edit Keepalive Expiry Frequency`}</DialogTitle>
        <Stack maxWidth="sm" sx={{ m: 'auto', p: 6 }}>
          <SetCnryKeepaliveExpiryForm
            key={tokenId.toString()}
            tokenId={tokenId}
            cnryKeepaliveExpiry={Number(cnryMetadata.keepaliveExpiry)}
          />
        </Stack>
      </Dialog>
    </>
  ) : (
    <></>
  );
};
