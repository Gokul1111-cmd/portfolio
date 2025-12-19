import { motion } from "framer-motion";
import { Save, Mail } from "lucide-react";
import { useState, useEffect } from "react";

export const ContactEditor = () => {
  const [contactData, setContactData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const res = await fetch("/api/content?key=contact");
      if (res.ok) {
        const data = await res.json();
        setContactData(data?.data ? data.data : {});
      }
    } catch (error) {
      console.error("Failed to load", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/content?key=contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: contactData }),
      });
      if (res.ok) alert("Saved!");
    } catch (error) {
      alert("Failed to save");
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Mail className="text-primary" /> Contact
      </h2>
      <div className="bg-card border border-border rounded-xl p-8 shadow-lg max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <input
              className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              value={contactData.email || ""}
              onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Phone</label>
            <input
              className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              value={contactData.phone || ""}
              onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Location</label>
            <input
              className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              value={contactData.location || ""}
              onChange={(e) => setContactData({ ...contactData, location: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">LinkedIn URL</label>
            <input
              className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              value={contactData.linkedin || ""}
              onChange={(e) => setContactData({ ...contactData, linkedin: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">GitHub URL</label>
            <input
              className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              value={contactData.github || ""}
              onChange={(e) => setContactData({ ...contactData, github: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Twitter URL</label>
            <input
              className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
              value={contactData.twitter || ""}
              onChange={(e) => setContactData({ ...contactData, twitter: e.target.value })}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
            >
              <Save size={16} /> Save
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
