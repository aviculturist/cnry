import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { useTransactionPopup } from '@micro-stacks/react';
import { currentCnryContractState } from '@store/helpers';
import { HATCH_FUNCTION } from '@utils/constants';
import { cnryUserPendingTxIdsAtom, currentPendingTxIdsAtom, userPendingTxAtom } from '@store/transactions';
//import { uintCV, intCV } from 'micro-stacks/clarity';
import { noneCV, someCV, uintCV, stringUtf8CV } from '@stacks/transactions';
import { anyCnryStatementDialogIsOpenAtomFamily } from '@store/ui/set-cnry-statement-dialog-is-open';

const useSetCnryStatement = (tokenId: number, cnryStatement: string) => {
  const [cnryContract] = useAtom(currentCnryContractState);
  const [contractAddress, contractName] = cnryContract.split('.');
  const { handleContractCall } = useTransactionPopup();
  const [cnryUserPendingTxIds, setCnryUserPendingTxIds] = useAtom(cnryUserPendingTxIdsAtom);
  const [pendingTxIds, setPendingTxIds] = useAtom(currentPendingTxIdsAtom);
  const [setCnryStatementDialogIsOpen, setSetCnryStatementDialogIsOpen] = useAtom(
    anyCnryStatementDialogIsOpenAtomFamily(tokenId)
  );
  const onFinish = useCallback(
    data => {
      setPendingTxIds([...pendingTxIds, data.txId]); // adds this txid to the array of pending transactions
      void userPendingTxAtom(data.txId); // creates an atomFamilyWithQuery to track status
      setCnryUserPendingTxIds([...cnryUserPendingTxIds, data.txId]); // adds this txid to the array of pending transactions
      setSetCnryStatementDialogIsOpen(false);
    },
    [cnryUserPendingTxIds, setCnryUserPendingTxIds, setPendingTxIds, setSetCnryStatementDialogIsOpen]
  );

  const onCancel = useCallback(errorMessage => {
    console.log('within onCancel: ');
    console.log(errorMessage);
  }, []);

  return useCallback(
    (tokenId, cnryStatement) => {
      void handleContractCall({
        contractAddress,
        contractName,
        functionName: 'set-statement',
        functionArgs: [uintCV(tokenId), stringUtf8CV(cnryStatement)],
        postConditions: [],
        onFinish,
        onCancel,
      });
    },
    [handleContractCall, contractAddress, contractName, onFinish, onCancel]
  );
};
export default useSetCnryStatement;
