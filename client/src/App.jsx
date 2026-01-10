import { useState, useCallback, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login"; // NEW
import { AdminDashboard } from "./pages/AdminDashboard"; // NEW
import { TestimonialSubmit } from "./pages/TestimonialSubmit";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import { NotFound } from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import WelcomeScreen from "@/components/WelcomeScreen";
import CustomCursor from "@/components/CustomCursor";
import { Analytics } from "@vercel/analytics/react";
import { getSettings } from "@/lib/settingsClient";

function App() {
  const [welcomeComplete, setWelcomeComplete] = useState(false);

  const handleWelcomeComplete = useCallback(() => {
    setWelcomeComplete(true);
  }, []);

  // Preload settings on app mount to prevent race conditions (non-blocking)
  useEffect(() => {
    // Preload in background but don't block render
    getSettings().catch((err) => {
      console.warn("Settings preload failed:", err);
    });
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <CustomCursor />
      <Toaster />
      {/* Mount the app immediately; show Welcome as an overlay */}
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          {/* NEW ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/testimonial-submit" element={<TestimonialSubmit />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Analytics />
      </BrowserRouter>

      {!welcomeComplete && (
        <WelcomeScreen onWelcomeComplete={handleWelcomeComplete} />
      )}
    </ThemeProvider>
  );
}

export default App;
