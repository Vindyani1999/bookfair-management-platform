import React from 'react';
import { Box, Stack, TextField, Typography } from '@mui/material';

const PersonalDetails = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(68, 68, 68, 0.1)',
        borderRadius: 2,
        p: 3,
        maxWidth: 600,
        mx: 'auto',
        boxShadow: 1,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 600, mb: 2 }}
      >
        Fill your personal/business information.
      </Typography>

      <Stack spacing={2}>
        {/* Full Name + Contact Number */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Full Name"
            fullWidth
            size="small"
            variant="outlined"
          />
          <TextField
            label="Contact Number"
            fullWidth
            size="small"
            variant="outlined"
          />
        </Stack>

        {/* Email Address */}
        <TextField
          label="Email Address"
          fullWidth
          size="small"
          variant="outlined"
        />

        {/* Business Name + Address */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Business Name (Optional)"
            fullWidth
            size="small"
            variant="outlined"
          />
          <TextField
            label="Business Address (Optional)"
            fullWidth
            size="small"
            variant="outlined"
          />
        </Stack>

        {/* Note */}
        <TextField
          label="Note (Optional)"
          fullWidth
          size="small"
          variant="outlined"
          multiline
          rows={3}
        />
      </Stack>
    </Box>
  );
};

export default PersonalDetails;
