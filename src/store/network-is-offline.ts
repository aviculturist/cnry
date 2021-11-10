import * as React from 'react';
import { atom } from 'jotai';
import { networkInfoAtom } from '@store/network-info';

export const networkIsOfflineAtom = atom(get =>
  // TODO: a better way to handle network offline
  JSON.stringify(get(networkInfoAtom)) === '{}' ? true : false
);
