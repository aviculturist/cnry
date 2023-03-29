import * as React from 'react';
import { NextPage } from 'next';
import { GetQueries, getStaticQueryProps } from 'jotai-query-toolkit/nextjs';
// import { wrapWithMicroStacks } from '@micro-stacks/nextjs';
// import { StacksMainnet, StacksTestnet, StacksMocknet } from 'micro-stacks/network';
// import {
//   DEFAULT_MAINNET_SERVER,
//   DEFAULT_TESTNET_SERVER,
//   DEFAULT_DEVNET_SERVER,
//   ENV,
// } from '@utils/constants';
import Header from '@components/header';
import CnryApp from '@components/cnry-app';
import Footer from '@components/footer';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import SafeSuspense from '@components/safe-suspense';

const Index: NextPage<any> = () => {
  return (
    <Container sx={{ mb: 8 }} disableGutters maxWidth={false}>
      <Header />
      <SafeSuspense
        fallback={
          <>
            <Skeleton sx={{ m: 'auto' }} variant="rectangular" width={400} height={200} />
          </>
        }
      >
        <CnryApp />
      </SafeSuspense>
      <Footer />
    </Container>
  );
};

// an array of queries for initial data
const agetQueries: GetQueries = () => [];
const getQueries: GetQueries = () => [
  [
    'cnry-get-last-id',
    async () => {
      return 1;
    },
  ],
  [
    'network-info', // the query key we're using
    async () => {
      return {
        peer_version: 385875968,
        pox_consensus: '17f76e597bab45646956f38dd39573085d72cbc0',
        burn_block_height: 16,
        stable_pox_consensus: '8e0561978fc5506b68a589c402dad97e862edb59',
        stable_burn_block_height: 15,
        server_version: 'blockstack-core 0.0.1 => 23.0.0.0 (, release build, linux [x86_64])',
        network_id: 2147483648,
        parent_network_id: 3669344250,
        stacks_tip_height: 15,
        stacks_tip: 'b1807a2d3f7f8c7922f7c1d60d7c34145ade05d789640dc7dc9ec1021e07bb54',
        stacks_tip_consensus_hash: '17f76e597bab45646956f38dd39573085d72cbc0',
        unanchored_tip: '0000000000000000000000000000000000000000000000000000000000000000',
        exit_at_block_height: null,
      };
    }, // TODO: our fetcher for the server
  ],
];

// enable SSG
export const getStaticProps = getStaticQueryProps(getQueries)(async _ctx => {
  return { props: {}, revalidate: 6000 };
});

// .env.development and .env.production are source of truth for NEXT_PUBLIC_ENV
// in development, default to devnet, in production, mainnet
// const initialNetwork =
//   ENV === 'development'
//     ? new StacksMocknet({ url: DEFAULT_DEVNET_SERVER })
//     : new StacksTestnet({ url: DEFAULT_TESTNET_SERVER });

// const withMicroStacks = wrapWithMicroStacks({
//   network: initialNetwork,
//   authOptions: {
//     appDetails: {
//       name: 'Cnry',
//       icon: `${typeof window !== 'undefined' ? window.location.href : ''}./favicon.ico`,
//     },
//   },
// });

export default Index; //withMicroStacks(Index);
