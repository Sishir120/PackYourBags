import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withTiming,
    FadeIn,
    ZoomIn
} from 'react-native-reanimated';
import { Sparkles, Cookie } from 'lucide-react-native';

const MOTIVATIONS = [
    "Consistency is the companion of success.",
    "Your future self will thank you for today.",
    "Small steps lead to big transformations.",
    "Energy flows where intention goes.",
    "Strength grows in the moments you think you can't go on.",
];

export function MobileFortuneCookie() {
    const [isCracked, setIsCracked] = useState(false);
    const [message, setMessage] = useState('');
    const shake = useSharedValue(0);
    const crackScale = useSharedValue(1);

    const handleCrack = () => {
        if (isCracked) return;

        // Shake animation
        shake.value = withSequence(
            withTiming(-5, { duration: 50 }),
            withTiming(5, { duration: 50 }),
            withTiming(-5, { duration: 50 }),
            withTiming(0, { duration: 50 })
        );

        // Crack effect after a short delay
        setTimeout(() => {
            setMessage(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);
            setIsCracked(true);
            crackScale.value = withSpring(1.1);
        }, 200);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: shake.value },
            { scale: crackScale.value }
        ]
    }));

    return (
        <View className="bg-card p-6 rounded-[2.5rem] border border-border mb-6">
            <View className="flex-row items-center gap-2 mb-6">
                <Sparkles size={16} color="#E8B4B8" />
                <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Daily Reward</Text>
            </View>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCrack}
                className="items-center justify-center py-6"
            >
                <Animated.View style={animatedStyle}>
                    {!isCracked ? (
                        <View className="w-24 h-24 bg-secondary rounded-full items-center justify-center border border-border shadow-sm">
                            <Cookie size={48} color="#E8B4B8" strokeWidth={1.5} />
                        </View>
                    ) : (
                        <Animated.View entering={ZoomIn} className="items-center gap-4 px-4">
                            <View className="flex-row gap-2">
                                <View className="w-10 h-10 bg-secondary rounded-full items-center justify-center opacity-40 overflow-hidden">
                                    <Cookie size={32} color="#E8B4B8" style={{ transform: [{ translateX: -10 }] }} />
                                </View>
                                <View className="w-10 h-10 bg-secondary rounded-full items-center justify-center opacity-40 overflow-hidden">
                                    <Cookie size={32} color="#E8B4B8" style={{ transform: [{ translateX: 10 }] }} />
                                </View>
                            </View>
                            <Animated.View entering={FadeIn.delay(300)}>
                                <Text className="text-center text-foreground font-bold italic leading-relaxed">
                                    "{message}"
                                </Text>
                            </Animated.View>
                        </Animated.View>
                    )}
                </Animated.View>

                {!isCracked && (
                    <Text className="text-[10px] font-bold text-primary uppercase tracking-widest mt-6">Tap to Reveal</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}
