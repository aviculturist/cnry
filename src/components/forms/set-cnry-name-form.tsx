import React from 'react';
import { useAtom } from 'jotai';
import { t } from '@lingui/macro';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/system/Box';
import useSetCnryName from '@hooks/use-set-cnry-name';
import { anyCnryNameDialogIsOpenAtomFamily } from '@store/ui/set-cnry-name-dialog-is-open';
const validationSchema = yup.object({
  name: yup.string().required(t`A name is required`),
});

const SetCnryNameForm = ({ tokenId, cnryName }: { tokenId: number; cnryName: string }) => {
  const handleSetCnryName = useSetCnryName(tokenId, cnryName);
  const formik = useFormik({
    initialValues: {
      name: cnryName, //Acme Corp Warrant Canary
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      void handleSetCnryName(tokenId, values.name.trim());
      setTimeout(() => {
        setSubmitting(false);
      }, 500);
    },
  });

  return (
    <>
      <Box
        key={tokenId}
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
            //placeholder="Acme Corp Warrant Canary"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <Button
            size="large"
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            disabled={formik.isSubmitting}
          >
            {t`Save`}
          </Button>
        </Stack>
      </Box>
    </>
  );
};
export default SetCnryNameForm;
