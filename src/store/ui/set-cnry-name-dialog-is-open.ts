import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

export const anyCnryNameDialogIsOpenAtomFamily = atomFamily((tokenId: number) => atom(false));
