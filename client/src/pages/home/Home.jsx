import { useState } from "react";
import axios from "axios";

import "./Home.css";

const Home = () => {
  const [query, setQuery] = useState(" ");
  const [loading, setLoading] = useState(false);
  const [isResponse, setIsResponse] = useState(false);

  // store this in database
  const creatorLinks = {
    Tony: "placeholder",
    Isa: "placeholder",
    Aaron: "placeholder",
    Panos: "placeholder",
    Victor: "https://www.linkedin.com/in/victor-verma-91713022b/",
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

  return (
    <>
      <div className="home-content">
        <div className="home-title-container">
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
    </>
  );
};

export default Home;
