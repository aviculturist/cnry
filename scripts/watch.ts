import { NodeProvider, NodeTransaction } from '@clarigen/node';
import { Transaction, WebTransactionReceipt, Response, TransactionReceipt } from '@clarigen/core';
import { contracts } from '@contracts';
import { StacksMocknet } from '@stacks/network';

// wallet_2 private key
// this is the private key making transactions.
//const privateKey = '530d9f61984c888536871c6573073bdfc0058896dc1adfe9a6a10dfacadc209101';
const privateKey = '7287ba251d44a4d3fd9276c88ce34c5c52a038955511cccaf77e61068649c17801';
const tokenId = Number(process.argv[2]) || 0;

const clarigenConfig = {
  privateKey,
  network: new StacksMocknet(),
  deployerAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
};

const deployed = NodeProvider.fromContracts(contracts, clarigenConfig);

async function run() {
  const cnry = deployed.cnry.contract;
  const watchTx = cnry.watch(tokenId) as Transaction<bigint, bigint>;

  const result = (await watchTx.submit({
    postConditions: [],
  })) as TransactionReceipt<bigint, bigint>;

  console.log(result);
  // console.log(`curl -s 'http://localhost:3999/extended/v1/tx/0x${result.txId}' | jq -r .`);
  // console.log(`stx -I http://localhost:3999 -H http://localhost:3999 get_confirmations ${result.txId}`);
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
