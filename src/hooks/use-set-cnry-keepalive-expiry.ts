import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { useTransactionPopup } from '@micro-stacks/react';
import { currentCnryContractState } from '@utils/helpers';
import { KEEPALIVE_FUNCTION } from '@utils/constants';
import { cnryUserPendingTxIdsAtom, currentPendingTxIdsAtom, userPendingTxAtom } from '@store/transactions';
//import { uintCV, intCV } from 'micro-stacks/clarity';
import { noneCV, someCV, uintCV, stringUtf8CV } from '@stacks/transactions';
import { anyCnryKeepaliveExpiryDialogIsOpenAtomFamily } from '@store/ui/set-cnry-keepalive-expiry-dialog-is-open';

const useSetCnryKeepaliveExpiry = (tokenId: number, cnryKeepaliveExpiry: number) => {
  const [cnryContract] = useAtom(currentCnryContractState);
  const [contractAddress, contractName] = cnryContract.split('.');
  const { handleContractCall } = useTransactionPopup();
  const [cnryUserPendingTxIds, setCnryUserPendingTxIds] = useAtom(cnryUserPendingTxIdsAtom);
  const [pendingTxIds, setPendingTxIds] = useAtom(currentPendingTxIdsAtom);
  const [setCnryKeepaliveExpiryDialogIsOpen, setSetCnryKeepaliveExpiryDialogIsOpen] = useAtom(
    anyCnryKeepaliveExpiryDialogIsOpenAtomFamily(tokenId)
  );
  const onFinish = useCallback(
    data => {
      //setPendingTxIds([...pendingTxIds, data.txid]); // adds this txid to the array of pending transactions
      setPendingTxIds([...pendingTxIds, data.txid]); // adds this txid to the array of pending transactions
      void userPendingTxAtom(data.txid); // creates an atomFamilyWithQuery to track status
      setCnryUserPendingTxIds([...cnryUserPendingTxIds, data.txid]); // adds this txid to the array of pending transactions
      setSetCnryKeepaliveExpiryDialogIsOpen(false);
    },
    [cnryUserPendingTxIds, setCnryUserPendingTxIds, setPendingTxIds, setSetCnryKeepaliveExpiryDialogIsOpen]
  );

  const onCancel = useCallback(errorMessage => {
    console.log('within onCancel: ');
    console.log(errorMessage);
  }, []);

  return useCallback(
    (tokenId, cnryKeepaliveExpiry) => {
      void handleContractCall({
        contractAddress,
        contractName,
        functionName: 'set-keepaliveExpiry',
        functionArgs: [uintCV(tokenId), uintCV(cnryKeepaliveExpiry)],
        postConditions: [],
        onFinish,
        onCancel,
      });
    },
    [handleContractCall, contractAddress, contractName, onFinish, onCancel]
  );
};
export default useSetCnryKeepaliveExpiry;
