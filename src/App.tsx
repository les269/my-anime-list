import React from "react";
import "./App.css";
import MyRoute from "./my-route";
import { ToastProvider } from "utils/toast-service";

function App() {
  return (
    <div className="App">
      <ToastProvider>
        <MyRoute></MyRoute>
      </ToastProvider>
    </div>
  );
}

export default App;
