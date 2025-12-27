import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Play, Sparkles } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedProps, withDelay, withSpring, FadeInDown } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { API_URL } from '../config';
import { MOCK_USER } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { MobileStreakTracker } from '../components/MobileStreakTracker';
import { MobileFortuneCookie } from '../components/MobileFortuneCookie';
import { InteractiveLogSheet } from '../components/InteractiveLogSheet';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function HomeScreen() {
    const { user: authUser } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isLogVisible, setIsLogVisible] = useState(false);
    const progress = useSharedValue(0);
    const navigation = useNavigation<any>();

    // Greeting logic
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    // Ring configuration
    const RING_SIZE = 120;
    const STROKE_WIDTH = 10;
    const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    useEffect(() => {
        const fetchUser = async () => {
            if (authUser?.email === 'demo@glowup.com') {
                setTimeout(() => {
                    setUser(MOCK_USER);
                    setLoading(false);
                    progress.value = withDelay(500, withSpring(0.85));
                }, 500);
                return;
            }

            try {
                const res = await fetch(`${API_URL}/user`);
                if (!res.ok) throw new Error(`API Error: ${res.status}`);
                const data = await res.json();
                setUser(data);
                const score = data.glowScore || 0;
                progress.value = withDelay(500, withSpring(score / 100));
            } catch (error) {
                console.error("Failed to fetch user:", error);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [authUser]);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
    }));

    if (loading) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator color="#E8B4B8" size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Greeting Section */}
                <View className="flex-row justify-between items-start mb-8">
                    <View>
                        <View className="flex-row items-center gap-2 mb-1">
                            <Sparkles size={12} color="#E8B4B8" />
                            <Text className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">
                                {greeting}
                            </Text>
                        </View>
                        <Text className="text-foreground text-4xl font-black tracking-tight">
                            {user?.name?.split(' ')[0] || 'Member'}.
                        </Text>
                        <Text className="text-muted-foreground text-sm mt-1">
                            You're doing <Text className="text-foreground font-bold">great</Text> today.
                        </Text>
                    </View>

                    {/* Glow Score Ring */}
                    <View className="relative items-center justify-center">
                        <Svg width={RING_SIZE} height={RING_SIZE} style={{ transform: [{ rotate: '-90deg' }] }}>
                            <Circle
                                cx={RING_SIZE / 2}
                                cy={RING_SIZE / 2}
                                r={RADIUS}
                                stroke="#F5F5F2"
                                strokeWidth={STROKE_WIDTH}
                            />
                            <AnimatedCircle
                                cx={RING_SIZE / 2}
                                cy={RING_SIZE / 2}
                                r={RADIUS}
                                stroke="#E8B4B8"
                                strokeWidth={STROKE_WIDTH}
                                strokeLinecap="round"
                                strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                                animatedProps={animatedProps}
                            />
                        </Svg>
                        <View className="absolute items-center justify-center">
                            <Text className="text-foreground font-black text-2xl tracking-tighter">
                                {Math.round((user?.glowScore || 85))}%
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Motivational Components */}
                <MobileStreakTracker count={5} />
                <MobileFortuneCookie />

                {/* Today's Focus */}
                <Animated.View entering={FadeInDown.delay(400)} className="mb-8">
                    <Text className="text-foreground text-xl font-bold mb-4 tracking-tight">Today's Focus</Text>
                    <View className="bg-card rounded-[2.5rem] p-7 border border-border shadow-sm">
                        <Text className="text-2xl font-black text-foreground mb-2">Gentle Movement</Text>
                        <Text className="text-muted-foreground leading-relaxed mb-6 text-sm">
                            Your body is adapting well. A quick <Text className="text-foreground font-bold">Yoga flow</Text> or a <Text className="text-foreground font-bold">walk</Text> will clear your mind.
                        </Text>

                        <TouchableOpacity
                            className="bg-primary h-14 rounded-2xl items-center justify-center shadow-lg"
                            onPress={() => setIsLogVisible(true)}
                        >
                            <Text className="text-[#3D3D3D] font-black uppercase tracking-widest">Start Daily Habits</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                <InteractiveLogSheet
                    visible={isLogVisible}
                    onClose={() => setIsLogVisible(false)}
                    onComplete={(data) => {
                        console.log('Daily Habit Data:', data);
                        setIsLogVisible(false);
                    }}
                />

                {/* Quick Support */}
                <Text className="text-foreground text-xl font-bold mb-4 tracking-tight">Quick Support</Text>
                <View className="flex-row gap-4">
                    <TouchableOpacity
                        className="flex-1 bg-card p-6 rounded-[2rem] items-center justify-center gap-3 border border-border"
                        onPress={() => navigation.navigate('Routines')}
                    >
                        <View className="w-12 h-12 bg-primary/10 rounded-2xl items-center justify-center">
                            <Play size={24} color="#E8B4B8" fill="#E8B4B8" />
                        </View>
                        <Text className="font-black text-[10px] text-foreground uppercase tracking-widest">Training</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-1 bg-card p-6 rounded-[2rem] items-center justify-center gap-3 border border-border"
                        onPress={() => navigation.navigate('Chat')}
                    >
                        <View className="w-12 h-12 bg-secondary/20 rounded-2xl items-center justify-center">
                            <MessageCircle size={24} color="#A8C5A8" />
                        </View>
                        <Text className="font-black text-[10px] text-foreground uppercase tracking-widest">Care Team</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
