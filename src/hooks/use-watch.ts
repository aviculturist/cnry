import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { uintCV } from 'micro-stacks/clarity';
import {
  PostConditionMode,
  createSTXPostCondition,
  FungibleConditionCode,
} from 'micro-stacks/transactions';
import { networkAtom, userStxAddressesAtom, useTransactionPopup } from '@micro-stacks/react';
import { ChainID } from 'micro-stacks/common';
import { currentCnryContractState } from '@utils/helpers';
import { WATCH_FUNCTION } from '@utils/constants';
import { currentPendingTxIdsAtom, userPendingTxAtom } from '@store/transactions';
import { watchPriceAtom } from '@store/cnry';

const useWatch = () => {
  const [cnryContract] = useAtom(currentCnryContractState);
  const [contractAddress, contractName] = cnryContract.split('.');
  const [network] = useAtom(networkAtom);
  const [watchPrice] = useAtom(watchPriceAtom);
  const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
  const [userStxAddresses] = useAtom(userStxAddressesAtom);
  const userStxAddress = userStxAddresses?.[chain] || contractAddress;
  const { handleContractCall } = useTransactionPopup();
  const [pendingTxIds, setPendingTxIds] = useAtom(currentPendingTxIdsAtom);

  const onFinish = useCallback(
    data => {
      setPendingTxIds([...pendingTxIds, data.txid]); // adds this txid to the array of pending transactions
      void userPendingTxAtom(data.txid); // creates an atomFamilyWithQuery to track status
    },
    [setPendingTxIds]
  );

  const onCancel = useCallback(errorMessage => {
    console.log('within onCancel: ');
    console.log(errorMessage);
  }, []);

  const stxPostCond = createSTXPostCondition(
    userStxAddress,
    FungibleConditionCode.Equal,
    watchPrice
  );

  return useCallback(
    cnryTokenId => {
      void handleContractCall({
        contractAddress,
        contractName,
        functionName: WATCH_FUNCTION,
        functionArgs: [uintCV(Number(cnryTokenId))],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [stxPostCond],
        onFinish,
        onCancel,
      });
    },
    [handleContractCall, contractAddress, contractName, stxPostCond, onFinish, onCancel]
  );
};
export default useWatch;
