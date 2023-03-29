import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

export const anyCnryKeepaliveExpiryDialogIsOpenAtomFamily = atomFamily((tokenId: number) =>
  atom(false)
);
