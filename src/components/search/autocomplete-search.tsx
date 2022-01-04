import * as React from 'react';
import { useNetwork } from '@micro-stacks/react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useAtom } from 'jotai';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  SearchErrorResult,
  SearchSuccessResult,
  AddressSearchResult,
  BlockSearchResult,
  ContractSearchResult,
  MempoolTxSearchResult,
  TxSearchResult,
} from '@stacks/stacks-blockchain-api-types';
import { styled, darken } from '@mui/material/styles';
import { ResultType, searchQueryAtom, searchResultAtom, searchHistoryAtom } from '@store/search';
import SearchResultIcon from '@components/search/search-result-icon';

const StyledA = styled('a')(
  ({ theme }: { theme: any }) => `
  color: ${theme.palette.primary.main};
  text-decoration: none;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
  :hover {
    color: ${darken(theme.palette.primary.main, 0.2)};
  }
`
);

// TODO: refactor when micro-stacks search client is available

const DEFAULT_FETCH_OPTIONS: RequestInit = {
  referrer: 'no-referrer',
  referrerPolicy: 'no-referrer',
};

async function fetchPrivate(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  return fetch(input, { ...DEFAULT_FETCH_OPTIONS, ...init });
}

// TODO: refactor, what are options for and why are theu using state, same for input value and value
const AutocompleteSearch = () => {
  const [value, setValue] = React.useState<ResultType>({} as ResultType);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<readonly ResultType[]>([]);
  const [searchResult, setSearchResult] = useAtom(searchResultAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [q, setQ] = useAtom(searchQueryAtom);
  const { network } = useNetwork();

  async function fetch() {
    const networkUrl = network.getCoreApiUrl();

    const requestHeaders = {
      Accept: 'application/json',
    };

    const fetchOptions = {
      method: 'GET',
      headers: requestHeaders,
    };

    const url = `${networkUrl}/extended/v1/search/${q}`;
    if (q !== '' && q.length >= 41) {
      try {
        const response = await fetchPrivate(url, fetchOptions);
        const searchResult: SearchErrorResult | SearchSuccessResult = await response.json();
        return searchResult;
      } catch (_e) {
        console.log(_e);
      }
    }
    return {} as SearchErrorResult | SearchSuccessResult;
  }

  // TODO: throttle this search and basic (length-based?) input validation
  React.useEffect(() => {
    const fetchData = async () => {
      const result = await fetch();
      setSearchResult(result);
    };
    fetchData();
  }, [q]);

  React.useEffect(() => {
    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    inputValue !== '' && setQ(inputValue);

    let newOptions: readonly ResultType[] = [];

    if (value) {
      newOptions = [value];
    }

    let result;
    switch (searchResult?.result?.entity_type) {
      // AddressSearchResult, e.g., ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
      case 'standard_address':
        result = [
          {
            icon: 'standard_address',
            slug: (searchResult as AddressSearchResult)?.result?.entity_id,
            primary_description: (searchResult as AddressSearchResult)?.result?.entity_id,
            secondary_description: (searchResult as AddressSearchResult)?.result?.entity_type,
          },
        ] as readonly ResultType[];
        break;
      // BlockSearchResult
      case 'block_hash':
        result = [
          {
            icon: 'block_hash',
            slug: (searchResult as BlockSearchResult)?.result?.entity_id,
            primary_description: (searchResult as BlockSearchResult)?.result?.entity_id,
            secondary_description: (searchResult as BlockSearchResult)?.result?.entity_type,
            timestamp: (searchResult as BlockSearchResult)?.result?.block_data?.burn_block_time,
          },
        ] as readonly ResultType[];
        break;
      // ContractSearchResult
      case 'contract_address':
        result = [
          {
            icon: 'contract_address',
            slug: (searchResult as ContractSearchResult)?.result?.entity_id,
            primary_description: (searchResult as ContractSearchResult)?.result?.entity_id,
            secondary_description: (searchResult as ContractSearchResult)?.result?.entity_type,
          },
        ] as readonly ResultType[];
        break;

      // MempoolTxSearchResult
      case 'mempool_tx_id':
        result = [
          {
            icon: 'mempool_tx_id',
            slug: (searchResult as MempoolTxSearchResult)?.result?.entity_id,
            primary_description: (searchResult as MempoolTxSearchResult)?.result?.entity_id,
            secondary_description: (searchResult as MempoolTxSearchResult)?.result?.entity_type,
          },
        ] as readonly ResultType[];
        break;

      // TxSearchResult, e.g., 0xbc28639f4c3b3e71c2757102d241c926a357bea375a507e14debbacd79c5a264
      case 'tx_id':
        result = [
          {
            icon: 'tx_id',
            slug: (searchResult as TxSearchResult)?.result?.entity_id,
            primary_description: (searchResult as TxSearchResult)?.result?.entity_id,
            secondary_description: (searchResult as TxSearchResult)?.result?.entity_type,
            timestamp: (searchResult as TxSearchResult)?.result?.tx_data?.burn_block_time,
          },
        ] as readonly ResultType[];
        break;

      default:
        result = [
          {
            icon: 'error',
            primary_description: (searchResult as SearchErrorResult)?.result?.entity_type,
            secondary_description: (searchResult as SearchErrorResult)?.error,
          },
        ] as readonly ResultType[];
        break;
    }

    //if (searchResult && searchResult?.found !== false) {
    // TODO
    //}
    if (result && result[0]?.slug !== undefined) {
      newOptions = [...newOptions, ...result];
      const newHistoryEntry: { [key: string]: ResultType } = {
        [result[0].slug]: result[0],
      };
      setSearchHistory({ ...searchHistory, ...newHistoryEntry });
    }
    setOptions(newOptions);
  }, [value, inputValue, searchResult, setQ, setSearchHistory, searchHistory]);

  return (
    <Stack sx={{ width: '100%' }}>
      <Autocomplete
        disableClearable
        getOptionLabel={option =>
          typeof option === 'string'
            ? option
            : option.primary_description
            ? option.primary_description
            : ''
        }
        filterOptions={x => x}
        options={options}
        autoComplete
        noOptionsText="Enter an account or contract address, transaction id, or block hash."
        includeInputInList
        filterSelectedOptions
        value={value}
        onChange={(event: any, newValue: ResultType) => {
          setOptions(newValue ? [newValue, ...options] : options);
          setValue(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={params => (
          <TextField
            {...params}
            label="Search..."
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
        renderOption={(props, option) => {
          return (
            <li {...props}>
              <StyledA href={`/search?q=${option.slug}`}>
                <Grid container alignItems="center">
                  <Grid item>{SearchResultIcon({ icon: option.icon })}</Grid>
                  <Grid item md>
                    {option.primary_description}
                    <Typography variant="body2" color="text.secondary">
                      {option.secondary_description}
                    </Typography>
                  </Grid>
                </Grid>
              </StyledA>
            </li>
          );
        }}
      />
    </Stack>
  );
};
export default AutocompleteSearch;
