import { useContext } from "react";
import { Navigate, Outlet, RouteObject } from "react-router-dom";
import { AppContext } from "../contexts/app.context";
import mainPath from "../configs/constants/path";
import LoginPage from "@/pages/LoginPage";

function AuthenticationRouteWrapper() {
  const { isAuthenticated } = useContext(AppContext);
  return !isAuthenticated ? <Outlet /> : <Navigate to={mainPath.home} />;
}

const AuthenticationRoute: RouteObject = {
  path: "",
  element: <AuthenticationRouteWrapper />,
  children: [
    {
      path: mainPath.login,
      element: <LoginPage />,
    },
  ],
};

export default AuthenticationRoute;
