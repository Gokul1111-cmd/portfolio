import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * SectionRedirect - Redirects to home page and scrolls to specific section
 * This allows sharing http://yoursite.com/about, /skills, /projects etc as direct links
 */
export const SectionRedirect = ({ sectionId }) => {
  const navigate = useNavigate();
  const params = useParams();
  
  // Use sectionId prop or fallback to route param
  const targetSection = sectionId || params.section || 'hero';

  useEffect(() => {
    // Navigate to home
    navigate('/', { replace: true });
    
    // Scroll to target section after navigation
    setTimeout(() => {
      const section = document.getElementById(targetSection);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, [navigate, targetSection]);

  return null;
};

export default SectionRedirect;
