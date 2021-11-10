import { parse, ParsedQs } from 'qs';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export function parsedQueryString(search?: string): ParsedQs {
  if (!search) {
    // react-router-dom places search string in the hash
    // TODO: hacky way to prevent server-side execution?
    const hash = typeof window !== 'undefined' ? window.location.hash : undefined;
    search = hash ? hash.substr(hash.indexOf('?')) : '';
  }
  return search && search.length > 1
    ? parse(search, { parseArrays: false, ignoreQueryPrefix: true })
    : {};
}

export default function useParsedQueryString(): ParsedQs {
  const { search } = useLocation();
  return useMemo(() => parsedQueryString(search), [search]);
}
