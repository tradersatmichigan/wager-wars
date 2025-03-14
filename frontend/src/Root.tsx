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
import { useState, useEffect } from 'react';
import AdminPage from './pages/AdminPage';
import PlayerPage from './pages/PlayerPage';

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

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/isadmin/");
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to check admin");

        setIsAdmin(data.is_admin);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  return isAdmin ?
    (
      <>
      <AdminPage />
      </>
  ) :
    (
      <>
      <PlayerPage />
      </>
  )
};

export default Root;
