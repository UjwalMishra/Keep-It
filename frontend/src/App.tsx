import { Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Signin from "./pages/Signin";
import SharedPage from "./pages/SharedPage";
import {
  GuestRoute,
  ProtectedRoute,
} from "./features/auth/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
      </Route>

      <Route element={<GuestRoute />}>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route path="/share/:sharelink" element={<SharedPage />} />
    </Routes>
  );
}

export default App;
