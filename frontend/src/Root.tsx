import React from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper,
  Stack
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NavBar from './client/base';

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

  /*
   * if user == admin, return the control root
   * else, return the player flow
   */


  let is_admin = false
  if (is_admin) {
    return (
      <Box sx={containerStyle}>
        <Outlet />
      </Box>
    );
  } else {
    return (
      <>
        <NavBar/>
        <Outlet/>
      </>
    )
  }
};

export default Root;
