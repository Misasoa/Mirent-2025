import React from "react";
import "react-toastify/dist/ReactToastify.css";
import Register from "./Components/register/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Component/login/Login";
import UserProfile from "./Components/profile/userProfile";
import ClientRoutes from "./routes/clientRoute";
import AdminRoutes from "./routes/adminRoutes";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Authentification */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User profile */}
        <Route path="/userProfile" element={<UserProfile />} />

        {/* Client */}
        <Route path="/*" element={<ClientRoutes />} />

        {/* Admin */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
};

export default App;
