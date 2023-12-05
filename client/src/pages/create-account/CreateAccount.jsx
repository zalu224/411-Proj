import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Container, Typography, TextField, Button } from '@mui/material';

const CreateAccount = () => {
  const navigate = useNavigate();
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // NEED TO BE WORKED ON
  // Replace 'YOUR_BACKEND_CREATE_ACCOUNT_ENDPOINT' with something like "/api/create-account"
  const handleCreateAccount = async () => {
    if (!username || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
  
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
  
    try {
      const response = await axios.post(`${backend_url}/create-account`, {
        username: username,
        password: password,
      });
  
      if (response.status === 400 && response.data && response.data.exists) {
        setError('This username is already taken. Please choose another.');
      } else if (response.status === 201 && response.data && response.data.success) {
        setError('');
        navigate('/login');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data && error.response.data.exists) {
          setError('This username is already taken. Please choose another.');
        }
      } else if (error.response) {
        console.error('Error creating account:', error.response);
        setError('An error occurred. Please try again.');
      } else {
        console.error('Network error:', error);
        setError('A network error occurred. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <div className="create-account-content">
        <Typography variant="h4" align="center" gutterBottom>
          Create Account
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
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        {error && (
          <Typography variant="body1" color="error" align="center">
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCreateAccount}
        >
          Create Account
        </Button>
      </div>
    </Container>
  );
};

export default CreateAccount;