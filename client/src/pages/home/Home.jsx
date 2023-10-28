import { useState } from "react";

import "./Home.css";

const Home = () => {
  const [query, setQuery] = useState(" ");
  return (
    <div className="home-content">
      <div className="home-title-container">
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
        <button className="search-bar-button">Get my calories!</button>
      </div>
    </div>
  );
};

export default Home;
