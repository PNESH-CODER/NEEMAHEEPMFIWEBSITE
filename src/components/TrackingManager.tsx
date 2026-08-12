import React, { useState, useEffect } from 'react';
import CookieConsentBanner from './CookieConsentBanner';
import CookiePreferencesModal from './CookiePreferencesModal';
import FinancialQuizModal from './FinancialQuizModal';
import PushNotificationOptIn from './PushNotificationOptIn';
import { initializeTrackingScripts } from '../services/trackingService';
import { popupManager } from '../lib/popupManager';

export default function TrackingManager() {
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  useEffect(() => {
    // Initialize tracking scripts based on existing consent
    initializeTrackingScripts();

    // Event listeners for global triggers
    const handleOpenCookieModal = () => {
      if (popupManager.registerOpen('cookie_modal')) {
        setIsCookieModalOpen(true);
      }
    };
    const handleOpenQuizModal = () => {
      if (popupManager.registerOpen('quiz_modal')) {
        setIsQuizModalOpen(true);
      }
    };

    window.addEventListener('neema_open_cookie_modal', handleOpenCookieModal);
    window.addEventListener('neema_open_quiz_modal', handleOpenQuizModal);

    return () => {
      window.removeEventListener('neema_open_cookie_modal', handleOpenCookieModal);
      window.removeEventListener('neema_open_quiz_modal', handleOpenQuizModal);
    };
  }, []);

  const handleCloseCookieModal = () => {
    setIsCookieModalOpen(false);
    popupManager.registerClose('cookie_modal');
  };

  const handleCloseQuizModal = () => {
    setIsQuizModalOpen(false);
    popupManager.registerClose('quiz_modal');
  };

  return (
    <>
      <CookieConsentBanner />
      <PushNotificationOptIn />
      
      <CookiePreferencesModal
        isOpen={isCookieModalOpen}
        onClose={handleCloseCookieModal}
      />

      <FinancialQuizModal
        isOpen={isQuizModalOpen}
        onClose={handleCloseQuizModal}
      />
    </>
  );
}
