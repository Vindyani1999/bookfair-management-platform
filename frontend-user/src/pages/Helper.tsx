import React from 'react';
import { Box, Stack, Typography, Avatar } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const Helper = () => {
    return (
        <Box
            sx={{
                backgroundColor: 'rgba(68, 68, 68, 0.1)',
                borderRadius: 3,
                p: 5,
                maxWidth: 1000,
                mx: 'auto',
                minHeight: 'auto',
            }}
        >
            {/* Heading */}
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    mb: 3,
                    textAlign: 'left',
                    color: '#000',
                    fontSize: '2rem',
                }}
            >
                Reach Out to US
            </Typography>

            {/* Description */}
            <Typography
                variant="body1"
                sx={{
                    color: '#2c2c2c',
                    mb: 6,
                    textAlign: 'center',
                    lineHeight: 1.7,
                    fontSize: '0.95rem',
                    maxWidth: 829,
                    mx: 'auto',
                }}
            >
                If you need any assistance with your stall reservation or have questions about the booking process, our team is always ready to help. Feel free to contact us
            </Typography>

            {/* Contact Info */}
            <Stack
                spacing={5}
                sx={{ mt: 8 }}
            >
                {/* Phone */}
                <Stack
                    direction="row"
                    spacing={3}
                    alignItems="center"
                    sx={{ pl: 4 }}
                >
                    <Avatar
                        sx={{
                            bgcolor: '#e8e8e8',
                            color: '#333',
                            width: 70,
                            height: 70,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                    >
                        <PhoneIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box textAlign="left">
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#4a4a4a',
                                mb: 0.5,
                                fontSize: '0.9rem',
                                fontWeight: 500,
                            }}
                        >
                            Phone
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                color: '#000',
                                fontSize: '1.5rem',
                            }}
                        >
                            +94 89 3676
                        </Typography>
                    </Box>
                </Stack>

                {/* Email */}
                <Stack
                    direction="row"
                    spacing={3}
                    alignItems="center"
                    sx={{ pl: 4 }}
                >
                    <Avatar
                        sx={{
                            bgcolor: '#e8e8e8',
                            color: '#333',
                            width: 70,
                            height: 70,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                    >
                        <EmailIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box textAlign="left">
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#4a4a4a',
                                mb: 0.5,
                                fontSize: '0.9rem',
                                fontWeight: 500,
                            }}
                        >
                            Email
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                color: '#000',
                                fontSize: '1.5rem',
                            }}
                        >
                            bookme@gmail.com
                        </Typography>
                    </Box>
                </Stack>
            </Stack>
        </Box>
    );
};

export default Helper;