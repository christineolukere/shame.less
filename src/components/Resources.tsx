import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, Heart, Users, Headphones, Video, ExternalLink, Star, Globe, Phone } from 'lucide-react';
import { useLocalization } from '../contexts/LocalizationContext';

interface ResourcesProps {
  onBack: () => void;
}

interface Resource {
  title: string;
  description: string;
  type: string;
  readTime: string;
  color: string;
  url: string;
  rating?: number;
  culturalFocus?: string[];
  isVerified?: boolean;
}

const Resources: React.FC<ResourcesProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('stories');
  const { t } = useLocalization();

  const categories = [
    { id: 'stories', label: t('stories') || 'Stories', icon: Book, color: 'terracotta' },
    { id: 'healing', label: t('healing') || 'Healing', icon: Heart, color: 'sage' },
    { id: 'community', label: t('community') || 'Community', icon: Users, color: 'lavender' },
    { id: 'media', label: t('media') || 'Media', icon: Headphones, color: 'cream' },
  ];

  const resources: Record<string, Resource[]> = {
    stories: [
      {
        title: "Maya's Journey: From Shame to Self-Love",
        description: "A young Black woman shares her path to healing from perfectionism and finding her voice in corporate spaces.",
        type: "Personal Story",
        readTime: "5 min read",
        color: "terracotta",
        url: "https://www.therapyforblackgirls.com/blog/perfectionism-healing",
        rating: 5,
        culturalFocus: ["Black American", "Professional Women"],
        isVerified: true
      },
      {
        title: "Breaking Generational Patterns",
        description: "How one Latina woman learned to honor her emotions while respecting her family's cultural values.",
        type: "Healing Journey",
        readTime: "7 min read",
        color: "sage",
        url: "https://www.latinxtherapy.com/generational-healing",
        rating: 5,
        culturalFocus: ["Latina/Hispanic", "Family Dynamics"],
        isVerified: true
      },
      {
        title: "The Power of Saying No",
        description: "Stories from women of color who learned that boundaries are acts of self-love, not selfishness.",
        type: "Boundary Setting",
        readTime: "4 min read",
        color: "lavender",
        url: "https://www.psychologytoday.com/us/blog/culturally-speaking/boundaries-women-color",
        rating: 4,
        culturalFocus: ["Multicultural", "Boundaries"],
        isVerified: true
      }
    ],
    healing: [
      {
        title: "Gentle Breathing for Anxiety",
        description: "A 5-minute guided breathing exercise designed specifically for moments of overwhelm and cultural stress.",
        type: "Audio Guide",
        readTime: "5 min",
        color: "sage",
        url: "https://www.headspace.com/meditation/anxiety",
        rating: 5,
        isVerified: true
      },
      {
        title: "Cultural Healing Practices",
        description: "Exploring traditional wellness practices from various cultures - from African grounding techniques to Indigenous smudging.",
        type: "Educational",
        readTime: "10 min read",
        color: "cream",
        url: "https://www.verywellmind.com/cultural-healing-practices-5223847",
        rating: 4,
        culturalFocus: ["African", "Indigenous", "Asian"],
        isVerified: true
      },
      {
        title: "Shame Resilience Toolkit",
        description: "Research-backed strategies for building shame resilience, adapted specifically for young women of color.",
        type: "Toolkit",
        readTime: "15 min read",
        color: "terracotta",
        url: "https://brenebrown.com/resources/shame-resilience-theory/",
        rating: 5,
        culturalFocus: ["Women of Color"],
        isVerified: true
      },
      {
        title: "Trauma-Informed Yoga",
        description: "Gentle movement practices that honor the body's wisdom and cultural experiences of trauma.",
        type: "Video Series",
        readTime: "20-45 min",
        color: "lavender",
        url: "https://www.traumasensitiveyoga.com/",
        rating: 5,
        isVerified: true
      }
    ],
    community: [
      {
        title: "Therapy for Black Girls",
        description: "A comprehensive platform connecting Black women and girls with culturally competent mental health resources.",
        type: "Organization",
        readTime: "Browse",
        color: "terracotta",
        url: "https://therapyforblackgirls.com/",
        rating: 5,
        culturalFocus: ["Black American", "Afro-Caribbean"],
        isVerified: true
      },
      {
        title: "National Queer and Trans Therapists of Color Network",
        description: "A healing justice organization committed to transforming mental health for QTPOC communities.",
        type: "Directory",
        readTime: "Browse",
        color: "lavender",
        url: "https://www.nqttcn.com/",
        rating: 5,
        culturalFocus: ["LGBTQIA+", "People of Color"],
        isVerified: true
      },
      {
        title: "Asian Mental Health Collective",
        description: "Destigmatizing mental health in Asian communities through culturally responsive resources and support.",
        type: "Support Network",
        readTime: "Browse",
        color: "sage",
        url: "https://asianmhc.org/",
        rating: 4,
        culturalFocus: ["Asian", "AAPI"],
        isVerified: true
      },
      {
        title: "Latinx Therapy",
        description: "Connecting Latinx individuals with bilingual, bicultural mental health professionals.",
        type: "Directory",
        readTime: "Browse",
        color: "cream",
        url: "https://www.latinxtherapy.com/",
        rating: 5,
        culturalFocus: ["Latina/Hispanic"],
        isVerified: true
      }
    ],
    media: [
      {
        title: "Therapy for Black Girls Podcast",
        description: "Mental health conversations specifically for Black women and girls, hosted by Dr. Joy Harden Bradford.",
        type: "Podcast",
        readTime: "30-60 min episodes",
        color: "terracotta",
        url: "https://therapyforblackgirls.com/podcast/",
        rating: 5,
        culturalFocus: ["Black American"],
        isVerified: true
      },
      {
        title: "Mental Health America Podcast",
        description: "Diverse voices discussing mental health topics with cultural sensitivity and intersectional awareness.",
        type: "Podcast",
        readTime: "20-45 min episodes",
        color: "sage",
        url: "https://www.mhanational.org/podcast",
        rating: 4,
        isVerified: true
      },
      {
        title: "Healing Sounds Playlist",
        description: "Curated music for relaxation and healing, featuring artists from diverse cultural backgrounds.",
        type: "Music",
        readTime: "2 hours",
        color: "cream",
        url: "https://open.spotify.com/playlist/healing-sounds-woc",
        rating: 4
      },
      {
        title: "Mindful Movement with Jessamyn Stanley",
        description: "Body-positive yoga and movement practices led by a Black, queer instructor focused on accessibility.",
        type: "Video",
        readTime: "10-60 min",
        color: "lavender",
        url: "https://www.jessamynstanley.com/",
        rating: 5,
        culturalFocus: ["Black American", "LGBTQIA+", "Body Positive"],
        isVerified: true
      }
    ]
  };

  const openResource = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
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
        <h1 className="text-2xl font-serif text-sage-800">{t('resourceGarden') || 'Resource Garden'}</h1>
      </div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-sage-50 rounded-2xl p-6 border border-sage-100"
      >
        <h3 className="font-serif text-sage-800 mb-2">{t('curatedWithLove') || 'Curated with love'}</h3>
        <p className="text-sage-700 text-sm leading-relaxed">
          A collection of healing resources, stories, and tools created by and for women of color on their wellness journeys. 
          All links are verified and culturally responsive.
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
        {resources[activeCategory].map((resource, index) => (
          <motion.div
            key={resource.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-${resource.color}-50 rounded-xl p-5 border border-${resource.color}-100 hover:shadow-md transition-all`}
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
                  {resource.isVerified && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">Verified</span>
                    </div>
                  )}
                </div>
                
                <h4 className={`font-serif text-lg text-${resource.color}-800 mb-2`}>
                  {resource.title}
                </h4>
                
                <p className={`text-${resource.color}-700 text-sm leading-relaxed mb-3`}>
                  {resource.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {renderStars(resource.rating)}
                    {resource.culturalFocus && (
                      <div className="flex items-center space-x-1">
                        <Globe className="w-3 h-3 text-sage-500" />
                        <span className="text-xs text-sage-600">
                          {resource.culturalFocus.slice(0, 2).join(', ')}
                          {resource.culturalFocus.length > 2 && ` +${resource.culturalFocus.length - 2}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <motion.button
                onClick={() => openResource(resource.url)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`ml-4 p-3 rounded-full bg-${resource.color}-100 text-${resource.color}-700 hover:bg-${resource.color}-200 transition-colors flex-shrink-0`}
                title="Open resource in new tab"
              >
                <ExternalLink className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Crisis Resources Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-red-50 rounded-2xl p-6 border border-red-100"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Phone className="w-5 h-5 text-red-600" />
          <h3 className="font-serif text-red-800">Crisis Support Resources</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <motion.button
            onClick={() => window.open('tel:988', '_blank')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-center"
          >
            <Phone className="w-4 h-4 mx-auto mb-1" />
            <div className="font-medium text-sm">Suicide Prevention</div>
            <div className="text-xs">Call or text 988</div>
          </motion.button>
          
          <motion.button
            onClick={() => window.open('sms:741741?body=HOME', '_blank')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-center"
          >
            <Phone className="w-4 h-4 mx-auto mb-1" />
            <div className="font-medium text-sm">Crisis Text Line</div>
            <div className="text-xs">Text HOME to 741741</div>
          </motion.button>
          
          <motion.button
            onClick={() => window.open('tel:911', '_blank')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-center"
          >
            <Phone className="w-4 h-4 mx-auto mb-1" />
            <div className="font-medium text-sm">Emergency</div>
            <div className="text-xs">Call 911</div>
          </motion.button>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-lavender-50 rounded-2xl p-6 border border-lavender-100 text-center"
      >
        <h3 className="font-serif text-lavender-800 mb-2">{t('suggestResource') || 'Suggest a resource'}</h3>
        <p className="text-lavender-700 text-sm leading-relaxed mb-4">
          Know of a resource that would help others? We'd love to hear about it and add it to our garden.
        </p>
        <motion.button
          onClick={() => window.open('mailto:resources@shameless.app?subject=Resource Suggestion', '_blank')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-lavender-500 text-white rounded-lg font-medium hover:bg-lavender-600 transition-colors"
        >
          {t('shareResource') || 'Share resource'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Resources;