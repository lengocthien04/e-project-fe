import "./App.css";
import ScrollToTop from "./components/utils/ScrollToTop";
import { PrimeReactProvider } from "primereact/api";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import { AppProvider } from "./contexts/app.context";
import useRouteElements from "./hooks/useRouteElements";

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
        <AppProvider>
          <AppIner />
        </AppProvider>
      </PrimeReactProvider>
    </ScrollToTop>
  );
}

export default App;
