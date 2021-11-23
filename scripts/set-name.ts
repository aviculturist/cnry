import { NodeProvider } from '@clarigen/node';
import { Transaction, WebTransactionReceipt, Response } from '@clarigen/core';
import { contracts } from '@contracts';
import { StacksMocknet } from '@stacks/network';

// wallet_2 private key
// this is the private key making transactions.
const privateKey = '530d9f61984c888536871c6573073bdfc0058896dc1adfe9a6a10dfacadc209101';

const tokenId = process.argv[3] !== undefined ? Number(process.argv[2]) : 0;
const name = process.argv[3] !== undefined ? process.argv[3] : 'Default Name';

const clarigenConfig = {
  privateKey,
  network: new StacksMocknet(),
  deployerAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
};

const deployed = NodeProvider.fromContracts(contracts, clarigenConfig);

async function run() {
  const cnry = deployed.cnry.contract;
  const setNameTx = cnry.setName(tokenId, name) as Transaction<bigint, bigint>;

  const result = (await setNameTx.submit({
    postConditions: [],
  })) as WebTransactionReceipt<bigint, bigint>;
  //  })) as WebTransactionReceipt<number, null>;

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
