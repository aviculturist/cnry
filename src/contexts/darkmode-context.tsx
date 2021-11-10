import * as React from 'react';
import { ReactNode, useEffect } from 'react';
import { useAtom } from 'jotai';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { arEG, enUS, itIT, Localization, ruRU } from '@mui/material/locale';
import { Direction, PaletteMode } from '@mui/material';
import { darkModeAtom } from '@store/darkmode';
import { useActiveLocale } from '@hooks/use-active-locale';

const CODE_TO_LOCALE: { [char: string]: Localization } = {
  en: enUS,
  ar: arEG,
  it: itIT,
  ru: ruRU,
};

export interface DarkModeContextInterface {
  darkMode?: any;
  toggleDarkMode?: any;
}

// https://fettblog.eu/typescript-react/context/
export const DarkModeContext = React.createContext<Partial<DarkModeContextInterface>>({});

// https://newbedev.com/how-to-fix-binding-element-children-implicitly-has-an-any-type-ts-7031
interface Props {
  children: ReactNode;
}

// https://stackoverflow.com/questions/56457935/typescript-error-property-x-does-not-exist-on-type-window
declare global {
  interface Window {
    __prefersDarkMode: any;
    __setPrefersDarkMode: any;
    __onPrefChange: any;
    generateIcon: any;
  }
}

const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  // TODO: footer gets the correct theme, but the main body doesn't
  //const [darkMode, setDarkMode] = useState(global.window?.__prefersDarkMode || false);
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const activeLocale = useActiveLocale();
  const languageDirection = activeLocale === 'ar' ? 'rtl' : 'ltr';
  //console.log(languageDirection);
  const getColorMode = (dmode: boolean, dir: Direction) => ({
    direction: dir,
    palette: {
      mode: dmode === true ? ('dark' as PaletteMode) : ('light' as PaletteMode),
    },
  });

  // Update the theme only if darkMode or languageDirection changes
  const theme = React.useMemo(
    () =>
      createTheme(
        getColorMode(darkMode as boolean, languageDirection as Direction),
        CODE_TO_LOCALE[activeLocale]
      ),
    [activeLocale, darkMode, languageDirection]
  );

  const toggleDarkMode = () => {
    global.window.__setPrefersDarkMode(darkMode === true ? false : true);
  };

  useEffect(() => {
    global.window.__onPrefChange = setDarkMode;
  }, [setDarkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode } as DarkModeContextInterface}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </DarkModeContext.Provider>
  );
}
export default DarkModeProvider;
