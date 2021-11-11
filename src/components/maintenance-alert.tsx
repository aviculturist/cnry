import * as React from 'react';
import { useAtomValue } from 'jotai/utils';
import SafeSuspense from '@components/safe-suspense';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { maintenanceModeAtom } from '@store/maintenance';
import { t } from '@lingui/macro';

const MaintenanceAlert = () => {
  const buildHash = process.env.NEXT_PUBLIC_COMMIT_HASH || '';
  const buildHashShort = buildHash.slice(0, 7);
  const maintenance = useAtomValue(maintenanceModeAtom(buildHashShort));

  return (
    <>
      {maintenance && maintenance.wall && maintenance.wall.value !== undefined ? (
        <SafeSuspense fallback={<>loading</>}>
          <Stack direction="column" spacing={2} justifyContent="center">
            <Alert severity="warning">
              <AlertTitle>{t`MAINTENANCE MODE: USE AT YOUR OWN RISK`}</AlertTitle>
              {maintenance.wall.value}
            </Alert>
          </Stack>
        </SafeSuspense>
      ) : (
        <></>
      )}
    </>
  );
};
export default MaintenanceAlert;
