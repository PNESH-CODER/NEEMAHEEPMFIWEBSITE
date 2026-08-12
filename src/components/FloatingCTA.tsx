import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FloatingCTA() {
  const navigate = useNavigate();
  const location = useLocation();
  const [inWhoWeAreSection, setInWhoWeAreSection] = useState(false);

  const isDashboardOrPortal = location.pathname.startsWith('/admin') || 
                              location.pathname.startsWith('/staff-portal') || 
                              location.pathname === '/portal' ||
                              location.pathname.startsWith('/blog');

  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  const isAboutPage = location.pathname === '/about-us' || location.pathname === '/about';

  useEffect(() => {
    if (!isAboutPage) {
      setInWhoWeAreSection(false);
      return;
    }

    const checkWhoWeAre = () => {
      const el = document.getElementById('who-we-are-section');
      if (!el) {
        setInWhoWeAreSection(false);
        return;
      }
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Section is considered active when its top is within viewport threshold and bottom hasn't scrolled far past
      const isInView = rect.top < windowHeight * 0.75 && rect.bottom > 120;
      setInWhoWeAreSection(isInView);
    };

    window.addEventListener('scroll', checkWhoWeAre, { passive: true });
    window.addEventListener('resize', checkWhoWeAre, { passive: true });
    checkWhoWeAre();

    return () => {
      window.removeEventListener('scroll', checkWhoWeAre);
      window.removeEventListener('resize', checkWhoWeAre);
    };
  }, [location.pathname, isAboutPage]);

  if (isDashboardOrPortal) return null;

  return (
    <div className={`fixed z-40 flex flex-col items-end gap-2 pointer-events-none max-w-[calc(100vw-1.5rem)] transition-all duration-300 ${
      isHomePage 
        ? 'bottom-[4.25rem] right-3 sm:bottom-20 sm:right-6' 
        : 'bottom-4 right-3 md:bottom-6 md:right-6'
    }`}>
      {/* Request a Call Back Floating CTA (Hidden on Home Page and inside Who We Are section) */}
      <AnimatePresence>
        {!isHomePage && !inWhoWeAreSection && (
          <motion.button
            key="request-callback-floating"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, type: "spring", stiffness: 220, damping: 22 }}
            onClick={() => navigate('/request-callback')}
            className="pointer-events-auto flex items-center justify-center gap-2 bg-[#074504] hover:bg-[#053303] text-white py-2 px-3 sm:py-2.5 sm:px-4 rounded-full shadow-[0_8px_25px_rgba(0,77,64,0.4)] transition-transform hover:-translate-y-0.5 group border border-white/20 cursor-pointer"
            aria-label="Request a Call Back"
          >
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#599200] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs shrink-0">
              <PhoneCall className="w-3.5 h-3.5 text-white" />
            </span>
            <span className="font-extrabold text-[11px] sm:text-xs tracking-tight uppercase whitespace-nowrap">
              Request a Call Back
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
