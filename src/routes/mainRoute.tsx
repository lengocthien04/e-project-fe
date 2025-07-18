import { Suspense, useContext } from "react";
import { Navigate, Outlet, RouteObject } from "react-router-dom";
import { AppContext } from "../contexts/app.context";
import LoadingWithEmptyContent from "../components/loading/LoadingWithEmptyContent";
import mainPath from "../configs/constants/path";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";

function MainRouteWrapper() {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? (
    <MainLayout>
      <Suspense fallback={<LoadingWithEmptyContent />}>
        <Outlet />
      </Suspense>
    </MainLayout>
  ) : (
    <Navigate to={mainPath.login} />
  );
}

const MainRoute: RouteObject = {
  path: "",
  element: <MainRouteWrapper />,
  children: [
    {
      path: mainPath.home,
      element: <HomePage />,
    },
  ],
};

export default MainRoute;
