import React from 'react';
import { View, Platform, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface GlassCardProps extends ViewProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
    delay?: number;
}

export const GlassCard = ({ children, className = "", intensity = 20, delay = 0, ...props }: GlassCardProps) => {
    const isIOS = Platform.OS === 'ios';

    const Content = () => (
        <View className={`border border-white/10 rounded-3xl overflow-hidden ${className}`} {...props}>
            {isIOS ? (
                <BlurView intensity={intensity} tint="dark" className="p-5">
                    {children}
                </BlurView>
            ) : (
                <View className="bg-zinc-900/90 p-5">
                    {children}
                </View>
            )}
        </View>
    );

    return (
        <Animated.View entering={FadeInUp.delay(delay).springify()}>
            <Content />
        </Animated.View>
    );
};
