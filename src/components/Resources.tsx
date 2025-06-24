import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, Heart, Users, Headphones, Video, ExternalLink } from 'lucide-react';

interface ResourcesProps {
  onBack: () => void;
}

const Resources: React.FC<ResourcesProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('stories');

  const categories = [
    { id: 'stories', label: 'Stories', icon: Book, color: 'terracotta' },
    { id: 'healing', label: 'Healing', icon: Heart, color: 'sage' },
    { id: 'community', label: 'Community', icon: Users, color: 'lavender' },
    { id: 'media', label: 'Media', icon: Headphones, color: 'cream' },
  ];

  const resources = {
    stories: [
      {
        title: "Maya's Journey: From Shame to Self-Love",
        description: "A young Black woman shares her path to healing from perfectionism and finding her voice.",
        type: "Personal Story",
        readTime: "5 min read",
        color: "terracotta"
      },
      {
        title: "Breaking Generational Patterns",
        description: "How one Latina woman learned to honor her emotions while respecting her family's culture.",
        type: "Healing Journey",
        readTime: "7 min read",
        color: "sage"
      },
      {
        title: "The Power of Saying No",
        description: "Stories from women of color who learned that boundaries are acts of self-love.",
        type: "Boundary Setting",
        readTime: "4 min read",
        color: "lavender"
      }
    ],
    healing: [
      {
        title: "Gentle Breathing for Anxiety",
        description: "A 5-minute guided breathing exercise designed for moments of overwhelm.",
        type: "Audio Guide",
        readTime: "5 min",
        color: "sage"
      },
      {
        title: "Cultural Healing Practices",
        description: "Exploring traditional wellness practices from various cultures and communities.",
        type: "Educational",
        readTime: "10 min read",
        color: "cream"
      },
      {
        title: "Shame Resilience Toolkit",
        description: "Research-backed strategies for building shame resilience, adapted for young women of color.",
        type: "Toolkit",
        readTime: "15 min read",
        color: "terracotta"
      }
    ],
    community: [
      {
        title: "Sister Circle Support Groups",
        description: "Virtual support groups for young women of color navigating mental health challenges.",
        type: "Support Group",
        readTime: "Weekly meetings",
        color: "lavender"
      },
      {
        title: "Healing Justice Collective",
        description: "A community-led organization focused on accessible mental health resources.",
        type: "Organization",
        readTime: "Ongoing",
        color: "sage"
      },
      {
        title: "Cultural Wellness Network",
        description: "Connecting with therapists and healers who understand intersectional identities.",
        type: "Directory",
        readTime: "Browse",
        color: "terracotta"
      }
    ],
    media: [
      {
        title: "Therapy for Black Girls Podcast",
        description: "Mental health conversations specifically for Black women and girls.",
        type: "Podcast",
        readTime: "30-60 min episodes",
        color: "terracotta"
      },
      {
        title: "Healing Sounds Playlist",
        description: "Curated music for relaxation, featuring artists from diverse backgrounds.",
        type: "Music",
        readTime: "2 hours",
        color: "cream"
      },
      {
        title: "Mindful Movement Videos",
        description: "Gentle yoga and movement practices led by instructors of color.",
        type: "Video",
        readTime: "10-30 min",
        color: "sage"
      }
    ]
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
        <h1 className="text-2xl font-serif text-sage-800">Resource Garden</h1>
      </div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-sage-50 rounded-2xl p-6 border border-sage-100"
      >
        <h3 className="font-serif text-sage-800 mb-2">Curated with love</h3>
        <p className="text-sage-700 text-sm leading-relaxed">
          These resources are carefully selected to honor your intersectional identity and support your healing journey. 
          Each piece is chosen with cultural sensitivity and genuine care.
        </p>
      </motion.div>

      {/* Category Tabs */}
      <div className="grid grid-cols-4 gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-xl text-center transition-all ${
                activeCategory === category.id
                  ? `bg-${category.color}-100 border-2 border-${category.color}-300 text-${category.color}-800`
                  : 'bg-white border border-sage-100 text-sage-700 hover:bg-sage-50'
              }`}
            >
              <Icon className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs font-medium">{category.label}</div>
            </motion.button>
          );
        })}
      </div>

      {/* Resources List */}
      <div className="space-y-4">
        {resources[activeCategory as keyof typeof resources].map((resource, index) => (
          <motion.div
            key={resource.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-${resource.color}-50 rounded-xl p-5 border border-${resource.color}-100`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 bg-${resource.color}-100 text-${resource.color}-700 text-xs font-medium rounded-full`}>
                    {resource.type}
                  </span>
                  <span className={`text-${resource.color}-600 text-xs`}>
                    {resource.readTime}
                  </span>
                </div>
                <h4 className={`font-serif text-lg text-${resource.color}-800 mb-2`}>
                  {resource.title}
                </h4>
                <p className={`text-${resource.color}-700 text-sm leading-relaxed`}>
                  {resource.description}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`ml-4 p-2 rounded-full bg-${resource.color}-100 text-${resource.color}-700 hover:bg-${resource.color}-200 transition-colors`}
              >
                <ExternalLink className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-lavender-50 rounded-2xl p-6 border border-lavender-100 text-center"
      >
        <h3 className="font-serif text-lavender-800 mb-2">Suggest a resource</h3>
        <p className="text-lavender-700 text-sm leading-relaxed mb-4">
          Know of a resource that would help other young women of color? We'd love to hear about it.
        </p>
        <button className="px-6 py-3 bg-lavender-500 text-white rounded-lg font-medium hover:bg-lavender-600 transition-colors">
          Share a Resource
        </button>
      </motion.div>
    </div>
  );
};

export default Resources;