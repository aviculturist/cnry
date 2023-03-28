import type {
  Account,
  ReadOnlyFn,
  TxReceipt,
  Block,
} from 'https://deno.land/x/clarinet@v1.5.2/index.ts';

import { Chain, Tx, types } from 'https://deno.land/x/clarinet@v1.5.2/index.ts';
import { Accounts, Context } from './deps.ts';
import { assertEquals } from 'https://deno.land/std@0.181.0/testing/asserts.ts';

import {
  describe,
  it,
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
  test,
  run,
} from 'https://deno.land/x/dspec@v0.2.0/mod.ts';

let ctx: Context;
let chain: Chain;
let accounts: Accounts;

beforeAll(() => {
  ctx = new Context();
  chain = ctx.chain;
  accounts = ctx.accounts;
});

afterAll(() => {
  ctx.terminate();
});

describe('Clarinet testing that ... ', () => {
  it('wallet_1 can hatch a Cnry', () => {
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
    result.expectOk();
  });

  it('wallet_2 can hatch a Cnry', () => {
    const account = accounts.get('wallet_2')!;
    const block = chain.mineBlock([
      Tx.contractCall(
        'cnry',
        'hatch',
        [types.utf8('Wallet 2 Warrant Canary'), types.utf8('The FBI has not been here today.')],
        account.address
      ),
    ]);
    const result = block.receipts[0].result;
    result.expectOk();
  });

  it('wallet_2 can update the contract uri', () => {
    const account = accounts.get('wallet_2')!;
    const block = chain.mineBlock([
      Tx.contractCall(
        'cnry',
        'set-uri',
        [types.uint(2), types.ascii('https://example.com')],
        account.address
      ),
    ]);

    const result = block.receipts[0].result;
    result.expectOk();

    const metadata = chain.callReadOnlyFn('cnry', 'get-metadata', [types.uint(2)], account.address);
    metadata.result.expectSome('https://example.com');
  });

  it('wallet_2 can watch a Cnry', () => {
    const account = accounts.get('wallet_2')!;
    const block = chain.mineBlock([
      Tx.contractCall('cnry', 'watch', [types.uint(2)], account.address),
    ]);

    const result = block.receipts[0].result;
    result.expectOk();

    // const metadata = chain.callReadOnlyFn('cnry', 'get-metadata', [types.uint(2)], account.address);
    // metadata.result.expectSome('https://example.com');
  });

  it('deployer can update the contract base-uri', () => {
    const deployer = accounts.get('deployer')!;

    const block = chain.mineBlock([
      Tx.contractCall(
        'cnry',
        'set-base-uri',
        [types.ascii('https://www.example.com?id={id}')],
        deployer.address
      ),
    ]);

    // contract returns (ok true)
    const result = block.receipts[0].result;
    result.expectOk().expectBool(true);

    const metadata = chain.callReadOnlyFn(
      'cnry',
      'get-base-uri',
      [types.uint(2)],
      deployer.address
    );
    // TODO: why is metadata.result wrapped in double quotes?
    assertEquals(metadata.result, '"https://www.example.com?id={id}"');
  });

  it('non-deployer cannot update the base-uri', () => {
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
  });

  it('ensure that Cnry contract is watched by Watcher contract', () => {
    const deployer = accounts.get('deployer')!;

    const call = chain.callReadOnlyFn('watcher', 'get-watched-contract', [], deployer.address);

    call.result
      .expectOk()
      .expectSome()
      .expectPrincipal('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.cnry');
  });
});

run();
