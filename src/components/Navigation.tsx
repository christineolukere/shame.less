import React from 'react';
import { Home, Heart, Trophy, BookOpen, Sparkles, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocalization } from '../contexts/LocalizationContext';

type View = 'dashboard' | 'checkin' | 'wins' | 'journal' | 'affirmations' | 'resources';

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const { translations: t } = useLocalization();
  
  const navItems = [
    { id: 'dashboard', icon: Home, label: t.home },
    { id: 'checkin', icon: Heart, label: t.checkIn },
    { id: 'wins', icon: Trophy, label: t.wins },
    { id: 'journal', icon: BookOpen, label: t.journal },
    { id: 'affirmations', icon: Sparkles, label: t.affirm },
    { id: 'resources', icon: Leaf, label: t.garden },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-sm border-t border-sage-100 safe-area-pb">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors touch-target min-w-0 flex-1 ${
                isActive 
                  ? 'text-terracotta-600 bg-terracotta-50' 
                  : 'text-sage-600 hover:text-terracotta-500 hover:bg-sage-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'fill-current' : ''} flex-shrink-0`} />
              <span className="text-xs mt-1 font-medium truncate w-full text-center">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;