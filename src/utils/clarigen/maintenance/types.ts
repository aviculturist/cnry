import { ClarityTypes, Transaction } from '@clarigen/core';

// prettier-ignore
export interface MaintenanceContract {
  addMaintenanceMode: (commitHash: string, maintenance: boolean, wall: string) => Transaction<bigint, ClarityTypes.Response<null, bigint>>;
  setMaintenance: (commitHash: string, maintenance: boolean) => Transaction<bigint, ClarityTypes.Response<null, bigint>>;
  setWall: (commitHash: string, wall: string) => Transaction<bigint, ClarityTypes.Response<null, bigint>>;
  getMaintenanceMode: (commitHash: string) => Promise<{
  "maintenance": boolean;
  "wall": string
    } | null>;
}
