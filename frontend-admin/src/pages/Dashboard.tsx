import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
} from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';

export default function Dashboard() {
  const { admin, logout } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#fff', color: '#333' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Admin Dashboard
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">
              Welcome, {admin?.adminName}
            </Typography>

            <Button
              variant="contained"
              startIcon={<LogoutOutlined />}
              onClick={logout}
              sx={{
                bgcolor: '#000',
                '&:hover': {
                  bgcolor: '#ee5a6f'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 2,
            minHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Book Fair Management System
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Admin panel content will go here...
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}