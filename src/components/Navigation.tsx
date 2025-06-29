import React, { useState } from 'react';
import { Home, Heart, Trophy, BookOpen, Sparkles, Leaf, Bookmark, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '../contexts/LocalizationContext';
import { getFavoriteResponses } from '../lib/checkInResponses';

type View = 'dashboard' | 'checkin' | 'wins' | 'journal' | 'affirmations' | 'resources' | 'favorites';

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const { t } = useLocalization();
  const favoriteCount = getFavoriteResponses().length;
  const [isExpanded, setIsExpanded] = useState(false);
  
  const navItems = [
    { id: 'dashboard', icon: Home, label: t('home') },
    { id: 'checkin', icon: Heart, label: t('checkIn') },
    { id: 'wins', icon: Trophy, label: t('wins') },
    { id: 'journal', icon: BookOpen, label: t('journal') },
    { id: 'affirmations', icon: Sparkles, label: t('affirm') },
    { id: 'resources', icon: Leaf, label: t('garden') },
  ] as const;

  // Add favorites to nav if user has any saved
  const allNavItems = favoriteCount > 0 
    ? [...navItems, { id: 'favorites' as const, icon: Bookmark, label: 'Saved' }]
    : navItems;

  // Show only first 4 items when collapsed, rest when expanded
  const visibleItems = isExpanded ? allNavItems : allNavItems.slice(0, 4);
  const hasMoreItems = allNavItems.length > 4;

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-sm border-t border-sage-100 safe-area-pb">
      {/* Toggle Button - only show if there are more than 4 items */}
      {hasMoreItems && (
        <div className="flex justify-center border-b border-sage-100">
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-sage-600 hover:text-terracotta-500 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      )}

      {/* Navigation Items */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isExpanded ? 'expanded' : 'collapsed'}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-around py-2 px-2"
        >
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors touch-target min-w-0 flex-1 relative ${
                  isActive 
                    ? 'text-terracotta-600 bg-terracotta-50' 
                    : 'text-sage-600 hover:text-terracotta-500 hover:bg-sage-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'fill-current' : ''} flex-shrink-0`} />
                <span className="text-xs mt-1 font-medium truncate w-full text-center">{item.label}</span>
                
                {/* Badge for favorites count */}
                {item.id === 'favorites' && favoriteCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-terracotta-500 text-white text-xs rounded-full flex items-center justify-center"
                  >
                    {favoriteCount > 9 ? '9+' : favoriteCount}
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Collapsed Items Indicator */}
      {hasMoreItems && !isExpanded && (
        <div className="absolute top-1 right-4">
          <div className="w-2 h-2 bg-terracotta-400 rounded-full animate-pulse"></div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;