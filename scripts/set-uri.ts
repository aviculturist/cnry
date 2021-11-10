import { NodeProvider } from '@clarigen/node';
import { Transaction, WebTransactionReceipt, Response } from '@clarigen/core';
import { contracts } from '@contracts';
import { StacksMocknet } from '@stacks/network';

// wallet_1 private key
// this is the private key making transactions.
const privateKey = '7287ba251d44a4d3fd9276c88ce34c5c52a038955511cccaf77e61068649c17801';

const clarigenConfig = {
  privateKey,
  network: new StacksMocknet(),
  deployerAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
};

const deployed = NodeProvider.fromContracts(contracts, clarigenConfig);

async function run() {
  const cnry = deployed.cnry.contract;
  const tokenId = 0;
  const setNameTx = cnry.setUri(tokenId, 'ipfs://QmBLAHBLAHBLAH/{id}') as Transaction<
    bigint,
    Response<null, bigint>
  >;

  const result = (await setNameTx.submit({
    postConditions: [],
  })) as WebTransactionReceipt<bigint, bigint>;

  console.log(result);
  console.log(`curl -s 'http://localhost:3999/extended/v1/tx/0x${result.txId}' | jq -r .`);
  console.log(
    `stx -I http://localhost:3999 -H http://localhost:3999 get_confirmations ${result.txId}`
  );
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
