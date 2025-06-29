import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LocalizationProvider } from './contexts/LocalizationContext';
import { useOnboarding } from './hooks/useOnboarding';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import CheckIn from './components/CheckIn';
import WinTracker from './components/WinTracker';
import Journal from './components/Journal';
import Affirmations from './components/Affirmations';
import Resources from './components/Resources';
import FavoriteResponses from './components/FavoriteResponses';
import SoftLanding from './components/SoftLanding';
import OnboardingFlow from './components/Onboarding/OnboardingFlow';
import WelcomeComplete from './components/Onboarding/WelcomeComplete';
import DisclaimerModal from './components/Auth/DisclaimerModal';
import UpsellModal from './components/Auth/UpsellModal';
import MigrationSuccessModal from './components/Auth/MigrationSuccessModal';

type View = 'dashboard' | 'checkin' | 'wins' | 'journal' | 'affirmations' | 'resources' | 'emergency' | 'favorites';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showEmergency, setShowEmergency] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMigrationSuccess, setShowMigrationSuccess] = useState(false);
  const [migratedCount, setMigratedCount] = useState(0);
  const [showWelcomeComplete, setShowWelcomeComplete] = useState(false);
  
  const { 
    user, 
    isGuest, 
    loading, 
    shouldShowUpsell,
    continueAsGuest, 
    dismissUpsell,
    migrateGuestData
  } = useAuth();

  const {
    isOnboardingComplete,
    onboardingData,
    completeOnboarding,
    skipOnboarding
  } = useOnboarding();

  // Check if disclaimer has been accepted
  useEffect(() => {
    const accepted = localStorage.getItem('shameless_disclaimer_accepted');
    if (accepted === 'true') {
      setDisclaimerAccepted(true);
    } else {
      setShowDisclaimer(true);
    }
  }, []);

  const handleDisclaimerAccept = () => {
    localStorage.setItem('shameless_disclaimer_accepted', 'true');
    setDisclaimerAccepted(true);
    setShowDisclaimer(false);
  };

  const handleGuestContinue = () => {
    continueAsGuest();
  };

  const handleOnboardingComplete = (data: any) => {
    completeOnboarding(data);
    setShowWelcomeComplete(true);
  };

  const handleOnboardingSkip = () => {
    skipOnboarding();
  };

  const handleWelcomeComplete = () => {
    setShowWelcomeComplete(false);
  };

  const handleUpsellSignUp = () => {
    dismissUpsell();
    setShowAuthModal(true);
  };

  const handleUpsellClose = () => {
    dismissUpsell();
  };

  const handleNavigateHome = () => {
    setCurrentView('dashboard');
  };

  // Handle successful authentication - migrate guest data
  useEffect(() => {
    const handleMigration = async () => {
      if (user && !isGuest && localStorage.getItem('shameless_guest_mode') === 'true') {
        // User just signed up/in and we have guest data to migrate
        const result = await migrateGuestData();
        if (result.success && result.migratedCount > 0) {
          setMigratedCount(result.migratedCount);
          setShowMigrationSuccess(true);
        }
      }
    };

    handleMigration();
  }, [user, isGuest, migrateGuestData]);

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
      case 'favorites':
        return <FavoriteResponses onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  // Show disclaimer first
  if (!disclaimerAccepted) {
    return (
      <DisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        onAccept={handleDisclaimerAccept}
      />
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-sage-50 to-lavender-50 flex items-center justify-center p-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 bg-terracotta-200 rounded-full flex items-center justify-center mx-auto">
            <span className="text-terracotta-800 font-serif text-2xl">💛</span>
          </div>
          <p className="text-sage-600 font-serif">Loading your safe space...</p>
        </motion.div>
      </div>
    );
  }

  // Show onboarding for new users - REQUIRED unless skipped
  if (!isOnboardingComplete) {
    return (
      <OnboardingFlow 
        onComplete={handleOnboardingComplete} 
        onSkip={handleOnboardingSkip}
      />
    );
  }

  // Show welcome completion screen
  if (showWelcomeComplete && onboardingData) {
    return (
      <WelcomeComplete
        onContinue={handleWelcomeComplete}
        anchorPhrase={onboardingData.anchorPhrase}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-sage-50 to-lavender-50">
      <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm min-h-screen shadow-xl flex flex-col">
        <Header 
          onEmergency={() => setShowEmergency(true)} 
          onGuestContinue={handleGuestContinue}
          onNavigateHome={handleNavigateHome}
        />
        
        <main className="flex-1 pb-32">
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

        <Footer currentView={currentView} onNavigate={setCurrentView} />

        {/* Modals */}
        <AnimatePresence>
          {showEmergency && (
            <SoftLanding onClose={() => setShowEmergency(false)} />
          )}
          
          {shouldShowUpsell && (
            <UpsellModal
              isOpen={shouldShowUpsell}
              onClose={handleUpsellClose}
              onSignUp={handleUpsellSignUp}
            />
          )}

          {showMigrationSuccess && (
            <MigrationSuccessModal
              isOpen={showMigrationSuccess}
              onClose={() => setShowMigrationSuccess(false)}
              migratedCount={migratedCount}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function App() {
  return (
    <LocalizationProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;