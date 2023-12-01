import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, Container, Typography } from '@mui/material';
import { jwtDecode } from "jwt-decode";
import './Login.css';

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const handleWebsiteLogin = async () => {
    try {
      const response = await axios.post(`${backend_url}/login`, {
        username: username,
        password: password,
      });

      // Check if the response contains a valid JWT token
      if (response.data.token) {
        // Store the token in local storage
        localStorage.setItem('token', response.data.token);
        console.log('Successful login via website');
        navigate('/');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error during website login:', error);
      setError('An error occurred. Please try again.');
    }
  };


  const handleGoogleLogin = useCallback(async (response) => {
    try {
      const token = response.credential

      // Assuming the backend handles Google OAuth token validation
      const oauthResponse = await axios.post(`${backend_url}/google-login`, {
        token: token,
      });

      if (oauthResponse.data.token) {
        localStorage.setItem('token', oauthResponse.data.token);
        console.log('Successful login via Google OAuth');
        navigate('/');
      } else {
        setError('Google OAuth login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during Google OAuth login:', error);
      setError('An error occurred. Please try again.');
    }
  }, [navigate, backend_url]);

  useEffect(() => {
    // Loading Google API and initializing Google Sign-In
    const loadGoogleAPI = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => {
        google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleLogin,
        });
        google.accounts.id.renderButton(
          document.getElementById('signInDiv'),
          { theme: 'outline', size: 'large' }
        );
      };
      document.body.appendChild(script);
    };

    loadGoogleAPI();
  }, [handleGoogleLogin]);

  return (
    <Container maxWidth="sm">
      <div className="login-content">
        <Typography variant="h4" align="center" gutterBottom>
          User Login
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Typography variant="body1" align="center" gutterBottom>
          Don't have an account? <NavLink to="/create-account">Create one</NavLink>
        </Typography>
        {error && (
          <Typography variant="body1" color="error" align="center">
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleWebsiteLogin}
        >
          Website Login
        </Button>
        <Typography variant="h4" align="center" gutterBottom className="third-party-login-header">
          Third Party Login
        </Typography>
        <div id="signInDiv" className="google-sign-in"></div>
      </div>
    </Container>
  );
};

export default Login;
