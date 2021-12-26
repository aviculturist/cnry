import * as React from 'react';
import { t } from '@lingui/macro';
import { useAtom } from 'jotai';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/system/Box';
import Stack from '@mui/material/Stack';

//import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import { addNetworkDialogIsOpenAtom } from '@store/ui/add-network-dialog-is-open';
import { Network } from '@store/networks';
import { useNetworks } from '@hooks/use-networks';
import { fetchCoreApiInfo } from 'micro-stacks/api';

const AddNetworkDialog = () => {
  const [open, setOpen] = useAtom(addNetworkDialogIsOpenAtom);
  const { handleAddNetwork } = useNetworks();
  const handleClose = () => {
    setOpen(false);
  };

  const getNetworkChain = async (url: string) => {
    try {
      const res = await fetchCoreApiInfo({ url: url });
      const network_id = res.network_id;
      return network_id === 1 ? 'mainnet' : 'testnet';
    } catch (_e) {
      console.log(_e);
    }
    return 'testnet';
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t`Add Network`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t`Add and select a new Stacks Blockchain API node using this form.`}
          </DialogContentText>
          <Formik
            initialValues={{
              name: '',
              url: '',
            }}
            validate={values => {
              const chain = getNetworkChain(values.url);
              const errors: Partial<Network> = {};
              if (!values.name) {
                errors.name = 'Required';
              }
              if (!values.url) {
                errors.url = 'Required';
              } else if (
                !/^(?:([a-z0-9+.-]+):\/\/)(?:\S+(?::\S*)?@)?(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
                  values.url
                )
              ) {
                errors.url = 'Invalid url';
              }
              if (!chain) {
                errors.url = 'Node is unreachable';
              }
              return errors;
            }}
            // TODO: use of async here adds a loading component automatically?
            onSubmit={async (values, { setSubmitting }) => {
              const url = new URL(values.url);
              const chain = await getNetworkChain(values.url);
              void handleAddNetwork({
                name: values.name.trim(),
                label: url.host,
                url: values.url,
                chain: chain,
              });
              setOpen(false);
              setTimeout(() => {
                setSubmitting(false);
              }, 500);
            }}
          >
            {({ submitForm, isSubmitting }) => (
              <Form>
                <Box
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
                    <Field
                      component={TextField}
                      name="name"
                      type="name"
                      label="Name"
                      variant="outlined"
                      fullWidth
                      placeholder={t`My Stacks Node`}
                    />
                    <Field
                      component={TextField}
                      type="url"
                      label="url"
                      name="url"
                      variant="outlined"
                      fullWidth
                      placeholder="https://"
                    />
                    {isSubmitting && <LinearProgress />}
                    <Stack direction="row">
                      <Button color="primary" disabled={isSubmitting} onClick={handleClose}>
                        {t`Cancel`}
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={submitForm}
                      >
                        {t`Add and Select`}
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AddNetworkDialog;
