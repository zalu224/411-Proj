import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import Error from "./pages/error/Error";

import "./App.css";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
