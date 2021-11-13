import { atom } from 'jotai';

export const settingsMenuIsOpenAtom = atom(false);
export const settingsMenuAnchorElAtom = atom(<null | HTMLElement>null);
