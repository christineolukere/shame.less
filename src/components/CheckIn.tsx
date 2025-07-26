import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { GuestStorageManager } from '../lib/guestStorage';
import { supabase } from '../lib/supabase';
import { getCheckInResponse, saveFavoriteResponse } from '../lib/checkInResponses';
import { saveAILetter } from '../lib/aiLetterStorage';
import CheckInResponseComponent from './CheckInResponse';
import AILetterModal from './AILetter/AILetterModal';

interface CheckInProps {
  onBack: () => void;
}

const CheckIn: React.FC<CheckInProps> = ({ onBack }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<any>(null);
  const [showAILetterModal, setShowAILetterModal] = useState(false);
  const [showAILetterPrompt, setShowAILetterPrompt] = useState(false);
  const { t } = useLocalization();
  const { user, isGuest } = useAuth();

  const moods = [
    { emoji: '😌', label: t('peaceful'), color: 'sage' },
    { emoji: '😊', label: t('content'), color: 'cream' },
    { emoji: '🥺', label: t('tender'), color: 'lavender' },
    { emoji: '😔', label: t('heavy'), color: 'sage' },
    { emoji: '😤', label: t('frustrated'), color: 'terracotta' },
    { emoji: '🌱', label: t('growing'), color: 'sage' },
    { emoji: '💫', label: t('hopeful'), color: 'lavender' },
    { emoji: '🌙', label: t('tired'), color: 'lavender' },
  ];

  const colors = [
    { name: t('softPink'), value: 'bg-rose-200', hex: '#fecaca' },
    { name: t('warmSage'), value: 'bg-sage-200', hex: '#c7d0c7' },
    { name: t('gentleLavender'), value: 'bg-lavender-200', hex: '#e9e5f1' },
    { name: t('sunsetOrange'), value: 'bg-terracotta-200', hex: '#f6d2c2' },
    { name: t('goldenCream'), value: 'bg-cream-200', hex: '#faf1e4' },
    { name: t('oceanBlue'), value: 'bg-blue-200', hex: '#bfdbfe' },
  ];

  const handleSaveCheckIn = async () => {
    if (!selectedMood || !selectedColor) return;

    setSaving(true);
    
    try {
      if (isGuest) {
        // Save to local storage for guest users
        GuestStorageManager.addCheckIn({
          mood: selectedMood,
          color: selectedColor,
          notes: notes || undefined
        });
      } else if (user) {
        // Save to Supabase for authenticated users
        const { error } = await supabase
          .from('check_ins')
          .insert({
            user_id: user.id,
            mood: selectedMood,
            color: selectedColor,
            notes: notes || null
          });

        if (error) throw error;
      }

      // Generate dynamic response
      const response = getCheckInResponse(selectedMood, selectedColor);
      setCurrentResponse(response);
      setShowResponse(true);
      setShowAILetterPrompt(true);
    } catch (error) {
      console.error('Error saving check-in:', error);
      // Could add toast notification here
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFavorite = (response: any) => {
    saveFavoriteResponse({
      ...response,
      emotion: selectedMood,
      color: selectedColor
    });
  };

  const handleContinue = () => {
    // Reset form and go back
    setSelectedMood(null);
    setSelectedColor(null);
    setNotes('');
    setShowResponse(false);
    setCurrentResponse(null);
    setShowAILetterPrompt(false);
    onBack();
  };

  const handleAILetterRequest = () => {
    setShowAILetterModal(true);
    setShowAILetterPrompt(false);
  };

  const handleSaveAILetter = async (letter: string) => {
    const sourceContent = `Mood: ${selectedMood}, Color: ${selectedColor}${notes ? `, Notes: ${notes}` : ''}`;
    
    await saveAILetter(
      letter,
      sourceContent,
      'checkin',
      selectedMood,
      user?.id,
      isGuest ? GuestStorageManager.getGuestSessionId() : undefined
    );
  };

  if (showResponse && currentResponse) {
    return (
      <div className="p-6">
        <div className="flex-start space-x-4 mb-6">
          <motion.button
            onClick={() => setShowResponse(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-sage-100 text-sage-700 touch-target shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="text-2xl font-serif text-sage-800">Your personalized response</h1>
        </div>

        <CheckInResponseComponent
          response={currentResponse}
          emotion={selectedMood!}
          color={selectedColor!}
          onContinue={handleContinue}
          onSaveFavorite={handleSaveFavorite}
        />

        {/* AI Letter Prompt */}
        <AnimatePresence>
          {showAILetterPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 bg-gradient-to-r from-terracotta-50 to-sage-50 rounded-2xl p-6 border border-terracotta-100 shadow-sm"
            >
              <div className="flex-start space-x-3">
                <Sparkles className="w-6 h-6 text-terracotta-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-serif text-terracotta-800 mb-2">
                    Would you like an AI-written letter?
                  </h3>
                  <p className="text-terracotta-700 text-sm mb-4 leading-relaxed">
                    Based on what you've shared about feeling {selectedMood?.toLowerCase()}, 
                    I can write you a gentle, personalized letter of support and reflection.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      onClick={handleAILetterRequest}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 transition-colors flex-center space-x-2 touch-target shadow-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Yes, write me a letter</span>
                    </motion.button>
                    <motion.button
                      onClick={() => setShowAILetterPrompt(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors touch-target shadow-sm"
                    >
                      Maybe later
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Letter Modal */}
        <AILetterModal
          isOpen={showAILetterModal}
          onClose={() => setShowAILetterModal(false)}
          content={`I'm feeling ${selectedMood?.toLowerCase()} today, and the color that matches my energy is ${selectedColor?.toLowerCase()}. ${notes ? `Additional thoughts: ${notes}` : ''}`}
          emotion={selectedMood || undefined}
          onSaveLetter={handleSaveAILetter}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex-start space-x-4">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-sage-100 text-sage-700 touch-target shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <h1 className="text-2xl font-serif text-sage-800">{t('yourPersonalizedResponse')}</h1>
      </div>

      {/* Gentle Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-terracotta-50 rounded-2xl p-4 sm:p-6 border border-terracotta-100 shadow-sm"
      >
        <div className="flex-start space-x-2 mb-3">
          <Heart className="w-5 h-5 text-terracotta-600 flex-shrink-0" />
          <h3 className="font-serif text-terracotta-800">{t('gentleCheckIn')}</h3>
        </div>
        <p className="text-terracotta-700 text-sm leading-relaxed">
          {t('checkInDescription')}
        </p>
      </motion.div>

      {/* Mood Selection */}
      <div className="section">
        <h3 className="section-title">{t('whatEmotionClosest')}</h3>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {moods.map((mood, index) => (
            <motion.button
              key={mood.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedMood(mood.label)}
              className={`p-4 rounded-xl text-center transition-all touch-target ${
                selectedMood === mood.label
                  ? 'bg-sage-200 border-2 border-sage-400 transform scale-105 shadow-sm'
                  : 'bg-white border border-sage-100 hover:bg-sage-50'
              }`}
            >
              <div className="text-xl sm:text-2xl mb-0.5 sm:mb-1">{mood.emoji}</div>
              <div className="text-[10px] sm:text-xs text-sage-700 font-medium">{mood.label}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className="section">
        <h3 className="section-title">{t('whatColorEnergy')}</h3>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {colors.map((color, index) => (
            <motion.button
              key={color.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onClick={() => setSelectedColor(color.name)}
              className={`p-4 rounded-xl transition-all touch-target ${
                selectedColor === color.name
                  ? 'ring-2 ring-sage-400 ring-offset-2 transform scale-105 shadow-sm'
                  : 'hover:scale-105'
              }`}
            >
              <div className={`w-full h-8 sm:h-12 rounded-lg ${color.value} mb-1 sm:mb-2 shadow-sm`} />
              <div className="text-[10px] sm:text-xs text-sage-700 font-medium">{color.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Optional Notes */}
      {(selectedMood || selectedColor) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h3 className="section-title">Any thoughts to add?</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional: What's on your mind right now?"
            className="w-full h-24 p-4 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-300 focus:border-transparent resize-none text-sage-800 placeholder-sage-400 shadow-sm"
          />
        </motion.div>
      )}

      {/* Save Button */}
      {selectedMood && selectedColor && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <motion.button
            onClick={handleSaveCheckIn}
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.02 }}
            whileTap={{ scale: saving ? 1 : 0.98 }}
            className="w-full py-4 bg-sage-500 text-white rounded-lg font-medium hover:bg-sage-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm touch-target"
          >
            {saving ? 'Creating your personalized response...' : 'Get my personalized response'}
          </motion.button>

          {/* Preview hint */}
          <div className="text-center text-sm text-sage-600">
            ✨ We'll create a unique affirmation and reflection just for your {selectedMood} + {selectedColor} combination
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CheckIn;