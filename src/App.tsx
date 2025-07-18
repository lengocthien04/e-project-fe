import "./App.css";
import ScrollToTop from "./components/utils/ScrollToTop";
import { PrimeReactProvider } from "primereact/api";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import { AppProvider } from "./contexts/app.context";
import useRouteElements from "./hooks/useRouteElements";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client";

function AppIner() {
  const routes = useRouteElements();

  return (
    <div
      style={{
        minHeight: "inherit",
      }}
    >
      {routes}
    </div>
  );
}

function App() {
  return (
    <ScrollToTop>
      <PrimeReactProvider>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <AppIner />
          </AppProvider>
        </QueryClientProvider>
      </PrimeReactProvider>
    </ScrollToTop>
  );
}

export default App;
