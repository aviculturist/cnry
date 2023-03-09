import { formatter } from '@lingui/format-json';
export default {
  catalogs: [
    {
      path: '<rootDir>/locale/{locale}',
      include: ['<rootDir>/src'],
      exclude: ['**/node_modules/**'],
    },
  ],
  // compileNamespace: 'ts',
  // extractBabelOptions: {},
  fallbackLocales: {},
  format: formatter({ style: 'minimal' }),
  formatOptions: { origins: false, lineNumbers: false },
  sourceLocale: 'en',
  locales: ['en', 'ar', 'it', 'ru'],
  orderBy: 'messageId',
  pseudoLocale: '',
  rootDir: '.',
  runtimeConfigModule: {
    i18n: ['@lingui/core', 'i18n'],
    Trans: ['@lingui/react', 'Trans'],
  },
};
