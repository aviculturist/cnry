# 🐦 Cnry

[![Release](https://github.com/aviculturist/cnry/actions/workflows/release.yaml/badge.svg)](https://github.com/aviculturist/cnry/actions/workflows/release.yamlrelease.yaml)
[![Lint](https://github.com/aviculturist/cnry/actions/workflows/lint.yaml/badge.svg)](https://github.com/aviculturist/cnry/actions/workflows/lint.yml)

Cnry makes it easy to publish and keep track of warrant canaries.

A [warrant canary](https://en.wikipedia.org/wiki/Warrant_canary) is a method by which a service provider can inform users that they been served with a government subpoena despite legal prohibitions on revealing the existence of the subpoena.

Even if you don't need a warrant canary, you can publish a Cnry as a pet that you need to feed once in a while (via the `keepalive` function) or it will expire. How often you need to feed it is configurable in the contract.

Warrant canaries are only useful if someone's paying attention. So anyone can call the `watch` function which will mint a `WATCHER` nft that keeps track of that activity. I have some further features in the works that will expand on that concept.

As an open source project, Cnry contains a set of [Clarity](https://clarity-lang.org/) contracts running on [Stacks](https://stacks.co) and powered by Bitcoin. It also knits together a web frontend interface, testing frameworks, integration environment, scripting setup, and static IPFS deployment workflow.

**NOTE: THIS PROJECT AND SUPPORTING LIBRARIES HAVE NOT BEEN AUDITED, IT IS IN ALPHA STATE. USE AT YOUR OWN RISK / DISCRETION**

**IN PARTICULAR, THE CONTRACTS HAVE SOME KNOWN ISSUES AND SHOULD NOT BE TRUSTED UNTIL AUDITED AND PUBLISHED TO MAINNET**

## Accessing Cnry

To access Cnry, use an IPFS gateway link from the
[latest release](https://github.com/aviculturist/cnry/releases/latest),
or visit [testnet.cnry.org](https://testnet.cnry.org).

> NOTE: `testnet` is the default network and `localnet`
> only works in development mode on some browsers due to
> security limitations (CORS and mixed content). You can
> also add your own network within the ui.

## Running Cnry

> If you prefer not using the integration environment,
> Cnry can be run locally and pointed at `testnet`,
> `regtest`(with some limitations). Skip
> ahead to Step 4 and for Steps 5 and 6 use another network.

1. To run Cnry with the integration environment locally, install and run [Docker Desktop](https://www.docker.com/products/docker-desktop).

2. Install [Clarinet](https://github.com/hirosystems/clarinet).

3. Clone this repository and bootstrap your `localnet` which consists of a Bitcoin node, Stacks node, Stacks API server, and Stacks and Bitcoin explorers:

```bash
cd cnry
clarinet integrate
```

4. Grab a beverage while the integration environment bootstraps and when you start seeing mempool transactions, open a different terminal, deploy the contracts, install the dependencies and start the development web server:

```bash
clarinet publish --devnet
yarn && yarn run dev
```

5. In your browser, install the [Hiro Wallet](https://www.hiro.so/wallet/install-web) and select `Change Network -> Localnet`.

6. Open [http://localhost:3000](http://localhost:3000) with your browser to load the app. Click on `Connect Stacks Wallet` and make sure you are connected to `Localnet`, then publish your first Cnry. Open the [Chrome DevTools](https://developer.chrome.com/docs/devtools/) to view the console and network queries.

As your transaction moves from submitted to pending and finally succeeds, you can track its progress via the notifications or using the activity drawer (the bell icon in the header).

## Testing

To run the tests (both `@clarigen/test` and Clarinet examples are included), try:

```bash
$ $ yarn test
yarn run v1.22.10
$ jest && clarinet test tests/*.ts
 PASS  tests/clarigen/cnry.test.ts
  Cnry contract
    ✓ Cnry token holder #2 (Alice) can hatch a Cnry and the first Cnry has tokenId 0 (39 ms)
    ✓ Alice can update the Cnry Uri (64 ms)
    ✓ Alice can update the Cnry keepalive-timestamp (86 ms)
    ✓ Cnry token holder #2 (Bob) can hatch a Cnry and the second Cnry has tokenId 1 (36 ms)
    ✓ Cnry token holders cannot update a different holder's Cnry (29 ms)
    ✓ Anyone can watch a Cnry (61 ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        4.085 s, estimated 6 s
Ran all test suites.

Running file:///Projects/cnry/tests/cnry_test.ts
* it adds the cnry contract to watcher watched-contract storage ... ok (17ms)
* deployer can hatch a Cnry ... ok (21ms)
* non-depoyer account can hatch Cnry ... ok (17ms)
* it allows the deployer to update the contract base-uri ... ok (16ms)
* it fails when a non-deployer account updates the contract metadata ... ok (23ms)
* it lets an account watch a Cnry ... ok (26ms)

test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (1877ms)
```

Each testing framework can also be run independently `npx jest` for the Clarigen test and `clarinet test tests/cnry_test.ts` for the Clarinet one.

## Scripts

There are some `node` scripts written with `@clarigen/node` that will call the public functions within the integration environment:

```bash
$ yarn ts-node scripts/keepalive.ts
yarn run v1.22.10
$ /Projects/cnry/node_modules/.bin/ts-node scripts/keepalive.ts
http://localhost:3999/extended/v1/tx/0x10242276f35714c18ababdd36bd5a667383f4d820bdbeeb65c649808c82d74e7
✨  Done in 3.44s.
```
Here are some examples of how to run the scripts:

```bash
yarn ts-node scripts/hatch.ts 'Acme Corp Warrant Canary' 'The FBI did not visit yesterday'
yarn ts-node scripts/watch.ts '1'
yarn ts-node scripts/set-name.ts '1' 'Acme Corporation Warrant Canary'
yarn ts-node scripts/set-uri.ts '1' 'https://example.com'
yarn ts-node scripts/add-maintenance.ts '4c28f47' 'true' 'This is a message from the deployer'
```
The last two are pretty neat. The penultimate one lets you set a Cnry-specific uri. And the last one shows how to use a small contract to manage a `maintenance` messaging and storage system on the bockchain. Because Cnry's interface is a fully static site (there's no server), it's by definition impossible to make changes once it's deployed without releasing a new version. The maintenance contract lets the deployer display a message on any build of the site by publishing it in the contract storage. The little hash is based on the last git commit hash for any given release which is displayed in the footer of the Cnry frontend.

## Translation

There's a robust translation framework (`lingui`) that's baked in and working well for plurals and RTL. Just need some translations!

## About

Cnry and its little sister [BirdCount](https://github.com/aviculturist/bird-count#--birdcount) were developed while participating in the first [Clarity Universe](https://clarity-lang.org/universe) cohort.

It was bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and then integrated with [Clarinet](https://github.com/hirosystems/clarinet) (testing and integration) and [Clarigen](https://github.com/obylabs/clarigen) (testing and boilerplate). It utilizes [micro-stacks](https://github.com/fungible-systems/micro-stacks/) to connect to Stacks and [jotai-query-toolkit](https://github.com/fungible-systems/jotai-query-toolkit) for managing query state.

The interface is currently built with components from [MUI v5](https://mui.com/) and the [styled-components](https://styled-components.com/) library but that could change in the future if more flexible options become apparent (suggestions welcome!).

Implementing a `fully static` `SSG` build using `Next.js` `export`, "no compromises" `DarkMode`, `i18n/l10n` (including RTL support) are core principles of the project. There's no server and you keep custody of your private keys at all times using the app. You also keep custody of all your session data which you can download using the links in the privacy shield menu icon.

### Deploying

Deploying an app manually to IPFS is pretty simple once you have the [IPFS Command-line](https://docs.ipfs.io/install/command-line/) installed, have done an `ipfs init` and have the daemon running:

```bash
yarn build && yarn export
ipfs add -r out
ipfs name publish /ipfs/<...Content Identifier (CID) of the out folder...>
```

I used to manually run the above, and I also set up an account at [Pinata](https://www.pinata.cloud/) to manually pin each release (to make sure at least one IPFS node has a copy):

```bash
ipfs pin remote add --service=pinata /ipfs/<...Content Identifier (CID) of the out folder...>
```

Now all of the above as well as a `dnslink`-based name resolution system are handled automatically via the Github [Release](https://github.com/aviculturist/cnry/actions/workflows/release.yaml) workflow using [Github encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets). SSL termination is handled using [Cloudflare](https://developers.cloudflare.com/distributed-web/ipfs-gateway) and pinning via [Pinata](https://www.pinata.cloud/). Yes, you have to actually email Cloudflare to ask them to set up the SSL certificate.

### Pinning the latest releases

Anyone running `ipfs` can support the project by pinning the latest version.

First find the CID hash on the latest release page, or by running:

```bash
dig +short txt _dnslink.cnry.org
"dnslink=/ipfs/<...Content Identifier (CID) of the out folder...>"
```

(alternatively, you can run `ipfs dns cnry.org` to get the latest CID hash)

To pin this content, run:

```bash
ipfs pin add -r /ipfs/<...Content Identifier (CID) of the out folder...>

```

## Contributions and TODO

If you'd like to contribute to the project, please reach out on Discord or via Twitter.

The current version is very much a WIP, things are still broken or partly implemented and many of the contract functions haven't been expressed in the ui.

## Design Caveats

- The `cnry` and `watcher` are NFTs. But don't ape in with any expectation that they will increase in value. In fact, the current `testnet` contracts have the `transfer` function disabled  ... because ... well, I still need to work out if there's any way to preserve those functions given the way the contracts interact.
- There is at times an error about a className missmatch when running `yarn run dev`, does not seem to effect production. See e.g., https://github.com/mui-org/material-ui/issues/18018 and https://github.com/mui-org/material-ui/pull/27088
- Most of the app is wrapped in `NoSsr` because `Next.js` does not currently support `i18n` static `export`. The main implication is that only the English version of the page is built during `export` and translations are loaded dynamically.
- Because of this limitation, the language pages are implemented using `react-router-dom` `HashRouter` rather than `next` router's `usePath` or domain endpoints, which is less than ideal for SEO but in my view is better than the alternative (no static export).
- The hosting environment (IPFS) can't produce responsive headers so that limits some interaction options. For example, the app can't perform an [Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)/[Content-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Language) negotiation or respond to [Clear-Site-Data](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Clear-Site-Data).
- https://github.com/mui-org/material-ui/issues/29209

## Thank You

Huge thanks to both [@aulneau](https://github.com/aulneau) and [@hstove](https://github.com/hstove) for helping get these elements working together nicely. Thanks also to [@friedger](https://github.com/friedger) for all the amazing contract examples, especially the `monsters` contract that formed the basis for Cnry's basic functionality. Many thanks also to the countless others on the Interwebs, too numerous to individually cite, links to whom I tried to remember to embed within comments of the relevant area of the codebase.
