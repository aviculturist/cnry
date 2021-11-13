import * as React from 'react';
import { t } from '@lingui/macro';
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
import { hatchCnryDialogIsOpenAtom } from '@store/ui/hatch-cnry-dialog-is-open';
import useHatch from '@hooks/use-hatch';
import { Network } from '@store/networks';

const HatchCnryDialog = () => {
  const [open, setOpen] = useAtom(hatchCnryDialogIsOpenAtom);
  const handleHatch = useHatch();
  //const { handleContractCall } = useHatch();
  // const handleContractCall = ({ cnryName, statement }: { cnryName: string; statement: string }) => {
  //   handleHatch(cnryName, statement);
  // };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Hatch Cnry</DialogTitle>
        <DialogContent>
          <DialogContentText>Hatch a warrant canary using this form.</DialogContentText>
          <Formik
            initialValues={{
              name: '',
              statement: '',
            }}
            validate={values => {
              const errors: Partial<{ name: string; statement: string }> = {};
              if (!values.name) {
                errors.name = 'Required';
              }
              if (!values.statement) {
                errors.statement = 'Required';
              }

              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              // void handleHatch({
              //   cnryName: values.name.trim(),
              //   statement: values.statement.trim(),
              // });
              void handleHatch(values.name.trim(), values.statement.trim());
              //setOpen(false);
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
                  type="statement"
                  label="statement"
                  name="statement"
                  variant="outlined"
                  fullWidth
                  placeholder="We have not been approached by the FBI"
                />
                {isSubmitting && <LinearProgress />}
                <br />
                <Button color="primary" disabled={isSubmitting} onClick={handleClose}>
                  Cancel
                </Button>
                <Button color="primary" disabled={isSubmitting} onClick={submitForm}>
                  Hatch Cnry
                </Button>
              </Form>
            )}
          </Formik>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add and Select</Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
};
export default HatchCnryDialog;
