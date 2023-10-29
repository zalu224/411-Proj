import { useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import "./Login.css";

const Login = () => {
  const [ error, setError ] = useState('');
  const navigate = useNavigate();

  function handleCallbackResponse(response) {
    // response.credential = JWT returned from Google signaling successful login
    var userObject = jwtDecode(response.credential)
    
    if (userObject){
      // also need to send userObject and/or response.credential to the backend for storage

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
      client_id: "placeholder",
      callback: handleCallbackResponse
    });
    
    
    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large"}
      );
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
