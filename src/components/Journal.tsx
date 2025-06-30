import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, Camera, Type, Play, Pause, Image as ImageIcon, AlertCircle, CheckCircle, Star, Sparkles, Mail, Clock, History, Plus, Mirror } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { GuestStorageManager } from '../lib/guestStorage';
import { getCurrentTheme, getThemedJournalPrompts } from '../lib/themeManager';
import { 
  saveJournalEntry, 
  loadJournalEntries, 
  checkContentSafety, 
  EnhancedJournalEntry 
} from '../lib/journalStorage';
import { saveAILetter } from '../lib/aiLetterStorage';
import { scheduleFutureEmail } from '../lib/futureEmailService';
import AudioRecorder from './Journal/AudioRecorder';
import PhotoUploader from './Journal/PhotoUploader';
import SafetyModal from './Journal/SafetyModal';
import AILetterModal from './AILetter/AILetterModal';
import JournalHistory from './Journal/JournalHistory';
import MirrorMirror from './Journal/MirrorMirror';

interface JournalProps {
  onBack: () => void;
}

type InputMode = 'text' | 'voice' | 'photo' | 'mirror';
type ViewMode = 'write' | 'history';

interface MediaFile {
  file: File;
  type: 'audio' | 'photo';
  duration?: number;
  preview?: string;
}

const Journal: React.FC<JournalProps> = ({ onBack }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('write');
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [title, setTitle] = useState('');
  const [journalText, setJournalText] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [moodRating, setMoodRating] = useState<number | null>(null);
  const [recentEntries, setRecentEntries] = useState<EnhancedJournalEntry[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [flaggedWords, setFlaggedWords] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [showAILetterModal, setShowAILetterModal] = useState(false);
  const [showAILetterPrompt, setShowAILetterPrompt] = useState(false);
  const [lastSavedEntry, setLastSavedEntry] = useState<string>('');
  const [sendToFuture, setSendToFuture] = useState(false);
  const [emailScheduling, setEmailScheduling] = useState(false);
  const [emailScheduled, setEmailScheduled] = useState(false);
  const [showMirrorMirror, setShowMirrorMirror] = useState(false);
  
  const { t } = useLocalization();
  const { user, isGuest } = useAuth();
  const currentTheme = getCurrentTheme();

  // Get theme-specific journal prompts
  const prompts = getThemedJournalPrompts(currentTheme);

  const inputModes = [
    { id: 'text', icon: Type, label: t('write') },
    { id: 'voice', icon: Mic, label: t('speak') },
    { id: 'photo', icon: Camera, label: t('capture') },
    { id: 'mirror', icon: Mirror, label: 'Mirror Mirror' },
  ] as const;

  useEffect(() => {
    if (viewMode === 'write') {
      loadRecentEntries();
    }
  }, [user, isGuest, viewMode]);

  const loadRecentEntries = async () => {
    setLoading(true);
    try {
      if (isGuest) {
        // Load from local storage for guest users
        const guestData = GuestStorageManager.getGuestData();
        const formattedEntries: EnhancedJournalEntry[] = guestData.journalEntries.slice(0, 3).map(entry => ({
          id: entry.id,
          user_id: undefined,
          guest_session_id: GuestStorageManager.getGuestSessionId(),
          title: undefined,
          content: entry.content,
          prompt: entry.prompt,
          entry_type: entry.entryType,
          mood_rating: undefined,
          is_flagged: false,
          created_at: entry.timestamp,
          media: []
        }));
        setRecentEntries(formattedEntries);
      } else if (user) {
        // Load from Supabase for authenticated users
        const result = await loadJournalEntries(user.id, 3);
        if (result.success && result.entries) {
          setRecentEntries(result.entries);
        }
      }
    } catch (error) {
      console.error('Error loading recent journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
    setJournalText(prompt + '\n\n');
  };

  const handleAudioRecordingComplete = (audioFile: File, duration: number) => {
    const newMediaFile: MediaFile = {
      file: audioFile,
      type: 'audio',
      duration
    };
    setMediaFiles([...mediaFiles, newMediaFile]);
    setShowAudioRecorder(false);
  };

  const handlePhotoSelected = (photoFile: File) => {
    const preview = URL.createObjectURL(photoFile);
    const newMediaFile: MediaFile = {
      file: photoFile,
      type: 'photo',
      preview
    };
    setMediaFiles([...mediaFiles, newMediaFile]);
    setShowPhotoUploader(false);
  };

  const removeMediaFile = (index: number) => {
    const updatedFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(updatedFiles);
  };

  const saveEntry = async () => {
    if (!journalText.trim() && mediaFiles.length === 0) return;

    setSaving(true);
    
    try {
      // Check content safety if there's text
      if (journalText.trim()) {
        const safetyCheck = checkContentSafety(journalText);
        if (!safetyCheck.isSafe) {
          setFlaggedWords(safetyCheck.flaggedWords);
          setShowSafetyModal(true);
          setSaving(false);
          return;
        }
      }

      await performSave();
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setSaving(false);
    }
  };

  const performSave = async () => {
    try {
      let entryId: string | undefined;

      if (isGuest) {
        // Save to local storage for guest users
        GuestStorageManager.addJournalEntry({
          content: journalText.trim(),
          prompt: selectedPrompt || undefined,
          entryType: inputMode
        });
        
        // Reload entries to get the new one
        await loadRecentEntries();
      } else if (user) {
        // Save to Supabase for authenticated users
        const entryData = {
          user_id: user.id,
          title: title.trim() || undefined,
          content: journalText.trim(),
          prompt: selectedPrompt || undefined,
          entry_type: inputMode,
          mood_rating: moodRating,
          is_flagged: false
        };

        const result = await saveJournalEntry(entryData, mediaFiles);
        
        if (result.success) {
          entryId = result.entryId;
          // Reload entries to get the updated list
          await loadRecentEntries();
        } else {
          throw new Error(result.error);
        }
      }

      // Handle future email scheduling for authenticated users
      if (sendToFuture && user && user.email && entryId) {
        setEmailScheduling(true);
        try {
          const emailResult = await scheduleFutureEmail({
            userId: user.id,
            userEmail: user.email,
            entryId: entryId,
            entryContent: journalText.trim(),
            entryTitle: title.trim() || undefined,
            sendAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
          });

          if (emailResult.success) {
            setEmailScheduled(true);
            setTimeout(() => setEmailScheduled(false), 5000);
          }
        } catch (emailError) {
          console.error('Error scheduling future email:', emailError);
        } finally {
          setEmailScheduling(false);
        }
      }

      // Store the entry content for AI letter generation
      setLastSavedEntry(journalText.trim());
      
      // Reset form
      setTitle('');
      setJournalText('');
      setSelectedPrompt(null);
      setMoodRating(null);
      setMediaFiles([]);
      setInputMode('text');
      setSendToFuture(false);
      
      // Show success message and AI letter prompt
      setSaveSuccess(true);
      setShowAILetterPrompt(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSafetyModalContinue = () => {
    setShowSafetyModal(false);
    performSave();
  };

  const handleAILetterRequest = () => {
    setShowAILetterModal(true);
    setShowAILetterPrompt(false);
  };

  const handleSaveAILetter = async (letter: string) => {
    await saveAILetter(
      letter,
      lastSavedEntry,
      'journal',
      undefined,
      user?.id,
      isGuest ? GuestStorageManager.getGuestSessionId() : undefined
    );
  };

  const handleMirrorMirrorSave = (content: string, response: string) => {
    setJournalText(content);
    setTitle('Mirror Mirror Session');
    setInputMode('text');
    setShowMirrorMirror(false);
  };

  const playAudio = (audioUrl: string, entryId: string) => {
    if (playingAudio === entryId) {
      // Pause current audio
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => audio.pause());
      setPlayingAudio(null);
    } else {
      // Stop any currently playing audio
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => audio.pause());
      
      // Play new audio
      const audio = new Audio(audioUrl);
      audio.play();
      setPlayingAudio(entryId);
      
      audio.onended = () => setPlayingAudio(null);
      audio.onpause = () => setPlayingAudio(null);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show journal history
  if (viewMode === 'history') {
    return <JournalHistory onBack={() => setViewMode('write')} />;
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className={`text-${currentTheme.colors.text.replace('-900', '-600')}`}>Loading your journal...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Success Messages */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-${currentTheme.colors.primary} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>Your reflection has been saved</span>
          </motion.div>
        )}

        {emailScheduled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <Mail className="w-5 h-5" />
            <span>We'll send this in 7 days. Stay soft. 💌</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Letter Prompt */}
      <AnimatePresence>
        {showAILetterPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`bg-gradient-to-r from-${currentTheme.colors.primary.replace('-500', '-50')} to-${currentTheme.colors.secondary.replace('-400', '-50')} rounded-2xl p-6 border border-${currentTheme.colors.primary.replace('-500', '-100')}`}
          >
            <div className="flex items-start space-x-3">
              <Sparkles className={`w-6 h-6 text-${currentTheme.colors.primary.replace('-500', '-600')} mt-1 flex-shrink-0`} />
              <div className="flex-1">
                <h3 className={`font-serif text-${currentTheme.colors.text} mb-2`}>
                  Would you like an AI-written letter based on what you shared?
                </h3>
                <p className={`text-${currentTheme.colors.text.replace('-900', '-700')} text-sm mb-4 leading-relaxed`}>
                  I can write you a gentle, personalized letter that reflects on your journal entry 
                  and offers comfort and encouragement.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={handleAILetterRequest}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 bg-${currentTheme.colors.primary} text-white rounded-lg hover:bg-${currentTheme.colors.primary.replace('-500', '-600')} transition-colors flex items-center space-x-2`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Yes, write me a letter</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setShowAILetterPrompt(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 bg-${currentTheme.colors.surface} text-${currentTheme.colors.text.replace('-900', '-700')} rounded-lg hover:bg-${currentTheme.colors.secondary.replace('-400', '-200')} transition-colors`}
                  >
                    Maybe later
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full bg-${currentTheme.colors.surface} text-${currentTheme.colors.text} touch-target`}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className={`text-2xl font-serif text-${currentTheme.colors.text}`}>{t('journalTitle')}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setViewMode('history')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full bg-${currentTheme.colors.primary.replace('-500', '-100')} text-${currentTheme.colors.primary.replace('-500', '-700')} hover:bg-${currentTheme.colors.primary.replace('-500', '-200')} transition-colors touch-target`}
            title="View journal history"
          >
            <History className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Quick Access to Recent Entries */}
      {recentEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-${currentTheme.colors.surface} rounded-xl p-4 border border-${currentTheme.colors.secondary.replace('-400', '-200')}`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-serif text-${currentTheme.colors.text} text-sm`}>Recent Reflections</h3>
            <motion.button
              onClick={() => setViewMode('history')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`text-xs text-${currentTheme.colors.primary.replace('-500', '-600')} hover:text-${currentTheme.colors.primary.replace('-500', '-700')} font-medium touch-target`}
            >
              View All
            </motion.button>
          </div>
          <div className="space-y-2">
            {recentEntries.map((entry) => (
              <div key={entry.id} className={`p-3 bg-${currentTheme.colors.background} rounded-lg border border-${currentTheme.colors.secondary.replace('-400', '-200')}`}>
                <p className={`text-${currentTheme.colors.text} text-sm line-clamp-2 mb-1`}>
                  {entry.content}
                </p>
                <div className={`text-xs text-${currentTheme.colors.text.replace('-900', '-500')}`}>
                  {new Date(entry.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Gentle Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-${currentTheme.colors.surface} rounded-2xl p-6 border border-${currentTheme.colors.secondary.replace('-400', '-200')}`}
      >
        <h3 className={`font-serif text-${currentTheme.colors.text} mb-2`}>{t('safeSpaceThoughts')}</h3>
        <p className={`text-${currentTheme.colors.text.replace('-900', '-700')} text-sm leading-relaxed`}>
          {t('journalDescription')}
        </p>
      </motion.div>

      {/* Safety Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-${currentTheme.colors.background} rounded-xl p-4 border border-${currentTheme.colors.secondary.replace('-400', '-200')}`}
      >
        <div className="flex items-start space-x-2">
          <AlertCircle className={`w-4 h-4 text-${currentTheme.colors.accent.replace('-600', '-600')} mt-0.5 flex-shrink-0`} />
          <div>
            <p className={`text-${currentTheme.colors.text.replace('-900', '-700')} text-sm`}>
              <strong>Journal Guidelines:</strong> This is your personal healing space. 
              Please avoid uploading explicit content. If you're in crisis, visit our Crisis Support section.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Input Mode Selection */}
      <div className="space-y-3">
        <h3 className={`text-lg font-serif text-${currentTheme.colors.text}`}>{t('howToExpress')}</h3>
        <div className="grid grid-cols-2 gap-3">
          {inputModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <motion.button
                key={mode.id}
                onClick={() => {
                  if (mode.id === 'mirror') {
                    setShowMirrorMirror(true);
                  } else {
                    setInputMode(mode.id);
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl text-center transition-all touch-target ${
                  inputMode === mode.id
                    ? `bg-${currentTheme.colors.primary.replace('-500', '-100')} border-2 border-${currentTheme.colors.primary.replace('-500', '-300')} text-${currentTheme.colors.primary.replace('-500', '-800')}`
                    : `bg-white border border-${currentTheme.colors.secondary.replace('-400', '-200')} text-${currentTheme.colors.text.replace('-900', '-700')} hover:bg-${currentTheme.colors.surface}`
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">{mode.label}</div>
                {mode.id === 'mirror' && (
                  <div className="text-xs text-terracotta-600 mt-1">AI-powered</div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Text Input Mode */}
      {inputMode === 'text' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Optional Title */}
          <div>
            <label className={`block text-sm font-medium text-${currentTheme.colors.text.replace('-900', '-700')} mb-2`}>
              Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your entry a title..."
              className={`w-full p-3 border border-${currentTheme.colors.secondary.replace('-400', '-200')} rounded-lg focus:ring-2 focus:ring-${currentTheme.colors.primary.replace('-500', '-300')} focus:border-transparent`}
            />
          </div>

          {/* Themed Prompts */}
          <div className="space-y-3">
            <h4 className={`text-base font-serif text-${currentTheme.colors.text}`}>{t('needGentleNudge')}</h4>
            <div className="grid grid-cols-1 gap-2">
              {prompts.slice(0, 4).map((prompt, index) => (
                <motion.button
                  key={prompt}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handlePromptSelect(prompt)}
                  className={`p-3 text-left text-sm rounded-lg transition-all touch-target ${
                    selectedPrompt === prompt
                      ? `bg-${currentTheme.colors.primary.replace('-500', '-100')} border-2 border-${currentTheme.colors.primary.replace('-500', '-300')}`
                      : `bg-white border border-${currentTheme.colors.secondary.replace('-400', '-200')} hover:bg-${currentTheme.colors.surface}`
                  }`}
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Mood Rating */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium text-${currentTheme.colors.text.replace('-900', '-700')}`}>
              How are you feeling? (optional)
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <motion.button
                  key={rating}
                  onClick={() => setMoodRating(rating)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors touch-target ${
                    moodRating === rating
                      ? `bg-${currentTheme.colors.primary.replace('-500', '-200')} text-${currentTheme.colors.primary.replace('-500', '-800')}`
                      : `bg-${currentTheme.colors.surface} text-${currentTheme.colors.text.replace('-900', '-600')} hover:bg-${currentTheme.colors.secondary.replace('-400', '-200')}`
                  }`}
                >
                  <Star className={`w-4 h-4 ${moodRating === rating ? 'fill-current' : ''}`} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder={t('letThoughtsFlow')}
            className={`w-full h-40 p-4 border border-${currentTheme.colors.secondary.replace('-400', '-200')} rounded-lg focus:ring-2 focus:ring-${currentTheme.colors.primary.replace('-500', '-300')} focus:border-transparent resize-none`}
          />

          {/* Future Email Option - Only for authenticated users */}
          {user && user.email && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-blue-50 rounded-xl p-4 border border-blue-100`}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="sendToFuture"
                  checked={sendToFuture}
                  onChange={(e) => setSendToFuture(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500 touch-target"
                />
                <div className="flex-1">
                  <label htmlFor="sendToFuture" className="flex items-center space-x-2 cursor-pointer">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800 font-medium text-sm">Email this entry to me in 7 days</span>
                  </label>
                  <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                    Receive a gentle reminder from your past self. We'll send this reflection to {user.email} 
                    as a loving message from who you are today.
                  </p>
                  {sendToFuture && (
                    <div className="flex items-center space-x-1 mt-2 text-blue-600">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">
                        Will be sent on {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Media Attachments */}
          {mediaFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className={`text-sm font-medium text-${currentTheme.colors.text.replace('-900', '-700')}`}>Attachments</h4>
              <div className="space-y-2">
                {mediaFiles.map((media, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 bg-${currentTheme.colors.surface} rounded-lg`}>
                    {media.type === 'audio' ? (
                      <Mic className={`w-5 h-5 text-${currentTheme.colors.text.replace('-900', '-600')}`} />
                    ) : (
                      <ImageIcon className={`w-5 h-5 text-${currentTheme.colors.text.replace('-900', '-600')}`} />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium text-${currentTheme.colors.text}`}>{media.file.name}</p>
                      {media.duration && (
                        <p className={`text-xs text-${currentTheme.colors.text.replace('-900', '-600')}`}>{formatDuration(media.duration)}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeMediaFile(index)}
                      className="text-red-500 hover:text-red-700 touch-target"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Media Buttons */}
          <div className="flex space-x-3">
            <motion.button
              onClick={() => setShowAudioRecorder(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center space-x-2 px-4 py-2 bg-${currentTheme.colors.primary.replace('-500', '-100')} text-${currentTheme.colors.primary.replace('-500', '-700')} rounded-lg hover:bg-${currentTheme.colors.primary.replace('-500', '-200')} transition-colors touch-target`}
            >
              <Mic className="w-4 h-4" />
              <span>Add Voice Note</span>
            </motion.button>
            
            <motion.button
              onClick={() => setShowPhotoUploader(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center space-x-2 px-4 py-2 bg-${currentTheme.colors.surface} text-${currentTheme.colors.text.replace('-900', '-700')} rounded-lg hover:bg-${currentTheme.colors.secondary.replace('-400', '-200')} transition-colors touch-target`}
            >
              <Camera className="w-4 h-4" />
              <span>Add Photo</span>
            </motion.button>
          </div>

          {/* Save Button */}
          <motion.button
            onClick={saveEntry}
            disabled={(!journalText.trim() && mediaFiles.length === 0) || saving || emailScheduling}
            whileHover={{ scale: (!journalText.trim() && mediaFiles.length === 0) || saving || emailScheduling ? 1 : 1.02 }}
            whileTap={{ scale: (!journalText.trim() && mediaFiles.length === 0) || saving || emailScheduling ? 1 : 0.98 }}
            className={`w-full py-3 bg-${currentTheme.colors.primary} text-white rounded-lg font-medium hover:bg-${currentTheme.colors.primary.replace('-500', '-600')} transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 touch-target`}
          >
            {emailScheduling ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Scheduling email...</span>
              </>
            ) : saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                {sendToFuture && <Mail className="w-4 h-4" />}
                <span>{sendToFuture ? 'Save & Schedule Email' : t('saveEntry')}</span>
              </>
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Voice Recording Mode */}
      {inputMode === 'voice' && !showAudioRecorder && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className={`w-32 h-32 mx-auto bg-${currentTheme.colors.primary.replace('-500', '-100')} rounded-full flex items-center justify-center`}>
            <Mic className={`w-12 h-12 text-${currentTheme.colors.primary.replace('-500', '-600')}`} />
          </div>
          <p className={`text-${currentTheme.colors.text.replace('-900', '-600')}`}>Ready to record your voice note</p>
          <motion.button
            onClick={() => setShowAudioRecorder(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-8 py-3 bg-${currentTheme.colors.primary} text-white rounded-lg font-medium hover:bg-${currentTheme.colors.primary.replace('-500', '-600')} transition-colors touch-target`}
          >
            Start Recording
          </motion.button>
        </motion.div>
      )}

      {/* Photo Mode */}
      {inputMode === 'photo' && !showPhotoUploader && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className={`w-32 h-32 mx-auto bg-${currentTheme.colors.secondary.replace('-400', '-100')} rounded-full flex items-center justify-center`}>
            <Camera className={`w-12 h-12 text-${currentTheme.colors.secondary.replace('-400', '-600')}`} />
          </div>
          <p className={`text-${currentTheme.colors.text.replace('-900', '-600')}`}>Share a moment through photography</p>
          <motion.button
            onClick={() => setShowPhotoUploader(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-8 py-3 bg-${currentTheme.colors.secondary.replace('-400', '-500')} text-white rounded-lg font-medium hover:bg-${currentTheme.colors.secondary.replace('-400', '-600')} transition-colors touch-target`}
          >
            Add Photo
          </motion.button>
        </motion.div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showAudioRecorder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <AudioRecorder
              onRecordingComplete={handleAudioRecordingComplete}
              onCancel={() => setShowAudioRecorder(false)}
            />
          </motion.div>
        )}

        {showPhotoUploader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <PhotoUploader
              onPhotoSelected={handlePhotoSelected}
              onCancel={() => setShowPhotoUploader(false)}
            />
          </motion.div>
        )}

        {showMirrorMirror && (
          <MirrorMirror
            onClose={() => setShowMirrorMirror(false)}
            onSave={handleMirrorMirrorSave}
          />
        )}
      </AnimatePresence>

      {/* Safety Modal */}
      <SafetyModal
        isOpen={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
        onContinue={handleSafetyModalContinue}
        flaggedWords={flaggedWords}
      />

      {/* AI Letter Modal */}
      <AILetterModal
        isOpen={showAILetterModal}
        onClose={() => setShowAILetterModal(false)}
        content={lastSavedEntry}
        onSaveLetter={handleSaveAILetter}
      />
    </div>
  );
};

export default Journal;