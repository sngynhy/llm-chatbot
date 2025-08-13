import React from "react";
import Home from "./pages/Home";
import { LoadingProvider } from "context/LoadingContext";
import { LoadingOverlay } from "components/ui/LoadingOverlay";
import { mainBackColor } from "styles/Common";

function App() {
  return (
    <div className="App" style={{ backgroundColor: mainBackColor }}>
      <LoadingProvider>
        <LoadingOverlay />
        <Home />
      </LoadingProvider>
    </div>
  );
}

export default App;
