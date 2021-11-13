import { atomWithStorage } from 'jotai/utils';

export const SUPPORTED_LOCALES = ['ar', 'en', 'it', 'ru'] as const;
export type Locale = typeof SUPPORTED_LOCALES[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const userLocaleAtom = atomWithStorage('locale', <Locale | null>null);
// TODO Should not import the named export 'messages' (reexported as 'DEFAULT_MESSAGES') from default-exporting module (only default export is available soon)
export { messages as DEFAULT_MESSAGES } from '../../../locale/en';
export const CODE_TO_NAME: { [char: string]: string } = {
  en: 'English',
  ar: 'العربية',
  it: 'Italiano',
  ru: 'Русский',
};
