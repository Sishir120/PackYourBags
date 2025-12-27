import React from 'react';
import { View, Text } from 'react-native';
import { Flame } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface MobileStreakTrackerProps {
    count?: number;
}

export function MobileStreakTracker({ count = 5 }: MobileStreakTrackerProps) {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const currentDayIndex = 4; // Friday for demo

    return (
        <Animated.View
            entering={FadeInDown.delay(200)}
            className="bg-card p-6 rounded-[2.5rem] border border-border mb-6"
        >
            <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center gap-3">
                    <View className="bg-orange-500/10 p-3 rounded-2xl">
                        <Flame size={24} color="#f97316" fill="#f97316" />
                    </View>
                    <View>
                        <Text className="text-foreground text-xl font-black">{count} Day Streak</Text>
                        <Text className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Keep the flame alive!</Text>
                    </View>
                </View>
            </View>

            <View className="flex-row justify-between items-center px-1">
                {days.map((day, i) => {
                    const isCompleted = i <= currentDayIndex;
                    const isToday = i === currentDayIndex;

                    return (
                        <View key={i} className="items-center gap-2">
                            <View
                                className={`w-10 h-10 rounded-2xl items-center justify-center border ${isToday ? 'bg-primary border-primary shadow-sm' :
                                        isCompleted ? 'bg-orange-500/10 border-orange-500/20' :
                                            'bg-secondary border-transparent'
                                    }`}
                            >
                                <Text
                                    className={`text-[10px] font-black ${isToday ? 'text-white' :
                                            isCompleted ? 'text-orange-500' :
                                                'text-muted-foreground'
                                        }`}
                                >
                                    {day}
                                </Text>
                            </View>
                            {isToday && (
                                <View className="w-1 h-1 rounded-full bg-primary" />
                            )}
                        </View>
                    );
                })}
            </View>
        </Animated.View>
    );
}
