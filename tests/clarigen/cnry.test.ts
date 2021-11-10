import { TestProvider, txOk, txErr } from '@clarigen/test';
import { cvToValue } from '@clarigen/core';

import { contracts, accounts, CnryContract, WatcherContract } from '@contracts';

const alice = accounts.deployer.address; //"ST3J2GVMMM2R07ZFBJDWTYEYAR8FZH5WKDTFJ9AHA";
const bob = accounts.wallet_1.address;
let cnry: CnryContract;
let watcher: WatcherContract;

async function deploy() {
  const deployed = await TestProvider.fromContracts(contracts);
  cnry = deployed.cnry.contract;
  watcher = deployed.watcher.contract;

}
const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));

describe('Cnry contract', () => {
  beforeAll(async () => {
    await deploy();
  });

  test('Cnry token holder #2 (Alice) can hatch a Cnry and the first Cnry has tokenId 0', async () => {
    const tx = cnry.hatch('Acme Corp', 'Acme Corp has never received an order under Section 215 of the USA Patriot Act.');
    const result = await txOk(tx, alice);
    expect(result.value).toEqual(0n);
  });

  test('Alice can update the Cnry Uri', async () => {
    const setUriTx = cnry.setUri(0, 'https://example.com');
    const result = await txOk(setUriTx, alice);
    expect(result.value).toBeGreaterThan(0n);
    const getUriTx = cnry.getTokenUri(0);
    expect(await getUriTx).toEqual({"value": "https://example.com"});
  });

  test('Alice can update the Cnry keepalive-timestamp', async () => {
    const getKeepaliveExpiry = cnry.getKeepaliveTimestamp(0);
    const keepalive = await getKeepaliveExpiry;
    const keepaliveValue = "value" in keepalive ? keepalive.value : 0;
    const keepaliveTx = cnry.keepalive(0);
    const result = await txOk(keepaliveTx, alice);
    const getKeepaliveExpiryAfter = cnry.getKeepaliveTimestamp(0);
    const keepaliveAfter = await getKeepaliveExpiryAfter;
    const keepaliveAfterValue = "value" in keepaliveAfter ? keepaliveAfter.value : 0;
    expect(keepaliveAfterValue).toBeGreaterThan(keepaliveValue);
  });

  test('Cnry token holder #2 (Bob) can hatch a Cnry and the second Cnry has tokenId 1', async () => {
    const tx = cnry.hatch('Bob', 'The FBI has not been here today');
    const result = await txOk(tx, bob);
    expect(result.value).toEqual(1n);
  });

  test('Cnry token holders cannot update a different holder\'s Cnry', async () => {
    const keepaliveTx = cnry.keepalive(0);
    const result = await txErr(keepaliveTx, bob);
    expect (result.value).toEqual(401n);
  });

  test('Anyone can watch a Cnry', async () => {
    const getCnryAddressTx = watcher.getWatchedContract();
    const res = await txOk(getCnryAddressTx, bob);
    const watchTx = cnry.watch(0);
    const result = await txOk(watchTx, bob);
    expect (result.value).toBeGreaterThan(10n)
  });

  // test('Cnry cannot be updated after expiry', async () => {
  //   const getKeepaliveExpiry = cnry.getKeepaliveExpiry(1);
  //   const keepalive = await getKeepaliveExpiry;
  //   const keepaliveValue = "value" in keepalive ? keepalive.value : 0;
  //   const keepaliveTx = cnry.setKeepaliveExpiry(1, 1);
  //   const result = await txOk(keepaliveTx, bob);
  //   const getKeepaliveExpiryAfter = cnry.getKeepaliveExpiry(0);
  //   const keepaliveAfter = await getKeepaliveExpiryAfter;
  //   const keepaliveAfterValue = "value" in keepaliveAfter ? keepaliveAfter.value : 0;
  //   await delay(5000); // Need to check the block length

  //   expect(keepaliveAfterValue).toBeGreaterThan(keepaliveValue);
  // });

});
