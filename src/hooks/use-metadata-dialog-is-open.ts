import { useAtom } from 'jotai';
import { metadataDialogIsOpenAtom } from '@store/metadata-dialog-is-open';

interface MetadataDialogProps {
  metadataDialogIsOpen: boolean;
  setMetadataDialogIsOpen: (update: any) => void;
}

const useMetadataDialogIsOpen = (): MetadataDialogProps => {
  const [metadataDialogIsOpen, setMetadataDialogIsOpen] = useAtom(metadataDialogIsOpenAtom);
  return {
    metadataDialogIsOpen: metadataDialogIsOpen,
    setMetadataDialogIsOpen: setMetadataDialogIsOpen,
  };
};
export default useMetadataDialogIsOpen;
