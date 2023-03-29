// import { NodeProvider } from '@clarigen/node';
// import { Transaction, TransactionReceipt, Response } from '@clarigen/core';
// import { contracts } from '@contracts';
// import { StacksMocknet } from '@stacks/network';

// // depoyer private key
// // this is the private key making transactions.
// const privateKey = '753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601';

// const commitHash = process.argv[2];
// const maintenance = process.argv[3] === 'true' ? true : false;
// const wall = process.argv[4];

// const clarigenConfig = {
//   privateKey,
//   network: new StacksMocknet(),
//   deployerAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
// };

// const deployed = NodeProvider.fromContracts(contracts, clarigenConfig);

// // yarn ts-node scripts/add-maintenanceMode 'true' 'Maintenance Mode Enabled, new release being depoyed'
// async function run() {
//   const maintenanceMode = deployed.maintenance.contract;
//   const mmTx = maintenanceMode.addMaintenanceMode(commitHash, maintenance, wall) as Transaction<
//     bigint,
//     Response<null, bigint>
//   >;

//   const result = (await mmTx.submit({
//     postConditions: [],
//   })) as TransactionReceipt<bigint, bigint>;

//   console.log(result);
//   // console.log(`curl -s 'http://localhost:3999/extended/v1/tx/0x${result.txId}' | jq -r .`);
//   // console.log(
//   //   `stx -I http://localhost:3999 -H http://localhost:3999 get_confirmations ${result.txId}`
//   // );
// }

// run()
//   .catch(console.error)
//   .finally(() => {
//     process.exit();
//   });
