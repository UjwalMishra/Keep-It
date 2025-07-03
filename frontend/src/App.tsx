import { Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import Signin from "./pages/Signin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
    </Routes>
  );
}

export default App;
