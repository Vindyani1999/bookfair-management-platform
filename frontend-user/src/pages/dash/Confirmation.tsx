import React from 'react';
import { Box, Stack, Typography, Button, Chip } from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode'; // optional icon for the button

const Confirmation = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#f8f1f1',
        borderRadius: 2,
        p: 3,
        maxWidth: 650,
        mx: 'auto',
        boxShadow: 1,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, mb: 3 }}
      >
        Your Reservation is Successful!
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        justifyContent="center"
      >
        {/* Left Side - Reservation Details */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#ffffff',
            borderRadius: 2,
            p: 2,
            boxShadow: 1,
            textAlign: 'left',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Reservation Details
          </Typography>

          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Reserved Stalls</strong>
          </Typography>

          <Stack spacing={1} sx={{ mb: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="body2">Hall D - Stall 4</Typography>
              <Chip label="Medium" size="small" color="info" />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="body2">Hall D - Stall 7</Typography>
              <Chip label="Large" size="small" color="success" />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="body2">Hall D - Stall 20</Typography>
              <Chip label="Small" size="small" color="warning" />
            </Box>
          </Stack>

          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Reservation Date</strong><br />
            October 28, 2025
          </Typography>

          <Typography variant="body2">
            <strong>Reservation ID</strong><br />
            ugfc4793e3fecfdk
          </Typography>
        </Box>

        {/* Right Side - QR Code Section */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#ffffff',
            borderRadius: 2,
            p: 2,
            boxShadow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Entry Pass QR Code
          </Typography>

          {/* QR Code Image */}
          <Box
            component="img"
            src="https://api.qrserver.com/v1/create-qr-code/?data=ReservationID123&size=150x150"
            alt="QR Code"
            sx={{
              width: 150,
              height: 150,
              mb: 2,
              borderRadius: 1,
            }}
          />

          {/* Download Button */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#bfbfbf',
              color: '#fff',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#a6a6a6' },
            }}
          >
            Download QR Code
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default Confirmation;
