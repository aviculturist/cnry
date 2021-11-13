import { Locale } from '@store/ui/user-locale';
import { LocationDescriptor } from 'history';
import useParsedQueryString from '@hooks/use-parsed-query-string';
import { stringify } from 'qs';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { userLocaleAtom } from '@store/ui/user-locale';
import { useAtom } from 'jotai';
import { useActiveLocale } from '@hooks/use-active-locale';
import { languageMenuIsOpenAtom } from '@store/ui/language-menu-is-open';

export function useLocationLinkProps(locale: Locale | null): {
  to?: LocationDescriptor;
  onClick?: () => void;
} {
  const location = useLocation();
  const qs = useParsedQueryString();
  const activeLocale = useActiveLocale();
  //console.log('useActiveLocale reports locale from useLocationLinkProps: ' + activeLocale)

  const [userLocale, setUserLocale] = useAtom(userLocaleAtom);
  const [isOpen, setIsOpen] = useAtom(languageMenuIsOpenAtom);

  return useMemo(
    () =>
      !locale
        ? {}
        : {
            to: {
              ...location,
              search: stringify({ ...qs, lng: locale }),
            },
            onClick: () => {
              //console.log('Click from useLocationLinkProps ' + locale);
              setUserLocale(locale);
              setIsOpen(false);
            },
          },
    [locale, location, qs, setUserLocale, setIsOpen]
  );
}
