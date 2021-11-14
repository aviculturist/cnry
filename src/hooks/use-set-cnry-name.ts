import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { useTransactionPopup } from '@micro-stacks/react';
import { currentCnryContractState } from '@store/helpers';
import { HATCH_FUNCTION } from '@utils/constants';
import { cnryUserPendingTxIdsAtom, userPendingTxIdsAtom, userPendingTxAtom } from '@store/cnry';
//import { uintCV, intCV } from 'micro-stacks/clarity';
import { noneCV, someCV, uintCV, stringUtf8CV } from '@stacks/transactions';
import { anyCnryNameDialogIsOpenAtomFamily } from '@store/ui/set-cnry-name-dialog-is-open';

const useSetCnryName = (tokenId: number, cnryName: string) => {
  const [cnryContract] = useAtom(currentCnryContractState);
  const [contractAddress, contractName] = cnryContract.split('.');
  const { handleContractCall } = useTransactionPopup();
  const [cnryUserPendingTxIds, setCnryUserPendingTxIds] = useAtom(cnryUserPendingTxIdsAtom);
  const [pendingTxIds, setPendingTxIds] = useAtom(userPendingTxIdsAtom);
  const [setCnryNameDialogIsOpen, setSetCnryNameDialogIsOpen] = useAtom(
    anyCnryNameDialogIsOpenAtomFamily(tokenId)
  );
  const onFinish = useCallback(
    data => {
      setPendingTxIds([...pendingTxIds, data.txId]); // adds this txid to the array of pending transactions
      void userPendingTxAtom(data.txId); // creates an atomFamilyWithQuery to track status
      setCnryUserPendingTxIds([...cnryUserPendingTxIds, data.txId]); // adds this txid to the array of pending transactions
      setSetCnryNameDialogIsOpen(false);
    },
    [cnryUserPendingTxIds, pendingTxIds, setCnryUserPendingTxIds, setPendingTxIds]
  );

  const onCancel = useCallback(errorMessage => {
    console.log('within onCancel: ');
    console.log(errorMessage);
  }, []);

  return useCallback(
    (tokenId, cnryName) => {
      void handleContractCall({
        contractAddress,
        contractName,
        functionName: 'set-name',
        functionArgs: [uintCV(tokenId), stringUtf8CV(cnryName)],
        postConditions: [],
        onFinish,
        onCancel,
      });
    },
    [handleContractCall, contractAddress, contractName, onFinish, onCancel]
  );
};
export default useSetCnryName;
