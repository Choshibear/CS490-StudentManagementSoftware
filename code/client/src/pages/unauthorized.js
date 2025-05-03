import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function UnauthorizedPage() {
  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h3">401 - Unauthorized</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        You don't have permission to access this page
      </Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>
        Return to Home
      </Button>
    </Box>
  );
}

export default UnauthorizedPage;