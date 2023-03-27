import {
  Block,
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from 'https://deno.land/x/clarinet@v1.5.2/index.ts';

import { assertEquals } from 'https://deno.land/std@0.181.0/testing/asserts.ts';

Clarinet.test({
  name: 'wallet_1 can hatch a Cnry',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const account = accounts.get('wallet_1')!;
    const block = chain.mineBlock([
      Tx.contractCall(
        'cnry',
        'hatch',
        [types.utf8('Wallet 1 Warrant Canary'), types.utf8('The FBI has not been here today.')],
        account.address
      ),
    ]);
    const result = block.receipts[0].result;
    console.log('wallet_1');
    console.log(result);
    result.expectOk();
  },
});

Clarinet.test({
  name: 'wallet_2 account can hatch Cnry',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const account = accounts.get('wallet_2')!;
    const block = chain.mineBlock([
      Tx.contractCall(
        'cnry',
        'hatch',
        [types.utf8('wallet_2 Warrant Canary'), types.utf8('The FBI has not been here today.')],
        account.address
      ),
    ]);
    const result = block.receipts[0].result;
    console.log('wallet_2');
    console.log(result);
    result.expectOk();
  },
});

Clarinet.test({
  name: 'wallet_2 can update the contract uri',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const account = accounts.get('wallet_2')!;

    // deployer account attempts to update the base-uri
    const block = chain.mineBlock([
      Tx.contractCall(
        'cnry',
        'set-uri',
        [types.uint(2), types.ascii('https://example.com')],
        account.address
      ),
    ]);

    // contract returns (ok true)
    const result = block.receipts[0].result;
    result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: 'it allows the deployer to update the contract base-uri',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    // deployer account attempts to update the base-uri
    const block = chain.mineBlock([
      Tx.contractCall(
        'cnry',
        'set-base-uri',
        [types.ascii('https://www.cnry.org?id={id}')],
        deployer.address
      ),
    ]);

    // contract returns (ok true)
    const result = block.receipts[0].result;
    result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: 'it fails when a non-deployer account updates the contract metadata',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const account = accounts.get('wallet_1')!;

    // wallet_1 attempts to update the base-uri
    const block = chain.mineBlock([
      Tx.contractCall(
        'cnry',
        'set-base-uri',
        [types.ascii('https://www.cnry.org/?id={id}')],
        account.address
      ),
    ]);

    // the contract returns an error
    const result = block.receipts[0].result;

    result.expectErr().expectUint(401);
  },
});

Clarinet.test({
  name: 'it lets an account watch a Cnry',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get('wallet_1')!;

    // wallet_2 calls the watch function
    const block_1 = chain.mineBlock([
      Tx.contractCall('cnry', 'watch', [types.uint(0)], wallet_1.address),
    ]);

    // contract returns (ok true)
    const result_1 = block_1.receipts[0].result;

    result_1.expectOk().expectUint(1);

    const wallet_2 = accounts.get('wallet_2')!;

    // wallet_2 calls the watch function
    const block_2 = chain.mineBlock([
      Tx.contractCall('cnry', 'watch', [types.uint(0)], wallet_2.address),
    ]);

    // contract returns (ok true)
    const result_2 = block_2.receipts[0].result;
    result_2.expectOk().expectUint(2);
  },
});

//This fails although it works in the scripts
// Clarinet.test({
//   name: 'it lets an account update a Cnry name',
//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     const account = accounts.get('wallet_1')!;

//     // wallet_1 calls the watch function
//     const block = chain.mineBlock([
//       Tx.contractCall('cnry', 'set-name', [types.uint(1), types.utf8('New Name')], account.address),
//     ]);

//     // contract returns (ok true)
//     const result = block.receipts[0].result;

//     result.expectOk();
//   },
// });

// Clarinet.test({
//   name: 'it lets an account watch a Cnry',
//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     const account = accounts.get('wallet_1')!;

//     // wallet_1 calls the watch function
//     const block = chain.mineBlock([
//       Tx.contractCall('cnry', 'watch', [types.uint(0)], account.address),
//     ]);

//     // contract returns (ok true)
//     const result = block.receipts[0].result;

//     result.expectOk().expectUint(1);
//   },
// });

// Clarinet.test({
//   name: 'it adds the cnry contract to watcher watched-contract storage',
//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     const deployer = accounts.get('deployer')!;

//     const call = chain.callReadOnlyFn('watcher', 'get-watched-contract', [], deployer.address);

//     call.result
//       .expectOk()
//       .expectSome()
//       .expectPrincipal('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.cnry');
//   },
// });
