import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mic, Camera, Type } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { GuestStorageManager } from '../lib/guestStorage';
import { supabase } from '../lib/supabase';

interface JournalEntry {
  id: string;
  content: string;
  prompt?: string;
  entryType: string;
  timestamp: string;
}

interface JournalProps {
  onBack: () => void;
}

const Journal: React.FC<JournalProps> = ({ onBack }) => {
  const [inputMode, setInputMode] = useState<'text' | 'voice' | 'photo'>('text');
  const [journalText, setJournalText] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { translations: t } = useLocalization();
  const { user, isGuest } = useAuth();

  const prompts = [
    t.gratefulFor,
    t.showedKindness,
    t.boundaryHonored,
    t.madeSmile,
    t.needToRelease,
    t.howGrowing,
    t.tellYoungerSelf,
    t.bringsYouPeace,
  ];

  const inputModes = [
    { id: 'text', icon: Type, label: t.write },
    { id: 'voice', icon: Mic, label: t.speak },
    { id: 'photo', icon: Camera, label: t.capture },
  ] as const;

  useEffect(() => {
    loadEntries();
  }, [user, isGuest]);

  const loadEntries = async () => {
    setLoading(true);
    try {
      if (isGuest) {
        // Load from local storage for guest users
        const guestData = GuestStorageManager.getGuestData();
        const formattedEntries: JournalEntry[] = guestData.journalEntries.map(entry => ({
          id: entry.id,
          content: entry.content,
          prompt: entry.prompt,
          entryType: entry.entryType,
          timestamp: entry.timestamp
        }));
        setEntries(formattedEntries);
      } else if (user) {
        // Load from Supabase for authenticated users
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5); // Show recent entries

        if (error) throw error;

        const formattedEntries: JournalEntry[] = (data || []).map(entry => ({
          id: entry.id,
          content: entry.content,
          prompt: entry.prompt || undefined,
          entryType: entry.entry_type,
          timestamp: entry.created_at
        }));
        setEntries(formattedEntries);
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!journalText.trim()) return;

    setSaving(true);
    try {
      const entryData = {
        content: journalText.trim(),
        prompt: selectedPrompt || undefined,
        entryType: inputMode
      };

      if (isGuest) {
        // Save to local storage for guest users
        GuestStorageManager.addJournalEntry(entryData);
        
        // Reload entries to get the new ID
        await loadEntries();
      } else if (user) {
        // Save to Supabase for authenticated users
        const { data, error } = await supabase
          .from('journal_entries')
          .insert({
            user_id: user.id,
            content: entryData.content,
            prompt: entryData.prompt || null,
            entry_type: entryData.entryType
          })
          .select()
          .single();

        if (error) throw error;

        const newEntry: JournalEntry = {
          id: data.id,
          content: data.content,
          prompt: data.prompt || undefined,
          entryType: data.entry_type,
          timestamp: data.created_at
        };

        setEntries([newEntry, ...entries]);
      }

      // Reset form
      setJournalText('');
      setSelectedPrompt(null);
    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      setSaving(false);
    }
  };

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
        <h1 className="text-2xl font-serif text-sage-800">{t.journalTitle}</h1>
      </div>

      {/* Gentle Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-lavender-50 rounded-2xl p-6 border border-lavender-100"
      >
        <h3 className="font-serif text-lavender-800 mb-2">{t.safeSpaceThoughts}</h3>
        <p className="text-lavender-700 text-sm leading-relaxed">
          {t.journalDescription}
        </p>
      </motion.div>

      {/* Input Mode Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-serif text-sage-800">{t.howToExpress}</h3>
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
        <h3 className="text-lg font-serif text-sage-800">{t.needGentleNudge}</h3>
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
            placeholder={t.letThoughtsFlow}
            className="w-full h-40 p-4 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-300 focus:border-transparent resize-none"
          />
          <button 
            onClick={saveEntry}
            disabled={!journalText.trim() || saving}
            className="w-full py-3 bg-sage-500 text-white rounded-lg font-medium hover:bg-sage-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : t.saveEntry}
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
          <p className="text-sage-600">Voice recording coming soon</p>
          <button className="px-8 py-3 bg-terracotta-500 text-white rounded-lg font-medium hover:bg-terracotta-600 transition-colors opacity-50 cursor-not-allowed">
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
          <p className="text-sage-600">Photo journaling coming soon</p>
          <button className="px-8 py-3 bg-lavender-500 text-white rounded-lg font-medium hover:bg-lavender-600 transition-colors opacity-50 cursor-not-allowed">
            Take Photo
          </button>
        </motion.div>
      )}

      {/* Recent Entries */}
      {entries.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-serif text-sage-800">Recent reflections</h3>
          <div className="space-y-3">
            {entries.slice(0, 3).map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-cream-50 rounded-lg border border-cream-100"
              >
                {entry.prompt && (
                  <div className="text-xs text-cream-600 mb-2 font-medium">
                    {entry.prompt}
                  </div>
                )}
                <p className="text-cream-800 text-sm leading-relaxed line-clamp-3">
                  {entry.content}
                </p>
                <div className="text-xs text-cream-600 mt-2">
                  {new Date(entry.timestamp).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;