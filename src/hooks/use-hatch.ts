import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { stringUtf8CV } from 'micro-stacks/clarity';
import {
  PostConditionMode,
  createSTXPostCondition,
  createNonFungiblePostCondition,
  FungibleConditionCode,
  NonFungibleConditionCode,
  createAssetInfo,
} from 'micro-stacks/transactions';
import { networkAtom, userStxAddressesAtom, useTransactionPopup } from '@micro-stacks/react';
import { ChainID } from 'micro-stacks/common';
import { currentCnryContractState } from '@utils/helpers';
import { HATCH_FUNCTION } from '@utils/constants';
import { hatchPriceAtom } from '@store/cnry';
import {
  cnryUserPendingTxIdsAtom,
  currentPendingTxIdsAtom,
  userPendingTxAtom,
} from '@store/transactions';
const useHatch = () => {
  const [cnryContract] = useAtom(currentCnryContractState);
  const [contractAddress, contractName] = cnryContract.split('.');
  const [network] = useAtom(networkAtom);
  const [hatchPrice] = useAtom(hatchPriceAtom);
  const chain = network?.chainId === ChainID.Mainnet ? 'mainnet' : 'testnet';
  const [userStxAddresses] = useAtom(userStxAddressesAtom);
  const userStxAddress = userStxAddresses?.[chain] || contractAddress;
  const { handleContractCall } = useTransactionPopup();
  const [cnryUserPendingTxIds, setCnryUserPendingTxIds] = useAtom(cnryUserPendingTxIdsAtom);
  const [pendingTxIds, setPendingTxIds] = useAtom(currentPendingTxIdsAtom);

  const onFinish = useCallback(
    data => {
      console.log(data);
      setPendingTxIds([...pendingTxIds, data.txid]); // adds this txid to the array of pending transactions
      void userPendingTxAtom(data.txid); // creates an atomFamilyWithQuery to track status
      setCnryUserPendingTxIds([...cnryUserPendingTxIds, data.txid]); // adds this txid to the array of pending transactions
    },
    [cnryUserPendingTxIds, pendingTxIds, setCnryUserPendingTxIds, setPendingTxIds]
  );

  const onCancel = useCallback(errorMessage => {
    console.log('within onCancel: ');
    console.log(errorMessage);
  }, []);

  const stxPostCond = createSTXPostCondition(
    userStxAddress,
    FungibleConditionCode.Equal,
    hatchPrice
  );

  const nftPostCond = createNonFungiblePostCondition(
    userStxAddress,
    NonFungibleConditionCode.Owns,
    createAssetInfo(contractAddress, contractName, 'CNRY'),
    stringUtf8CV('CNRY')
  );

  return useCallback(
    (cnryName, statement) => {
      void handleContractCall({
        contractAddress,
        contractName,
        functionName: HATCH_FUNCTION,
        functionArgs: [stringUtf8CV(cnryName), stringUtf8CV(statement)],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [stxPostCond, nftPostCond],
        onFinish,
        onCancel,
      });
    },
    [
      handleContractCall,
      contractAddress,
      contractName,
      stxPostCond,
      nftPostCond,
      onFinish,
      onCancel,
    ]
  );
};
export default useHatch;
