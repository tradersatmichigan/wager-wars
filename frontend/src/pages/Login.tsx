import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";

/*

This is a generic login page, I set it up so that I could blueprint the logic for how Arjun would get to the control 
page. Logging in with admin, admin takes you to the control panel

*/

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO: Replace with real auth logic
    console.log("Logging in with:", username, password);

    if (username == "admin" && password == "admin") {
        navigate("/control");
    } else {
        navigate("/home");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
