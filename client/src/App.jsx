import { Routes, Route } from "react-router-dom";

import Error from "./pages/error/Error";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Template from "./pages/template/Template";
import CreateAccount from "./pages/create-account/CreateAccount";
import "./App.css";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/template" element={<Template />} />
        <Route path="*" element={<Error />} />
        <Route path="/create-account" element={<CreateAccount />} />
      </Routes>
    </div>
  );
}

export default App;
