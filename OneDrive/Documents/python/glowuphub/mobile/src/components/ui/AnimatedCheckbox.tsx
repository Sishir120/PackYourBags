import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolateColor, withTiming } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

interface AnimatedCheckboxProps {
    checked: boolean;
    onPress: () => void;
}

export const AnimatedCheckbox = ({ checked, onPress }: AnimatedCheckboxProps) => {
    const scale = useSharedValue(checked ? 1 : 0);
    const progress = useSharedValue(checked ? 1 : 0);

    useEffect(() => {
        scale.value = withSpring(checked ? 1 : 0, { damping: 15 });
        progress.value = withTiming(checked ? 1 : 0, { duration: 200 });
    }, [checked]);

    const rContainerStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            ['rgba(255, 255, 255, 0.1)', '#DFFF00']
        );
        const borderColor = interpolateColor(
            progress.value,
            [0, 1],
            ['rgba(255, 255, 255, 0.2)', '#DFFF00']
        );

        return {
            backgroundColor,
            borderColor,
        };
    });

    const rIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            opacity: progress.value
        };
    });

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <Animated.View className="w-6 h-6 rounded-full border items-center justify-center mr-3" style={rContainerStyle}>
                <Animated.View style={rIconStyle}>
                    <Check size={14} color="#000" strokeWidth={4} />
                </Animated.View>
            </Animated.View>
        </TouchableOpacity>
    );
};
