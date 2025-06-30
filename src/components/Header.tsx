import React, { useState } from 'react';
import { Heart, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLocalization } from '../contexts/LocalizationContext';
import AuthModal from './Auth/AuthModal';
import ProfileMenu from './Auth/ProfileMenu';

interface HeaderProps {
  onEmergency: () => void;
  onGuestContinue?: () => void;
  onNavigateHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onEmergency, onGuestContinue, onNavigateHome }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading, isGuest } = useAuth();
  const { t } = useLocalization();

  const handleAuthModalOpen = () => {
    setShowAuthModal(true);
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  const handleTitleClick = () => {
    if (onNavigateHome) {
      onNavigateHome();
    }
  };

  return (
    <>
      <header className="bg-white/90 backdrop-blur-sm border-b border-sage-100 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10">
        <div className="flex-between">
          <motion.button
            onClick={handleTitleClick}
            className="flex-start space-x-2 min-w-0 flex-1 text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-terracotta-500 fill-current flex-shrink-0" />
            <h1 className="text-lg sm:text-xl font-serif font-medium text-sage-800 truncate hover:text-terracotta-600 transition-colors">
              {t('appName')}
            </h1>
          </motion.button>

          <div className="flex-end space-x-2 sm:space-x-3">
            <motion.button
              onClick={onEmergency}
              className="p-2 rounded-full bg-lavender-100 text-lavender-700 hover:bg-lavender-200 transition-colors touch-target"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Soft Landing - Emergency Comfort"
            >
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            {!loading && (
              <>
                {user ? (
                  <ProfileMenu />
                ) : !isGuest ? (
                  <motion.button
                    onClick={handleAuthModalOpen}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 sm:px-4 py-2 text-white rounded-full text-sm font-medium transition-all touch-target"
                    style={{ backgroundColor: '#E9A8A6' }}
                  >
                    {t('signIn')}
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleAuthModalOpen}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 sm:px-4 py-2 bg-sage-100 text-sage-700 rounded-full text-sm font-medium hover:bg-sage-200 transition-all touch-target"
                  >
                    Save Journey
                  </motion.button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleAuthModalClose}
        onGuestContinue={onGuestContinue}
        showMigrationMessage={isGuest}
      />
    </>
  );
};

export default Header;