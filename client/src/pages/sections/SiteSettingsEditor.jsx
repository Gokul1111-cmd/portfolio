/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import {
  Save,
  Settings,
  Linkedin,
  Instagram,
  Youtube,
  Github,
  Mail,
  Phone,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const defaultSiteSettings = {
  brandName: "Gokul A",
  brandBio:
    "Full-stack developer passionate about AI, cloud computing, and building impactful digital solutions.",
  navLinks: [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ],
  footerSocialLinks: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/gokulanbalagan1112/",
    },
    { label: "GitHub", href: "https://github.com/Gokul1111-cmd" },
  ],
  footerQuickLinks: [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
  ],
  footerPolicyLinks: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Cookies", href: "#" },
  ],
  contactInfo: {
    email: "gokulanbalagan1112@gmail.com",
    phone: "+91 8754740118",
    location: "Coimbatore, Tamil Nadu, India",
  },
  copyrightText: "© 2024 Gokul A. All rights reserved.",
};

// Live Footer Preview Component
const FooterPreview = ({ siteData }) => {
  return (
    <motion.div
      className="bg-card border border-border rounded-xl p-6 shadow-lg sticky top-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-sm font-bold mb-4 text-muted-foreground">
        Footer Preview
      </h3>

      {/* Simplified Footer Preview */}
      <div className="bg-background/80 rounded-lg p-4 text-xs space-y-4 border border-border/50">
        {/* Brand Section */}
        <div className="space-y-2 pb-4 border-b border-border/30">
          <p className="font-bold text-sm">
            {siteData.brandName || "Brand Name"}
          </p>
          <p className="text-muted-foreground text-xs line-clamp-2">
            {siteData.brandBio || "Brand bio appears here..."}
          </p>

          {/* Social Links */}
          <div className="flex gap-2 pt-2">
            {(siteData.footerSocialLinks || [])
              .slice(0, 4)
              .map((social, idx) => (
                <div
                  key={idx}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {social.label === "LinkedIn" && <Linkedin size={14} />}
                  {social.label === "Instagram" && <Instagram size={14} />}
                  {social.label === "YouTube" && <Youtube size={14} />}
                  {social.label === "GitHub" && <Github size={14} />}
                </div>
              ))}
          </div>
        </div>

        {/* Navigation Section */}
        <div className="pb-3 border-b border-border/30">
          <p className="font-bold text-xs uppercase mb-2 text-muted-foreground">
            Navigation
          </p>
          <ul className="space-y-1">
            {(siteData.footerQuickLinks || []).slice(0, 3).map((link, idx) => (
              <li
                key={idx}
                className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                {link.name || "Link"}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div className="pb-3 border-b border-border/30">
          <p className="font-bold text-xs uppercase mb-2 text-muted-foreground">
            Contact
          </p>
          <ul className="space-y-1">
            {siteData.contactInfo?.email && (
              <li className="text-muted-foreground flex items-center gap-1">
                <Mail size={12} className="flex-shrink-0" />{" "}
                {siteData.contactInfo.email}
              </li>
            )}
            {siteData.contactInfo?.phone && (
              <li className="text-muted-foreground flex items-center gap-1">
                <Phone size={12} className="flex-shrink-0" />{" "}
                {siteData.contactInfo.phone}
              </li>
            )}
          </ul>
        </div>

        {/* Bottom Section */}
        <div className="pt-3 border-t border-border/30 text-muted-foreground">
          <p className="text-xs mb-2">
            {siteData.copyrightText || "© YEAR. All rights reserved."}
          </p>
          <div className="flex gap-2 text-xs">
            {(siteData.footerPolicyLinks || []).slice(0, 2).map((link, idx) => (
              <span key={idx} className="hover:text-primary cursor-pointer">
                {link.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const SiteSettingsEditor = () => {
  const [siteData, setSiteData] = useState(defaultSiteSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSiteSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/content?key=site");
      if (res.ok) {
        const data = await res.json();
        if (data?.data) {
          setSiteData({ ...defaultSiteSettings, ...data.data });
        } else {
          setSiteData(defaultSiteSettings);
        }
      } else {
        setSiteData(defaultSiteSettings);
      }
    } catch (error) {
      console.error("Failed to load site settings", error);
      setSiteData(defaultSiteSettings);
      setError("Failed to load site settings. Using defaults.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSiteSettings();
  }, [fetchSiteSettings]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/content?key=site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: siteData }),
      });
      if (res.ok) {
        setError("");
        alert("Site settings saved successfully!");
      } else {
        throw new Error("API returned error");
      }
    } catch (error) {
      console.error("Save failed", error);
      setError("Failed to save settings");
      alert("Failed to save");
    }
  };

  // Helper functions for array operations
  const updateNavLink = (index, field, value) => {
    const next = [...(siteData.navLinks || [])];
    next[index] = { ...next[index], [field]: value };
    setSiteData({ ...siteData, navLinks: next });
  };

  const addNavLink = () => {
    const next = [...(siteData.navLinks || []), { name: "", href: "" }];
    setSiteData({ ...siteData, navLinks: next });
  };

  const removeNavLink = (index) => {
    const next = [...(siteData.navLinks || [])];
    next.splice(index, 1);
    setSiteData({ ...siteData, navLinks: next });
  };

  const updateSocialLink = (index, field, value) => {
    const next = [...(siteData.footerSocialLinks || [])];
    next[index] = { ...next[index], [field]: value };
    setSiteData({ ...siteData, footerSocialLinks: next });
  };

  const addSocialLink = () => {
    const next = [
      ...(siteData.footerSocialLinks || []),
      { label: "", href: "" },
    ];
    setSiteData({ ...siteData, footerSocialLinks: next });
  };

  const removeSocialLink = (index) => {
    const next = [...(siteData.footerSocialLinks || [])];
    next.splice(index, 1);
    setSiteData({ ...siteData, footerSocialLinks: next });
  };

  const updateQuickLink = (index, field, value) => {
    const next = [...(siteData.footerQuickLinks || [])];
    next[index] = { ...next[index], [field]: value };
    setSiteData({ ...siteData, footerQuickLinks: next });
  };

  const addQuickLink = () => {
    const next = [...(siteData.footerQuickLinks || []), { name: "", href: "" }];
    setSiteData({ ...siteData, footerQuickLinks: next });
  };

  const removeQuickLink = (index) => {
    const next = [...(siteData.footerQuickLinks || [])];
    next.splice(index, 1);
    setSiteData({ ...siteData, footerQuickLinks: next });
  };

  const updatePolicyLink = (index, field, value) => {
    const next = [...(siteData.footerPolicyLinks || [])];
    next[index] = { ...next[index], [field]: value };
    setSiteData({ ...siteData, footerPolicyLinks: next });
  };

  const addPolicyLink = () => {
    const next = [
      ...(siteData.footerPolicyLinks || []),
      { name: "", href: "" },
    ];
    setSiteData({ ...siteData, footerPolicyLinks: next });
  };

  const removePolicyLink = (index) => {
    const next = [...(siteData.footerPolicyLinks || [])];
    next.splice(index, 1);
    setSiteData({ ...siteData, footerPolicyLinks: next });
  };

  if (isLoading)
    return <div className="p-8 text-center">Loading site settings...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Settings className="text-primary" /> Site Settings
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Top Section - Preview & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left - Live Preview */}
        <div className="lg:col-span-1">
          <FooterPreview siteData={siteData} />
        </div>

        {/* Right - Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
            <form onSubmit={handleSave} className="space-y-8">
              {/* Brand Settings */}
              <div className="border-b border-border pb-6">
                <h3 className="text-lg font-bold mb-4">Brand Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Brand Name
                    </label>
                    <input
                      className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                      placeholder="e.g., Gokul A"
                      value={siteData.brandName || ""}
                      onChange={(e) =>
                        setSiteData({ ...siteData, brandName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Brand Bio
                    </label>
                    <textarea
                      rows={2}
                      className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                      value={siteData.brandBio || ""}
                      onChange={(e) =>
                        setSiteData({ ...siteData, brandBio: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="border-b border-border pb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Navigation Links</h3>
                  <button
                    type="button"
                    onClick={addNavLink}
                    className="text-xs text-primary hover:underline"
                  >
                    Add Link
                  </button>
                </div>
                <div className="space-y-3">
                  {(siteData.navLinks || []).map((link, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-3 gap-2 items-center"
                    >
                      <input
                        className="p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                        placeholder="Link name"
                        value={link.name || ""}
                        onChange={(e) =>
                          updateNavLink(idx, "name", e.target.value)
                        }
                      />
                      <input
                        className="col-span-2 p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                        placeholder="URL or anchor"
                        value={link.href || ""}
                        onChange={(e) =>
                          updateNavLink(idx, "href", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeNavLink(idx)}
                        className="text-xs text-destructive"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Social Links */}
              <div className="border-b border-border pb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Footer Social Links</h3>
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="text-xs text-primary hover:underline"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-3">
                  {(siteData.footerSocialLinks || []).map((link, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-3 gap-2 items-center"
                    >
                      <input
                        className="p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                        placeholder="Platform (LinkedIn, GitHub, etc)"
                        value={link.label || ""}
                        onChange={(e) =>
                          updateSocialLink(idx, "label", e.target.value)
                        }
                      />
                      <input
                        className="col-span-2 p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                        placeholder="URL"
                        value={link.href || ""}
                        onChange={(e) =>
                          updateSocialLink(idx, "href", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeSocialLink(idx)}
                        className="text-xs text-destructive"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Quick Links */}
              <div className="border-b border-border pb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Footer Quick Links</h3>
                  <button
                    type="button"
                    onClick={addQuickLink}
                    className="text-xs text-primary hover:underline"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-3">
                  {(siteData.footerQuickLinks || []).map((link, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-3 gap-2 items-center"
                    >
                      <input
                        className="p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                        placeholder="Link name"
                        value={link.name || ""}
                        onChange={(e) =>
                          updateQuickLink(idx, "name", e.target.value)
                        }
                      />
                      <input
                        className="col-span-2 p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                        placeholder="URL or anchor"
                        value={link.href || ""}
                        onChange={(e) =>
                          updateQuickLink(idx, "href", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeQuickLink(idx)}
                        className="text-xs text-destructive"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-b border-border pb-6">
                <h3 className="text-lg font-bold mb-4">Contact Info</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Email
                    </label>
                    <input
                      className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                      value={siteData.contactInfo?.email || ""}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          contactInfo: {
                            ...siteData.contactInfo,
                            email: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Phone
                    </label>
                    <input
                      className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                      value={siteData.contactInfo?.phone || ""}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          contactInfo: {
                            ...siteData.contactInfo,
                            phone: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Location
                    </label>
                    <input
                      className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                      value={siteData.contactInfo?.location || ""}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          contactInfo: {
                            ...siteData.contactInfo,
                            location: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Footer Policy Links */}
              <div className="border-b border-border pb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Footer Policy Links</h3>
                  <button
                    type="button"
                    onClick={addPolicyLink}
                    className="text-xs text-primary hover:underline"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-3">
                  {(siteData.footerPolicyLinks || []).map((link, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-3 gap-2 items-center"
                    >
                      <input
                        className="p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                        placeholder="Link name (Privacy, Terms, etc)"
                        value={link.name || ""}
                        onChange={(e) =>
                          updatePolicyLink(idx, "name", e.target.value)
                        }
                      />
                      <input
                        className="col-span-2 p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                        placeholder="URL"
                        value={link.href || ""}
                        onChange={(e) =>
                          updatePolicyLink(idx, "href", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removePolicyLink(idx)}
                        className="text-xs text-destructive"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Settings */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Copyright Text
                  </label>
                  <input
                    className="w-full p-2 rounded-md bg-background border border-border outline-none focus:border-primary"
                    placeholder="e.g., © YEAR Your Name. All rights reserved."
                    value={siteData.copyrightText || ""}
                    onChange={(e) =>
                      setSiteData({
                        ...siteData,
                        copyrightText: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                >
                  <Save size={16} /> Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
