import { useState } from "react";
import axios from "axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState(" ");
  const [loading, setLoading] = useState(false);
  const [isResponse, setIsResponse] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [username, setUsername] = useState("Guest");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // store this in database
  const creatorLinks = {
    Tony: "https://www.linkedin.com/in/tony-cen-cen-47a323252/",
    Isa: "placeholder",
    Aaron: "placeholder",
    Panos: "placeholder",
    Victor: "https://www.linkedin.com/in/victor-verma-91713022b/",
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleQuery = () => {
    setLoading(true);
    axios
      .get("get request for calorie api results")
      .then((response) => {
        /* parse api response data */
        console.log(response);
        setIsResponse(true);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleSignInOut = () => {
    if (isAuthenticated) { // User is currently signed in and is now signing out
      setIsAuthenticated(false);
      setUsername("Guest");
    } else { // User is currently not signed in and is now signing in
      navigate("/login");
      setIsAuthenticated(true);
      // Also set user name
    }
    handleClose();
  };

  return (
    <div className="home-content">
      <div className="home-title-container">
        <div className="account-icon">
          <div>
            {!isAuthenticated && (
              <span className="username-placeholder">{username}</span>
            )}
            <AccountCircleIcon
              sx={{ fontSize: 50 }}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            />
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleSignInOut}>
                {isAuthenticated ? "Sign Out" : "Sign In"}
              </MenuItem>
            </Menu>
          </div>
        </div>
        <h1 className="home-title">Application Title</h1>
      </div>
      {isResponse ? (
        "placeholder"
      ) : loading ? (
        "placeholder"
      ) : (
        <div className="search-bar">
          <h2 className="search-bar-title">What did you eat?</h2>
          <input
            className="search-bar-input"
            type="text"
            value={query}
            onChange={(i) => setQuery(i.target.value)}
          />
          <button className="search-bar-button" onClick={handleQuery}>
            Analyze my nutrition!
          </button>
        </div>
      )}
      <div className="home-footer">
        Created by{" "}
        <a
          className="home-footer-link"
          target="_blank"
          rel="noreferrer"
          href={creatorLinks.Tony}
        >
          Tony
        </a>
        {", "}
        <a
          className="home-footer-link"
          target="_blank"
          rel="noreferrer"
          href={creatorLinks.Isa}
        >
          Isa
        </a>
        {", "}
        <a
          className="home-footer-link"
          target="_blank"
          rel="noreferrer"
          href={creatorLinks.Aaron}
        >
          Aaron
        </a>
        {", "}
        <a
          className="home-footer-link"
          target="_blank"
          rel="noreferrer"
          href={creatorLinks.Panos}
        >
          Panos
        </a>
        {", and "}
        <a
          className="home-footer-link"
          target="_blank"
          rel="noreferrer"
          href={creatorLinks.Victor}
        >
          Victor
        </a>
      </div>
    </div>
  );
};

export default Home;
