import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

export const editCnryMenuIsOpenAtom = atomFamily((tokenId: number) => atom(false));
export const editCnryMenuAnchorElAtom = atomFamily((tokenId: number) =>
  atom(<null | HTMLElement>null)
);
