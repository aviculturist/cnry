import { useAtom } from 'jotai';
import { transactionsDrawerIsOpenAtom } from '@store/ui/transactions-drawer-is-open';

interface TransactionsDrawer {
  transactionsDrawerIsOpen: boolean;
  setTransactionsDrawerIsOpen: (update: any) => void;
}

const useTransactionsDrawerIsOpen = (): TransactionsDrawer => {
  const [transactionsDrawerIsOpen, setTransactionsDrawerIsOpen] = useAtom(
    transactionsDrawerIsOpenAtom
  );
  return {
    transactionsDrawerIsOpen: transactionsDrawerIsOpen,
    setTransactionsDrawerIsOpen: setTransactionsDrawerIsOpen,
  };
};
export default useTransactionsDrawerIsOpen;
