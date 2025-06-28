import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Heart, Sparkles, Trophy, BookOpen, Bookmark } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { getFavoriteResponses } from '../lib/checkInResponses';

type View = 'dashboard' | 'checkin' | 'wins' | 'journal' | 'affirmations' | 'resources' | 'favorites';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, isGuest } = useAuth();
  const { translations: t } = useLocalization();
  const currentHour = new Date().getHours();
  const isEvening = currentHour >= 18 || currentHour < 6;
  const favoriteCount = getFavoriteResponses().length;
  
  const getPersonalizedGreeting = () => {
    const timeGreeting = currentHour < 12 ? t.goodMorning : currentHour < 17 ? t.goodAfternoon : t.goodEvening;
    
    if (user) {
      const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || t.friend;
      return `${timeGreeting}, ${displayName}`;
    } else if (isGuest) {
      return `${timeGreeting}, ${t.beautiful}`;
    } else {
      return `${timeGreeting}, ${t.beautiful}`;
    }
  };

  const quickActions = [
    {
      id: 'checkin',
      title: t.howAreYouFeeling,
      subtitle: 'Get personalized responses',
      icon: Heart,
      color: 'terracotta',
      action: () => onNavigate('checkin')
    },
    {
      id: 'wins',
      title: t.yourWins,
      subtitle: 'Big or small, it matters',
      icon: Trophy,
      color: 'sage',
      action: () => onNavigate('wins')
    },
    {
      id: 'journal',
      title: t.journalTitle,
      subtitle: 'Let it flow onto paper',
      icon: BookOpen,
      color: 'lavender',
      action: () => onNavigate('journal')
    },
    {
      id: 'affirmations',
      title: t.dailyAffirmations,
      subtitle: 'Words of love for you',
      icon: Sparkles,
      color: 'cream',
      action: () => onNavigate('affirmations')
    }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Personalized Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center space-x-2">
          {isEvening ? (
            <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-lavender-500 flex-shrink-0" />
          ) : (
            <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-cream-500 flex-shrink-0" />
          )}
          <h2 className="text-xl sm:text-2xl font-serif text-sage-800 truncate">{getPersonalizedGreeting()}</h2>
        </div>
        <p className="text-sm sm:text-base text-sage-600">
          {user ? t.welcomeBackToSafeSpace : t.worthyOfLove}
        </p>
      </motion.div>

      {/* Today's Gentle Reminder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-terracotta-50 to-cream-50 rounded-2xl p-4 sm:p-6 border border-terracotta-100"
      >
        <h3 className="font-serif text-base sm:text-lg text-terracotta-800 mb-2">{t.todaysReminder}</h3>
        <p className="text-sm sm:text-base text-terracotta-700 leading-relaxed">
          "Your healing is not linear, and that's perfectly okay. Every small step you take matters, 
          even when it doesn't feel like progress."
        </p>
      </motion.div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-serif text-sage-800">{t.howCanISupport}</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                onClick={action.action}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 sm:p-4 rounded-xl text-left transition-all bg-${action.color}-50 border border-${action.color}-100 hover:bg-${action.color}-100 touch-target`}
              >
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${action.color}-600 mb-2 flex-shrink-0`} />
                <h4 className={`font-medium text-${action.color}-800 text-sm leading-tight`}>{action.title}</h4>
                <p className={`text-${action.color}-600 text-xs mt-1 leading-tight`}>{action.subtitle}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Saved Favorites (if any) */}
      {favoriteCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-lavender-50 rounded-2xl p-4 sm:p-6 border border-lavender-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base sm:text-lg text-lavender-800 mb-2">Your saved combinations</h3>
              <p className="text-lavender-700 text-sm">
                {favoriteCount} personalized response{favoriteCount !== 1 ? 's' : ''} saved
              </p>
            </div>
            <motion.button
              onClick={() => onNavigate('favorites')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-lavender-100 text-lavender-700 rounded-lg hover:bg-lavender-200 transition-colors"
            >
              <Bookmark className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Growth Rings - Progress Visualization */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-sage-50 rounded-2xl p-4 sm:p-6 border border-sage-100"
      >
        <h3 className="font-serif text-base sm:text-lg text-sage-800 mb-4">{t.yourGrowthRings}</h3>
        <div className="flex items-center justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((ring, index) => (
            <motion.div
              key={ring}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 ${
                index < 3 
                  ? 'bg-sage-200 border-sage-400' 
                  : 'border-sage-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sage-600 text-sm text-center mt-3">
          3 {t.daysOfSelfCare}
        </p>
      </motion.div>
    </div>
  );
};

export default Dashboard;