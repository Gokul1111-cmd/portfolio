import { useState, useCallback } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login"; // NEW
import { AdminDashboard } from "./pages/AdminDashboard"; // NEW
import { TestimonialSubmit } from "./pages/TestimonialSubmit";
import { NotFound } from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import WelcomeScreen from "@/components/WelcomeScreen";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [welcomeComplete, setWelcomeComplete] = useState(false);

  const handleWelcomeComplete = useCallback(() => {
    setWelcomeComplete(true);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster />
      {/* Mount the app immediately; show Welcome as an overlay */}
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
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
