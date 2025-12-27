import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_USER } from '../data/mockData';

type User = {
    id: string;
    email: string;
    name: string;
    streak?: number;
    logs?: any[]; // Using any[] for now as defined in mockData logs structure
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    signIn: (token: string, userData: User) => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    signIn: async () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for stored session
        const bootstrapAsync = async () => {
            try {
                // Check for stored session logic would go here
                // For now, we start fresh to show the Login Flow
                // const user = await AsyncStorage.getItem('user');
                // if (user) setUser(JSON.parse(user));
            } catch (e) {
                console.error('Failed to load user', e);
            } finally {
                setIsLoading(false);
            }
        };

        bootstrapAsync();
    }, []);

    const signIn = async (token: string, userData: User) => {
        // In a real app, store token in SecureStore
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const signOut = async () => {
        await AsyncStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
