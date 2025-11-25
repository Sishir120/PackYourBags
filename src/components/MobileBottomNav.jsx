import React from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { Home, Gamepad2, Bot, User, Sparkles } from 'lucide-react';

const MobileBottomNav = () => {
    const navigate = useNavigate();

    const navItems = [
        { id: 'home', label: 'Home', icon: Home, path: '/' },
        { id: 'arcade', label: 'Arcade', icon: Gamepad2, path: '/arcade' },
        { id: 'spin', label: 'Spin', icon: Sparkles, path: '/', isFab: true }, // Special FAB
        { id: 'ai', label: 'AI Chat', icon: Bot, path: '/ai-chat' },
        { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    if (item.isFab) {
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    navigate('/');
                                    setTimeout(() => {
                                        document.getElementById('roulette')?.scrollIntoView({ behavior: 'smooth' });
                                    }, 100);
                                }}
                                className="relative -top-6 bg-gradient-to-r from-amber-400 to-orange-500 text-white p-4 rounded-full shadow-lg shadow-orange-500/30 border-4 border-white transform transition-transform active:scale-95"
                                aria-label="Spin Roulette"
                            >
                                <item.icon className="w-6 h-6" />
                            </button>
                        );
                    }

                    return (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                                }`
                            }
                            aria-label={item.label}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
                                    <span className="text-[10px] font-medium">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
