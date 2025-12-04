import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Header from './components/Header'
import Footer from './components/Footer'
import MobileBottomNav from './components/MobileBottomNav'
import Hero from './components/Hero'
import RouletteSection from './components/RouletteSection'
import FeaturedDestinations from './components/FeaturedDestinations'
import AIHighlight from './components/AIHighlight'
import Testimonials from './components/Testimonials'
import Newsletter from './components/Newsletter'
import Destinations from './pages/Destinations'
import DestinationDetails from './pages/DestinationDetails'
import DestinationBlogPage from './pages/DestinationBlogPage'
import ItineraryPage from './pages/ItineraryPage'
import DestinationDeepDive from './pages/DestinationDeepDive'
import BlogList from './pages/BlogList'
import BlogPost from './pages/BlogPost'
import AIChatPortal from './components/AIChatPortal'
import PriceTrackerPage from './pages/PriceTrackerPage'
import MyTrips from './pages/MyTrips'
import ItineraryBuilder from './pages/ItineraryBuilder'
import FavoritesPage from './pages/FavoritesPage'
import SubscriptionPage from './pages/SubscriptionPage'
import AboutUs from './pages/AboutUs'
import Terms from './pages/TermsOfService';
import Privacy from './pages/Privacy';
import AdminDashboard from './pages/AdminDashboard';
import AdminBlogGenerator from './pages/AdminBlogGenerator';
import AdminDestinationManager from './pages/AdminDestinationManager';
import ProfessionalTheme from './components/ProfessionalTheme'
import AsSeenIn from './components/AsSeenIn'
import Arcade from './pages/Arcade'
import AccessibilityNotice from './components/AccessibilityNotice'
import LightswindDemo from './components/LightswindDemo'
import LightswindTravelForm from './components/LightswindTravelForm'
import { supabase } from './utils/supabase'
import AuthModal from './components/AuthModal'
import LoginModal from './components/LoginModal'
import AIChatModal from './components/AIChatModal'
import AITravelPlanModal from './components/AITravelPlanModal'
import MapModal from './components/MapModal'
import NotFound from './pages/NotFound'
import OnboardingFlow from './components/OnboardingFlow'
import EmailCapturePopup from './components/EmailCapturePopup'
import ArcadeTeaser from './components/ArcadeTeaser'
import HomePage from './pages/HomePage'
import PlanningPage from './pages/PlanningPage'
import AuthCallback from './pages/AuthCallback'
import Profile from './pages/ProfileV2'

import { SubscriptionProvider } from './context/SubscriptionContext'
import { GameLimitProvider } from './context/GameLimitContext'
import UpgradeModal from './components/UpgradeModal'
import MarbleRacePage from './pages/games/MarbleRacePage'
import TravelBingoPage from './pages/games/TravelBingoPage'
import WhoPaysPage from './pages/games/WhoPaysPage'
import GeoMasterPage from './pages/games/GeoMasterPage'
import HangmanPage from './pages/games/HangmanPage'
import RoulettePage from './pages/games/RoulettePage'
import Plinko from './components/games/Plinko/Plinko'

function App() {
  const [user, setUser] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)
  const [isAITravelPlanOpen, setIsAITravelPlanOpen] = useState(false)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [theme, setTheme] = useState('light')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showEmailPopup, setShowEmailPopup] = useState(false)
  const [emailPopupVariant, setEmailPopupVariant] = useState('A')

  // Check user session on app load
  useEffect(() => {
    const checkSession = async () => {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setUser(session.user)
        }
      }
    }

    checkSession()

    // Listen for auth changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setUser(session.user)
        } else {
          setUser(null)
        }
      })

      return () => subscription.unsubscribe()
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Check for auth error in URL
    const params = new URLSearchParams(window.location.search);
    const authError = params.get('auth_error');
    if (authError) {
      // Clear the param
      window.history.replaceState({}, document.title, window.location.pathname);
      // Show error (could be improved with a toast later)
      if (authError === 'auth_failed') alert('Authentication failed. Please try again.');
      else if (authError === 'no_session') alert('Could not sign in. Please try again.');
      else alert('An unknown authentication error occurred.');
    }
  }, [])

  // Update theme when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for custom openAIChat event
  useEffect(() => {
    const handleOpenAIChat = () => setIsAIChatOpen(true);
    window.addEventListener('openAIChat', handleOpenAIChat);
    return () => window.removeEventListener('openAIChat', handleOpenAIChat);
  }, []);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleEmailPopupClose = () => {
    setShowEmailPopup(false);
  };

  return (
    <HelmetProvider>
      <SubscriptionProvider>
        <GameLimitProvider>
          <div className={`min-h-screen flex flex-col font-inter relative overflow-hidden transition-colors duration-300 bg-white text-neutral-900`}>
            {theme === 'joyful' && <ProfessionalTheme />}
            {theme === 'dark' && <div className="fixed inset-0 pointer-events-none z-0 bg-gray-900" />}
            <Header
              user={user}
              onSignIn={() => setIsAuthModalOpen(true)}
              onSignOut={async () => {
                if (supabase) {
                  await supabase.auth.signOut()
                  setUser(null)
                }
              }}
              onOpenAIChat={() => setIsAIChatOpen(true)}
              theme={theme}
              toggleTheme={toggleTheme}
            />

            {showOnboarding && (
              <OnboardingFlow onComplete={handleOnboardingComplete} />
            )}

            {showEmailPopup && (
              <EmailCapturePopup
                onClose={handleEmailPopupClose}
                variant={emailPopupVariant}
              />
            )}

            <main className="flex-grow pt-16 pb-20 md:pb-0">
              <Routes>
                <Route path="/" element={<HomePage user={user} />} />
                <Route path="/plan" element={<PlanningPage />} />
                <Route path="/destinations" element={<Destinations user={user} />} />
                <Route path="/destination/:id" element={<DestinationDetails />} />
                <Route path="/destination/:id/blog" element={<DestinationBlogPage />} />
                <Route path="/destination/itinerary/:id" element={<ItineraryPage />} />
                <Route path="/destination/details/:id" element={<DestinationDeepDive />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/arcade" element={<Arcade />} />
                <Route path="/arcade/marble-race" element={<MarbleRacePage />} />
                <Route path="/arcade/bingo" element={<TravelBingoPage />} />
                <Route path="/arcade/who-pays" element={<WhoPaysPage />} />
                <Route path="/arcade/geo-master" element={<GeoMasterPage />} />
                <Route path="/arcade/hangman" element={<HangmanPage />} />
                <Route path="/arcade/roulette" element={<RoulettePage />} />
                <Route path="/arcade/plinko" element={<Plinko />} />
                <Route path="/ai-chat" element={<AIChatPortal />} />
                <Route path="/price-tracker" element={<PriceTrackerPage user={user} />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/my-trips" element={<MyTrips />} />
                <Route path="/itinerary/new" element={<ItineraryBuilder />} />
                <Route path="/itinerary/:id" element={<ItineraryBuilder />} />
                <Route path="/favorites" element={<FavoritesPage user={user} />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/blog-generator" element={<AdminBlogGenerator />} />
                <Route path="/admin/destinations" element={<AdminDestinationManager />} />
                <Route path="/lightswind-demo" element={<LightswindDemo />} />
                <Route path="/lightswind-form" element={<LightswindTravelForm />} />
                <Route path="/settings" element={<div className="pt-20">Settings Page</div>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />
            <MobileBottomNav />

            {/* Modals */}
            <UpgradeModal />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
            <AIChatModal isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
            <AITravelPlanModal
              isOpen={isAITravelPlanOpen}
              onClose={() => setIsAITravelPlanOpen(false)}
              destination={selectedDestination}
            />
            <MapModal
              isOpen={isMapModalOpen}
              onClose={() => setIsMapModalOpen(false)}
              destination={selectedDestination}
            />
          </div >
        </GameLimitProvider>
      </SubscriptionProvider >
    </HelmetProvider>
  )
}

export default App