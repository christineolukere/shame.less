import React from 'react';
import { Heart, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onEmergency: () => void;
}

const Header: React.FC<HeaderProps> = ({ onEmergency }) => {
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

        <motion.button
          onClick={onEmergency}
          className="p-2 rounded-full bg-lavender-100 text-lavender-700 hover:bg-lavender-200 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Soft Landing - Emergency Comfort"
        >
          <Shield className="w-5 h-5" />
        </motion.button>
      </div>
    </header>
  );
};

export default Header;