import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart } from 'lucide-react';
import { useLocalization } from '../contexts/LocalizationContext';

interface CheckInProps {
  onBack: () => void;
}

const CheckIn: React.FC<CheckInProps> = ({ onBack }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { t } = useLocalization();

  const moods = [
    { emoji: '😌', label: t('checkin.moods.peaceful'), color: 'sage' },
    { emoji: '😊', label: t('checkin.moods.content'), color: 'cream' },
    { emoji: '🥺', label: t('checkin.moods.tender'), color: 'lavender' },
    { emoji: '😔', label: t('checkin.moods.heavy'), color: 'sage' },
    { emoji: '😤', label: t('checkin.moods.frustrated'), color: 'terracotta' },
    { emoji: '🌱', label: t('checkin.moods.growing'), color: 'sage' },
    { emoji: '💫', label: t('checkin.moods.hopeful'), color: 'lavender' },
    { emoji: '🌙', label: t('checkin.moods.tired'), color: 'lavender' },
  ];

  const colors = [
    { name: t('checkin.colors.softPink'), value: 'bg-rose-200', hex: '#fecaca' },
    { name: t('checkin.colors.warmSage'), value: 'bg-sage-200', hex: '#c7d0c7' },
    { name: t('checkin.colors.gentleLavender'), value: 'bg-lavender-200', hex: '#e9e5f1' },
    { name: t('checkin.colors.sunsetOrange'), value: 'bg-terracotta-200', hex: '#f6d2c2' },
    { name: t('checkin.colors.goldenCream'), value: 'bg-cream-200', hex: '#faf1e4' },
    { name: t('checkin.colors.oceanBlue'), value: 'bg-blue-200', hex: '#bfdbfe' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-sage-100 text-sage-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <h1 className="text-2xl font-serif text-sage-800">{t('checkin.title')}</h1>
      </div>

      {/* Gentle Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-terracotta-50 rounded-2xl p-6 border border-terracotta-100"
      >
        <div className="flex items-center space-x-2 mb-3">
          <Heart className="w-5 h-5 text-terracotta-600" />
          <h3 className="font-serif text-terracotta-800">{t('checkin.gentleCheckIn')}</h3>
        </div>
        <p className="text-terracotta-700 text-sm leading-relaxed">
          {t('checkin.description')}
        </p>
      </motion.div>

      {/* Mood Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif text-sage-800">{t('checkin.moodQuestion')}</h3>
        <div className="grid grid-cols-4 gap-3">
          {moods.map((mood, index) => (
            <motion.button
              key={mood.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedMood(mood.label)}
              className={`p-4 rounded-xl text-center transition-all ${
                selectedMood === mood.label
                  ? 'bg-sage-200 border-2 border-sage-400'
                  : 'bg-white border border-sage-100 hover:bg-sage-50'
              }`}
            >
              <div className="text-2xl mb-1">{mood.emoji}</div>
              <div className="text-xs text-sage-700 font-medium">{mood.label}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif text-sage-800">{t('checkin.colorQuestion')}</h3>
        <div className="grid grid-cols-3 gap-3">
          {colors.map((color, index) => (
            <motion.button
              key={color.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onClick={() => setSelectedColor(color.name)}
              className={`p-4 rounded-xl transition-all ${
                selectedColor === color.name
                  ? 'ring-2 ring-sage-400 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className={`w-full h-12 rounded-lg ${color.value} mb-2`} />
              <div className="text-xs text-sage-700 font-medium">{color.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Affirmation */}
      {(selectedMood || selectedColor) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-lavender-50 rounded-2xl p-6 border border-lavender-100"
        >
          <h3 className="font-serif text-lavender-800 mb-2">{t('checkin.forYou')}</h3>
          <p className="text-lavender-700 leading-relaxed">
            "{t('checkin.affirmation')}"
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CheckIn;