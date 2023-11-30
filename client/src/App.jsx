import { Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import Error from "./pages/error/Error";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Template from "./pages/template/Template";
import CreateAccount from "./pages/create-account/CreateAccount";
import "./App.css";

function App() {
  return (
    <div>
      <SnackbarProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/template" element={<Template />} />
          <Route path="*" element={<Error />} />
          <Route path="/create-account" element={<CreateAccount />} />
        </Routes>
      </SnackbarProvider>
    </div>
  );
}

export default App;
