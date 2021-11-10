import * as React from 'react';
import { useContext } from 'react';
import { DarkModeContext, DarkModeContextInterface } from 'src/contexts/darkmode-context';

export const useDarkModeContext = (): DarkModeContextInterface => useContext(DarkModeContext);
