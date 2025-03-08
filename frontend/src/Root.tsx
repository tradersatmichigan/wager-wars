import React from 'react';
import {Outlet} from 'react-router-dom'
import NavBar from './base'
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
  return (
    <>
    <NavBar />
    <Outlet />
    </>
  )

}
export default Root;
