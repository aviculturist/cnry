import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

//https://github.com/Velenir/nextjs-ipfs-example/
const scriptTxt = `
(function () {
  const { pathname } = window.location
  const ipfsMatch = /.*\\/Qm\\w{44}\\//.exec(pathname)
  const base = document.createElement('base')

  base.href = ipfsMatch ? ipfsMatch[0] : '/'
  document.head.append(base)
})();
`;

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* TODO: fix this whole section. PWA primary color */}
          {/* <meta content={colorMode === 'dark' ? `${darkTheme.palette.primary.main}` : `${lightTheme.palette.primary.main}`} name="theme-color" /> */}
          {/* <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            rel="stylesheet"
          /> */}
          <script dangerouslySetInnerHTML={{ __html: scriptTxt }} />
          <style
            dangerouslySetInnerHTML={{
              __html: `
              #background-radial-gradient {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                pointer-events: none;
                width: 200vw;
                height: 200vh;
                background: radial-gradient(50% 50% at 50% 50%, #42a5f5 0%, rgba(255, 255, 255, 0) 100%);
                transform: translate(-100vw, -100vh);
                z-index: -1;
            }
              `,
            }}
          />
        </Head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function () {
                function setDarkModePref(newPref) {
                  document.body.className = newPref === true ? "dark" : "light";
                  window.__prefersDarkMode = newPref;
                  window.__onPrefChange(newPref);
                }
                window.__onPrefChange = function () {};
                window.__setPrefersDarkMode = function (newPref) {
                  setDarkModePref(newPref);
                  try {
                    localStorage.setItem("darkMode", window.__prefersDarkMode);
                  } catch (err) {}
                };
                const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
                darkQuery.addListener(function (event) {
                  window.__setPrefersDarkMode(event.matches ? true : false);
                });
                let prefersDarkMode;
                try {
                  darkModePreferenceExists = localStorage.getItem("darkMode") === null ? false : true;
                  prefersDarkMode = JSON.parse(localStorage.getItem("darkMode"));
                } catch (err) {}
                setDarkModePref(darkModePreferenceExists ? prefersDarkMode : (darkQuery.matches ? true : false));
              })();
            `,
            }}
          />
          <Main />
          <NextScript />
          <div id="background-radial-gradient"></div>
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
// https://github.com/mui-org/material-ui/tree/next/examples/nextjs-with-styled-components-typescript
// https://github.com/vercel/next.js/blob/master/examples/with-styled-components/pages/_document.js
// See also https://stackoverflow.com/questions/60697385/fix-eslint-warnings-in-next-jss-document-tsx-thrown-by-documentany-and-ctx-r
MyDocument.getInitialProps = async ctx => {
  const sheet = new ServerStyleSheet();
  const originalRenderPage = ctx.renderPage;

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        // eslint-disable-next-line react/display-name
        enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
      });
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {sheet.getStyleElement()}
        </>
      ),
    };
  } finally {
    sheet.seal();
  }
};
