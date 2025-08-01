import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Heart, Sparkles, Trophy, BookOpen, Bookmark, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { getFavoriteResponses } from '../lib/checkInResponses';
import { GuestStorageManager } from '../lib/guestStorage';
import { supabase } from '../lib/supabase';
import { getCurrentTheme, getThemedGreeting, getThemedWisdom } from '../lib/themeManager';

type View = 'dashboard' | 'checkin' | 'wins' | 'journal' | 'affirmations' | 'resources' | 'favorites';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

interface UserProgress {
  checkInCount: number;
  journalCount: number;
  winCount: number;
  streakDays: number;
  totalDays: number;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, isGuest } = useAuth();
  const { t } = useLocalization();
  const currentTheme = getCurrentTheme();
  const [progress, setProgress] = useState<UserProgress>({
    checkInCount: 0,
    journalCount: 0,
    winCount: 0,
    streakDays: 0,
    totalDays: 0
  });
  const [showProgressTooltip, setShowProgressTooltip] = useState(false);
  const [showGrowthToast, setShowGrowthToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const currentHour = new Date().getHours();
  const isEvening = currentHour >= 18 || currentHour < 6;
  const favoriteCount = getFavoriteResponses().length;

  // Personalized greeting messages that rotate
  const greetingMessages = [
    "You made it, Beautiful Soul 🌸",
    "Hello, Soft Heart 💗",
    "Welcome, Gentle Spirit ✨",
    "So glad you're here 💛",
    "A moment just for you 🌿"
  ];
  
  // Get a random greeting based on the day
  const getRandomGreeting = () => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (24 * 60 * 60 * 1000));
    return greetingMessages[dayOfYear % greetingMessages.length];
  };

  useEffect(() => {
    loadUserProgress();
  }, [user, isGuest]);

  const loadUserProgress = async () => {
    try {
      if (isGuest) {
        // Load from local storage for guest users
        const guestData = GuestStorageManager.getGuestData();
        const checkInCount = guestData.checkIns.length;
        const journalCount = guestData.journalEntries.length;
        const winCount = guestData.wins.length;
        
        // Calculate streak and total days
        const allDates = [
          ...guestData.checkIns.map(c => c.timestamp),
          ...guestData.journalEntries.map(j => j.timestamp),
          ...guestData.wins.map(w => w.timestamp)
        ].map(timestamp => new Date(timestamp).toDateString());
        
        const uniqueDates = [...new Set(allDates)].sort();
        const totalDays = uniqueDates.length;
        const streakDays = calculateStreak(uniqueDates);
        
        setProgress({
          checkInCount,
          journalCount,
          winCount,
          streakDays,
          totalDays
        });
      } else if (user) {
        // Load from Supabase for authenticated users
        const [checkIns, journals, wins] = await Promise.all([
          supabase.from('check_ins').select('created_at').eq('user_id', user.id),
          supabase.from('journal_entries').select('created_at').eq('user_id', user.id),
          supabase.from('wins').select('created_at').eq('user_id', user.id)
        ]);

        const checkInCount = checkIns.data?.length || 0;
        const journalCount = journals.data?.length || 0;
        const winCount = wins.data?.length || 0;

        // Calculate streak and total days
        const allDates = [
          ...(checkIns.data || []).map(c => c.created_at),
          ...(journals.data || []).map(j => j.created_at),
          ...(wins.data || []).map(w => w.created_at)
        ].map(timestamp => new Date(timestamp).toDateString());
        
        const uniqueDates = [...new Set(allDates)].sort();
        const totalDays = uniqueDates.length;
        const streakDays = calculateStreak(uniqueDates);

        setProgress({
          checkInCount,
          journalCount,
          winCount,
          streakDays,
          totalDays
        });
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const calculateStreak = (sortedDates: string[]): number => {
    if (sortedDates.length === 0) return 0;
    
    let streak = 1;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    // Check if user has activity today or yesterday
    const latestDate = sortedDates[sortedDates.length - 1];
    if (latestDate !== today && latestDate !== yesterday) {
      return 0; // Streak broken
    }
    
    // Count consecutive days working backwards
    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const currentDate = new Date(sortedDates[i + 1]);
      const previousDate = new Date(sortedDates[i]);
      const dayDiff = Math.floor((currentDate.getTime() - previousDate.getTime()) / (24 * 60 * 60 * 1000));
      
      if (dayDiff === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const showGrowthFeedback = (message: string) => {
    setToastMessage(message);
    setShowGrowthToast(true);
    setTimeout(() => setShowGrowthToast(false), 3000);
  };

  const handleGrowthRingClick = () => {
    const totalActivities = progress.checkInCount + progress.journalCount + progress.winCount;
    
    if (totalActivities === 0) {
      showGrowthFeedback(t('startYourJourney'));
    } else if (totalActivities < 5) {
      showGrowthFeedback(t('activitiesCompleted', { count: totalActivities }));
    } else if (totalActivities < 15) {
      showGrowthFeedback(t('buildingMomentum', { count: totalActivities }));
    } else if (totalActivities < 30) {
      showGrowthFeedback(t('dedicationInspiring', { count: totalActivities }));
    } else if (totalActivities < 50) {
      showGrowthFeedback(t('creatingChange', { count: totalActivities }));
    } else {
      showGrowthFeedback(t('growthExtraordinary', { count: totalActivities }));
    }
  };
  
  const getPersonalizedGreeting = () => {
    const timeGreeting = currentHour < 12 ? (t('goodMorning') || 'Good morning') : 
                        currentHour < 17 ? (t('goodAfternoon') || 'Good afternoon') : 
                        (t('goodEvening') || 'Good evening');
    
    const themedGreeting = getThemedGreeting(currentTheme);
    
    if (user) {
      const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || themedGreeting;
      return `${timeGreeting}, ${displayName}`;
    } else {
      return getRandomGreeting();
    }
  };

  const getGrowthRingsFilled = () => {
    const totalActivities = progress.checkInCount + progress.journalCount + progress.winCount;
    
    if (totalActivities >= 50) return 5;
    if (totalActivities >= 30) return 4;
    if (totalActivities >= 15) return 3;
    if (totalActivities >= 5) return 2;
    if (totalActivities >= 1) return 1;
    return 0;
  };

  const quickActions = [
    {
      id: 'checkin',
      title: t('howAreYouFeeling') || 'How are you feeling?',
      subtitle: 'Get personalized responses',
      icon: Heart,
      color: currentTheme.colors.primary.split('-')[0],
      action: () => onNavigate('checkin')
    },
    {
      id: 'wins',
      title: t('yourWins') || 'Your wins',
      subtitle: 'Big or small, it matters',
      icon: Trophy,
      color: currentTheme.colors.secondary.split('-')[0],
      action: () => onNavigate('wins')
    },
    {
      id: 'journal',
      title: t('journalTitle') || 'Journal',
      subtitle: 'Let it flow onto paper',
      icon: BookOpen,
      color: currentTheme.colors.accent.split('-')[0],
      action: () => onNavigate('journal')
    },
    {
      id: 'affirmations',
      title: t('dailyAffirmations') || 'Daily affirmations',
      subtitle: 'Words of love for you',
      icon: Sparkles,
      color: currentTheme.colors.primary.split('-')[0],
      action: () => onNavigate('affirmations')
    }
  ];

  const filledRings = getGrowthRingsFilled();

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
      {/* Growth Toast */}
      <AnimatePresence>
        {showGrowthToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-${currentTheme.colors.primary} text-white px-6 py-3 rounded-lg shadow-lg max-w-sm text-center`}
          >
            <span className="text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Personalized Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-1 sm:space-y-2"
      >
        <div className="flex-center space-x-2">
          {isEvening ? (
            <Moon className={`w-5 h-5 text-${currentTheme.colors.secondary.replace('-400', '-500')} flex-shrink-0`} />
          ) : (
            <Sun className={`w-5 h-5 text-${currentTheme.colors.accent.replace('-600', '-500')} flex-shrink-0`} />
          )}
          <h2 className={`text-lg sm:text-2xl font-serif text-${currentTheme.colors.text} truncate`}>{getPersonalizedGreeting()}</h2>
        </div>
        <p className={`text-xs sm:text-base text-${currentTheme.colors.text.replace('-900', '-600')}`}>
          {user ? (t('welcomeBackToSafeSpace') || 'Welcome back to your safe space.') : (t('worthyOfLove') || 'You are worthy of love and gentleness.')}
        </p>
      </motion.div>

      {/* Today's Gentle Reminder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-sage-50 rounded-xl p-4 sm:p-5 border border-sage-100 shadow-sm"
      >
        <h3 className={`font-serif text-sm sm:text-lg text-${currentTheme.colors.text} mb-1 sm:mb-2`}>{t('todaysReminder') || "Today's gentle reminder"}</h3>
        <p className={`text-xs sm:text-base text-${currentTheme.colors.text.replace('-900', '-700')} leading-relaxed`}>
          {getThemedWisdom(currentTheme)}
        </p>
      </motion.div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-serif text-center font-medium text-sage-800 mt-4 sm:mt-6 mb-2 sm:mb-3">{t('howCanISupport') || 'How can I support you today?'}</h3>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                onClick={action.action}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, shadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 sm:p-4 rounded-xl text-left transition-all duration-200 bg-white border border-sage-100 hover:bg-${action.color}-50 touch-target shadow-sm hover:shadow-md`}
                aria-label={`Open ${action.title}`}
              >
                <div className="flex items-center space-x-2 sm:space-x-3 mb-1 sm:mb-2">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${action.color}-600 flex-shrink-0`} />
                  <h4 className={`font-medium text-${action.color}-800 text-xs sm:text-sm`}>{action.title}</h4>
                </div>
                <p className={`text-${action.color}-600 text-[10px] sm:text-xs ml-6 sm:ml-8`}>{action.subtitle}</p>
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
          className="card bg-white rounded-xl p-5 sm:p-6 border border-sage-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className={`font-serif text-base sm:text-lg text-${currentTheme.colors.text} mb-1`}>Your saved combinations</h3>
              <p className={`text-${currentTheme.colors.text.replace('-900', '-700')} text-sm`}>
                {favoriteCount} personalized response{favoriteCount !== 1 ? 's' : ''} saved
              </p>
            </div>
            <motion.button
              onClick={() => onNavigate('favorites')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 bg-${currentTheme.colors.secondary.replace('-400', '-100')} text-${currentTheme.colors.secondary.replace('-400', '-700')} rounded-lg hover:bg-${currentTheme.colors.secondary.replace('-400', '-200')} transition-colors touch-target shadow-sm`}
              aria-label="View saved combinations"
            >
              <Bookmark className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Interactive Growth Rings */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="card bg-white rounded-xl p-5 sm:p-6 border border-sage-100 shadow-sm relative"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-serif text-base sm:text-lg text-${currentTheme.colors.text}`}>{t('yourGrowthRings') || 'Your growth rings'}</h3>
          <motion.button
            onHoverStart={() => setShowProgressTooltip(true)}
            onHoverEnd={() => setShowProgressTooltip(false)}
            onClick={() => setShowProgressTooltip(!showProgressTooltip)}
            className={`p-2 rounded-full bg-${currentTheme.colors.secondary.replace('-400', '-100')} text-${currentTheme.colors.secondary.replace('-400', '-600')} hover:bg-${currentTheme.colors.secondary.replace('-400', '-200')} transition-colors touch-target shadow-sm`}
            aria-label="Show progress details"
          >
            <Info className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Progress Tooltip */}
        <AnimatePresence>
          {showProgressTooltip && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 right-4 bg-white rounded-lg shadow-lg border border-sage-200 p-4 z-10 w-64"
            >
              <h4 className={`font-medium text-${currentTheme.colors.text} mb-2`}>Your Progress</h4>
              <div className={`space-y-1 text-sm text-${currentTheme.colors.text.replace('-900', '-600')}`}>
                <div>Check-ins: {progress.checkInCount}</div>
                <div>Journal entries: {progress.journalCount}</div>
                <div>Wins celebrated: {progress.winCount}</div>
                <div>Current streak: {progress.streakDays} days</div>
                <div>Total active days: {progress.totalDays}</div>
              </div>
              <p className={`text-xs text-${currentTheme.colors.text.replace('-900', '-500')} mt-2`}>
                This ring shows how often you've shown up for yourself. You're doing beautifully.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <p className="text-center text-sm text-sage-600 mb-3">
          {t('startYourJourney')}
        </p>
        
        <motion.div 
          className="flex items-center justify-center space-x-3 my-4"
          onClick={handleGrowthRingClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="View growth progress"
        >
          {[1, 2, 3, 4, 5].map((ring, index) => (
            <motion.div
              key={ring}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full ${
                index < filledRings
                  ? `bg-${currentTheme.colors.primary.replace('-500', '-200')} border-2 border-${currentTheme.colors.primary.replace('-500', '-400')} shadow-sm` 
                  : `border-2 border-dashed border-${currentTheme.colors.text.replace('-900', '-200')} bg-${currentTheme.colors.text.replace('-900', '-50')} hover:border-${currentTheme.colors.text.replace('-900', '-300')}`
              } transition-all duration-300`}
            >
              {index < filledRings && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className={`w-full h-full rounded-full bg-gradient-to-br from-${currentTheme.colors.primary.replace('-500', '-300')} to-${currentTheme.colors.primary.replace('-500', '-400')}`}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
        
        <div className="text-center">
          <p className={`text-${currentTheme.colors.text.replace('-900', '-600')} text-sm`}>
            {progress.streakDays > 0 ? (
              <>
                {t('dayStreak', { days: progress.streakDays, plural: progress.streakDays !== 1 ? 's' : '' })} • {progress.totalDays} {t('daysOfSelfCare')}
              </>
            ) : (
              t('startSelfCareToday')
            )}
          </p>
          
          {progress.streakDays >= 7 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-2"
            >
              <span className={`inline-flex items-center px-3 py-1 bg-${currentTheme.colors.primary.replace('-500', '-200')} text-${currentTheme.colors.primary.replace('-500', '-800')} text-xs font-medium rounded-full shadow-sm`}>
                {t('weekStreakAchieved')}
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;