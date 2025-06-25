import React from "react";
import Home from "./pages/Home";
import { LoadingProvider } from "context/LoadingContext";
import { LoadingOverlay } from "components/ui/LoadingOverlay";

function App() {
    return (
        <div className="App">
          <LoadingProvider>
            <LoadingOverlay />
            <Home />
          </LoadingProvider>
        </div>
    );
}

export default App;
