import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export const Login = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Verify against the environment variable set in .env
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      localStorage.setItem("admin_auth", "true");
      navigate("/admin");
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground relative overflow-hidden" data-admin-page>
      {/* Background decoration matching your theme */}
      <div className="absolute inset-0 bg-primary/5 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-8 bg-card/50 backdrop-blur-xl border border-border rounded-2xl shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Lock size={24} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter Access Code"
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors shadow-lg shadow-primary/20"
          >
            Enter Dashboard
          </button>
        </form>
      </motion.div>
    </div>
  );
};
