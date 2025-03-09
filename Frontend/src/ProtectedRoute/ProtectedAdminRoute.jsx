import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const isAdminAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true";

  return isAdminAuthenticated ? <Outlet /> : <Navigate to="/AdminLogin" replace />;
};

export default ProtectedAdminRoute;