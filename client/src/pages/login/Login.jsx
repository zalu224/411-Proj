import { useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import "./Login.css";

const Login = () => {
  const [ error, setError ] = useState('');
  const navigate = useNavigate();

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
      client_id: google_client_id,
      callback: handleCallbackResponse
    });
    
    
      google.accounts.id.renderButton(
        document.getElementById("signInDiv"),
        { theme: "outline", size: "large"}
        );

      //console.log('google_client_id:', google_client_id);

    }, []);
    
    
    return (
    <>
      <div className="login-content">
        <div className="login-text">
          To access the nutrition assistant app, please sign in with your Google account
        </div>
        <div id="signInDiv" className="login-button"></div>
      </div>
    </>
    );
};

export default Login;
