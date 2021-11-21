import React from 'react';
import { t } from '@lingui/macro';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/system/Box';
import useSetCnryKeepaliveExpiry from '@hooks/use-set-cnry-keepalive-expiry';

const validationSchema = yup.object({
  keepaliveExpiry: yup.number().required(t`A keepaliveExpiry is required`),
});

const SetCnryKeepaliveExpiryForm = ({
  tokenId,
  cnryKeepaliveExpiry,
}: {
  tokenId: number;
  cnryKeepaliveExpiry: number;
}) => {
  const handleSetCnryKeepaliveExpiry = useSetCnryKeepaliveExpiry(tokenId, cnryKeepaliveExpiry);
  const formik = useFormik({
    initialValues: {
      keepaliveExpiry: cnryKeepaliveExpiry,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      void handleSetCnryKeepaliveExpiry(tokenId, values.keepaliveExpiry);
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
            select
            //labelId="keepaliveExpiry"
            id="keepaliveExpiry"
            name="keepaliveExpiry"
            value={formik.values.keepaliveExpiry}
            label="Keepalive Expiry Frequency"
            onChange={formik.handleChange}
            error={formik.touched.keepaliveExpiry && Boolean(formik.errors.keepaliveExpiry)}
          >
            <MenuItem key="keepaliveExpiry-86400" id="keepaliveExpiry-86400" value={86400}>
              {t`Every day`}
            </MenuItem>
            <MenuItem key="keepaliveExpiry-604800" id="keepaliveExpiry-604800" value={604800}>
              {t`Every week`}
            </MenuItem>
            <MenuItem key="keepaliveExpiry-2629800" id="keepaliveExpiry-2629800" value={2629800}>
              {t`Every month`}
            </MenuItem>
            <MenuItem key="keepaliveExpiry-7890000" id="keepaliveExpiry-7890000" value={7890000}>
              {t`Every quarter (three months)`}
            </MenuItem>
            <MenuItem key="keepaliveExpiry-31536000" id="keepaliveExpiry-31536000" value={31536000}>
              {t`Every year`}
            </MenuItem>
          </TextField>
          {/* <TextField
            fullWidth
            multiline
            rows={4}
            id="keepaliveExpiry"
            name="keepaliveExpiry"
            label={t`KeepaliveExpiry`}
            value={formik.values.keepaliveExpiry}
            onChange={formik.handleChange}
            error={formik.touched.keepaliveExpiry && Boolean(formik.errors.keepaliveExpiry)}
            helperText={formik.touched.keepaliveExpiry && formik.errors.keepaliveExpiry}
          /> */}
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
export default SetCnryKeepaliveExpiryForm;
