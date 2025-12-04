import React, { useState, useEffect, Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Header from './components/Header'
import Footer from './components/Footer'
import MobileBottomNav from './components/MobileBottomNav'
import Hero from './components/Hero'
import ProfessionalTheme from './components/ProfessionalTheme'
import { supabase } from './utils/supabase'
import AuthModal from './components/AuthModal'
import LoginModal from './components/LoginModal'
import AIChatModal from './components/AIChatModal'
import AITravelPlanModal from './components/AITravelPlanModal'
import MapModal from './components/MapModal'
import OnboardingFlow from './components/OnboardingFlow'
import EmailCapturePopup from './components/EmailCapturePopup'
import UpgradeModal from './components/UpgradeModal'
import { SubscriptionProvider } from './context/SubscriptionContext'
import { GameLimitProvider } from './context/GameLimitContext'
import ComingSoon from './pages/ComingSoon'

// Lazy load pages for performance
const HomePage = lazy(() => import('./pages/HomePage'))
const PlanningPage = lazy(() => import('./pages/PlanningPage'))
const Destinations = lazy(() => import('./pages/Destinations'))
const DestinationDetails = lazy(() => import('./pages/DestinationDetails'))
const DestinationBlogPage = lazy(() => import('./pages/DestinationBlogPage'))
const ItineraryPage = lazy(() => import('./pages/ItineraryPage'))
const DestinationDeepDive = lazy(() => import('./pages/DestinationDeepDive'))
const BlogList = lazy(() => import('./pages/BlogList'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const AIChatPortal = lazy(() => import('./components/AIChatPortal'))
const PriceTrackerPage = lazy(() => import('./pages/PriceTrackerPage'))
const MyTrips = lazy(() => import('./pages/MyTrips'))
const ItineraryBuilder = lazy(() => import('./pages/ItineraryBuilder'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'))
const AboutUs = lazy(() => import('./pages/AboutUs'))
const Terms = lazy(() => import('./pages/TermsOfService'))
const Privacy = lazy(() => import('./pages/Privacy'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminBlogGenerator = lazy(() => import('./pages/AdminBlogGenerator'))
const AdminDestinationManager = lazy(() => import('./pages/AdminDestinationManager'))
const LightswindDemo = lazy(() => import('./components/LightswindDemo'))
const LightswindTravelForm = lazy(() => import('./components/LightswindTravelForm'))
const Arcade = lazy(() => import('./pages/Arcade'))
const MarbleRacePage = lazy(() => import('./pages/games/MarbleRacePage'))
const TravelBingoPage = lazy(() => import('./pages/games/TravelBingoPage'))
const WhoPaysPage = lazy(() => import('./pages/games/WhoPaysPage'))
const GeoMasterPage = lazy(() => import('./pages/games/GeoMasterPage'))
const HangmanPage = lazy(() => import('./pages/games/HangmanPage'))
const RoulettePage = lazy(() => import('./pages/games/RoulettePage'))
const Plinko = lazy(() => import('./components/games/Plinko/Plinko'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))
const Profile = lazy(() => import('./pages/ProfileV2'))
const NotFound = lazy(() => import('./pages/NotFound'))

// SEO Pages
const AITripPlannerPage = lazy(() => import('./pages/AITripPlannerPage'))
const NepalHub = lazy(() => import('./pages/NepalHub'))
const BaliHub = lazy(() => import('./pages/BaliHub'))
const JapanHub = lazy(() => import('./pages/JapanHub'))
const ItineraryDetail = lazy(() => import('./pages/ItineraryDetail'))
const GroupTripCostSplitter = lazy(() => import('./pages/tools/GroupTripCostSplitter'))

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
  </div>
)

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
              <Suspense fallback={<PageLoader />}>
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

                  {/* SEO Strategic Routes */}
                  <Route path="/ai-trip-planner" element={<AITripPlannerPage />} />
                  <Route path="/nepal-travel-itineraries" element={<NepalHub />} />
                  <Route path="/bali-travel-itineraries" element={<BaliHub />} />
                  <Route path="/japan-travel-itineraries" element={<JapanHub />} />
                  <Route path="/itineraries/pokhara-4-days" element={<ItineraryDetail />} />
                  <Route path="/tools/group-trip-cost-splitter" element={<GroupTripCostSplitter />} />

                  {/* Placeholder Routes */}
                  <Route path="/pricing" element={<ComingSoon title="Pricing Plans" />} />
                  <Route path="/contact" element={<ComingSoon title="Contact Us" />} />
                  <Route path="/careers" element={<ComingSoon title="Careers" />} />
                  <Route path="/agencies" element={<ComingSoon title="For Agencies" />} />
                  <Route path="/creators" element={<ComingSoon title="For Creators" />} />
                  <Route path="/affiliates" element={<ComingSoon title="Affiliate Program" />} />
                  <Route path="/cookies" element={<ComingSoon title="Cookie Policy" />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
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