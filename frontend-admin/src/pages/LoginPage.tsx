import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container
} from '@mui/material';

export default function LoginPage() {
  const [adminName, setAdminName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ adminName, password });
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#c8d3db',
        padding: 2
      }}
    >
      <Container maxWidth="xs">
        <Card
          elevation={0}
          sx={{
            padding: { xs: 4, sm: 5 },
            borderRadius: 4,
            backgroundColor: '#fff',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Box
            sx={{
              textAlign: 'center',
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              '&:hover img': {
                transform: 'scale(1.1)'
              }
            }}
          >
            <Box
              component="img"
              src="/images/black_logo.png"
              alt="Book.me"
              sx={{
                height: '56px',
                width: 'auto',
                transition: 'transform 0.3s ease',
              }}
            />
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                backgroundColor: '#f8d7da',
                color: '#721c24'
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: '#000',
                    mb: 1,
                    fontSize: '14px'
                  }}
                >
                  Username
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  disabled={loading}
                  autoComplete="username"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#b3b3b3',
                      borderRadius: '8px',
                      '& fieldset': {
                        border: 'none',
                      },
                      '&:hover': {
                        backgroundColor: '#a8a8a8',
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#a8a8a8',
                      },
                      '& input': {
                        padding: '12px 14px',
                      }
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: '#000',
                    mb: 1,
                    fontSize: '14px'
                  }}
                >
                  Password
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#b3b3b3',
                      borderRadius: '8px',
                      '& fieldset': {
                        border: 'none',
                      },
                      '&:hover': {
                        backgroundColor: '#a8a8a8',
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#a8a8a8',
                      },
                      '& input': {
                        padding: '12px 14px',
                      }
                    }
                  }}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 1,
                  py: 1.5,
                  backgroundColor: '#000',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: '#2d2d2d',
                  },
                  '&:disabled': {
                    backgroundColor: '#666',
                    color: '#ccc'
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: '#fff' }} />
                ) : (
                  'Login as an Admin'
                )}
              </Button>
            </Box>
          </form>
        </Card>
      </Container>
    </Box>
  );
}