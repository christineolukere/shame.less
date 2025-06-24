import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Heart, Sparkles, Trophy, BookOpen } from 'lucide-react';

type View = 'dashboard' | 'checkin' | 'wins' | 'journal' | 'affirmations' | 'resources';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const currentHour = new Date().getHours();
  const isEvening = currentHour >= 18 || currentHour < 6;
  
  const greeting = () => {
    if (currentHour < 12) return "Good morning, beautiful";
    if (currentHour < 17) return "Good afternoon, love";
    return "Good evening, dear one";
  };

  const quickActions = [
    {
      id: 'checkin',
      title: 'How are you feeling?',
      subtitle: 'Check in with yourself',
      icon: Heart,
      color: 'terracotta',
      action: () => onNavigate('checkin')
    },
    {
      id: 'wins',
      title: 'Celebrate a win',
      subtitle: 'Big or small, it matters',
      icon: Trophy,
      color: 'sage',
      action: () => onNavigate('wins')
    },
    {
      id: 'journal',
      title: 'Journal your thoughts',
      subtitle: 'Let it flow onto paper',
      icon: BookOpen,
      color: 'lavender',
      action: () => onNavigate('journal')
    },
    {
      id: 'affirmations',
      title: 'Daily affirmation',
      subtitle: 'Words of love for you',
      icon: Sparkles,
      color: 'cream',
      action: () => onNavigate('affirmations')
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center space-x-2">
          {isEvening ? (
            <Moon className="w-6 h-6 text-lavender-500" />
          ) : (
            <Sun className="w-6 h-6 text-cream-500" />
          )}
          <h2 className="text-2xl font-serif text-sage-800">{greeting()}</h2>
        </div>
        <p className="text-sage-600">You are worthy of love and gentleness today</p>
      </motion.div>

      {/* Today's Gentle Reminder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-terracotta-50 to-cream-50 rounded-2xl p-6 border border-terracotta-100"
      >
        <h3 className="font-serif text-lg text-terracotta-800 mb-2">Today's gentle reminder</h3>
        <p className="text-terracotta-700 leading-relaxed">
          "Your healing is not linear, and that's perfectly okay. Every small step you take matters, 
          even when it doesn't feel like progress."
        </p>
      </motion.div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-serif text-sage-800">How can I support you today?</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                onClick={action.action}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl text-left transition-all bg-${action.color}-50 border border-${action.color}-100 hover:bg-${action.color}-100`}
              >
                <Icon className={`w-6 h-6 text-${action.color}-600 mb-2`} />
                <h4 className={`font-medium text-${action.color}-800 text-sm`}>{action.title}</h4>
                <p className={`text-${action.color}-600 text-xs mt-1`}>{action.subtitle}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Growth Rings - Progress Visualization */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-sage-50 rounded-2xl p-6 border border-sage-100"
      >
        <h3 className="font-serif text-lg text-sage-800 mb-4">Your growth rings</h3>
        <div className="flex items-center justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((ring, index) => (
            <motion.div
              key={ring}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className={`w-8 h-8 rounded-full border-2 ${
                index < 3 
                  ? 'bg-sage-200 border-sage-400' 
                  : 'border-sage-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sage-600 text-sm text-center mt-3">
          3 days of gentle self-care this week
        </p>
      </motion.div>
    </div>
  );
};

export default Dashboard;