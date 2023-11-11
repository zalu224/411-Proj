import { useState } from "react";
import axios from "axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";

import NutritionResponse from "../../components/NutritionResponse";
import Spinner from "../../components/Spinner/Spinner";

import "./Home.css";

const Home = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResponse, setIsResponse] = useState(false);

  // store this in database
  const creatorLinks = {
    Tony: "https://www.linkedin.com/in/tony-cen-cen-47a323252/",
    Isa: "https://www.linkedin.com/in/isa-alsafwah-a03446243/",
    Aaron: "placeholder",
    Panos: "placeholder",
    Victor: "https://www.linkedin.com/in/victor-verma-91713022b/",
  };

  const handleQuery = () => {
    setLoading(true);
    if (query.trim() === "") {
      console.log("query is empty");
      setQuery("");
      setLoading(false);
      return;
    }
    setIsResponse(true);
    axios
      .get("get request for calorie api results")
      .then((response) => {
        /* parse api response data */
        console.log(response);
        setIsResponse(true);
        setQuery("");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleQueryClear = () => {
    setQuery("");
  };

  const handleResponseClear = () => {
    setLoading(true);
    setIsResponse(false);
    setLoading(false);
  };

  const handleResponseReset = () => {
    setLoading(true);
    setQuery("");
    setIsResponse(false);
    setLoading(false);
  };

  const sampleResponse = {
    items: [
      {
        sugar_g: 13.3,
        fiber_g: 4,
        serving_size_g: 283.495,
        sodium_mg: 8,
        name: "onion",
        potassium_mg: 99,
        fat_saturated_g: 0.1,
        fat_total_g: 0.5,
        calories: 126.7,
        cholesterol_mg: 0,
        protein_g: 3.9,
        carbohydrates_total_g: 28.6,
      },
      {
        sugar_g: 2.6,
        fiber_g: 1.2,
        serving_size_g: 100,
        sodium_mg: 4,
        name: "tomato",
        potassium_mg: 23,
        fat_saturated_g: 0,
        fat_total_g: 0.2,
        calories: 18.2,
        cholesterol_mg: 0,
        protein_g: 0.9,
        carbohydrates_total_g: 3.9,
      },
    ],
  };

  return (
    <div className="home-content">
      <div className="home-title-container">
        <div className="account-icon">
          <Link className="home-login-button" to="/login">
            <AccountCircleIcon sx={{ fontSize: 50 }} />
          </Link>
        </div>
        <h1 className="home-title">Application Title</h1>
      </div>
      <div className="search-bar">
        <h2 className="search-bar-title">What did you eat?</h2>
        <input
          className="search-bar-input"
          type="text"
          value={query}
          onChange={(i) => setQuery(i.target.value)}
        />
      </div>
      <div className="home-response">
        {query !== "" && (
          <div className="search-bar-buttons">
            <button className="search-bar-button" onClick={handleQuery}>
              Analyze
            </button>
            <button className="search-bar-button" onClick={handleQueryClear}>
              Clear
            </button>
          </div>
        )}
        {loading ? (
          <Spinner />
        ) : (
          isResponse && (
            <>
              <div className="nutrition-response">
                <NutritionResponse response={sampleResponse.items} />
              </div>
              <div className="response-buttons">
                <button
                  className="response-button"
                  onClick={handleResponseClear}
                >
                  Clear Response
                </button>
                <button
                  className="response-button"
                  onClick={handleResponseReset}
                >
                  Reset Query
                </button>
              </div>
            </>
          )
        )}
        {!query && !isResponse && <br />}
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
