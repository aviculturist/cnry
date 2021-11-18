import '../utils/wdyr';
import * as React from 'react';
import { ReactNode, Suspense } from 'react';
import { Provider } from 'jotai';
import { HashRouter } from 'react-router-dom';
import DarkModeProvider from 'src/contexts/darkmode-context';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import { useEffect } from 'react';
import * as plurals from 'make-plural/plurals';
import { useAtom } from 'jotai';
import { userLocaleAtom, DEFAULT_MESSAGES, DEFAULT_LOCALE, Locale } from '@store/ui/user-locale';
import { useActiveLocale, queryLocale, navigatorLocale } from '@hooks/use-active-locale';
import NoSsr from '@mui/material/NoSsr';
import { StyleSheetManager } from 'styled-components';
import rtlPlugin from 'stylis-plugin-rtl';
import { StylisPlugin } from 'styled-components';

// https://dev.to/pffigueiredo/bullet-proof-rtl-rtl-in-a-web-platform-3-6-4bne
// TODO: these props/children ?
function DirectionProvider({ children }: { children: ReactNode }) {
  const locale = useActiveLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <StyleSheetManager stylisPlugins={dir === 'rtl' ? [rtlPlugin as unknown as StylisPlugin] : []}>
      {children}
      {/* {props.children} */}
    </StyleSheetManager>
  );
}

async function dynamicActivate(queryLocale: Locale | undefined, userLocale: Locale | null) {
  const locale: Locale = queryLocale ?? userLocale ?? navigatorLocale() ?? DEFAULT_LOCALE;
  i18n.loadLocaleData(locale, { plurals: () => plurals[locale] });
  const { messages } =
    locale === DEFAULT_LOCALE
      ? { messages: DEFAULT_MESSAGES }
      : await import(`@lingui/loader!./../../locale/${locale}.json?raw-lingui`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}

dynamicActivate(queryLocale ?? navigatorLocale() ?? DEFAULT_LOCALE, null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useActiveLocale();
  const [userLocale, setUserLocale] = useAtom(userLocaleAtom);

  useEffect(() => {
    dynamicActivate(locale, userLocale)
      .then(() => {
        document.documentElement.setAttribute('lang', locale);
        const dir = locale === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', dir);
        document.querySelector('body')?.setAttribute('dir', dir);
        setUserLocale(locale); // stores the selected locale to persist across sessions
      })
      .catch(error => {
        console.error('Failed to activate locale', locale, error);
      });
  }, [locale, userLocale, setUserLocale]);

  return (
    <I18nProvider forceRenderOnLocaleChange={true} i18n={i18n}>
      {children}
    </I18nProvider>
  );
}

function CnryApp(props: AppProps) {
  const { Component, pageProps } = props;
  return (
    <Provider>
      <Head>
        <title>Cnry</title>
        <link href="./favicon.ico" rel="icon" />
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
      </Head>
      {/* NoSsr because Nextjs doesn't support i18n SSG and HashRouter will fail server-side with Invariant failed: Hash history needs a DOM*/}
      <NoSsr>
        <HashRouter>
          <LanguageProvider>
            <DirectionProvider>
              <DarkModeProvider>
                <CssBaseline />
                <Component {...pageProps} />
              </DarkModeProvider>
            </DirectionProvider>
          </LanguageProvider>
        </HashRouter>
      </NoSsr>
    </Provider>
  );
}
export default CnryApp;
