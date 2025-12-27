import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { X, Check, Sparkles, Smile, Meh, Frown, Zap, Coffee, Moon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

interface InteractiveLogSheetProps {
    visible: boolean;
    onClose: () => void;
    onComplete: (data: any) => void;
}

export function InteractiveLogSheet({ visible, onClose, onComplete }: InteractiveLogSheetProps) {
    const [step, setStep] = useState(1);
    const [mood, setMood] = useState<string | null>(null);
    const [habits, setHabits] = useState<string[]>([]);

    const toggleHabit = (id: string) => {
        setHabits(prev => prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]);
    };

    const handleFinish = () => {
        onComplete({ mood, habits });
        // Reset state for next time
        setTimeout(() => {
            setStep(1);
            setMood(null);
            setHabits([]);
        }, 300);
    };

    if (!visible) return null;

    return (
        <Modal visible={visible} transparent animationType="none">
            <View className="flex-1 justify-end">
                {/* Backdrop */}
                <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                    className="absolute inset-0 bg-black/60"
                >
                    <TouchableOpacity className="flex-1" onPress={onClose} />
                </Animated.View>

                {/* Sheet */}
                <Animated.View
                    entering={SlideInUp.springify().damping(20)}
                    exiting={SlideOutDown}
                    className="bg-background rounded-t-[3rem] p-8 pb-12 border-t border-white/5"
                    style={{ maxHeight: height * 0.8 }}
                >
                    <View className="w-12 h-1.5 bg-white/10 rounded-full self-center mb-8" />

                    {step === 1 ? (
                        <View className="space-y-8">
                            <View>
                                <View className="flex-row items-center gap-2 mb-2">
                                    <Sparkles size={16} color="#E8B4B8" />
                                    <Text className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Step 1 of 2</Text>
                                </View>
                                <Text className="text-foreground text-3xl font-black tracking-tight">How are you feeling?</Text>
                            </View>

                            <View className="flex-row justify-between gap-4">
                                {[
                                    { id: 'great', icon: Smile, label: 'Great', color: '#10b981' },
                                    { id: 'okay', icon: Meh, label: 'Okay', color: '#f59e0b' },
                                    { id: 'low', icon: Frown, label: 'Low', color: '#ef4444' }
                                ].map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => setMood(item.id)}
                                        className={`flex-1 p-6 rounded-3xl border ${mood === item.id ? 'bg-primary/10 border-primary' : 'bg-card border-border'} items-center gap-3 transition-all`}
                                    >
                                        <item.icon size={32} color={mood === item.id ? '#E8B4B8' : '#9A9A9A'} />
                                        <Text className={`font-bold ${mood === item.id ? 'text-foreground' : 'text-muted-foreground'}`}>{item.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TouchableOpacity
                                disabled={!mood}
                                onPress={() => setStep(2)}
                                className={`h-16 rounded-2xl items-center justify-center shadow-lg ${mood ? 'bg-primary' : 'bg-secondary opacity-50'}`}
                            >
                                <Text className="text-[#3D3D3D] font-black uppercase tracking-widest">Next</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View className="space-y-8">
                            <View>
                                <View className="flex-row items-center gap-2 mb-2">
                                    <Sparkles size={16} color="#E8B4B8" />
                                    <Text className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Step 2 of 2</Text>
                                </View>
                                <Text className="text-foreground text-3xl font-black tracking-tight">Daily Rituals.</Text>
                            </View>

                            <View className="space-y-3">
                                {[
                                    { id: 'breath', label: 'Morning Breathwork', icon: Coffee },
                                    { id: 'water', label: 'Hydration Target', icon: Zap },
                                    { id: 'sleep', label: 'Restful Sleep', icon: Moon }
                                ].map((ritual) => (
                                    <TouchableOpacity
                                        key={ritual.id}
                                        onPress={() => toggleHabit(ritual.id)}
                                        className={`p-5 rounded-2xl border ${habits.includes(ritual.id) ? 'bg-primary/10 border-primary' : 'bg-card border-border'} flex-row items-center justify-between`}
                                    >
                                        <View className="flex-row items-center gap-4">
                                            <View className="bg-secondary p-2 rounded-xl">
                                                <ritual.icon size={20} color="#E8B4B8" />
                                            </View>
                                            <Text className={`font-bold ${habits.includes(ritual.id) ? 'text-foreground' : 'text-muted-foreground'}`}>{ritual.label}</Text>
                                        </View>
                                        <View className={`w-6 h-6 rounded-full border ${habits.includes(ritual.id) ? 'bg-primary border-primary' : 'border-border'} items-center justify-center`}>
                                            {habits.includes(ritual.id) && <Check size={14} color="#3D3D3D" />}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    onPress={() => setStep(1)}
                                    className="h-16 px-8 bg-secondary rounded-2xl items-center justify-center"
                                >
                                    <Text className="text-foreground font-bold">Back</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleFinish}
                                    className="flex-1 h-16 bg-primary rounded-2xl items-center justify-center shadow-lg"
                                >
                                    <Text className="text-[#3D3D3D] font-black uppercase tracking-widest">Complete Check-in</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
}
