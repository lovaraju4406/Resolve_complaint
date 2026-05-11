import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import LandingPage from "./components/common/LandingPage";
import Login from "./components/common/Login";
import SignUp from "./components/common/SignUp";
import UserHome from "./components/user/UserHome";
import UserRaise from "./components/user/UserRaise";
import UserComplaints from "./components/user/UserComplaints";
import AdminHome from "./components/admin/AdminHome";
import AgentHome from "./components/agent/AgentHome";
import UserInfo from "./components/admin/UserInfo";
import AgentInfo from "./components/admin/AgentInfo";

const GOOGLE_CLIENT_ID = "103164797331-kn9313lobik06rdla1ba5k6fiurmrc3e.apps.googleusercontent.com";

const ProtectedRoute = ({ element }) => {
  const isLoggedIn = !!localStorage.getItem("user");
  return isLoggedIn ? element : <Navigate to="/Login" replace />;
};

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="App">
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/"        element={<LandingPage />} />   {/* ✅ root opens LandingPage */}
            <Route path="/Login"   element={<Login />} />
            <Route path="/SignUp"  element={<SignUp />} />

            {/* Protected routes */}
            <Route path="/home"        element={<ProtectedRoute element={<UserHome />} />} />
            <Route path="/Complaint"   element={<ProtectedRoute element={<UserRaise />} />} />
            <Route path="/Status"      element={<ProtectedRoute element={<UserComplaints />} />} />
            <Route path="/AdminHome"   element={<ProtectedRoute element={<AdminHome />} />} />
            <Route path="/UserInfo"    element={<ProtectedRoute element={<UserInfo />} />} />
            <Route path="/AgentHome"   element={<ProtectedRoute element={<AgentHome />} />} />
            <Route path="/AgentInfo"   element={<ProtectedRoute element={<AgentInfo />} />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;