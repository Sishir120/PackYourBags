import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  MapPin,
  Menu,
  X,
  User,
  Heart,
  LogIn,
  LogOut,
  TrendingUp,
  Globe,
  BookOpen,
  Bot,
  Sparkles,
  Gamepad2,
  Users,
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import { getUserFavorites } from '../utils/destinationApi';
import { motion, AnimatePresence } from 'framer-motion';
import ReferralModal from './ReferralModal';

const Header = ({ user, onSignIn, onSignOut }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch user profile & favorites when auth changes
  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchFavoritesCount();
    } else {
      setFavoritesCount(0);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!supabase) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id);
        if (!error && data && data.length > 0) {
          setUserProfile(data[0]);
        }
      }
    } catch (e) {
      console.error('Error fetching user profile:', e);
    }
  };

  const fetchFavoritesCount = async () => {
    if (!user?.id) return;
    try {
      const response = await getUserFavorites(user.id);
      if (response.success) {
        setFavoritesCount(response.count || 0);
      }
    } catch (e) {
      console.error('Error fetching favorites count:', e);
    }
  };

  // Navigation helpers
  const handleHome = () => navigate('/');
  const handleDestinations = () => navigate('/destinations');
  const handlePriceTracker = () => navigate('/price-tracker');
  const handleBlog = () => navigate('/blog');
  const handleArcade = () => navigate('/arcade');
  const handleAIChat = () => navigate('/ai-chat');
  const handleFavorites = () => {
    if (user) navigate('/favorites');
    else onSignIn();
  };

  const displayName = userProfile?.name || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || 'user@example.com';

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-neutral-200'
          : 'bg-white border-b border-neutral-200'
          }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={handleHome}
                className="flex items-center space-x-2 group"
                aria-label="PackYourBags - AI-Powered Travel Planning Platform"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary-600 text-white shadow-sm group-hover:bg-primary-700 transition-colors">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-bold text-neutral-900">
                    PackYourBags
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-1" aria-label="Main navigation">
              {[
                { label: 'Destinations', icon: Globe, action: handleDestinations },
                { label: 'Arcade', icon: Gamepad2, action: handleArcade, isNew: true },
                { label: 'Deals', icon: TrendingUp, action: handlePriceTracker },
                { label: 'Blog', icon: BookOpen, action: handleBlog },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all flex items-center gap-2 relative"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.isNew && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[9px] font-bold rounded-full shadow-sm animate-pulse">
                      NEW
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              {/* GAMIFICATION: Spin Roulette Button */}
              <button
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('roulette')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full hover:from-amber-500 hover:to-orange-600 transition-all shadow-md hover:shadow-lg hover:scale-105 font-bold border border-orange-400/50"
                aria-label="Spin the Travel Roulette"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Spin & Win</span>
              </button>

              {/* Invite Friends Button */}
              <button
                onClick={() => setShowReferralModal(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-all font-semibold"
                aria-label="Invite Friends"
              >
                <Users className="w-4 h-4" />
                <span className="text-sm">Invite</span>
              </button>

              {/* AI Travel Assistant */}
              <button
                onClick={handleAIChat}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-all font-semibold"
                aria-label="AI Travel Assistant"
              >
                <Bot className="w-4 h-4" />
                <span className="text-sm">AI Chat</span>
              </button>

              {/* Favorites */}
              <button
                onClick={handleFavorites}
                className="relative p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all"
                aria-label="Favorites"
              >
                <Heart className="w-5 h-5" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {favoritesCount}
                  </span>
                )}
              </button>

              {/* User menu / sign-in */}
              {user ? (
                <div className="relative group">
                  <button
                    className="flex items-center space-x-2 p-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 transition-all"
                    aria-label="User menu"
                  >
                    {/* GAMIFICATION: User Level Ring */}
                    <div className="relative">
                      <div className="bg-primary-600 p-1 rounded-md relative z-10">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg blur opacity-40"></div>
                    </div>
                    <div className="hidden md:flex flex-col items-start pl-1">
                      <span className="text-xs font-bold text-neutral-900 leading-none">
                        {displayName}
                      </span>
                      <span className="text-[10px] font-bold text-amber-600 leading-none mt-0.5">
                        Lvl 5 Explorer
                      </span>
                    </div>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-xl py-2 hidden group-hover:block z-50 bg-white border border-neutral-200">
                    <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-bold text-neutral-900">Level 5 Explorer</p>
                        <span className="text-xs font-bold text-primary-600">2,450 XP</span>
                      </div>
                      {/* XP Bar */}
                      <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 w-[75%]"></div>
                      </div>
                      <p className="text-[10px] text-neutral-500 mt-1 text-right">550 XP to Level 6</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-neutral-700 hover:bg-neutral-100 font-medium"
                      >
                        <User className="w-4 h-4 mr-3" /> Profile & Badges
                      </Link>
                      <Link
                        to="/my-trips"
                        className="flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-neutral-700 hover:bg-neutral-100 font-medium"
                      >
                        <MapPin className="w-4 h-4 mr-3" /> My Trips
                      </Link>
                      <Link
                        to="/favorites"
                        className="flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-neutral-700 hover:bg-neutral-100 font-medium"
                      >
                        <Heart className="w-4 h-4 mr-3" /> Favorites
                      </Link>
                      <button
                        onClick={onSignOut}
                        className="flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors text-red-600 hover:bg-red-50 font-medium"
                      >
                        <LogOut className="w-4 h-4 mr-3" /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onSignIn}
                  className="btn btn-primary"
                  aria-label="Sign in"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-neutral-800 hover:bg-neutral-100 rounded-lg"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-neutral-200 bg-white"
            >
              <div className="px-4 py-4 space-y-2">
                <button
                  onClick={() => {
                    navigate('/');
                    setTimeout(() => {
                      document.getElementById('roulette')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-base font-bold rounded-lg flex items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md"
                >
                  <Sparkles className="w-5 h-5" />
                  Spin & Win
                </button>

                <button
                  onClick={() => {
                    setShowReferralModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-base font-semibold rounded-lg flex items-center gap-3 bg-purple-50 text-purple-700"
                >
                  <Users className="w-5 h-5" />
                  Invite Friends
                </button>

                <button
                  onClick={() => {
                    handleAIChat();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-base font-semibold rounded-lg flex items-center gap-3 bg-primary-50 text-primary-700"
                >
                  <Bot className="w-5 h-5" />
                  AI Travel Assistant
                </button>

                {[
                  { label: 'Home', icon: MapPin, action: handleHome },
                  { label: 'Destinations', icon: Globe, action: handleDestinations },
                  { label: 'Arcade', icon: Gamepad2, action: handleArcade },
                  { label: 'Deals', icon: TrendingUp, action: handlePriceTracker },
                  { label: 'Blog', icon: BookOpen, action: handleBlog },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.action();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-base font-medium rounded-lg flex items-center gap-3 text-neutral-800 hover:bg-neutral-100 transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <ReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
      />
    </>
  );
};

export default Header;