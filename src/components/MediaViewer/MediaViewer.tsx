import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Download, Eye, ThumbsUp, User, Refresh2, AlertCircle, Bookmark, BookmarkCheck } from 'lucide-react';
import { pixabayAPI, ProcessedMedia } from '../../lib/pixabayApi';

interface MediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  mood?: string;
  color?: string;
  contentType?: 'image' | 'video' | 'both';
  searchQuery?: string;
}

const MediaViewer: React.FC<MediaViewerProps> = ({
  isOpen,
  onClose,
  mood = 'peaceful',
  color,
  contentType = 'image',
  searchQuery
}) => {
  const [media, setMedia] = useState<ProcessedMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<ProcessedMedia | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen, mood, color, contentType, searchQuery]);

  const loadMedia = async () => {
    setLoading(true);
    setError(null);

    try {
      if (searchQuery) {
        // Direct search
        const results = await pixabayAPI.searchCalmingImages({
          query: searchQuery,
          safeSearch: true
        });
        setMedia(results);
      } else {
        // Mood-based search
        const results = await pixabayAPI.getMoodBasedContent(mood, color, contentType);
        
        if (contentType === 'image') {
          setMedia(results.images);
        } else if (contentType === 'video') {
          setMedia(results.videos);
        } else {
          setMedia([...results.images, ...results.videos]);
        }
      }
    } catch (err: any) {
      setError('Unable to load media. Please try again.');
      console.error('Media loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaSelect = (mediaItem: ProcessedMedia, index: number) => {
    setSelectedMedia(mediaItem);
    setCurrentIndex(index);
  };

  const navigateMedia = (direction: 'prev' | 'next') => {
    if (media.length === 0) return;
    
    let newIndex = currentIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : media.length - 1;
    } else {
      newIndex = currentIndex < media.length - 1 ? currentIndex + 1 : 0;
    }
    
    setCurrentIndex(newIndex);
    setSelectedMedia(media[newIndex]);
  };

  const toggleFavorite = (mediaItem: ProcessedMedia) => {
    if (pixabayAPI.isFavorited(mediaItem.id)) {
      pixabayAPI.removeFavoriteMedia(mediaItem.id);
    } else {
      pixabayAPI.saveFavoriteMedia(mediaItem);
    }
    // Force re-render by updating the media array
    setMedia([...media]);
  };

  const getMoodDescription = () => {
    const descriptions: Record<string, string> = {
      peaceful: 'Serene and calming visuals to center your mind',
      content: 'Warm and comforting imagery for satisfaction',
      tender: 'Gentle and nurturing visuals for sensitive moments',
      heavy: 'Contemplative imagery for processing difficult feelings',
      frustrated: 'Dynamic visuals to help release tension',
      growing: 'Inspiring imagery for personal development',
      hopeful: 'Uplifting visuals to nurture optimism',
      tired: 'Restful imagery for relaxation and recovery'
    };
    
    return descriptions[mood] || 'Curated visuals for your current mood';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-sage-100">
            <div>
              <h2 className="text-xl font-serif text-sage-800">
                {searchQuery ? `Search: "${searchQuery}"` : `${mood} visuals`}
              </h2>
              <p className="text-sm text-sage-600 mt-1">
                {searchQuery ? 'Custom search results' : getMoodDescription()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={loadMedia}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                className="p-2 rounded-full bg-sage-100 text-sage-700 hover:bg-sage-200 transition-colors disabled:opacity-50"
                title="Refresh content"
              >
                <Refresh2 className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </motion.button>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-sage-100 text-sage-700 hover:bg-sage-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-sage-500 border-t-transparent rounded-full"
                />
                <span className="ml-3 text-sage-600">Loading calming visuals...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                  <p className="text-red-600">{error}</p>
                  <motion.button
                    onClick={loadMedia}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors"
                  >
                    Try Again
                  </motion.button>
                </div>
              </div>
            )}

            {!loading && !error && media.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sage-600">No media found for your current mood. Try refreshing or adjusting your preferences.</p>
              </div>
            )}

            {!loading && !error && media.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {media.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group cursor-pointer"
                    onClick={() => handleMediaSelect(item, index)}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-sage-100">
                      {item.type === 'image' ? (
                        <img
                          src={item.previewUrl || item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-sage-100 to-lavender-100 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-white text-sm">▶</span>
                            </div>
                            <p className="text-xs text-sage-600">Video</p>
                            {item.duration && (
                              <p className="text-xs text-sage-500">{Math.round(item.duration)}s</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-end">
                      <div className="p-3 w-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-white text-xs">
                            <Eye className="w-3 h-3" />
                            <span>{item.stats.views.toLocaleString()}</span>
                            <ThumbsUp className="w-3 h-3 ml-2" />
                            <span>{item.stats.likes.toLocaleString()}</span>
                          </div>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(item);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 rounded-full bg-white/20 backdrop-blur-sm"
                          >
                            {pixabayAPI.isFavorited(item.id) ? (
                              <BookmarkCheck className="w-4 h-4 text-yellow-400" />
                            ) : (
                              <Bookmark className="w-4 h-4 text-white" />
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Media Modal */}
          <AnimatePresence>
            {selectedMedia && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 z-60 flex items-center justify-center p-4"
                onClick={() => setSelectedMedia(null)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button */}
                  <motion.button
                    onClick={() => setSelectedMedia(null)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full backdrop-blur-sm"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>

                  {/* Navigation buttons */}
                  {media.length > 1 && (
                    <>
                      <motion.button
                        onClick={() => navigateMedia('prev')}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full backdrop-blur-sm"
                      >
                        ←
                      </motion.button>
                      <motion.button
                        onClick={() => navigateMedia('next')}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full backdrop-blur-sm"
                      >
                        →
                      </motion.button>
                    </>
                  )}

                  {/* Media content */}
                  <div className="relative">
                    {selectedMedia.type === 'image' ? (
                      <img
                        src={selectedMedia.url}
                        alt={selectedMedia.title}
                        className="w-full h-auto max-h-[70vh] object-contain"
                      />
                    ) : (
                      <video
                        src={selectedMedia.url}
                        controls
                        autoPlay
                        loop
                        muted
                        className="w-full h-auto max-h-[70vh] object-contain"
                      />
                    )}
                  </div>

                  {/* Media info */}
                  <div className="p-6 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-serif text-sage-800 mb-2">{selectedMedia.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-sage-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{selectedMedia.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{selectedMedia.stats.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{selectedMedia.stats.likes.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedMedia.tags.slice(0, 5).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-sage-100 text-sage-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <motion.button
                        onClick={() => toggleFavorite(selectedMedia)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 rounded-full transition-colors ${
                          pixabayAPI.isFavorited(selectedMedia.id)
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
                        }`}
                      >
                        {pixabayAPI.isFavorited(selectedMedia.id) ? (
                          <BookmarkCheck className="w-5 h-5" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MediaViewer;