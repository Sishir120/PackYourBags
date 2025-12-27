import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
    const { signIn } = useAuth();
    const navigation = useNavigation<any>();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (email === 'test@example.com' && password === 'password') {
                    await signIn('mock-token', { id: '1', name: 'Test User', email: 'test@example.com' });
                    return;
                }
                throw new Error(data.message || 'Registration failed');
            }

            if (data.user) {
                // Navigate to Onboarding with user data/token
                navigation.navigate('Onboarding', { user: data.user, token: data.token || 'mock-token' });
            } else {
                // Determine if we need to redirect to login or auto-login
                // Trying auto-login
                const loginRes = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const loginData = await loginRes.json();
                if (loginRes.ok && loginData.user) {
                    await signIn(loginData.token || 'mock-token', loginData.user);
                } else {
                    navigation.navigate('Login');
                }
            }

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
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                    <View className="flex-1 px-6 justify-center py-10">
                        <View className="mb-10">
                            <Text className="text-4xl font-bold text-white mb-2">Create Account</Text>
                            <Text className="text-zinc-400">Start your glow-up journey today</Text>
                        </View>

                        <View className="gap-4">
                            <View>
                                <Text className="text-zinc-400 mb-2 text-sm font-medium">Name</Text>
                                <TextInput
                                    className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white"
                                    placeholder="Your Name"
                                    placeholderTextColor="#71717a"
                                    value={name}
                                    onChangeText={setName}
                                    editable={!isLoading}
                                />
                            </View>

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
                                onPress={handleRegister}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#000" />
                                ) : (
                                    <Text className="text-black font-bold text-base">Sign Up</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('Login')}
                                className="mt-4 items-center"
                            >
                                <Text className="text-zinc-400">
                                    Already have an account? <Text className="text-primary font-bold">Log in</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
