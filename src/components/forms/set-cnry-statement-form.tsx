import React from 'react';
import { useAtom } from 'jotai';
import { t } from '@lingui/macro';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/system/Box';
import useSetCnryStatement from '@hooks/use-set-cnry-statement';
import { anyCnryStatementDialogIsOpenAtomFamily } from '@store/ui/set-cnry-statement-dialog-is-open';
const validationSchema = yup.object({
  statement: yup
    .string()
    .max(280, t`A statement cannot exceed 280 characters. It should fit in a Tweet!`)
    .required(t`A statement is required`),
});

const SetCnryStatementForm = ({
  tokenId,
  cnryStatement,
}: {
  tokenId: number;
  cnryStatement: string;
}) => {
  const handleSetCnryStatement = useSetCnryStatement(tokenId, cnryStatement);
  const formik = useFormik({
    initialValues: {
      statement: cnryStatement,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      void handleSetCnryStatement(tokenId, values.statement.trim());
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
            multiline
            rows={4}
            id="statement"
            name="statement"
            label={t`Statement`}
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
            {t`Save`}
          </Button>
        </Stack>
      </Box>
    </>
  );
};
export default SetCnryStatementForm;
