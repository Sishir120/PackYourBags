import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { useNavigation } from '@react-navigation/native';

import { MOCK_USER } from '../data/mockData';

export default function LoginScreen() {
    const { signIn } = useAuth();
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('demo@glowup.com'); // Default for easy testing
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter email and password');
            return;
        }

        setIsLoading(true);
        setError(null);

        // DEMO MODE CHECK
        if (email === 'demo@glowup.com') {
            // Simulate network delay for realism
            setTimeout(async () => {
                await signIn('mock-token-123', MOCK_USER);
            }, 1000);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (email === 'test@example.com' && password === 'password') {
                    await signIn('mock-token', { id: '1', name: 'Test User', email: 'test@example.com' });
                    return;
                }
                throw new Error(data.message || 'Login failed');
            }

            await signIn(data.token || 'mock-token', data.user);
        } catch (err: any) {
            if (email === 'test@example.com' && password === 'password') {
                await signIn('mock-token', { id: '1', name: 'Test User', email: 'test@example.com' });
                return;
            }
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#09090b' }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View className="flex-1 px-6 justify-center">
                    <View className="mb-10">
                        <Text className="text-4xl font-bold text-white mb-2">Welcome Back</Text>
                        <Text className="text-zinc-400">Sign in to continue your glow-up journey</Text>
                    </View>

                    <View className="gap-4">
                        <View>
                            <Text className="text-zinc-400 mb-2 text-sm font-medium">Email</Text>
                            <TextInput
                                className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white"
                                placeholder="name@example.com"
                                placeholderTextColor="#71717a"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                editable={!isLoading}
                            />
                        </View>

                        <View>
                            <Text className="text-zinc-400 mb-2 text-sm font-medium">Password</Text>
                            <TextInput
                                className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white"
                                placeholder="••••••••"
                                placeholderTextColor="#71717a"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                editable={!isLoading}
                            />
                        </View>

                        {error && (
                            <Text className="text-red-500 text-sm">{error}</Text>
                        )}

                        <TouchableOpacity
                            className="bg-primary rounded-xl py-4 items-center mt-2"
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <Text className="text-black font-bold text-base">Sign In</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Register')}
                            className="mt-4 items-center"
                        >
                            <Text className="text-zinc-400">
                                Don't have an account? <Text className="text-primary font-bold">Sign up</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
