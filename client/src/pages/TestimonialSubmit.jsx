/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Send,
  Quote,
  ShieldCheck,
  Sparkles,
  Upload,
  User,
  Briefcase,
} from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { StarBackground } from "@/components/StarBackground";
import { storage } from "@/lib/firebaseClient";

const relationshipOptions = [
  "Client",
  "Colleague",
  "Teammate",
  "Manager / Lead",
  "Vendor / Partner",
  "Mentor",
];

const roleOptions = [
  "Client",
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full-stack Developer",
  "UI/UX Designer",
  "Graphic Designer",
  "Data / AI Engineer",
  "QA / Tester",
  "Intern / Entry-level Engineer",
  "Student / Graduate",
  "Sales / GTM",
  "Other",
];

const PreviewCard = ({ data }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card/70 border border-border rounded-2xl p-6 shadow-lg backdrop-blur-sm"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="h-12 w-12 rounded-full border border-primary/40 overflow-hidden bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">
        {data.image ? (
          <img
            src={data.image}
            alt={data.name || "Profile"}
            className="w-full h-full object-cover"
          />
        ) : (
          (data.name || "?").charAt(0).toUpperCase()
        )}
      </div>
      <div>
        <p className="text-base font-semibold">{data.name || "Your Name"}</p>
        <p className="text-xs text-muted-foreground">
          {data.role || "Role / Title"}{" "}
          {data.relationship ? `• ${data.relationship}` : ""}
        </p>
      </div>
    </div>

    <div className="flex gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < (data.rating ?? 0)
              ? "text-yellow-400 fill-yellow-400"
              : "text-muted-foreground/30"
          }
        />
      ))}
    </div>

    <p className="text-sm text-muted-foreground leading-relaxed italic">
      {data.content ||
        "“Your testimonial will appear here. Keep it concise and specific.”"}
    </p>
  </motion.div>
);

export const TestimonialSubmit = () => {
  const [formData, setFormData] = useState({
    name: "",
    role: "Client / Stakeholder",
    relationship: "Client",
    rating: 0,
    content: "",
    image: "",
    link: "",
    honeypot: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [imageDragActive, setImageDragActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus({ type: "error", msg: "Please choose an image file." });
      return;
    }

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > 15) {
      setStatus({ type: "error", msg: "Max image size is 15 MB." });
      return;
    }

    try {
      setUploadingImage(true);
      setStatus({
        type: "info",
        msg: "Uploading image to Firebase Storage...",
      });

      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${file.name}`;
      const storageRef = ref(storage, `testimonials/${uniqueName}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      setFormData((p) => ({ ...p, image: downloadUrl }));
      setStatus({ type: "success", msg: "Image uploaded. Ready to submit." });
    } catch (error) {
      console.error("Image upload failed", error);
      setStatus({
        type: "error",
        msg: "Image upload failed. Please try again.",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const getDropZoneProps = (setActive, fileHandler) => ({
    onDragOver: (e) => {
      e.preventDefault();
      setActive(true);
    },
    onDragLeave: () => setActive(false),
    onDrop: (e) => {
      e.preventDefault();
      setActive(false);
      fileHandler(e.dataTransfer.files?.[0]);
    },
  });

  const dropZoneClass = (active) =>
    `grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-stretch p-3 rounded-lg border-2 border-dashed transition-all ${
      active
        ? "border-primary bg-primary/10 scale-[1.01]"
        : "border-border bg-background/50 hover:border-primary/50"
    }`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (formData.honeypot) return; // basic bot trap

    if (
      !formData.name.trim() ||
      !formData.content.trim() ||
      !formData.image.trim()
    ) {
      setStatus({
        type: "error",
        msg: "Name, testimonial, and profile photo are required.",
      });
      return;
    }

    if (uploadingImage) {
      setStatus({
        type: "info",
        msg: "Please wait for the image upload to finish.",
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        relationship: formData.relationship,
        rating: formData.rating,
        content: formData.content.trim(),
        image: formData.image,
        link: formData.link.trim(),
      };

      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit testimonial");

      setStatus({
        type: "success",
        msg: "Thank you! Your testimonial is now live on the portfolio.",
      });
      setSubmitted(true);
      setFormData({
        name: "",
        role: "Client / Stakeholder",
        relationship: "Client",
        rating: 0,
        content: "",
        image: "",
        link: "",
        honeypot: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        msg: "Could not submit right now. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <StarBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />

      <div className="relative max-w-6xl mx-auto px-4 py-16 lg:py-20 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles size={14} /> Share Your Experience
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Add Your Testimonial
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This page is just for people who worked with me—clients, teammates,
            managers. Your words publish instantly to the portfolio.
          </p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/80 border border-border rounded-2xl p-8 shadow-xl backdrop-blur-xl text-center space-y-4 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              <Sparkles size={16} /> Thanks for sharing
            </div>
            <h2 className="text-2xl font-bold">Your testimonial is now live</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Appreciate your time—your words are already visible on the
              portfolio. If you want to add another, you can submit again below.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setStatus(null);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              Share another testimonial
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <PreviewCard data={formData} />
              <div className="bg-card/70 border border-border rounded-2xl p-4 flex items-start gap-3 text-sm text-muted-foreground backdrop-blur-sm">
                <ShieldCheck className="text-primary" size={18} />
                <div>
                  <p className="font-semibold text-foreground mb-1">
                    Who can submit?
                  </p>
                  <p>
                    Clients, collaborators, teammates, managers, and partners.
                    Please keep it genuine and concise.
                  </p>
                </div>
              </div>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card/80 border border-border rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <User size={14} /> Full Name*
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Briefcase size={14} /> Role / Title*
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  >
                    {roleOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Relationship
                  </label>
                  <select
                    value={formData.relationship}
                    onChange={(e) =>
                      setFormData({ ...formData, relationship: e.target.value })
                    }
                    className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  >
                    {relationshipOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() =>
                          setFormData({ ...formData, rating: value })
                        }
                        className="p-1"
                        aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                      >
                        <Star
                          size={22}
                          className={
                            value <= formData.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-muted-foreground"
                          }
                        />
                      </button>
                    ))}
                    <span className="text-sm font-semibold text-muted-foreground ml-2">
                      {formData.rating}/5
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Quote size={14} /> Testimonial*
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none resize-none"
                  placeholder="What was it like working together? What results stood out?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">
                    LinkedIn / Website (optional)
                  </label>
                  <input
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Upload size={14} /> Profile Image*
                  </label>
                  <div
                    {...getDropZoneProps(setImageDragActive, handleImageFile)}
                    className={dropZoneClass(imageDragActive)}
                  >
                    <input
                      required
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="w-full p-3 sm:h-12 rounded-lg bg-background border border-border focus:border-primary outline-none"
                      placeholder="Image URL (auto-filled after upload)"
                    />
                    <label className="w-full sm:w-auto sm:h-12 inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold border border-border rounded-lg bg-background cursor-pointer hover:border-primary text-center">
                      <Upload size={14} />{" "}
                      {uploadingImage ? "Uploading..." : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFile(e.target.files?.[0])}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <input
                type="text"
                value={formData.honeypot}
                onChange={(e) =>
                  setFormData({ ...formData, honeypot: e.target.value })
                }
                className="hidden"
                tabIndex="-1"
                autoComplete="off"
              />

              {status && (
                <div
                  className={`p-3 rounded-lg border text-sm ${
                    status.type === "error"
                      ? "border-destructive/40 bg-destructive/10 text-destructive"
                      : status.type === "success"
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-500"
                        : "border-primary/30 bg-primary/5 text-primary"
                  }`}
                >
                  {status.msg}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || uploadingImage}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                <Send size={16} />
                {submitting
                  ? "Sending..."
                  : uploadingImage
                    ? "Wait for upload"
                    : "Share Testimonial"}
              </button>
            </motion.form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialSubmit;
