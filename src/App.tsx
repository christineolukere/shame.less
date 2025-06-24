import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CheckIn from './components/CheckIn';
import WinTracker from './components/WinTracker';
import Journal from './components/Journal';
import Affirmations from './components/Affirmations';
import Resources from './components/Resources';
import SoftLanding from './components/SoftLanding';

type View = 'dashboard' | 'checkin' | 'wins' | 'journal' | 'affirmations' | 'resources' | 'emergency';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showEmergency, setShowEmergency] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'checkin':
        return <CheckIn onBack={() => setCurrentView('dashboard')} />;
      case 'wins':
        return <WinTracker onBack={() => setCurrentView('dashboard')} />;
      case 'journal':
        return <Journal onBack={() => setCurrentView('dashboard')} />;
      case 'affirmations':
        return <Affirmations onBack={() => setCurrentView('dashboard')} />;
      case 'resources':
        return <Resources onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-sage-50 to-lavender-50">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm min-h-screen shadow-xl">
          <Header onEmergency={() => setShowEmergency(true)} />
          
          <main className="pb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </main>

          <Navigation currentView={currentView} onNavigate={setCurrentView} />

          <AnimatePresence>
            {showEmergency && (
              <SoftLanding onClose={() => setShowEmergency(false)} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;