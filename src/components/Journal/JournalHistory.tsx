import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Calendar, Filter, Play, Pause, Star, Eye, Download, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocalization } from '../../contexts/LocalizationContext';
import { GuestStorageManager } from '../../lib/guestStorage';
import { loadJournalEntries, EnhancedJournalEntry } from '../../lib/journalStorage';
import { getCurrentTheme } from '../../lib/themeManager';
import JournalEntryDetail from './JournalEntryDetail';

interface JournalHistoryProps {
  onBack: () => void;
}

const JournalHistory: React.FC<JournalHistoryProps> = ({ onBack }) => {
  const [entries, setEntries] = useState<EnhancedJournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<EnhancedJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<EnhancedJournalEntry | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'text' | 'voice' | 'photo'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'mood'>('newest');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { user, isGuest } = useAuth();
  const { t } = useLocalization();
  const currentTheme = getCurrentTheme();

  useEffect(() => {
    loadAllEntries();
  }, [user, isGuest]);

  useEffect(() => {
    filterAndSortEntries();
  }, [entries, searchQuery, filterType, sortBy]);

  const loadAllEntries = async () => {
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
        // Load all entries from Supabase for authenticated users
        const result = await loadJournalEntries(user.id, 100); // Load more entries
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

  const filterAndSortEntries = () => {
    let filtered = [...entries];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.content.toLowerCase().includes(query) ||
        entry.title?.toLowerCase().includes(query) ||
        entry.prompt?.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(entry => entry.entry_type === filterType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'mood':
          return (b.mood_rating || 0) - (a.mood_rating || 0);
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredEntries(filtered);
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

  const exportEntries = () => {
    const exportData = filteredEntries.map(entry => ({
      date: new Date(entry.created_at).toLocaleDateString(),
      title: entry.title || 'Untitled',
      content: entry.content,
      prompt: entry.prompt,
      type: entry.entry_type,
      mood: entry.mood_rating
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `journal-entries-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className={`text-${currentTheme.colors.text.replace('-900', '-600')}`}>Loading your journal history...</div>
      </div>
    );
  }

  // Show detailed entry view
  if (selectedEntry) {
    return (
      <JournalEntryDetail
        entry={selectedEntry}
        onBack={() => setSelectedEntry(null)}
        onPlayAudio={playAudio}
        playingAudio={playingAudio}
        formatDuration={formatDuration}
      />
    );
  }

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
          <h1 className={`text-2xl font-serif text-${currentTheme.colors.text}`}>Journal History</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full bg-${currentTheme.colors.surface} text-${currentTheme.colors.text} touch-target`}
          >
            <Filter className="w-5 h-5" />
          </motion.button>
          
          {filteredEntries.length > 0 && (
            <motion.button
              onClick={exportEntries}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-full bg-${currentTheme.colors.primary.replace('-500', '-100')} text-${currentTheme.colors.primary.replace('-500', '-700')} touch-target`}
              title="Export entries"
            >
              <Download className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-${currentTheme.colors.text.replace('-900', '-400')}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your journal entries..."
          className={`w-full pl-10 pr-4 py-3 border border-${currentTheme.colors.secondary.replace('-400', '-200')} rounded-lg focus:ring-2 focus:ring-${currentTheme.colors.primary.replace('-500', '-300')} focus:border-transparent`}
        />
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`bg-${currentTheme.colors.surface} rounded-xl p-4 border border-${currentTheme.colors.secondary.replace('-400', '-200')} space-y-4`}
          >
            {/* Entry Type Filter */}
            <div>
              <label className={`block text-sm font-medium text-${currentTheme.colors.text.replace('-900', '-700')} mb-2`}>
                Entry Type
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'text', label: 'Text' },
                  { id: 'voice', label: 'Voice' },
                  { id: 'photo', label: 'Photo' }
                ].map((type) => (
                  <motion.button
                    key={type.id}
                    onClick={() => setFilterType(type.id as any)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors touch-target ${
                      filterType === type.id
                        ? `bg-${currentTheme.colors.primary} text-white`
                        : `bg-${currentTheme.colors.background} text-${currentTheme.colors.text.replace('-900', '-700')} hover:bg-${currentTheme.colors.secondary.replace('-400', '-100')}`
                    }`}
                  >
                    {type.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className={`block text-sm font-medium text-${currentTheme.colors.text.replace('-900', '-700')} mb-2`}>
                Sort By
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'newest', label: 'Newest First' },
                  { id: 'oldest', label: 'Oldest First' },
                  { id: 'mood', label: 'Mood Rating' }
                ].map((sort) => (
                  <motion.button
                    key={sort.id}
                    onClick={() => setSortBy(sort.id as any)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors touch-target ${
                      sortBy === sort.id
                        ? `bg-${currentTheme.colors.secondary.replace('-400', '-500')} text-white`
                        : `bg-${currentTheme.colors.background} text-${currentTheme.colors.text.replace('-900', '-700')} hover:bg-${currentTheme.colors.secondary.replace('-400', '-100')}`
                    }`}
                  >
                    {sort.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Summary */}
      <div className={`text-sm text-${currentTheme.colors.text.replace('-900', '-600')}`}>
        {searchQuery ? (
          <>Showing {filteredEntries.length} result{filteredEntries.length !== 1 ? 's' : ''} for "{searchQuery}"</>
        ) : (
          <>Showing {filteredEntries.length} of {entries.length} entries</>
        )}
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <Calendar className={`w-16 h-16 mx-auto text-${currentTheme.colors.text.replace('-900', '-300')}`} />
          <h3 className={`text-lg font-serif text-${currentTheme.colors.text.replace('-900', '-600')}`}>
            {searchQuery ? 'No entries found' : 'No journal entries yet'}
          </h3>
          <p className={`text-${currentTheme.colors.text.replace('-900', '-500')}`}>
            {searchQuery 
              ? 'Try adjusting your search terms or filters'
              : 'Start writing to see your entries here'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-${currentTheme.colors.background} rounded-xl p-5 border border-${currentTheme.colors.secondary.replace('-400', '-200')} hover:shadow-md transition-all cursor-pointer`}
              onClick={() => setSelectedEntry(entry)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Entry Header */}
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 bg-${currentTheme.colors.primary.replace('-500', '-100')} text-${currentTheme.colors.primary.replace('-500', '-700')} text-xs font-medium rounded-full`}>
                      {entry.entry_type}
                    </span>
                    <span className={`text-xs text-${currentTheme.colors.text.replace('-900', '-500')}`}>
                      {new Date(entry.created_at).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    {entry.mood_rating && (
                      <div className="flex space-x-0.5">
                        {[...Array(entry.mood_rating)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 text-${currentTheme.colors.accent.replace('-600', '-500')} fill-current`} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  {entry.title && (
                    <h3 className={`font-medium text-${currentTheme.colors.text} mb-2 truncate`}>
                      {entry.title}
                    </h3>
                  )}

                  {/* Prompt */}
                  {entry.prompt && (
                    <div className={`text-xs text-${currentTheme.colors.text.replace('-900', '-600')} mb-2 font-medium italic`}>
                      {entry.prompt}
                    </div>
                  )}

                  {/* Content Preview */}
                  <p className={`text-${currentTheme.colors.text.replace('-900', '-700')} text-sm leading-relaxed line-clamp-3 mb-3`}>
                    {entry.content}
                  </p>

                  {/* Media Attachments */}
                  {entry.media && entry.media.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {entry.media.map((media) => (
                        <div key={media.id} className="flex items-center space-x-2">
                          {media.media_type === 'audio' ? (
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                media.signed_url && playAudio(media.signed_url, entry.id);
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex items-center space-x-1 px-2 py-1 bg-${currentTheme.colors.primary.replace('-500', '-100')} text-${currentTheme.colors.primary.replace('-500', '-700')} rounded text-xs hover:bg-${currentTheme.colors.primary.replace('-500', '-200')} transition-colors touch-target`}
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
                                className={`w-12 h-12 object-cover rounded border border-${currentTheme.colors.secondary.replace('-400', '-200')}`}
                                onClick={(e) => e.stopPropagation()}
                              />
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* View Button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEntry(entry);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`ml-4 p-2 rounded-full bg-${currentTheme.colors.secondary.replace('-400', '-100')} text-${currentTheme.colors.secondary.replace('-400', '-700')} hover:bg-${currentTheme.colors.secondary.replace('-400', '-200')} transition-colors touch-target`}
                  title="View full entry"
                >
                  <Eye className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalHistory;