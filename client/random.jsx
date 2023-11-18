import { useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { Button, TextField, Container, Typography } from '@mui/material';
import "./Login.css";

const Login = () => {
  const [ error, setError ] = useState('');
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // WEBSITE LOGIN
  const handleLogin = () => {
    // Authenticate using username and password
    // Example: You can add your authentication logic here
    if (username === 'exampleUser' && password === 'examplePassword') {
      // Example successful login, replace with your logic
      const fakeToken = 'exampleFakeToken';
      const userObject = jwtDecode(fakeToken);
      sendDataToBackend(userObject);
      console.log('Successful login');
      navigate('/');
    } else {
      setError('Login failed. Please try again.');
    }
  };

  function sendDataToBackend(data) {
    // Sending data to the backend, replace this with your backend logic
    axios.post('YOUR_BACKEND_URL', data)
      .then(response => {
        console.log('Data successfully sent to the backend.');
      })
      .catch(error => {
        console.error('Error sending data:', error);
      });
  }


  // THIRD PARTY GOOGLE LOGIN
  // Importing environmental variables
  const google_client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const backend_url = import.meta.env.VITE_BACKEND_URL

  function sendDataToBackend(data) {
    axios.post(backend_url, data)
    .then(response => {
      console.log('Data successfully sent to the backend.');
    })
    .catch(error => {
      console.error("Error sending data:", error);
    });
  }

  function handleCallbackResponse(response) {
    // response.credential = JWT returned from Google signaling successful login
    var userObject = jwtDecode(response.credential)
    
    if (userObject){
      //sendDataToBackend(userObject);

      // user logged in successfully, redirect to home page
      console.log(`successful login`);
      navigate("/");
    } else {
      console.log("login failed")
      setError('Login failed. Please try again.');
    }
    
    }
  
    useEffect(() => {
      /* global google */
      google.accounts.id.initialize({
      client_id: VITE_GOOGLE_CLIENT_ID,
      callback: handleCallbackResponse
    });
    
    
      google.accounts.id.renderButton(
        document.getElementById("signInDiv"),
        { theme: "outline", size: "large"}
        );

      //console.log('google_client_id:', google_client_id);

    }, []);
    
    
    return (
      <Container maxWidth="sm">
        <div className="login-content">
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            onClick={handleLogin}
          >
            Login
          </Button>
        </div>
      </Container>
    );
};

export default Login;
