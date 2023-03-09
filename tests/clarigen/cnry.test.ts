import { simnet, accounts } from '@utils/clarigen';
import { assertEquals } from 'https://deno.land/std@0.181.0/testing/asserts.ts';
import { beforeAll, describe, it, run } from 'https://deno.land/x/dspec@v0.2.0/mod.ts';
import {
  Chain,
  contractsFactory,
  factory,
  txOk,
  txErr,
} from 'https://deno.land/x/clarigen/src/index.ts';

const { cnry, watcher } = contractsFactory(simnet);

describe('Clarigen tests that', () => {
  let chain: Chain;
  beforeAll(() => {
    chain = Chain.fromSimnet(simnet).chain;
  });
  const alice = accounts.wallet_1.address;
  const bob = accounts.wallet_2.address;

  it('wallet_1 (Alice) can hatch a Cnry and the first Cnry has tokenId 1', () => {
    const initial = chain.rov(cnry.getLastTokenId());
    assertEquals(initial.value, 0n);

    const hatchResult = chain.mineOne(txOk(cnry.hatch('foo', 'bar'), alice));
    assertEquals(hatchResult.value, 1n);

    const first = chain.rov(cnry.getLastTokenId());
    assertEquals(first.value, 1n);
  });

  it('Alice can update her Cnry Uri', () => {
    const setUriTx = chain.mineOne(
      txOk(cnry.setUri({ tokenId: 1n, cnryUri: 'https://example.com' }), alice)
    );

    const getUriTx = chain.rov(cnry.getTokenUri(1n));
    assertEquals(getUriTx.value, 'https://example.com');
  });

  it('Alice can update her Cnry keepalive-timestamp', () => {
    const keepaliveUpdateTx = chain.mineOne(
      txOk(cnry.setKeepaliveExpiry({ tokenId: 1n, keepaliveExpiry: 5n }), alice)
    );
  });

  it('wallet_2 (Bob) can hatch a Cnry and the second Cnry has tokenId 2', () => {
    const hatchResult = chain.mineOne(
      txOk(cnry.hatch('Bobs Cnry', 'The FBI has not been here today'), bob)
    );
    assertEquals(hatchResult.value, 2n);
  });

  it("Bob cannot update Alice's Cnry", () => {
    const keepaliveResultTx = chain.mineOne(txErr(cnry.keepalive(1n), bob));
    assertEquals(keepaliveResultTx.value, 401n);
  });

  it("Bob can watch Alice's Cnry", () => {
    const watchContractTx = chain.mineOne(txOk(cnry.watch(1n), bob));
  });
});

run();
