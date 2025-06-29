import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Play, Pause, Calendar, Type, Mic, Camera, Share, Trash2, Edit3 } from 'lucide-react';
import { EnhancedJournalEntry } from '../../lib/journalStorage';
import { getCurrentTheme } from '../../lib/themeManager';
import { useLocalization } from '../../contexts/LocalizationContext';

interface JournalEntryDetailProps {
  entry: EnhancedJournalEntry;
  onBack: () => void;
  onPlayAudio: (audioUrl: string, entryId: string) => void;
  playingAudio: string | null;
  formatDuration: (seconds: number) => string;
}

const JournalEntryDetail: React.FC<JournalEntryDetailProps> = ({
  entry,
  onBack,
  onPlayAudio,
  playingAudio,
  formatDuration
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { t } = useLocalization();
  const currentTheme = getCurrentTheme();

  const getEntryTypeIcon = (type: string) => {
    switch (type) {
      case 'voice':
        return Mic;
      case 'photo':
        return Camera;
      default:
        return Type;
    }
  };

  const shareEntry = async () => {
    const shareText = `${entry.title ? entry.title + '\n\n' : ''}${entry.content}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: entry.title || 'Journal Entry',
          text: shareText
        });
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const EntryIcon = getEntryTypeIcon(entry.entry_type);

  return (
    <div className="p-6 space-y-6">
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
          <h1 className={`text-2xl font-serif text-${currentTheme.colors.text}`}>
            {entry.title || 'Journal Entry'}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            onClick={shareEntry}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full bg-${currentTheme.colors.surface} text-${currentTheme.colors.text} touch-target`}
            title="Share entry"
          >
            <Share className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            onClick={() => setShowDeleteConfirm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors touch-target"
            title="Delete entry"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Entry Metadata */}
      <div className={`bg-${currentTheme.colors.surface} rounded-xl p-4 border border-${currentTheme.colors.secondary.replace('-400', '-200')}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <EntryIcon className={`w-4 h-4 text-${currentTheme.colors.primary.replace('-500', '-600')}`} />
              <span className={`text-sm font-medium text-${currentTheme.colors.text.replace('-900', '-700')}`}>
                {entry.entry_type.charAt(0).toUpperCase() + entry.entry_type.slice(1)} Entry
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className={`w-4 h-4 text-${currentTheme.colors.text.replace('-900', '-500')}`} />
              <span className={`text-sm text-${currentTheme.colors.text.replace('-900', '-600')}`}>
                {new Date(entry.created_at).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          {entry.mood_rating && (
            <div className="flex items-center space-x-1">
              <span className={`text-sm text-${currentTheme.colors.text.replace('-900', '-600')} mr-1`}>Mood:</span>
              {[...Array(entry.mood_rating)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 text-${currentTheme.colors.accent.replace('-600', '-500')} fill-current`} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prompt (if exists) */}
      {entry.prompt && (
        <div className={`bg-${currentTheme.colors.background} rounded-xl p-4 border border-${currentTheme.colors.secondary.replace('-400', '-200')}`}>
          <h3 className={`text-sm font-medium text-${currentTheme.colors.text.replace('-900', '-700')} mb-2`}>
            Reflection Prompt
          </h3>
          <p className={`text-${currentTheme.colors.text.replace('-900', '-600')} italic`}>
            {entry.prompt}
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className={`bg-${currentTheme.colors.background} rounded-xl p-6 border border-${currentTheme.colors.secondary.replace('-400', '-200')}`}>
        <div className={`prose prose-sm max-w-none text-${currentTheme.colors.text} leading-relaxed whitespace-pre-wrap`}>
          {entry.content}
        </div>
      </div>

      {/* Media Attachments */}
      {entry.media && entry.media.length > 0 && (
        <div className={`bg-${currentTheme.colors.surface} rounded-xl p-4 border border-${currentTheme.colors.secondary.replace('-400', '-200')}`}>
          <h3 className={`text-sm font-medium text-${currentTheme.colors.text.replace('-900', '-700')} mb-4`}>
            Attachments
          </h3>
          <div className="space-y-4">
            {entry.media.map((media) => (
              <div key={media.id} className={`p-4 bg-${currentTheme.colors.background} rounded-lg border border-${currentTheme.colors.secondary.replace('-400', '-200')}`}>
                {media.media_type === 'audio' ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <motion.button
                        onClick={() => media.signed_url && onPlayAudio(media.signed_url, entry.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 rounded-full bg-${currentTheme.colors.primary.replace('-500', '-100')} text-${currentTheme.colors.primary.replace('-500', '-700')} hover:bg-${currentTheme.colors.primary.replace('-500', '-200')} transition-colors touch-target`}
                      >
                        {playingAudio === entry.id ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </motion.button>
                      <div>
                        <p className={`font-medium text-${currentTheme.colors.text}`}>{media.file_name}</p>
                        <p className={`text-sm text-${currentTheme.colors.text.replace('-900', '-600')}`}>
                          {media.duration ? formatDuration(media.duration) : 'Audio recording'}
                        </p>
                      </div>
                    </div>
                    <div className={`text-xs text-${currentTheme.colors.text.replace('-900', '-500')}`}>
                      {(media.file_size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                ) : (
                  media.signed_url && (
                    <div className="space-y-3">
                      <img
                        src={media.signed_url}
                        alt="Journal attachment"
                        className="w-full max-w-md mx-auto rounded-lg shadow-sm"
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span className={`text-${currentTheme.colors.text.replace('-900', '-700')}`}>{media.file_name}</span>
                        <span className={`text-${currentTheme.colors.text.replace('-900', '-500')}`}>
                          {(media.file_size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              
              <div>
                <h3 className="text-lg font-serif text-sage-800 mb-2">Delete Journal Entry</h3>
                <p className="text-sage-600 text-sm">
                  Are you sure you want to delete this entry? This action cannot be undone.
                </p>
              </div>

              <div className="flex space-x-3">
                <motion.button
                  onClick={() => setShowDeleteConfirm(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-sage-100 text-sage-700 rounded-lg font-medium hover:bg-sage-200 transition-colors touch-target"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => {
                    // TODO: Implement delete functionality
                    setShowDeleteConfirm(false);
                    onBack();
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors touch-target"
                >
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default JournalEntryDetail;