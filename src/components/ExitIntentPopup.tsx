import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { X, FileText, AlertCircle, ArrowRight, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLeads } from '../hooks/useLeads';
import { trackEvent } from '../services/trackingService';
import CaptchaField from './CaptchaField';
import { popupManager } from '../lib/popupManager';

export default function ExitIntentPopup() {
  const location = useLocation();
  const { submitLead } = useLeads();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [consent, setConsent] = useState(true);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDashboardOrPortal = location.pathname.startsWith('/admin') || 
                              location.pathname.startsWith('/staff-portal') || 
                              location.pathname === '/portal' ||
                              location.pathname.startsWith('/blog');

  if (isDashboardOrPortal) return null;

  useEffect(() => {
    // 1. Global input monitor to check if user is already filling another form
    const handleGlobalInputInteraction = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')
      ) {
        if (!target.closest('#exit-intent-form-container')) {
          sessionStorage.setItem('neema_interacted_form', 'true');
        }
      }
    };

    // Track user page interaction (scroll, click, mouse movement)
    const handleUserInteraction = () => {
      sessionStorage.setItem('neema_page_interacted', 'true');
    };

    document.addEventListener('input', handleGlobalInputInteraction);
    window.addEventListener('scroll', handleUserInteraction, { passive: true });
    window.addEventListener('click', handleUserInteraction, { passive: true });
    window.addEventListener('mousemove', handleUserInteraction, { passive: true });

    // 2. Mouse leave / exit intent detection for Home or About Us pages
    const handleMouseLeave = (e: MouseEvent) => {
      const isHomeOrAbout = location.pathname === '/' || 
                            location.pathname === '/about-us' || 
                            location.pathname === '/about' ||
                            location.pathname === '/home';
      const hasInteracted = sessionStorage.getItem('neema_page_interacted') === 'true';
      const alreadyClosed = sessionStorage.getItem('neema_whitepaper_closed') === 'true';
      const alreadyInteracted = sessionStorage.getItem('neema_interacted_form') === 'true';

      if (!isHomeOrAbout) return;

      if (!hasInteracted || alreadyClosed || alreadyInteracted || isOpen || !popupManager.canShow('exit_intent')) {
        return;
      }

      if (e.clientY < 20) {
        if (popupManager.registerOpen('exit_intent')) {
          setIsOpen(true);
          trackEvent('exit_intent_whitepaper_shown');
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('input', handleGlobalInputInteraction);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('mousemove', handleUserInteraction);
    };
  }, [isOpen, location.pathname]);

  const handleClose = () => {
    setIsOpen(false);
    popupManager.registerClose('exit_intent');
    sessionStorage.setItem('neema_whitepaper_closed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!captchaVerified) {
      setError('Please solve the math security challenge.');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitLead({
        type: 'Resource',
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        consentGiven: true,
        signupSource: 'Exit Intent Whitepaper Popup',
        details: {
          whitepaperRequested: 'How to Maximize Your SACCO Dividends',
          downloadTimestamp: new Date().toISOString()
        }
      });

      trackEvent('whitepaper_downloaded', { email: formData.email });
      setIsSubmitting(false);
      setIsSubmitted(true);
      sessionStorage.setItem('neema_whitepaper_closed', 'true');
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'Error processing download request.');
    }
  };

  const handleDownloadPdf = () => {
    // Generate virtual blob PDF download for user
    const content = `NEEMA HEEP - SACCO Dividends & Micro-Financing Guide\n\nThank you for requesting this guide, ${formData.name}.\nKey Principles:\n1. Maximize monthly savings to increase dividend multiplier.\n2. Reinvest dividend yields into asset-backed micro-financing.\n3. Access 0% processing fees on early renewals.\n\nContact support@neemaheep.co.ke for consultation.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NEEMA_HEEP_SACCO_Dividends_Guide.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
          />

          <motion.div
            id="exit-intent-form-container"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative bg-white rounded-[3rem] w-full max-w-lg p-7 md:p-10 shadow-2xl border border-[#074504]/10 overflow-hidden"
          >
            {/* Gradient Top Accent */}
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#074504] via-[#599200] to-[#C0991B]" />

            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5 pr-6">
                  <span className="bg-[#C0991B]/20 text-[#074504] border border-[#C0991B]/20 text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-[#C0991B]" />
                    <span>Free Educational PDF Guide</span>
                  </span>
                  <h3 className="text-2xl font-black text-[#074504] uppercase tracking-tight pt-2 leading-tight">
                    How to Maximize Your <br />
                    <span className="text-[#C0991B]">SACCO Dividends & Yields</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    Before you go, claim our free 2026 playbook detailing how SACCO members optimize dividend payouts, interest rates, and loan multipliers.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 p-3 rounded-xl text-red-600 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2.5">
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

                  <input
                    type="tel"
                    placeholder="Phone Number (Optional)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#074504] rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#074504] transition-all font-semibold"
                  />
                </div>

                {/* Spam Protection */}
                <CaptchaField onVerified={setCaptchaVerified} />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#074504] hover:bg-[#599200] text-white font-black uppercase text-xs tracking-widest py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-[#C0991B]" />
                      <span>Download Free Whitepaper</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 bg-[#599200]/20 text-[#599200] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#074504] uppercase tracking-tight">Guide Unlocked!</h3>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-sm mx-auto mt-2">
                    We've sent a copy of <strong className="text-[#074504]">"How to Maximize Your SACCO Dividends"</strong> to <strong>{formData.email}</strong>.
                  </p>
                </div>

                <button
                  onClick={handleDownloadPdf}
                  className="bg-[#074504] hover:bg-[#599200] text-white text-xs font-black uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-md transition-all inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#C0991B]" />
                  <span>Download Guide Copy Now</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
