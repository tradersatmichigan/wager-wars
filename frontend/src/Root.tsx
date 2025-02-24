import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper,
  Stack
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Root = () => {
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f1 100%)',
    padding: '20px'
  };

  const paperStyle = {
    padding: '40px',
    textAlign: 'center',
    maxWidth: '600px',
    margin: 'auto'
  };

  return (
    <Box sx={containerStyle}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={paperStyle}>
          <Stack spacing={4}>
            <Typography variant="h2" component="h1" gutterBottom>
              Welcome to Your App
            </Typography>
            
            <Typography variant="h6" color="text.secondary">
              Your new platform is being built with care. 
              Stay tuned for amazing features.
            </Typography>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
            >
              <Button 
                variant="contained" 
                size="large"
                endIcon={<ArrowForwardIcon />}
              >
                Get Started
              </Button>
              
              <Button 
                variant="outlined" 
                size="large"
              >
                Learn More
              </Button>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ pt: 2 }}>
              Built with React + TypeScript + Material UI
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default Root;
