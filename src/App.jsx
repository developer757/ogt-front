import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  Domains,
  Funnels,
  Users,
  Spends,
  Offers,
  Sources,
  Statistics,
  Leads,
  Dashboard,
  Logs,
  Duplicates,
  Statuses,
  ImportLeads,
  LeadsInHold,
  ImportHistory,
  Login,
  Unauthorized,
  NotFound,
} from "./_root/pages";
import RootLayout from "./_root/RootLayout";
import "./App.css";
import { useContext, useState } from "react";
import { UserContext } from "./context/UserContext";

function ProtectedRoute({ userData, children }) {
  if (!userData) {
    return <Navigate to="/unathorized" replace />;
  }
  return children ? children : <Outlet />;
}

function ProtectedAdminRoute({ userData, children }) {
  if (userData && userData.role === "Buyer") {
    return <Navigate to="/unathorized" replace />;
  }
  return children ? children : <Outlet />;
}

function App() {
  const { userData, setUserData } = useContext(UserContext);

  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route element={<ProtectedRoute userData={userData} />}>
            <Route element={<ProtectedAdminRoute userData={userData} />}>
              <Route path="/domains" element={<Domains />} />
              <Route path="/spends" element={<Spends />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/logs" element={<Logs />} />
            </Route>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/funnels" element={<Funnels />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/duplicates" element={<Duplicates />} />
            <Route path="/statuses" element={<Statuses />} />
            <Route path="/import-leads" element={<ImportLeads />} />
            <Route path="/leads-in-hold" element={<LeadsInHold />} />
            <Route path="/import-history" element={<ImportHistory />} />
          </Route>
        </Route>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unathorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
