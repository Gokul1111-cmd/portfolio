import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

export const NewsletterCTA = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      // Store in Firestore via API
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Thanks for subscribing! Check your inbox soon.");
        setEmail("");
      } else {
        const data = await response.json();
        setStatus("error");
        setMessage(data.error || "Subscription failed. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network error. Please try again later.");
      console.error("Newsletter subscription error:", error);
    }
  };

  return (
    <div className="my-16 md:my-20 p-8 md:p-10 border rounded-xl bg-card/50 backdrop-blur">
      <div className="max-w-xl mx-auto text-center space-y-4">
        <Mail size={32} className="mx-auto text-primary" />
        <h3 className="text-2xl font-bold">Love this content?</h3>
        <p className="text-muted-foreground">
          Get exclusive tutorials, behind-the-scenes insights, and early access to new posts delivered to your inbox.
        </p>
        
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={status === "loading" || status === "success"}
            className="flex-1 px-4 py-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Subscribe"}
          </button>
        </form>

        {/* Status Messages */}
        {status === "success" && (
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 text-sm">
            <CheckCircle size={16} />
            <span>{message}</span>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={16} />
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterCTA;
