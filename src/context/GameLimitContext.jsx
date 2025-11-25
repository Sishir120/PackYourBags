import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSubscription } from './SubscriptionContext';

const GameLimitContext = createContext();

const GAME_LIMIT_FREE = 3; // Free users can play 3 times
const COOLDOWN_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export const GameLimitProvider = ({ children }) => {
    const { isPremium } = useSubscription();
    const [gamePlays, setGamePlays] = useState({});
    const [cooldownEnd, setCooldownEnd] = useState(null);

    // Load game plays from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('gamePlays');
        const storedCooldown = localStorage.getItem('gameCooldownEnd');

        if (stored) {
            setGamePlays(JSON.parse(stored));
        }

        if (storedCooldown) {
            const cooldownTime = parseInt(storedCooldown);
            if (cooldownTime > Date.now()) {
                setCooldownEnd(cooldownTime);
            } else {
                // Cooldown expired, reset
                localStorage.removeItem('gameCooldownEnd');
                localStorage.removeItem('gamePlays');
                setGamePlays({});
            }
        }
    }, []);

    // Save to localStorage whenever gamePlays changes
    useEffect(() => {
        if (Object.keys(gamePlays).length > 0) {
            localStorage.setItem('gamePlays', JSON.stringify(gamePlays));
        }
    }, [gamePlays]);

    // Check if cooldown has expired
    useEffect(() => {
        if (cooldownEnd && cooldownEnd <= Date.now()) {
            // Reset game plays
            setGamePlays({});
            setCooldownEnd(null);
            localStorage.removeItem('gamePlays');
            localStorage.removeItem('gameCooldownEnd');
        }
    }, [cooldownEnd]);

    /**
     * Check if user can play a game
     * @param {string} gameId - Unique identifier for the game
     * @returns {object} { canPlay: boolean, playsRemaining: number, cooldownEnd: number|null }
     */
    const canPlayGame = (gameId) => {
        // Premium users can always play
        if (isPremium) {
            return {
                canPlay: true,
                playsRemaining: Infinity,
                cooldownEnd: null,
                isPremium: true
            };
        }

        // Check if in cooldown
        if (cooldownEnd && cooldownEnd > Date.now()) {
            return {
                canPlay: false,
                playsRemaining: 0,
                cooldownEnd: cooldownEnd,
                isPremium: false
            };
        }

        // Check plays for this game
        const plays = gamePlays[gameId] || 0;
        const remaining = GAME_LIMIT_FREE - plays;

        return {
            canPlay: remaining > 0,
            playsRemaining: Math.max(0, remaining),
            cooldownEnd: null,
            isPremium: false
        };
    };

    /**
     * Record a game play
     * @param {string} gameId - Unique identifier for the game
     */
    const recordGamePlay = (gameId) => {
        // Premium users don't need tracking
        if (isPremium) return;

        const newPlays = { ...gamePlays };
        newPlays[gameId] = (newPlays[gameId] || 0) + 1;

        // Check if this was the last play
        const totalPlays = Object.values(newPlays).reduce((sum, count) => sum + count, 0);

        if (totalPlays >= GAME_LIMIT_FREE) {
            // Start cooldown
            const cooldownTime = Date.now() + COOLDOWN_DURATION;
            setCooldownEnd(cooldownTime);
            localStorage.setItem('gameCooldownEnd', cooldownTime.toString());
        }

        setGamePlays(newPlays);
    };

    /**
     * Get total plays remaining across all games
     * @returns {number} Total plays remaining
     */
    const getTotalPlaysRemaining = () => {
        if (isPremium) return Infinity;

        if (cooldownEnd && cooldownEnd > Date.now()) {
            return 0;
        }

        const totalPlays = Object.values(gamePlays).reduce((sum, count) => sum + count, 0);
        return Math.max(0, GAME_LIMIT_FREE - totalPlays);
    };

    /**
     * Get time remaining in cooldown
     * @returns {number} Milliseconds remaining, or 0 if no cooldown
     */
    const getCooldownRemaining = () => {
        if (!cooldownEnd) return 0;
        return Math.max(0, cooldownEnd - Date.now());
    };

    /**
     * Format cooldown time as readable string
     * @returns {string} Formatted time string
     */
    const getFormattedCooldown = () => {
        const remaining = getCooldownRemaining();
        if (remaining === 0) return null;

        const minutes = Math.floor(remaining / (60 * 1000));
        const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

        if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        }
        return `${seconds}s`;
    };

    /**
     * Reset all game plays (for testing or admin purposes)
     */
    const resetGamePlays = () => {
        setGamePlays({});
        setCooldownEnd(null);
        localStorage.removeItem('gamePlays');
        localStorage.removeItem('gameCooldownEnd');
    };

    const value = {
        canPlayGame,
        recordGamePlay,
        getTotalPlaysRemaining,
        getCooldownRemaining,
        getFormattedCooldown,
        resetGamePlays,
        isPremium,
        gameLimit: GAME_LIMIT_FREE,
        cooldownDuration: COOLDOWN_DURATION
    };

    return (
        <GameLimitContext.Provider value={value}>
            {children}
        </GameLimitContext.Provider>
    );
};

/**
 * Hook to use game limit context
 * @returns {object} Game limit context value
 */
export const useGameLimit = () => {
    const context = useContext(GameLimitContext);
    if (!context) {
        throw new Error('useGameLimit must be used within GameLimitProvider');
    }
    return context;
};

export default GameLimitContext;
