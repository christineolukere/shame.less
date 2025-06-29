import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, Camera, Type, Play, Pause, Image as ImageIcon, AlertCircle, CheckCircle, Star, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { GuestStorageManager } from '../lib/guestStorage';
import { 
  saveJournalEntry, 
  loadJournalEntries, 
  checkContentSafety, 
  EnhancedJournalEntry 
} from '../lib/journalStorage';
import { saveAILetter } from '../lib/aiLetterStorage';
import AudioRecorder from './Journal/AudioRecorder';
import PhotoUploader from './Journal/PhotoUploader';
import SafetyModal from './Journal/SafetyModal';
import AILetterModal from './AILetter/AILetterModal';

interface JournalProps {
  onBack: () => void;
}

type InputMode = 'text' | 'voice' | 'photo';

interface MediaFile {
  file: File;
  type: 'audio' | 'photo';
  duration?: number;
  preview?: string;
}

const Journal: React.FC<JournalProps> = ({ onBack }) => {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [title, setTitle] = useState('');
  const [journalText, setJournalText] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [moodRating, setMoodRating] = useState<number | null>(null);
  const [entries, setEntries] = useState<EnhancedJournalEntry[]>([]);
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
  
  const { t } = useLocalization();
  const { user, isGuest } = useAuth();

  const prompts = [
    t('gratefulFor'),
    t('showedKindness'),
    t('boundaryHonored'),
    t('madeSmile'),
    t('needToRelease'),
    t('howGrowing'),
    t('tellYoungerSelf'),
    t('bringsYouPeace'),
  ];

  const inputModes = [
    { id: 'text', icon: Type, label: t('write') },
    { id: 'voice', icon: Mic, label: t('speak') },
    { id: 'photo', icon: Camera, label: t('capture') },
  ] as const;

  useEffect(() => {
    loadJournalData();
  }, [user, isGuest]);

  const loadJournalData = async () => {
    setLoading(true);
    try {
      if (isGuest) {
        // Load from local storage for guest users
        const guestData = GuestStorageManager.getGuestData();
        const formattedEntries: EnhancedJournalEntry[] = guestData.journalEntries.map(entry => ({
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
        setEntries(formattedEntries);
      } else if (user) {
        // Load from Supabase for authenticated users
        const result = await loadJournalEntries(user.id, 10);
        if (result.success && result.entries) {
          setEntries(result.entries);
        }
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
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
      if (isGuest) {
        // Save to local storage for guest users
        GuestStorageManager.addJournalEntry({
          content: journalText.trim(),
          prompt: selectedPrompt || undefined,
          entryType: inputMode
        });
        
        // Reload entries to get the new one
        await loadJournalData();
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
          // Reload entries to get the updated list
          await loadJournalData();
        } else {
          throw new Error(result.error);
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-sage-600">Loading your journal...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Success Message */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-sage-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Your reflection has been saved</span>
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
            className="bg-gradient-to-r from-terracotta-50 to-sage-50 rounded-2xl p-6 border border-terracotta-100"
          >
            <div className="flex items-start space-x-3">
              <Sparkles className="w-6 h-6 text-terracotta-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-serif text-terracotta-800 mb-2">
                  Would you like an AI-written letter based on what you shared?
                </h3>
                <p className="text-terracotta-700 text-sm mb-4 leading-relaxed">
                  I can write you a gentle, personalized letter that reflects on your journal entry 
                  and offers comfort and encouragement.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={handleAILetterRequest}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 transition-colors flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Yes, write me a letter</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setShowAILetterPrompt(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors"
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
      <div className="flex items-center space-x-4">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-sage-100 text-sage-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <h1 className="text-2xl font-serif text-sage-800">{t('journalTitle')}</h1>
      </div>

      {/* Gentle Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-lavender-50 rounded-2xl p-6 border border-lavender-100"
      >
        <h3 className="font-serif text-lavender-800 mb-2">{t('safeSpaceThoughts')}</h3>
        <p className="text-lavender-700 text-sm leading-relaxed">
          {t('journalDescription')}
        </p>
      </motion.div>

      {/* Safety Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cream-50 rounded-xl p-4 border border-cream-100"
      >
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-cream-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-cream-700 text-sm">
              <strong>Journal Guidelines:</strong> This is your personal healing space. 
              Please avoid uploading explicit content. If you're in crisis, visit our Crisis Support section.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Input Mode Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-serif text-sage-800">{t('howToExpress')}</h3>
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

      {/* Text Input Mode */}
      {inputMode === 'text' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Optional Title */}
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your entry a title..."
              className="w-full p-3 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-300 focus:border-transparent"
            />
          </div>

          {/* Gentle Prompts */}
          <div className="space-y-3">
            <h4 className="text-base font-serif text-sage-800">{t('needGentleNudge')}</h4>
            <div className="grid grid-cols-1 gap-2">
              {prompts.slice(0, 4).map((prompt, index) => (
                <motion.button
                  key={prompt}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handlePromptSelect(prompt)}
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

          {/* Mood Rating */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-sage-700">
              How are you feeling? (optional)
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <motion.button
                  key={rating}
                  onClick={() => setMoodRating(rating)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    moodRating === rating
                      ? 'bg-terracotta-200 text-terracotta-800'
                      : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
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
            className="w-full h-40 p-4 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-300 focus:border-transparent resize-none"
          />

          {/* Media Attachments */}
          {mediaFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-sage-700">Attachments</h4>
              <div className="space-y-2">
                {mediaFiles.map((media, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-sage-50 rounded-lg">
                    {media.type === 'audio' ? (
                      <Mic className="w-5 h-5 text-sage-600" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-sage-600" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-sage-800">{media.file.name}</p>
                      {media.duration && (
                        <p className="text-xs text-sage-600">{formatDuration(media.duration)}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeMediaFile(index)}
                      className="text-red-500 hover:text-red-700"
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
              className="flex items-center space-x-2 px-4 py-2 bg-terracotta-100 text-terracotta-700 rounded-lg hover:bg-terracotta-200 transition-colors"
            >
              <Mic className="w-4 h-4" />
              <span>Add Voice Note</span>
            </motion.button>
            
            <motion.button
              onClick={() => setShowPhotoUploader(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors"
            >
              <Camera className="w-4 h-4" />
              <span>Add Photo</span>
            </motion.button>
          </div>

          {/* Save Button */}
          <motion.button
            onClick={saveEntry}
            disabled={(!journalText.trim() && mediaFiles.length === 0) || saving}
            whileHover={{ scale: (!journalText.trim() && mediaFiles.length === 0) || saving ? 1 : 1.02 }}
            whileTap={{ scale: (!journalText.trim() && mediaFiles.length === 0) || saving ? 1 : 0.98 }}
            className="w-full py-3 bg-sage-500 text-white rounded-lg font-medium hover:bg-sage-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : t('saveEntry')}
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
          <div className="w-32 h-32 mx-auto bg-terracotta-100 rounded-full flex items-center justify-center">
            <Mic className="w-12 h-12 text-terracotta-600" />
          </div>
          <p className="text-sage-600">Ready to record your voice note</p>
          <motion.button
            onClick={() => setShowAudioRecorder(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-terracotta-500 text-white rounded-lg font-medium hover:bg-terracotta-600 transition-colors"
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
          <div className="w-32 h-32 mx-auto bg-lavender-100 rounded-full flex items-center justify-center">
            <Camera className="w-12 h-12 text-lavender-600" />
          </div>
          <p className="text-sage-600">Share a moment through photography</p>
          <motion.button
            onClick={() => setShowPhotoUploader(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-lavender-500 text-white rounded-lg font-medium hover:bg-lavender-600 transition-colors"
          >
            Add Photo
          </motion.button>
        </motion.div>
      )}

      {/* Recent Entries */}
      {entries.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-serif text-sage-800">Recent reflections</h3>
          <div className="space-y-3">
            {entries.slice(0, 5).map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-cream-50 rounded-lg border border-cream-100"
              >
                {entry.title && (
                  <h4 className="font-medium text-cream-800 mb-2">{entry.title}</h4>
                )}
                
                {entry.prompt && (
                  <div className="text-xs text-cream-600 mb-2 font-medium">
                    {entry.prompt}
                  </div>
                )}
                
                <p className="text-cream-800 text-sm leading-relaxed line-clamp-3 mb-3">
                  {entry.content}
                </p>

                {/* Media Attachments */}
                {entry.media && entry.media.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {entry.media.map((media) => (
                      <div key={media.id} className="flex items-center space-x-2">
                        {media.media_type === 'audio' ? (
                          <motion.button
                            onClick={() => media.signed_url && playAudio(media.signed_url, entry.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-1 px-2 py-1 bg-terracotta-100 text-terracotta-700 rounded text-xs hover:bg-terracotta-200 transition-colors"
                          >
                            {playingAudio === entry.id ? (
                              <Pause className="w-3 h-3" />
                            ) : (
                              <Play className="w-3 h-3" />
                            )}
                            <span>{media.duration ? formatDuration(media.duration) : 'Audio'}</span>
                          </motion.button>
                        ) : (
                          media.signed_url && (
                            <img
                              src={media.signed_url}
                              alt="Journal attachment"
                              className="w-12 h-12 object-cover rounded border border-cream-200"
                            />
                          )
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xs text-cream-600">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </div>
                  
                  {entry.mood_rating && (
                    <div className="flex space-x-1">
                      {[...Array(entry.mood_rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-terracotta-500 fill-current" />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
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