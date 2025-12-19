import {
  ArrowUp,
  Linkedin,
  Instagram,
  Youtube,
  Github,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [siteData, setSiteData] = useState({
    brandName: "Gokul A",
    brandBio: "Full-stack developer passionate about AI, cloud computing, and building impactful digital solutions.",
    footerSocialLinks: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/gokulanbalagan1112/" },
      { label: "Instagram", href: "#" },
      { label: "YouTube", href: "#" },
      { label: "GitHub", href: "https://github.com/Gokul1111-cmd" },
    ],
    footerQuickLinks: [
      { name: "Home", href: "#home" },
      { name: "About", href: "#about" },
      { name: "Skills", href: "#skills" },
      { name: "Projects", href: "#projects" },
    ],
    contactInfo: { email: "gokulanbalagan1112@gmail.com", phone: "+91 8754740118", location: "Coimbatore, Tamil Nadu, India" },
    footerPolicyLinks: [
      { name: "Privacy", href: "#" },
      { name: "Terms", href: "#" },
      { name: "Cookies", href: "#" },
    ],
    copyrightText: `© ${currentYear} Gokul A. All rights reserved.`,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const res = await fetch("/api/content?key=site");
        if (res.ok) {
          const data = await res.json();
          if (data?.data) {
            setSiteData((prev) => ({ ...prev, ...data.data }));
          }
        }
      } catch (error) {
        console.error("Footer settings fetch failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteSettings();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <footer id="contact" className="px-6 py-12 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Glass background container */}
        <motion.div 
          className="backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 rounded-xl p-8 border border-white/20 dark:border-gray-700/50 shadow-lg"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Branding */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{siteData.brandName}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {siteData.brandBio}
              </p>
              <div className="flex space-x-4">
                {(siteData.footerSocialLinks || []).map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-300"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.label === "LinkedIn" && <Linkedin size={18} />}
                    {social.label === "Instagram" && <Instagram size={18} />}
                    {social.label === "YouTube" && <Youtube size={18} />}
                    {social.label === "GitHub" && <Github size={18} />}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div variants={itemVariants}>
              <h4 className="text-gray-900 dark:text-white font-medium mb-4 text-sm uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-3">
                {(siteData.footerQuickLinks || []).map((link, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a 
                      href={link.href} 
                      className="hover:text-gray-900 dark:hover:text-white transition-colors duration-300 text-sm text-gray-600 dark:text-gray-300"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div variants={itemVariants}>
              <h4 className="text-gray-900 dark:text-white font-medium mb-4 text-sm uppercase tracking-wider">Contact</h4>
              <ul className="space-y-3">
                <motion.li 
                  className="flex items-start space-x-3 text-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-gray-600 dark:text-gray-400 mt-0.5"><Mail size={16} /></span>
                  <a 
                    href={`mailto:${siteData.contactInfo?.email || ""}`}
                    className="hover:text-gray-900 dark:hover:text-white transition-colors duration-300 text-gray-600 dark:text-gray-300"
                  >
                    {siteData.contactInfo?.email}
                  </a>
                </motion.li>
                <motion.li 
                  className="flex items-start space-x-3 text-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-gray-600 dark:text-gray-400 mt-0.5"><Phone size={16} /></span>
                  <a 
                    href={`tel:${siteData.contactInfo?.phone?.replace(/\s/g, '') || ""}`}
                    className="hover:text-gray-900 dark:hover:text-white transition-colors duration-300 text-gray-600 dark:text-gray-300"
                  >
                    {siteData.contactInfo?.phone}
                  </a>
                </motion.li>
                {siteData.contactInfo?.location && (
                  <motion.li 
                    className="flex items-start space-x-3 text-sm"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-gray-600 dark:text-gray-400 mt-0.5"><MapPin size={16} /></span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {siteData.contactInfo.location}
                    </span>
                  </motion.li>
                )}
              </ul>
            </motion.div>


          </div>

          {/* Bottom bar */}
          <motion.div 
            className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700/50 flex flex-col items-center text-xs text-gray-600 dark:text-gray-400 space-y-4 sm:space-y-0 sm:flex-row sm:justify-center sm:gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div>
              <p>{siteData.copyrightText}</p>
            </div>
            
            <div className="flex items-center gap-4">
              {(siteData.footerPolicyLinks || []).map((link, index) => (
                <a key={index} href={link.href} className="hover:text-gray-900 dark:hover:text-white transition-colors">{link.name}</a>
              ))}
            </div>

            <motion.a
              href="#hero"
              aria-label="Back to top"
              className="p-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp size={16} />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};