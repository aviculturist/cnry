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
import { currentCnryContractState } from '@store/helpers';
import { KEEPALIVE_FUNCTION } from '@utils/constants';
import { userPendingTxIdsAtom, userPendingTxAtom, keepalivePriceAtom } from '@store/cnry';

const useKeepalive = () => {
  const [cnryContract] = useAtom(currentCnryContractState);
  const [contractAddress, contractName] = cnryContract.split('.');
  const [network] = useAtom(networkAtom);
  const [keepalivePrice] = useAtom(keepalivePriceAtom);
  const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
  const [userStxAddresses] = useAtom(userStxAddressesAtom);
  const userStxAddress = userStxAddresses?.[chain] || contractAddress;
  const { handleContractCall } = useTransactionPopup();
  const [pendingTxIds, setPendingTxIds] = useAtom(userPendingTxIdsAtom);

  const onFinish = useCallback(
    data => {
      setPendingTxIds([...pendingTxIds, data.txId]); // adds this txid to the array of pending transactions
      void userPendingTxAtom(data.txId); // creates an atomFamilyWithQuery to track status
    },
    [pendingTxIds, setPendingTxIds]
  );

  const onCancel = useCallback(errorMessage => {
    console.log('within onCancel: ');
    console.log(errorMessage);
  }, []);

  const stxPostCond = createSTXPostCondition(
    userStxAddress,
    FungibleConditionCode.Equal,
    keepalivePrice
  );

  return useCallback(
    cnryTokenId => {
      void handleContractCall({
        contractAddress,
        contractName,
        functionName: KEEPALIVE_FUNCTION,
        functionArgs: [uintCV(Number(cnryTokenId.tokenId))],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [stxPostCond],
        onFinish,
        onCancel,
      });
    },
    [handleContractCall, contractAddress, contractName, stxPostCond, onFinish, onCancel]
  );
};
export default useKeepalive;
