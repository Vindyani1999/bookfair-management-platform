import { Box, Typography} from '@mui/material';

const PaymentDetails = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#f8f1f1',
        borderRadius: 2,
        p: 3,
        maxWidth: 600,
        mx: 'auto',
        boxShadow: 1,
      }}
    >
      <Typography>Complete the reservation with the payment.</Typography>
    </Box>
  )
}

export default PaymentDetails