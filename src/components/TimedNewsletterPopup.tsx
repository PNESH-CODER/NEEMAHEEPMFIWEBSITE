import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, ArrowRight } from 'lucide-react';
import { useLeads } from '../hooks/useLeads';
import { useNavigate } from 'react-router-dom';
import VerificationModal from './VerificationModal';
import { popupManager } from '../lib/popupManager';

export default function TimedNewsletterPopup() {
  const { submitLead } = useLeads();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const handleGlobalInputInteraction = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')
      ) {
        if (!target.closest('#timed-newsletter-form-container')) {
          sessionStorage.setItem('neema_interacted_form', 'true');
        }
      }
    };

    const handleUserInteraction = () => {
      sessionStorage.setItem('neema_page_interacted', 'true');
    };

    document.addEventListener('input', handleGlobalInputInteraction);
    window.addEventListener('scroll', handleUserInteraction, { passive: true });
    window.addEventListener('click', handleUserInteraction, { passive: true });

    const timer = setTimeout(() => {
      const isHomeOrAbout = window.location.pathname === '/' || 
                            window.location.pathname === '/about-us' || 
                            window.location.pathname === '/about';
      const hasInteracted = sessionStorage.getItem('neema_page_interacted') === 'true';
      const alreadyClosed = sessionStorage.getItem('neema_timed_newsletter_closed') === 'true';
      const alreadyInteracted = sessionStorage.getItem('neema_interacted_form') === 'true';
      const alreadySubscribed = localStorage.getItem('neema_newsletter_subscribed') === 'true';

      if (isHomeOrAbout && hasInteracted && !alreadyClosed && !alreadyInteracted && !alreadySubscribed && !isOpen && popupManager.canShow('newsletter')) {
        if (popupManager.registerOpen('newsletter')) {
          setIsOpen(true);
        }
      }
    }, 25000);

    return () => {
      document.removeEventListener('input', handleGlobalInputInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
      clearTimeout(timer);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    popupManager.registerClose('newsletter');
    sessionStorage.setItem('neema_timed_newsletter_closed', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email.');
      return;
    }

    if (!consent) {
      setError('You must consent to continue.');
      return;
    }

    setIsVerifying(true);
  };

  const handleVerifiedSubmit = async () => {
    setIsVerifying(false);
    setIsOpen(false);
    sessionStorage.setItem('neema_timed_newsletter_closed', 'true');
    localStorage.setItem('neema_newsletter_subscribed', 'true');
    
    try {
      await submitLead({
        type: 'Contact',
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        consentGiven: true,
        signupSource: 'Timed Newsletter Popup (Home Page)',
        details: {
          exitIntentCaptured: false,
          phoneEntered: !!formData.phone,
          timedPopup: true,
        }
      });
      navigate(`/thank-you?verified=true&email=${encodeURIComponent(formData.email)}&type=newsletter`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            {/* Soft dark background backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Newsletter popup box */}
            <motion.div
              id="timed-newsletter-form-container"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative bg-white rounded-[3rem] w-full max-w-lg p-8 md:p-10 shadow-2xl border border-[#074504]/5 overflow-hidden"
            >
              {/* Highlight bar */}
              <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-[#074504] to-[#C0991B]" />

              <button
                onClick={handleClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                id="close-newsletter-popup"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5 pr-4">
                  <span className="bg-[#C0991B]/20 text-[#074504] border border-[#C0991B]/10 text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-1 rounded-full inline-block">
                    Join Our Community
                  </span>
                  <h3 className="text-2xl font-black text-[#074504] uppercase tracking-tight pt-2 leading-tight">
                    Stay Connected With <br/>
                    <span className="text-[#C0991B]">Neema HEEP</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed pt-1">
                    Subscribe now to receive important notices about upcoming financial intakes, success stories, and program impact reports.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 p-3.5 rounded-xl text-red-600 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#074504] rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#074504] transition-all font-semibold"
                  />

                  <input
                    type="email"
                    required
                    placeholder="Your Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#074504] rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#074504] transition-all font-semibold"
                  />
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      required
                      className="mt-0.5 accent-[#074504] w-3.5 h-3.5 rounded border-gray-300 cursor-pointer"
                    />
                    <span className="text-[9px] text-gray-500 leading-normal uppercase font-black tracking-wider transition-colors group-hover:text-gray-700">
                      I agree to the <a href="/privacy-policy" target="_blank" className="underline font-bold text-[#074504]">Privacy Policy</a> and authorize safe communication.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#074504] hover:bg-[#599200] text-white font-black uppercase text-xs tracking-widest py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Subscribe Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <VerificationModal
        isOpen={isVerifying}
        email={formData.email}
        phone={formData.phone || undefined}
        onVerified={handleVerifiedSubmit}
        onClose={() => setIsVerifying(false)}
      />
    </>
  );
}
