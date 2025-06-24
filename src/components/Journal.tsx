import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mic, Camera, Type } from 'lucide-react';

interface JournalProps {
  onBack: () => void;
}

const Journal: React.FC<JournalProps> = ({ onBack }) => {
  const [inputMode, setInputMode] = useState<'text' | 'voice' | 'photo'>('text');
  const [journalText, setJournalText] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const prompts = [
    "What am I grateful for today?",
    "How did I show myself kindness?",
    "What boundary did I honor?",
    "What made me smile today?",
    "What do I need to release?",
    "How am I growing?",
    "What would I tell my younger self?",
    "What brings me peace?",
  ];

  const inputModes = [
    { id: 'text', icon: Type, label: 'Write' },
    { id: 'voice', icon: Mic, label: 'Speak' },
    { id: 'photo', icon: Camera, label: 'Capture' },
  ] as const;

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
        <h1 className="text-2xl font-serif text-sage-800">Journal</h1>
      </div>

      {/* Gentle Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-lavender-50 rounded-2xl p-6 border border-lavender-100"
      >
        <h3 className="font-serif text-lavender-800 mb-2">A safe space for your thoughts</h3>
        <p className="text-lavender-700 text-sm leading-relaxed">
          Let your thoughts flow freely. There's no judgment here, only space for you to be authentic and gentle with yourself.
        </p>
      </motion.div>

      {/* Input Mode Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-serif text-sage-800">How would you like to express yourself?</h3>
        <div className="grid grid-cols-3 gap-3">
          {inputModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <motion.button
                key={mode.id}
                onClick={() => setInputMode(mode.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl text-center transition-all ${
                  inputMode === mode.id
                    ? 'bg-terracotta-100 border-2 border-terracotta-300 text-terracotta-800'
                    : 'bg-white border border-sage-100 text-sage-700 hover:bg-sage-50'
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">{mode.label}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Gentle Prompts */}
      <div className="space-y-3">
        <h3 className="text-lg font-serif text-sage-800">Need a gentle nudge?</h3>
        <div className="grid grid-cols-1 gap-2">
          {prompts.slice(0, 4).map((prompt, index) => (
            <motion.button
              key={prompt}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedPrompt(prompt);
                setJournalText(prompt + '\n\n');
              }}
              className={`p-3 text-left text-sm rounded-lg transition-all ${
                selectedPrompt === prompt
                  ? 'bg-cream-100 border-2 border-cream-300'
                  : 'bg-white border border-sage-100 hover:bg-sage-50'
              }`}
            >
              {prompt}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Journal Input */}
      {inputMode === 'text' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Let your thoughts flow..."
            className="w-full h-40 p-4 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-300 focus:border-transparent resize-none"
          />
          <button className="w-full py-3 bg-sage-500 text-white rounded-lg font-medium hover:bg-sage-600 transition-colors">
            Save Entry
          </button>
        </motion.div>
      )}

      {/* Voice Recording */}
      {inputMode === 'voice' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-32 h-32 mx-auto bg-terracotta-100 rounded-full flex items-center justify-center">
            <Mic className="w-12 h-12 text-terracotta-600" />
          </div>
          <p className="text-sage-600">Tap to start recording your thoughts</p>
          <button className="px-8 py-3 bg-terracotta-500 text-white rounded-lg font-medium hover:bg-terracotta-600 transition-colors">
            Start Recording
          </button>
        </motion.div>
      )}

      {/* Photo Capture */}
      {inputMode === 'photo' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-32 h-32 mx-auto bg-lavender-100 rounded-full flex items-center justify-center">
            <Camera className="w-12 h-12 text-lavender-600" />
          </div>
          <p className="text-sage-600">Capture a moment that speaks to you</p>
          <button className="px-8 py-3 bg-lavender-500 text-white rounded-lg font-medium hover:bg-lavender-600 transition-colors">
            Take Photo
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Journal;