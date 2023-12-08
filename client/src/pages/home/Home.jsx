import { useState, useEffect } from "react";
import axios from "axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useSnackbar } from "notistack";

import NutritionResponse from "../../components/APIResponse/NutritionResponse";
import RecipeResponse from "../../components/APIResponse/RecipeResponse";
import SearchHistory from "../../components/SearchHistory/SearchHistory";

import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [calorieQuery, setCalorieQuery] = useState("");
  const [calorieResponse, setCalorieResponse] = useState(null);
  const [nutritionHistory, setNutritionHistory] = useState(null);
  const [recipeQuery, setRecipeQuery] = useState("");
  const [recipeResponse, setRecipeResponse] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [username, setUsername] = useState("Guest");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsAuthenticated(!!token); // Set isAuthenticated to true if token exists, false otherwise

    const username = sessionStorage.getItem("username");
    console.log(username);
    setUsername(username || "Guest"); // Set the username obtained from sessionStorage or 'Guest' if not present
  }, []);

  // store this in database
  const creatorLinks = {
    Tony: "https://www.linkedin.com/in/tony-cen-cen-47a323252/",
    Isa: "https://www.linkedin.com/in/isa-alsafwah-a03446243/",
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

  const handleCalorieQuery = () => {
    const token = sessionStorage.getItem("token"); // Retrieve the token here
    console.log(token);
    if (calorieQuery.trim() === "") {
      setCalorieQuery("");
      enqueueSnackbar("Query cannot be empty", { variant: "error" });
      return;
    }
    if (calorieQuery.includes("%")) {
      enqueueSnackbar("Query cannot contain the % symbol", {
        variant: "error",
      });
      return;
    }
    if (calorieQuery.includes("?")) {
      enqueueSnackbar("Query cannot contain the ? symbol", {
        variant: "error",
      });
      return;
    }
    if (calorieQuery.includes("/")) {
      enqueueSnackbar("Query cannot contain the / symbol", {
        variant: "error",
      });
      return;
    }
    if (calorieQuery.includes(`\\`)) {
      enqueueSnackbar("Query cannot contain the `\\` symbol", {
        variant: "error",
      });
      return;
    }
    axios
      .get(`http://localhost:3000/api/calories/${calorieQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT token in the header
        },
        withCredentials: true,
      })
      .then((response) => {
        setCalorieResponse(response.data);
        setCalorieQuery("");
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar(error, { variant: "error" });
      });
  };
  const handleCalorieQueryClear = () => {
    setCalorieQuery("");
    setCalorieResponse(null);
    enqueueSnackbar("Query cleared", { variant: "success" });
  };

  const getNutritionHistory = () => {
    const token = sessionStorage.getItem("token");
    axios
      .get("http://localhost:3000/api/calories/search-history", {
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT token in the header
        },
        withCredentials: true,
      })
      .then((response) => {
        setNutritionHistory(response.data.data);
      })
      .catch((error) => {
        console.log(error);

        enqueueSnackbar(error, { variant: "error" });
      });
  };
  const clearNutritionHistory = () => {
    setNutritionHistory(null);
  };

  const handleRecipeQuery = () => {
    const token = sessionStorage.getItem("token");
    if (recipeQuery.trim() === "") {
      setRecipeQuery("");
      enqueueSnackbar("Query cannot be empty", { variant: "error" });
      return;
    }
    if (recipeQuery.includes("%")) {
      enqueueSnackbar("Query cannot contain the % symbol", {
        variant: "error",
      });
      return;
    }
    if (recipeQuery.includes("?")) {
      enqueueSnackbar("Query cannot contain the ? symbol", {
        variant: "error",
      });
      return;
    }
    if (recipeQuery.includes("/")) {
      enqueueSnackbar("Query cannot contain the / symbol", {
        variant: "error",
      });
      return;
    }
    if (recipeQuery.includes(`\\`)) {
      enqueueSnackbar("Query cannot contain the `\\` symbol", {
        variant: "error",
      });
      return;
    }
    if (recipeQuery.search(/\d/) !== -1) {
      enqueueSnackbar("Recipe query cannot contain numbers", {
        variant: "error",
      });
      return;
    }
    axios
      .get(
        `http://localhost:3000/api/recipes/${recipeQuery.split(" ").join("")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token in the header
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.results.length !== 0) {
          setRecipeResponse(response.data.results);
          console.log(recipeResponse);
          setRecipeQuery("");
        }
        if (response.data.results.length === 0) {
          enqueueSnackbar(
            "This query does not seem to be working - try another query if the error persists",
            { variant: "error" }
          );
        }
      })
      .catch((error) => {
        console.log(error);

        enqueueSnackbar(error, { variant: "error" });
      });
  };
  const handleRecipeQueryClear = () => {
    setRecipeQuery("");
    setRecipeResponse(null);
    enqueueSnackbar("Query cleared", { variant: "success" });
  };

  const handleSignInOut = () => {
    if (isAuthenticated) {
      // User is currently signed in and is now signing out
      setIsAuthenticated(false);
      setUsername("Guest");
    } else {
      // User is currently not signed in and is now signing in
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
          <span className="username-placeholder">{username}</span>
        </div>
        <h1 className="home-title">Nutrisistant</h1>
      </div>
      <div>
        <div className="search-bar">
          <h2 className="search-bar-title">
            {isAuthenticated
              ? "What did you eat?"
              : "Log in to get nutrition info"}
          </h2>
          <input
            className={`search-bar-input ${!isAuthenticated ? "disabled" : ""}`} // Apply disabled class if not authenticated
            type="text"
            value={calorieQuery}
            onChange={(e) => setCalorieQuery(e.target.value)}
            disabled={!isAuthenticated} // Disable input if not authenticated
          />
        </div>
        <div>
          {(calorieQuery !== "" || calorieResponse !== null) && (
            <div className="search-bar-buttons">
              <button
                className="search-bar-button"
                onClick={handleCalorieQuery}
              >
                Analyze
              </button>
              <button
                className="search-bar-button"
                onClick={handleCalorieQueryClear}
              >
                Clear
              </button>
            </div>
          )}
          {calorieResponse !== null && (
            <div className="nutrition-response">
              <NutritionResponse response={calorieResponse.items} />
            </div>
          )}
          {isAuthenticated ? (
            nutritionHistory !== null ? (
              <button
                className="clear-nutrition-search-history-button"
                onClick={clearNutritionHistory}
              >
                Clear Nutrition Search History
              </button>
            ) : (
              <>
                <button
                  className="get-nutrition-search-history-button"
                  onClick={getNutritionHistory}
                >
                  Get Nutrition Search History
                </button>
              </>
            )
          ) : null}
          {nutritionHistory !== null ? (
            <SearchHistory response={nutritionHistory} />
          ) : null}
        </div>
      </div>
      <div>
        <div className="search-bar">
          <h2 className="search-bar-title">
            {isAuthenticated
              ? "What ingredients do you want to use?"
              : "Log in to get recipes"}
          </h2>
          <input
            className={`search-bar-input ${!isAuthenticated ? "disabled" : ""}`} // Apply disabled class if not authenticated
            type="text"
            value={recipeQuery}
            onChange={(e) => setRecipeQuery(e.target.value)}
            disabled={!isAuthenticated} // Disable input if not authenticated
          />
        </div>
        <div>
          {(recipeQuery !== "" || recipeResponse !== null) && (
            <div className="search-bar-buttons">
              <button className="search-bar-button" onClick={handleRecipeQuery}>
                Search
              </button>
              <button
                className="search-bar-button"
                onClick={handleRecipeQueryClear}
              >
                Clear
              </button>
            </div>
          )}

          {recipeResponse !== null && (
            <div className="recipe-response">
              <RecipeResponse response={recipeResponse} />
            </div>
          )}

          {!recipeQuery && recipeResponse === null && <br />}
        </div>
      </div>
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
