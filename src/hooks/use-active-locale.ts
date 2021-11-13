import { DEFAULT_LOCALE, SUPPORTED_LOCALES, userLocaleAtom, Locale } from '@store/ui/user-locale';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import { useMemo } from 'react';
import useParsedQueryString from '@hooks/use-parsed-query-string';
import { parsedQueryString } from '@hooks/use-parsed-query-string';
//import { locale } from 'dayjs';

/**
 * Given a locale string (e.g. from user agent), return the best match for corresponding SupportedLocale
 * @param maybeSupportedLocale the fuzzy locale identifier
 */
function parseLocale(maybeSupportedLocale: unknown): Locale | undefined {
  if (typeof maybeSupportedLocale !== 'string') return undefined;
  const lowerMaybeSupportedLocale = maybeSupportedLocale.toLowerCase();
  return SUPPORTED_LOCALES.find(
    locale =>
      locale.toLowerCase() === lowerMaybeSupportedLocale ||
      locale.split('-')[0] === lowerMaybeSupportedLocale
  );
}

/**
 * Returns the supported locale read from the user agent (navigator)
 */
export function navigatorLocale(): Locale | undefined {
  // only render client side
  if (typeof window === 'undefined') return undefined;
  if (!navigator.language) return undefined;
  const [language, region] = navigator.language.split('-');

  if (region) {
    return parseLocale(`${language}-${region.toUpperCase()}`) ?? parseLocale(language);
  }
  //console.log('in navigatorLocale: ' + parseLocale(language));
  return parseLocale(language);
}

// function useStoreLocale(): Locale | undefined {
//    const [userLocale,] = useAtom(userLocaleAtom); // = useUserLocale()
//    return userLocale ?? undefined
//    //return store.getState().user.userLocale ?? undefined
// }

export function useInitialLocale() {
  const storeLocale = useAtomValue(userLocaleAtom);
  // console.log('storeLocale in useInitialLocale: ' + storeLocale)
  const initialLocale =
    parseLocale(parsedQueryString().lng) ?? storeLocale ?? navigatorLocale() ?? DEFAULT_LOCALE;
  return { initialLocale };
}

// function storeLocale(): Locale | undefined {
//   const userLocale = useAtomValue(userLocaleAtom);
//   return userLocale as Locale;
// }
export const queryLocale = parseLocale(parsedQueryString().lng);

// let's agree for the sake of argument there's no stored language initially
export const initialLocale =
  parseLocale(parsedQueryString().lng) ?? navigatorLocale() ?? DEFAULT_LOCALE;
//   parseLocale(parsedQueryString().lng) ?? storeLocale() ?? navigatorLocale() ?? DEFAULT_LOCALE

function useUrlLocale() {
  const parsed = useParsedQueryString();
  return parseLocale(parsed.lng);
}

export function useUserLocale(): Locale | null {
  const [userLocale] = useAtom(userLocaleAtom);
  return userLocale;
}

/**
 * Returns the currently active locale, from a combination of user agent, query string, and user settings stored in redux
 * Stores the query string locale in redux (if set) to persist across sessions
 */
export function useActiveLocale(): Locale {
  const urlLocale = useUrlLocale();
  const userLocale = useUserLocale();

  // console.log('urlLocale: ' + urlLocale);
  // console.log('userLocale: ' + userLocale);
  // console.log('navigatorLocale: ' + navigatorLocale());
  // console.log('DEFAULT_LOCALE: ' + DEFAULT_LOCALE);

  return useMemo(
    () => urlLocale ?? userLocale ?? navigatorLocale() ?? DEFAULT_LOCALE,
    [urlLocale, userLocale]
  );
}
