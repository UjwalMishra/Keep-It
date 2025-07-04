import { Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import Signin from "./pages/Signin";
import SharedPage from "./pages/SharedPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/api/v1/link/share/:sharelink" element={<SharedPage />} />
    </Routes>
  );
}

export default App;
