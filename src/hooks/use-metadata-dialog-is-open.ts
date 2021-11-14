import { useAtom } from 'jotai';
import { singleCnryDialogIsOpenAtom } from '@store/ui/single-cnry-dialog-is-open';

interface SingleCnryDialogProps {
  singleCnryDialogIsOpen: boolean;
  setSingleCnryDialogIsOpen: (update: any) => void;
}

const useSingleCnryDialogIsOpen = (): SingleCnryDialogProps => {
  const [singleCnryDialogIsOpen, setSingleCnryDialogIsOpen] = useAtom(singleCnryDialogIsOpenAtom);
  return {
    singleCnryDialogIsOpen: singleCnryDialogIsOpen,
    setSingleCnryDialogIsOpen: setSingleCnryDialogIsOpen,
  };
};
export default useSingleCnryDialogIsOpen;
