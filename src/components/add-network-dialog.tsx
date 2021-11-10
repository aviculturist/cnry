import * as React from 'react';
import { useAtom } from 'jotai';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import { addNetworkDialogIsOpenAtom } from '@store/add-network-dialog-is-open';
import { useNetworks } from '@hooks/use-networks';
import { Network } from '@store/networks';

const AddNetworkDialog = () => {
  const [open, setOpen] = useAtom(addNetworkDialogIsOpenAtom);
  const { handleAddNetwork } = useNetworks();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Network</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add and select a new Stacks Blockchain API node using this form.
          </DialogContentText>
          <Formik
            initialValues={{
              name: '',
              url: '',
            }}
            validate={values => {
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
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              const url = new URL(values.url);
              // TODO: run an info query to discover the chainMode
              //await setChainMode(networkMode);
              // TODO: handle localhost / http://
              void handleAddNetwork({
                name: values.name.trim(),
                label: url.host,
                url: `https://${url.host}`,
                chain: 'testnet',
              });
              setOpen(false);
              setTimeout(() => {
                setSubmitting(false);
                //alert(JSON.stringify(values, null, 2));
              }, 500);
            }}
          >
            {({ submitForm, isSubmitting }) => (
              <Form>
                <Field
                  component={TextField}
                  name="name"
                  type="name"
                  label="Name"
                  variant="outlined"
                  fullWidth
                  placeholder="My Stacks Node"
                />
                <br />
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
                <br />
                <Button color="primary" disabled={isSubmitting} onClick={handleClose}>
                  Cancel
                </Button>
                <Button color="primary" disabled={isSubmitting} onClick={submitForm}>
                  Add and Select
                </Button>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AddNetworkDialog;
