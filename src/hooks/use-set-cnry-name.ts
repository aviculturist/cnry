import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { useTransactionPopup } from '@micro-stacks/react';
import { currentCnryContractState } from '@utils/helpers';
import { SET_NAME_FUNCTION } from '@utils/constants';
import { userPendingTxAtom, submittedTransactionAtom } from '@store/transactions';
import { uintCV, stringUtf8CV } from 'micro-stacks/clarity';
import { anyCnryNameDialogIsOpenAtomFamily } from '@store/ui/set-cnry-name-dialog-is-open';
import { submittedTransactionDialogIsOpenAtom } from '@store/ui/submitted-transaction-dialog-is-open';
import { currentUpdatingCnrysAtom } from '@store/cnry';

const useSetCnryName = (tokenId: number) => {
  const [cnryContract] = useAtom(currentCnryContractState);
  const [contractAddress, contractName] = cnryContract.split('.');
  const { handleContractCall } = useTransactionPopup();
  const [, setSetCnryNameDialogIsOpen] = useAtom(anyCnryNameDialogIsOpenAtomFamily(tokenId));
  const [, setSubmittedTransactionDialogIsOpen] = useAtom(submittedTransactionDialogIsOpenAtom);
  const [, setSubmittedTxId] = useAtom(submittedTransactionAtom);
  const [updatingCnryIds, setUpdatingCnryIds] = useAtom(currentUpdatingCnrysAtom);

  const onFinish = useCallback(
    data => {
      void userPendingTxAtom(data.txid); // track node acknowledgement and transaction status
      setSetCnryNameDialogIsOpen(false);
      setSubmittedTxId(data.txid); // transaction is submitted, awaiting node acknowledgement
      const newArray = updatingCnryIds[tokenId] === undefined ? [] : updatingCnryIds[tokenId];
      newArray.push(data.txid);
      setUpdatingCnryIds({ ...updatingCnryIds, [tokenId]: newArray }); // add transaction to array to track Cnry updating status
      setSubmittedTransactionDialogIsOpen(true); // open transaction submitted dialog
    },
    [
      setSetCnryNameDialogIsOpen,
      setSubmittedTransactionDialogIsOpen,
      setSubmittedTxId,
      setUpdatingCnryIds,
      tokenId,
      updatingCnryIds,
    ]
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
        functionName: SET_NAME_FUNCTION,
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
