import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Utensils, Droplets, Scale, Plus, Check, Play, Sparkles, Activity as ActivityIcon } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import api from '../services/api';
import { MobileActivityProtocol, MobileProtocolStep } from '../components/MobileActivityProtocol';
import Animated, { FadeInDown } from 'react-native-reanimated';

const PROTOCOLS: Record<string, MobileProtocolStep[]> = {
    'walking': [
        {
            title: "Gear & Prep",
            description: "Shoes laced? Water ready? Let's check your posture.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/walking_protocol_main_1766485275665.png",
            tip: "Head up, shoulders relaxed, and swing your arms naturally."
        },
        {
            title: "Paced Walk",
            description: "Maintain a steady, brisk pace. Keep your breathing steady.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/walking_protocol_main_1766485275665.png",
            duration: 1800,
            tip: "Land on your heel and roll through to your toes."
        },
        {
            title: "Cool Down",
            description: "Slow your pace gradually. Let your heart rate settle.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/cooldown_protocol_common_1766485407095.png",
            duration: 300
        }
    ],
    'yoga': [
        {
            title: "Centering",
            description: "Find your quiet space. Roll out your mat and focus on your breath.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/yoga_protocol_main_1766485293224.png",
            duration: 180,
            tip: "Inhale deeply through your nose, exhale slowly through your mouth."
        },
        {
            title: "Main Practice",
            description: "Move mindfully. Hold each pose for 5 deep breaths.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/yoga_protocol_main_1766485293224.png",
            duration: 900
        },
        {
            title: "Savasana",
            description: "Rest deeply. Let your body absorb the practice.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/cooldown_protocol_common_1766485407095.png",
            duration: 300
        }
    ],
    'home-workout': [
        {
            title: "Warmup",
            description: "Get the blood flowing with jumping jacks and high knees.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/home_workout_main_1766485319868.png",
            duration: 300
        },
        {
            title: "Power Circuit",
            description: "Keep your core tight and maintain constant focus.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/home_workout_main_1766485319868.png",
            duration: 1200,
            tip: "Focus on form over speed."
        }
    ],
    'cycling': [
        {
            title: "Interval Ride",
            description: "Find your rhythm. Push on the intervals, rest on the recovery.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/cycling_protocol_main_1766485336715.png",
            duration: 1800
        }
    ]
};

export default function TrackScreen() {
    const { user } = useAuth();

    // UI State
    const [waterCount, setWaterCount] = useState(0);
    const [weight, setWeight] = useState('');
    const [calories, setCalories] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeProtocol, setActiveProtocol] = useState<string | null>(null);

    const logData = async (payload: any) => {
        if (!user) return;
        setLoading(true);

        try {
            const res = await api.post('/log', payload);
            console.log(`Logged successfully`, payload);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleProtocolComplete = (duration: number) => {
        const type = activeProtocol || 'activity';
        setActiveProtocol(null);
        // For now, logging activity completion is a placeholder or maps to steps
        // logData({ steps: Math.floor(duration * 1.5) }); // Example estimation
        console.log(`Completed ${type} for ${duration}s`);
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <MobileActivityProtocol
                visible={!!activeProtocol}
                onClose={() => setActiveProtocol(null)}
                title={activeProtocol ? activeProtocol.charAt(0).toUpperCase() + activeProtocol.slice(1) : ''}
                steps={activeProtocol ? PROTOCOLS[activeProtocol] : []}
                onComplete={handleProtocolComplete}
            />

            <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="mb-8">
                    <View className="flex-row items-center gap-2 mb-1">
                        <Sparkles size={12} color="#E8B4B8" />
                        <Text className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">Maintenance</Text>
                    </View>
                    <Text className="text-foreground text-3xl font-black">Daily Habits.</Text>
                </View>

                {/* Live Activity Section */}
                <Text className="text-foreground text-xl font-bold mb-4 tracking-tight">Support My Movement</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4 mb-8">
                    {[
                        { id: 'walking', label: 'Walk', color: '#10b981' },
                        { id: 'yoga', label: 'Yoga', color: '#8b5cf6' },
                        { id: 'home-workout', label: 'Workout', color: '#f59e0b' },
                        { id: 'cycling', label: 'Cycle', color: '#3b82f6' }
                    ].map((activity) => (
                        <TouchableOpacity
                            key={activity.id}
                            onPress={() => setActiveProtocol(activity.id)}
                            className="bg-card w-32 h-40 rounded-3xl items-center justify-center border border-border mr-3"
                        >
                            <View className="w-14 h-14 rounded-2xl items-center justify-center mb-4" style={{ backgroundColor: `${activity.color}15` }}>
                                <Play size={24} color={activity.color} fill={activity.color} />
                            </View>
                            <Text className="text-foreground font-bold">{activity.label}</Text>
                            <Text className="text-muted-foreground text-[9px] font-black uppercase tracking-widest mt-1">Live Protocol</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Fast Logs */}
                <Text className="text-foreground text-xl font-bold mb-4 tracking-tight">Quick Logs</Text>

                {/* Water Tracker */}
                <Animated.View entering={FadeInDown.delay(100)} className="bg-card p-6 rounded-[2.5rem] border border-border mb-6">
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="flex-row items-center gap-3">
                            <View className="bg-blue-500/10 p-3 rounded-2xl">
                                <Droplets size={24} color="#3b82f6" />
                            </View>
                            <Text className="text-lg font-bold text-foreground">Hydration</Text>
                        </View>
                        <Text className="text-2xl font-black text-blue-500">{waterCount * 250}ml</Text>
                    </View>

                    <View className="flex-row justify-between items-center bg-secondary rounded-2xl p-2 h-16">
                        <TouchableOpacity
                            onPress={() => setWaterCount(Math.max(0, waterCount - 1))}
                            className="w-12 h-12 items-center justify-center bg-background rounded-xl "
                        >
                            <Text className="text-2xl font-black text-foreground">-</Text>
                        </TouchableOpacity>

                        <Text className="font-black text-foreground text-sm uppercase tracking-widest">{waterCount} Glasses</Text>

                        <TouchableOpacity
                            onPress={() => {
                                const newCount = waterCount + 1;
                                setWaterCount(newCount);
                                logData({ water: 1 });
                            }}
                            className="w-12 h-12 items-center justify-center bg-primary rounded-xl shadow-lg"
                        >
                            <Plus size={24} color="#3D3D3D" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Weight Log */}
                <Animated.View entering={FadeInDown.delay(200)} className="bg-card p-6 rounded-[2.5rem] border border-border mb-6">
                    <View className="flex-row items-center gap-3 mb-4">
                        <View className="bg-emerald-500/10 p-3 rounded-2xl">
                            <Scale size={24} color="#10b981" />
                        </View>
                        <Text className="text-lg font-bold text-foreground">My Weight</Text>
                    </View>

                    <View className="flex-row gap-4">
                        <View className="bg-secondary flex-1 h-14 rounded-2xl justify-center px-6">
                            <TextInput
                                placeholder="0.0 kg"
                                placeholderTextColor="#9A9A9A"
                                keyboardType="numeric"
                                className="text-lg font-bold text-foreground"
                                value={weight}
                                onChangeText={setWeight}
                            />
                        </View>
                        <TouchableOpacity
                            className="bg-primary w-14 h-14 rounded-2xl items-center justify-center shadow-lg"
                            onPress={() => logData({ weight: parseFloat(weight) })}
                            disabled={loading || !weight}
                        >
                            {loading ? <ActivityIcon size={24} color="#3D3D3D" className="animate-spin" /> : <Check size={24} color="#3D3D3D" />}
                        </TouchableOpacity>
                    </View>
                    <Text className="text-muted-foreground text-[10px] italic mt-4 px-2">Logging regularly helps track your long-term progress.</Text>
                </Animated.View>

                {/* Nutrition Log */}
                <Animated.View entering={FadeInDown.delay(300)} className="bg-card p-6 rounded-[2.5rem] border border-border mb-6">
                    <View className="flex-row items-center gap-3 mb-4">
                        <View className="bg-orange-500/10 p-3 rounded-2xl">
                            <Utensils size={24} color="#f97316" />
                        </View>
                        <Text className="text-lg font-bold text-foreground">Quick Calories</Text>
                    </View>

                    <View className="flex-row gap-4">
                        <View className="bg-secondary flex-1 h-14 rounded-2xl justify-center px-6">
                            <TextInput
                                placeholder="e.g. 500 kcal"
                                placeholderTextColor="#9A9A9A"
                                keyboardType="numeric"
                                className="text-lg font-bold text-foreground"
                                value={calories}
                                onChangeText={setCalories}
                            />
                        </View>
                        <TouchableOpacity
                            className="bg-primary w-14 h-14 rounded-2xl items-center justify-center shadow-lg"
                            onPress={() => {
                                logData({ calories: parseInt(calories) });
                                setCalories('');
                            }}
                            disabled={loading || !calories}
                        >
                            {loading ? <ActivityIcon size={24} color="#3D3D3D" className="animate-spin" /> : <Plus size={24} color="#3D3D3D" />}
                        </TouchableOpacity>
                    </View>
                </Animated.View>

            </ScrollView>
        </SafeAreaView>
    );
}
