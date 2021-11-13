import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { useTransactionPopup } from '@micro-stacks/react';
import { currentCnryContractState } from '@store/helpers';
import { HATCH_FUNCTION } from '@utils/constants';
import { cnryUserPendingTxIdsAtom, userPendingTxIdsAtom, userPendingTxAtom } from '@store/cnry';
import { uintCV } from 'micro-stacks/clarity';
import { noneCV, someCV, stringUtf8CV } from '@stacks/transactions';

const useHatch = () => {
  const [cnryContract] = useAtom(currentCnryContractState);
  const [contractAddress, contractName] = cnryContract.split('.');
  const { handleContractCall } = useTransactionPopup();
  const [cnryUserPendingTxIds, setCnryUserPendingTxIds] = useAtom(cnryUserPendingTxIdsAtom);
  const [pendingTxIds, setPendingTxIds] = useAtom(userPendingTxIdsAtom);

  const onFinish = useCallback(
    data => {
      setPendingTxIds([...pendingTxIds, data.txId]); // adds this txid to the array of pending transactions
      void userPendingTxAtom(data.txId); // creates an atomFamilyWithQuery to track status
      setCnryUserPendingTxIds([...cnryUserPendingTxIds, data.txId]); // adds this txid to the array of pending transactions
    },
    [cnryUserPendingTxIds, pendingTxIds, setCnryUserPendingTxIds, setPendingTxIds]
  );

  const onCancel = useCallback(errorMessage => {
    console.log('within onCancel: ');
    console.log(errorMessage);
  }, []);

  return useCallback(
    (cnryName, statement) => {
      void handleContractCall({
        contractAddress,
        contractName,
        functionName: HATCH_FUNCTION,
        functionArgs: [stringUtf8CV(cnryName), stringUtf8CV(statement)],
        postConditions: [],
        onFinish,
        onCancel,
      });
    },
    [handleContractCall, contractAddress, contractName, onFinish, onCancel]
  );
};
export default useHatch;
