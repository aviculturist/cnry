import { t } from '@lingui/macro';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/system/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const CnryListSkeleton = () => {
  return (
    <div>
      <Tabs value="one" centered>
        <Tab value="one" label={t`New`} />
        <Tab value="two" label={t`My Cnrys`} disabled />
        <Tab value="three" label={t`Watching`} disabled />
        <Tab value="four" label={t`Browse`} disabled />
      </Tabs>
      <div role="tabpanel" id="one">
        <Box sx={{ p: 3 }}>
          <div>
            <Box
              //onSubmit={formik.handleSubmit}
              component="form"
              autoComplete="off"
              sx={{
                mb: 4,
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <Stack
                borderRadius={4}
                maxWidth="sm"
                sx={{ m: 'auto', mb: 1, p: 4, bgcolor: 'background.paper' }}
                spacing={4}
              >
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label={t`Name`}
                  placeholder={t`Acme Corp Warrant Canary`}
                />
                <TextField
                  sx={{ width: '100%' }}
                  multiline
                  rows={4}
                  fullWidth
                  id="statement"
                  name="statement"
                  label={t`Statement`}
                  placeholder={t`Acme Corp has never received an order under Section 215 of the USA Patriot Act.`}
                  type="statement"
                />
                <Button
                  size="large"
                  color="primary"
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled
                >
                  {t`Hatch a New Cnry`}
                </Button>
              </Stack>
            </Box>
          </div>
        </Box>

        <Stack maxWidth="sm" sx={{ m: 'auto' }}>
          <Alert severity="info">
            <AlertTitle>{t`About Cnry`}</AlertTitle>
            {t`Cnry makes it easy to publish and keep track of warrant canaries. Transactions settle on Bitcoin via Stacks.`}{' '}
            <strong>
              <a rel="noreferrer" target="_blank" href="https://github.com/aviculturist/cnry#-cnry">
                Learn more.
              </a>
            </strong>
          </Alert>
        </Stack>
      </div>
      <div role="tabpanel" id="two"></div>
      <div role="tabpanel" id="three"></div>
      <div role="tabpanel" id="four"></div>

      {/* <Stack sx={{ m: 'auto' }} direction="column">
                  <Skeleton sx={{ m: 'auto' }} variant="rectangular" width={400} height={50} />
                  <CnryListSkeleton />
                  <CnryListSkeleton />
                </Stack> */}
    </div>
  );
};
export default CnryListSkeleton;
