import { useRoutes } from "react-router-dom";
import MainRoute from "../routes/mainRoute";
import AuthenticationRoute from "../routes/authenticationRoute";

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: "",
      children: [MainRoute, AuthenticationRoute],
    },
  ]);
  return routeElements;
}
