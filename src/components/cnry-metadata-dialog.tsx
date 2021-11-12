import { useRouter } from 'next/router';
import { t } from '@lingui/macro';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import { DialogTitle } from '@mui/material';
import CnryCard from '@components/cnry-card';
import { useQuery } from '@hooks/use-query';
import useMetadataDialogIsOpen from '@hooks/use-metadata-dialog-is-open';

export const CnryMetadataErrorDialog = () => {
  const id = useQuery();
  const tokenId = id !== '' ? Number(id) : undefined;
  const { metadataDialogIsOpen, setMetadataDialogIsOpen } = useMetadataDialogIsOpen();
  const router = useRouter();
  const handleClose = () => {
    router.replace('./id={id}', './', { shallow: true });
  };
  return tokenId ? (
    <>
      <Dialog fullWidth={true} maxWidth="xs" onClose={handleClose} open={metadataDialogIsOpen}>
        <DialogTitle>{t`Cnry #{tokenId} Not Found`}</DialogTitle>
      </Dialog>
    </>
  ) : (
    <></>
  );
};

export const CnryMetadataDialog = () => {
  const id = useQuery();
  const tokenId = id !== '' ? Number(id) : undefined;
  const { metadataDialogIsOpen, setMetadataDialogIsOpen } = useMetadataDialogIsOpen();
  const router = useRouter();
  const handleClose = () => {
    // TODO: this is clumsy
    router.replace('./id={id}', './', { shallow: true });
  };

  // TODO: add scrolling feature
  return tokenId !== undefined ? (
    <>
      <Dialog fullWidth={true} maxWidth="sm" onClose={handleClose} open={metadataDialogIsOpen}>
        <DialogTitle>Cnry #{id}</DialogTitle>
        <Stack maxWidth="sm" sx={{ m: 'auto', p: 6 }}>
          <CnryCard tokenId={tokenId} />
        </Stack>
      </Dialog>
    </>
  ) : (
    <></>
  );
};
