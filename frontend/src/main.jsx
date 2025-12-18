import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// 🔹 Toast notifications (replaces alerts)
import { Toaster } from "sonner";

// 🔹 Global styles (if you already have index.css keep it)
import "./app.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <App />

      {/* Toast Provider */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand={false}
        duration={3000}
      />
    </>
  </StrictMode>
);
