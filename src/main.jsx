import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import MiniProjects from "./pages/MiniProjects.jsx";
import CustomCursor from "./components/CustomCursor.jsx";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        {/* These now exist globally across all pages */}
        <CustomCursor />
        <Toaster />

        <Routes>
          <Route path="/" element={<App />} />
          <Route path="mini-projects" element={<MiniProjects />} />
          <Route path="*" element={<div className="h-screen flex items-center justify-center text-white bg-[#0a0a0a]"><h1 className="text-4xl">404 | Page Not Found</h1></div>} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
