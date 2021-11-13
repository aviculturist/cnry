import { atom } from 'jotai';
export const darkModeAtom = atom(global.window?.__prefersDarkMode); // || false ????
