import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Trash2 } from 'lucide-react';
import { getFavoriteResponses, CheckInResponse } from '../lib/checkInResponses';

interface FavoriteResponsesProps {
  onBack: () => void;
}

interface SavedResponse extends CheckInResponse {
  emotion?: string;
  color?: string;
  savedAt: string;
}

const FavoriteResponses: React.FC<FavoriteResponsesProps> = ({ onBack }) => {
  const [favorites, setFavorites] = useState<SavedResponse[]>([]);

  useEffect(() => {
    const savedFavorites = getFavoriteResponses();
    setFavorites(savedFavorites);
  }, []);

  const removeFavorite = (index: number) => {
    const updatedFavorites = favorites.filter((_, i) => i !== index);
    setFavorites(updatedFavorites);
    localStorage.setItem('shameless_favorite_responses', JSON.stringify(updatedFavorites));
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
        <h1 className="text-2xl font-serif text-sage-800">Saved Combinations</h1>
      </div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cream-50 rounded-2xl p-6 border border-cream-100"
      >
        <div className="flex items-center space-x-2 mb-3">
          <Heart className="w-5 h-5 text-cream-600" />
          <h3 className="font-serif text-cream-800">Your favorite moments</h3>
        </div>
        <p className="text-cream-700 text-sm leading-relaxed">
          These are the emotion + color combinations that resonated most with you. 
          Revisit them whenever you need their specific comfort.
        </p>
      </motion.div>

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <Heart className="w-16 h-16 mx-auto text-sage-300" />
          <h3 className="text-lg font-serif text-sage-600">No saved combinations yet</h3>
          <p className="text-sage-500">
            When you find a check-in response that really speaks to you, 
            save it to revisit later.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((favorite, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${favorite.backgroundColor} rounded-2xl p-6 relative`}
            >
              {/* Remove button */}
              <motion.button
                onClick={() => removeFavorite(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 p-2 bg-white/80 rounded-full text-sage-600 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>

              {/* Content */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{favorite.emoji}</span>
                  {favorite.emotion && favorite.color && (
                    <span className="text-sm text-sage-600 bg-white/60 px-2 py-1 rounded-full">
                      {favorite.emotion} + {favorite.color}
                    </span>
                  )}
                </div>

                <blockquote className="text-lg font-serif text-sage-800 leading-relaxed">
                  "{favorite.affirmation}"
                </blockquote>

                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-sm text-sage-700 font-medium mb-1">Reflection:</p>
                  <p className="text-sm text-sage-600">{favorite.reflection}</p>
                </div>

                <div className="text-xs text-sage-500">
                  Saved on {new Date(favorite.savedAt).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteResponses;