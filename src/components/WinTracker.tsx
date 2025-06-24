import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trophy, Heart, Sparkles } from 'lucide-react';

interface Win {
  id: string;
  text: string;
  category: 'self-care' | 'boundaries' | 'growth' | 'joy';
  timestamp: Date;
}

interface WinTrackerProps {
  onBack: () => void;
}

const WinTracker: React.FC<WinTrackerProps> = ({ onBack }) => {
  const [wins, setWins] = useState<Win[]>([
    {
      id: '1',
      text: 'Got out of bed even though it was hard',
      category: 'self-care',
      timestamp: new Date()
    },
    {
      id: '2',
      text: 'Said no to plans when I needed rest',
      category: 'boundaries',
      timestamp: new Date(Date.now() - 86400000)
    }
  ]);
  const [newWin, setNewWin] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Win['category']>('self-care');
  const [showAddForm, setShowAddForm] = useState(false);

  const categories = [
    { id: 'self-care', label: 'Self-Care', icon: Heart, color: 'terracotta' },
    { id: 'boundaries', label: 'Boundaries', icon: Sparkles, color: 'lavender' },
    { id: 'growth', label: 'Growth', icon: Trophy, color: 'sage' },
    { id: 'joy', label: 'Joy', icon: Sparkles, color: 'cream' },
  ] as const;

  const quickWins = [
    'Got out of bed',
    'Drank water',
    'Took a shower',
    'Ate a meal',
    'Set a boundary',
    'Asked for help',
    'Practiced saying no',
    'Took a break',
    'Moved my body',
    'Called someone I love',
  ];

  const addWin = (text: string) => {
    const newWinItem: Win = {
      id: Date.now().toString(),
      text,
      category: selectedCategory,
      timestamp: new Date()
    };
    setWins([newWinItem, ...wins]);
    setNewWin('');
    setShowAddForm(false);
  };

  const getCategoryColor = (category: Win['category']) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'sage';
  };

  return (
    <div className="p-6 space-y-6">
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
          <h1 className="text-2xl font-serif text-sage-800">Your Wins</h1>
        </div>
        <motion.button
          onClick={() => setShowAddForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-terracotta-100 text-terracotta-700"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Encouragement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cream-50 rounded-2xl p-6 border border-cream-100"
      >
        <h3 className="font-serif text-cream-800 mb-2">Every step counts</h3>
        <p className="text-cream-700 text-sm leading-relaxed">
          Celebrating your wins, no matter how small they seem, helps rewire your brain for self-compassion. 
          You're doing better than you think.
        </p>
      </motion.div>

      {/* Quick Add Wins */}
      {!showAddForm && (
        <div className="space-y-3">
          <h3 className="text-lg font-serif text-sage-800">Quick wins to celebrate</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickWins.slice(0, 6).map((win, index) => (
              <motion.button
                key={win}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => addWin(win)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 text-left text-sm bg-white border border-sage-100 rounded-lg hover:bg-sage-50 transition-colors"
              >
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
              <h3 className="text-lg font-serif text-sage-800">Add your win</h3>
              
              {/* Category Selection */}
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-3 rounded-lg text-left transition-all ${
                        selectedCategory === category.id
                          ? `bg-${category.color}-100 border-2 border-${category.color}-300`
                          : 'bg-white border border-sage-100 hover:bg-sage-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 text-${category.color}-600 mb-1`} />
                      <div className="text-sm font-medium">{category.label}</div>
                    </button>
                  );
                })}
              </div>

              {/* Text Input */}
              <textarea
                value={newWin}
                onChange={(e) => setNewWin(e.target.value)}
                placeholder="What did you accomplish today?"
                className="w-full p-4 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-300 focus:border-transparent resize-none"
                rows={3}
              />

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => addWin(newWin)}
                  disabled={!newWin.trim()}
                  className="flex-1 py-3 bg-terracotta-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-terracotta-600 transition-colors"
                >
                  Celebrate This Win
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-sage-100 text-sage-700 rounded-lg font-medium hover:bg-sage-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wins List */}
      <div className="space-y-3">
        <h3 className="text-lg font-serif text-sage-800">Recent celebrations</h3>
        <div className="space-y-3">
          {wins.map((win, index) => {
            const color = getCategoryColor(win.category);
            return (
              <motion.div
                key={win.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg bg-${color}-50 border border-${color}-100`}
              >
                <div className="flex items-start space-x-3">
                  <Trophy className={`w-5 h-5 text-${color}-600 mt-0.5 flex-shrink-0`} />
                  <div className="flex-1">
                    <p className={`text-${color}-800 font-medium`}>{win.text}</p>
                    <p className={`text-${color}-600 text-xs mt-1`}>
                      {win.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WinTracker;