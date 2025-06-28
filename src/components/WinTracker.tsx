import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trophy, Heart, Sparkles, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { GuestStorageManager } from '../lib/guestStorage';
import { supabase } from '../lib/supabase';
import { celebrateWin, CelebrationConfig } from '../lib/winCelebrations';
import WinCelebration from './WinCelebration';

interface Win {
  id: string;
  text: string;
  category: 'self-care' | 'boundaries' | 'growth' | 'joy';
  timestamp: string;
}

interface WinTrackerProps {
  onBack: () => void;
}

const WinTracker: React.FC<WinTrackerProps> = ({ onBack }) => {
  const { t } = useLocalization();
  const { user, isGuest } = useAuth();
  const [wins, setWins] = useState<Win[]>([]);
  const [newWin, setNewWin] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Win['category']>('self-care');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentCelebration, setCurrentCelebration] = useState<CelebrationConfig | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  const categories = [
    { id: 'self-care', label: t('selfCare') || 'Self-Care', icon: Heart, color: 'terracotta' },
    { id: 'boundaries', label: t('boundaries') || 'Boundaries', icon: Sparkles, color: 'lavender' },
    { id: 'growth', label: t('growth') || 'Growth', icon: Trophy, color: 'sage' },
    { id: 'joy', label: t('joy') || 'Joy', icon: Sparkles, color: 'cream' },
  ] as const;

  const quickWins = [
    t('gotOutOfBed') || 'Got out of bed',
    t('drankWater') || 'Drank water',
    t('tookShower') || 'Took a shower',
    t('ateAMeal') || 'Ate a meal',
    t('setBoundary') || 'Set a boundary',
    t('askedForHelp') || 'Asked for help',
    t('practicedSayingNo') || 'Practiced saying no',
    t('tookBreak') || 'Took a break',
    t('movedBody') || 'Moved my body',
    t('calledSomeone') || 'Called someone',
  ];

  useEffect(() => {
    loadWins();
  }, [user, isGuest]);

  const loadWins = async () => {
    setLoading(true);
    try {
      if (isGuest) {
        // Load from local storage for guest users
        const guestData = GuestStorageManager.getGuestData();
        const formattedWins: Win[] = guestData.wins.map(win => ({
          id: win.id,
          text: win.text,
          category: win.category as Win['category'],
          timestamp: win.timestamp
        }));
        setWins(formattedWins);
      } else if (user) {
        // Load from Supabase for authenticated users
        const { data, error } = await supabase
          .from('wins')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedWins: Win[] = (data || []).map(win => ({
          id: win.id,
          text: win.text,
          category: win.category as Win['category'],
          timestamp: win.created_at
        }));
        setWins(formattedWins);
      }
    } catch (error) {
      console.error('Error loading wins:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWin = async (text: string) => {
    if (!text.trim()) return;

    setSaving(true);
    try {
      const newWinItem: Omit<Win, 'id'> = {
        text: text.trim(),
        category: selectedCategory,
        timestamp: new Date().toISOString()
      };

      if (isGuest) {
        // Save to local storage for guest users
        GuestStorageManager.addWin({
          text: newWinItem.text,
          category: newWinItem.category
        });
        
        // Reload wins to get the new ID
        await loadWins();
      } else if (user) {
        // Save to Supabase for authenticated users
        const { data, error } = await supabase
          .from('wins')
          .insert({
            user_id: user.id,
            text: newWinItem.text,
            category: newWinItem.category
          })
          .select()
          .single();

        if (error) throw error;

        const formattedWin: Win = {
          id: data.id,
          text: data.text,
          category: data.category,
          timestamp: data.created_at
        };

        setWins([formattedWin, ...wins]);
      }

      // Trigger celebration!
      const celebration = celebrateWin(selectedCategory, text);
      setCurrentCelebration(celebration);

      setNewWin('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving win:', error);
    } finally {
      setSaving(false);
    }
  };

  const clearAllWins = async () => {
    setClearing(true);
    try {
      if (isGuest) {
        // Clear from local storage for guest users
        const guestData = GuestStorageManager.getGuestData();
        guestData.wins = [];
        GuestStorageManager.saveGuestData(guestData);
      } else if (user) {
        // Clear from Supabase for authenticated users
        const { error } = await supabase
          .from('wins')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
      }

      setWins([]);
      setShowClearConfirm(false);
    } catch (error) {
      console.error('Error clearing wins:', error);
    } finally {
      setClearing(false);
    }
  };

  const handleQuickWin = async (winText: string) => {
    // Determine category based on win text
    let category: Win['category'] = 'self-care';
    
    const boundaryWins = [t('setBoundary'), t('practicedSayingNo'), t('askedForHelp')].filter(Boolean);
    const growthWins = [t('movedBody'), t('calledSomeone'), t('tookBreak')].filter(Boolean);
    const selfCareWins = [t('drankWater'), t('tookShower'), t('ateAMeal'), t('gotOutOfBed')].filter(Boolean);
    
    if (boundaryWins.some(win => winText.includes(win))) {
      category = 'boundaries';
    } else if (growthWins.some(win => winText.includes(win))) {
      category = 'growth';
    } else if (selfCareWins.some(win => winText.includes(win))) {
      category = 'self-care';
    }

    const originalCategory = selectedCategory;
    setSelectedCategory(category);
    await addWin(winText);
    setSelectedCategory(originalCategory);
  };

  const getCategoryColor = (category: Win['category']) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'sage';
  };

  const handleCelebrationComplete = () => {
    setCurrentCelebration(null);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-sage-600">{t('loading') || 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Celebration Overlay */}
      <WinCelebration 
        celebration={currentCelebration} 
        onComplete={handleCelebrationComplete} 
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-sage-100 text-sage-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="text-2xl font-serif text-sage-800">{t('yourWins') || 'Your Wins'}</h1>
        </div>
        <div className="flex items-center space-x-2">
          {wins.length > 0 && (
            <motion.button
              onClick={() => setShowClearConfirm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              title={t('clearAllWins') || 'Clear all wins'}
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
          )}
          <motion.button
            onClick={() => setShowAddForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-terracotta-100 text-terracotta-700"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Encouragement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cream-50 rounded-2xl p-6 border border-cream-100"
      >
        <h3 className="font-serif text-cream-800 mb-2">{t('everyStepCounts') || 'Every step counts'}</h3>
        <p className="text-cream-700 text-sm leading-relaxed">
          {t('winsDescription') || 'Celebrating progress, no matter how small. Each win is a testament to your strength and resilience.'}
        </p>
      </motion.div>

      {/* Quick Add Wins */}
      {!showAddForm && (
        <div className="space-y-3">
          <h3 className="text-lg font-serif text-sage-800">{t('quickWinsTocelebrate') || 'Quick wins to celebrate'}</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickWins.slice(0, 6).map((win, index) => (
              <motion.button
                key={win}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleQuickWin(win)}
                disabled={saving}
                whileHover={{ scale: saving ? 1 : 1.02 }}
                whileTap={{ scale: saving ? 1 : 0.98 }}
                className="p-3 text-left text-sm bg-white border border-sage-100 rounded-lg hover:bg-sage-50 transition-colors disabled:opacity-50 relative overflow-hidden"
              >
                {saving && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  />
                )}
                {win}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Win Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="space-y-3">
              <h3 className="text-lg font-serif text-sage-800">{t('addYourWin') || 'Add your win'}</h3>
              
              {/* Category Selection */}
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <motion.button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-lg text-left transition-all ${
                        selectedCategory === category.id
                          ? `bg-${category.color}-100 border-2 border-${category.color}-300`
                          : 'bg-white border border-sage-100 hover:bg-sage-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 text-${category.color}-600 mb-1`} />
                      <div className="text-sm font-medium">{category.label}</div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Text Input */}
              <textarea
                value={newWin}
                onChange={(e) => setNewWin(e.target.value)}
                placeholder={t('whatDidYouAccomplish') || 'What did you accomplish today?'}
                className="w-full p-4 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-300 focus:border-transparent resize-none"
                rows={3}
              />

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <motion.button
                  onClick={() => addWin(newWin)}
                  disabled={!newWin.trim() || saving}
                  whileHover={{ scale: !newWin.trim() || saving ? 1 : 1.02 }}
                  whileTap={{ scale: !newWin.trim() || saving ? 1 : 0.98 }}
                  className="flex-1 py-3 bg-terracotta-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-terracotta-600 transition-colors relative overflow-hidden"
                >
                  {saving && (
                    <motion.div
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  )}
                  {saving ? (t('celebrating') || 'Celebrating...') : (t('celebrateThisWin') || 'Celebrate this win')}
                </motion.button>
                <button
                  onClick={() => setShowAddForm(false)}
                  disabled={saving}
                  className="px-6 py-3 bg-sage-100 text-sage-700 rounded-lg font-medium hover:bg-sage-200 transition-colors disabled:opacity-50"
                >
                  {t('cancel') || 'Cancel'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                
                <div>
                  <h3 className="text-lg font-serif text-sage-800 mb-2">{t('clearAllWins') || 'Clear all wins'}</h3>
                  <p className="text-sage-600 text-sm">
                    {t('clearWinsConfirmation') || 'Are you sure you want to clear all your wins? This action cannot be undone.'}
                  </p>
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => setShowClearConfirm(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-sage-100 text-sage-700 rounded-lg font-medium hover:bg-sage-200 transition-colors"
                  >
                    {t('cancel') || 'Cancel'}
                  </motion.button>
                  <motion.button
                    onClick={clearAllWins}
                    disabled={clearing}
                    whileHover={{ scale: clearing ? 1 : 1.02 }}
                    whileTap={{ scale: clearing ? 1 : 0.98 }}
                    className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {clearing ? (t('clearing') || 'Clearing...') : (t('clearAll') || 'Clear All')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wins List */}
      <div className="space-y-3">
        <h3 className="text-lg font-serif text-sage-800">{t('recentCelebrations') || 'Recent celebrations'}</h3>
        {wins.length === 0 ? (
          <div className="text-center py-8 text-sage-600">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-sage-400" />
            <p>{t('noWinsYet') || 'No wins yet. Add your first celebration above!'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {wins.map((win, index) => {
              const color = getCategoryColor(win.category);
              const categoryLabel = categories.find(c => c.id === win.category)?.label || win.category;
              return (
                <motion.div
                  key={win.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg bg-${color}-50 border border-${color}-100 relative overflow-hidden`}
                >
                  <div className="flex items-start space-x-3">
                    <Trophy className={`w-5 h-5 text-${color}-600 mt-0.5 flex-shrink-0`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 bg-${color}-100 text-${color}-700 text-xs font-medium rounded-full`}>
                          {categoryLabel}
                        </span>
                      </div>
                      <p className={`text-${color}-800 font-medium`}>{win.text}</p>
                      <p className={`text-${color}-600 text-xs mt-1`}>
                        {new Date(win.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Subtle sparkle animation for recent wins */}
                  {index === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                      transition={{ duration: 2, delay: 0.5 }}
                      className="absolute top-2 right-2 text-yellow-400"
                    >
                      ✨
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WinTracker;