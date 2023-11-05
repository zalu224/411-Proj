import { Routes, Route } from "react-router-dom";

import Error from "./pages/error/Error";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Template from "./pages/template/Template";

import "./App.css";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Error />} />
        <Route path="template" element={<Template />} />
      </Routes>
    </div>
  );
}

export default App;
