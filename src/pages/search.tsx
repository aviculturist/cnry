import * as React from 'react';
import { NextPage } from 'next';
import { GetStaticPropsContext } from 'next';
import { GetQueries, getStaticQueryProps } from 'jotai-query-toolkit/nextjs';
//import { wrapWithMicroStacks } from '@micro-stacks/nextjs';
// import { StacksMainnet, StacksTestnet, StacksMocknet } from 'micro-stacks/network';
// import {
//   DEFAULT_MAINNET_SERVER,
//   DEFAULT_TESTNET_SERVER,
//   DEFAULT_DEVNET_SERVER,
//   ENV,
// } from '@utils/constants';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { t } from '@lingui/macro';
import Header from '@components/header';
import Footer from '@components/footer';
import { useSearchQuery } from '@hooks/use-queries';

import {
  SearchErrorResult,
  SearchSuccessResult,
  AddressSearchResult,
  BlockSearchResult,
  ContractSearchResult,
  MempoolTxSearchResult,
  TxSearchResult,
} from '@stacks/stacks-blockchain-api-types';

import { useAtom } from 'jotai';
import { searchResultsAtom } from '@store/search';
import SafeSuspense from '@components/safe-suspense';
import Skeleton from '@mui/material/Skeleton';

// // TODO: break into components, refactor, etc.
// function useSearchQuery() {
//   const router = useRouter();
//   const q = router.asPath.split(/\?/)[1].split(/=/)[1];
//   return typeof q === 'string' ? q : '';
// }

const SearchResults = () => {
  const q = useSearchQuery();
  const [searchResults] = useAtom(searchResultsAtom(q));
  // SearchErrorResult
  if (searchResults && searchResults?.found === false) {
    return <SearchErrorDisplay />;
  }
  switch (searchResults?.result?.entity_type) {
    // AddressSearchResult, e.g., ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
    case 'standard_address':
      return <AddressSearchResultDisplay />;

    // BlockSearchResult
    case 'block_hash':
      return <BlockSearchResultDisplay />;

    // ContractSearchResult
    case 'contract_address':
      return <ContractSearchResultDisplay />;

    // MempoolTxSearchResult
    case 'mempool_tx_id':
      return <MempoolTxSearchResultDisplay />;

    // TxSearchResult, e.g., 0xbc28639f4c3b3e71c2757102d241c926a357bea375a507e14debbacd79c5a264
    case 'tx_id':
      return <TxSearchResultDisplay />;

    default:
      return <CircularProgress />;
  }
};

const SearchErrorDisplay = () => {
  const q = useSearchQuery();
  const [searchResults] = useAtom(searchResultsAtom(q));
  const err = searchResults as SearchErrorResult;
  return (
    <div>
      <Typography align="center" gutterBottom>
        {err.result?.entity_type && err.result.entity_type !== 'unknown_hash'
          ? err.result.entity_type
          : ''}
        <br />
        {err.error ? err.error : 'Loading...'}
      </Typography>
    </div>
  );
};

const AddressSearchResultDisplay = () => {
  const q = useSearchQuery();
  const [searchResults] = useAtom(searchResultsAtom(q));
  const add = searchResults as AddressSearchResult;
  return (
    <div>
      <Typography align="center" gutterBottom>
        {t`Address ${q}`}
      </Typography>

      <dl>
        <dt>entity_id:</dt>
        <dd>{add.result.entity_id} </dd>
      </dl>
    </div>
  );
};

const BlockSearchResultDisplay = () => {
  const q = useSearchQuery();
  const [searchResults] = useAtom(searchResultsAtom(q));
  const bl = searchResults as BlockSearchResult;
  return (
    <div>
      <Typography align="center" gutterBottom>
        {t`Block ${q}`}
      </Typography>

      <dl>
        <dt>entity_id:</dt>
        <dd>{bl.result.entity_id} </dd>
        <dt>canonical:</dt>
        <dd>{bl.result.block_data.canonical === true ? 'true' : 'false'} </dd>
        <dt>hash:</dt>
        <dd>{bl.result.block_data.hash} </dd>
        <dt>parent_block_hash:</dt>
        <dd>{bl.result.block_data.parent_block_hash} </dd>
        <dt> burn_block_time:</dt>
        <dd>{bl.result.block_data.burn_block_time} </dd>
        <dt> height:</dt>
        <dd>{bl.result.block_data.height} </dd>
      </dl>
    </div>
  );
};

const ContractSearchResultDisplay = () => {
  const q = useSearchQuery();
  const [searchResults] = useAtom(searchResultsAtom(q));
  const c = searchResults as ContractSearchResult;
  return (
    <div>
      <Typography align="center" gutterBottom>
        {t`Contract ${q}`}
      </Typography>

      <dl>
        <dt>entity_id:</dt>
        <dd>{c.result.entity_id} </dd>
        <dt>canonical:</dt>
        <dd>{c.result.tx_data?.canonical === true ? 'true' : 'false'} </dd>
        <dt>block_hash:</dt>
        <dd>{c.result.tx_data?.block_hash} </dd>
        <dt>burn_block_time:</dt>
        <dd>{c.result.tx_data?.burn_block_time} </dd>
        <dt> block_height:</dt>
        <dd>{c.result.tx_data?.block_height} </dd>
        <dt> tx_type:</dt>
        <dd>{c.result.tx_data?.tx_type} </dd>
      </dl>
    </div>
  );
};

const MempoolTxSearchResultDisplay = () => {
  const q = useSearchQuery();
  const [searchResults] = useAtom(searchResultsAtom(q));
  const mem = searchResults as MempoolTxSearchResult;
  return (
    <div>
      <Typography align="center" gutterBottom>
        {t`Mempool Transaction ${q}`}
      </Typography>

      <dl>
        <dt>entity_id:</dt>
        <dd>{mem.result.entity_id} </dd>
        <dt>entity_type:</dt>
        <dd>{mem.result.entity_type} </dd>
        <dt>tx_type:</dt>
        <dd>{mem.result.tx_data.tx_type} </dd>
      </dl>
    </div>
  );
};

const TxSearchResultDisplay = () => {
  // const [getQuery, setQuery] = useAtom(queryAtom);
  // const [searchResults] = useAtom(searchResultsAtom);
  const q = useSearchQuery();
  const [searchResults] = useAtom(searchResultsAtom(q));
  const tx = searchResults as TxSearchResult;
  return (
    <div>
      <Typography align="center" gutterBottom>
        {t`Transaction ${q}`}
      </Typography>

      <dl>
        <dt>entity_id:</dt>
        <dd>{tx.result.entity_id} </dd>
        <dt>canonical:</dt>
        <dd>{tx.result.tx_data.canonical === true ? 'true' : 'false'} </dd>
        <dt>block_hash:</dt>
        <dd>{tx.result.tx_data.block_hash} </dd>
        <dt>burn_block_time:</dt>
        <dd>{tx.result.tx_data.burn_block_time} </dd>
        <dt> block_height:</dt>
        <dd>{tx.result.tx_data.block_height} </dd>
        <dt> tx_type:</dt>
        <dd>{tx.result.tx_data.tx_type} </dd>
      </dl>
    </div>
  );
};

// const Search = () => {
//const q = useSearchQuery();
//const [searchResults] = useAtom(searchResultsAtom(q));

//https://stackoverflow.com/questions/66133814/how-to-get-url-query-string-on-next-js-static-site-generation/67877443#67877443
// useEffect(() => {
//   if (!router.isReady) return;
//   const query = router.query;
//   // TODO: another way to grab the query; this might be super dangerous, should do input validation
//   // const q = router.asPath.split(/\?/)[1].split(/=/)[1]; // e.g., 'q=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
//   //console.log(query);
//   setQuery(typeof query.q === 'string' ? query.q : '');
// }, [router.isReady, router.query, setQuery]);

const Search: NextPage<any> = () => {
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
        <SearchResults />
      </SafeSuspense>
      <Footer />
    </Container>
  );
};

//export default Search;

const getQueries: GetQueries = (_ctx: GetStaticPropsContext) => [
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
  [
    'search-results', // the query key we're using
    async () => {
      return {};
    }, // TODO: our fetcher for the server
  ],
];

// enable SSG
export const getStaticProps = getStaticQueryProps(getQueries)(async _ctx => {
  return { props: {}, revalidate: 60 };
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

export default Search; //withMicroStacks(Search);
