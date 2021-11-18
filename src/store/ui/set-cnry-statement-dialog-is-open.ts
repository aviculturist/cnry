import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

export const anyCnryStatementDialogIsOpenAtomFamily = atomFamily((tokenId: number) => atom(false));
