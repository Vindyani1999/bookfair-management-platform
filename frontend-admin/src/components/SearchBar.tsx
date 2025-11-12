import React from 'react';
import { Box, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(237, 241, 243, 0.9)',
        borderRadius: '9999px',
        padding: '4px 10px',
        width: '60%',
        height: '40px',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <InputBase
        placeholder="Search..."
        sx={{
          ml: 1,
          flex: 1,
          fontSize: '0.95rem',
        }}
      />
      <IconButton sx={{ p: '6px' }}>
        <SearchIcon sx={{ color: '#333' }} />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
