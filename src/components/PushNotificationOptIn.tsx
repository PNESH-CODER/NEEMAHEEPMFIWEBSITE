import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, CheckCircle2 } from 'lucide-react';
import { popupManager } from '../lib/popupManager';

export default function PushNotificationOptIn() {
  const [isOpen, setIsOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    const dismissed = localStorage.getItem('neema_push_dismissed');
    const isGranted = Notification.permission === 'granted';

    if (isGranted) {
      setSubscribed(true);
      return;
    }

    if (!dismissed && Notification.permission !== 'denied') {
      const timer = setTimeout(() => {
        if (popupManager.registerOpen('push_optin')) {
          setIsOpen(true);
        }
      }, 12000); // Trigger after 12s engagement
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubscribe = async () => {
    if (!('Notification' in window)) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setSubscribed(true);
        setIsOpen(false);
        popupManager.registerClose('push_optin');
        localStorage.setItem('neema_push_granted', 'true');
        new Notification('NEEMA HEEP Alerts Enabled!', {
          body: 'You will now receive desktop alerts for loan rates, SACCO dividend notices, and funding intakes.',
          icon: '/favicon.ico',
        });
      } else {
        handleDismiss();
      }
    } catch (e) {
      console.error(e);
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    popupManager.registerClose('push_optin');
    localStorage.setItem('neema_push_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && !subscribed && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="fixed bottom-24 left-4 z-[80] bg-white border border-[#074504]/20 rounded-[2rem] p-4 shadow-2xl max-w-sm w-full"
        >
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#074504] text-white flex items-center justify-center shrink-0 shadow-md">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="space-y-1 pr-4">
              <h4 className="text-xs font-black text-[#074504] uppercase tracking-wider">
                Enable Instant Financing Alerts
              </h4>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                Get desktop alerts for new loan programs, dividend declarations, and priority intake notices after you leave.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
            <button
              onClick={handleSubscribe}
              className="flex-1 bg-[#074504] hover:bg-[#599200] text-white text-[11px] font-black uppercase tracking-wider py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C0991B]" />
              <span>Allow Notifications</span>
            </button>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 text-[11px] font-bold uppercase tracking-wider px-3 py-2"
            >
              Later
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
