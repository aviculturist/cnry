import { atom } from 'jotai';

export const languageMenuIsOpenAtom = atom(false);
export const languageMenuAnchorElAtom = atom(<null | HTMLElement>null);
