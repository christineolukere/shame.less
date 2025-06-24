import React, { useState } from 'react';
import { Heart, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './Auth/AuthModal';
import ProfileMenu from './Auth/ProfileMenu';

interface HeaderProps {
  onEmergency: () => void;
}

const Header: React.FC<HeaderProps> = ({ onEmergency }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading } = useAuth();

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-sage-100 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heart className="w-6 h-6 text-terracotta-500 fill-current" />
          <h1 className="text-xl font-serif font-medium text-sage-800">
            shame.<span className="text-terracotta-500">less</span>
          </h1>
        </motion.div>

        <div className="flex items-center space-x-3">
          <motion.button
            onClick={onEmergency}
            className="p-2 rounded-full bg-lavender-100 text-lavender-700 hover:bg-lavender-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Soft Landing - Emergency Comfort"
          >
            <Shield className="w-5 h-5" />
          </motion.button>

          {!loading && (
            <>
              {user ? (
                <ProfileMenu />
              ) : (
                <motion.button
                  onClick={() => setShowAuthModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-terracotta-500 text-white rounded-lg text-sm font-medium hover:bg-terracotta-600 transition-colors"
                >
                  Sign In
                </motion.button>
              )}
            </>
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  );
};

export default Header;