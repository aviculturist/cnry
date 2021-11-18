import React from 'react';
import { t } from '@lingui/macro';
import { useAuth } from '@micro-stacks/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/system/Box';
import useHatch from '@hooks/use-hatch';
import useInstallWalletDialog from '@hooks/use-install-wallet-dialog';

const validationSchema = yup.object({
  name: yup.string().required(t`A name is required`),
  statement: yup
    .string()
    .max(280, t`A statement cannot exceed 280 characters. It should fit in a Tweet!`)
    .required(t`A statement is required`),
});

const HatchCnryForm = () => {
  const { isSignedIn, handleSignIn, session } = useAuth();
  const { setInstallWalletDialogIsOpen } = useInstallWalletDialog();
  const handleHatch = useHatch();
  const formik = useFormik({
    initialValues: {
      name: '', //Acme Corp Warrant Canary
      statement: '', //The FBI has not been here today.
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      isSignedIn ? void handleHatch(values.name.trim(), values.statement.trim()) : handleSignIn({});
      setTimeout(() => {
        setSubmitting(false);
      }, 500);
      !session && setInstallWalletDialogIsOpen(true);
      // TODO: better onboarding along these lines
      // : (values: any) => {
      //     try {
      //       handleSignIn({
      //         onFinish: (values:any) => void handleHatch(values.name.trim(), values.statement.trim()),
      //       });
      //     } catch (e) {
      //       console.log(e);
      //     }
      //   };
      // alert(JSON.stringify(values, null, 2));
      // isSignedIn
      //   ? () => void handleHatch(values.name.trim(), values.statement.trim())
      //   : () => {
      //       try {
      //         // TODO: fix coming upstream
      //         //() => handleSignIn();
      //         handleSignIn({  onFinish: () => handleHatch(values.name.trim(), values.statement.trim() )  })
      //         //handleSignIn({}).onFinish().then(() => handleHatch(values.name.trim(), values.statement.trim()));
      //       } catch (_e) {
      //         console.log(_e);
      //       }
      //       !session && setInstallWalletDialogIsOpen(true);
      //     };
    },
  });

  return (
    <>
      <Box
        onSubmit={formik.handleSubmit}
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
            placeholder="Acme Corp Warrant Canary"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            sx={{ width: '100%' }}
            multiline
            rows={4}
            fullWidth
            id="statement"
            name="statement"
            label={t`Statement`}
            placeholder="Acme Corp has never received an order under Section 215 of the USA Patriot Act."
            type="statement"
            value={formik.values.statement}
            onChange={formik.handleChange}
            error={formik.touched.statement && Boolean(formik.errors.statement)}
            helperText={formik.touched.statement && formik.errors.statement}
          />
          <Button
            size="large"
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            disabled={formik.isSubmitting}
          >
            {t`Hatch a New Cnry`}
          </Button>
        </Stack>
      </Box>
    </>
  );
};
export default HatchCnryForm;
