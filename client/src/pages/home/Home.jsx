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
        <input
          className="search-bar-input"
          type="text"
          value={query}
          onChange={(input) => setQuery(input.target.value)}
        />
      </div>
    </div>
  );
};

export default Home;
