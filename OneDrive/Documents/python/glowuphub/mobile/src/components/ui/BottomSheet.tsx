import React, { forwardRef, useImperativeHandle, useCallback } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback, Platform } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT * 0.7;

export interface BottomSheetRef {
    scrollTo: (destination: number) => void;
    isActive: () => boolean;
}

interface BottomSheetProps {
    children?: React.ReactNode;
}

const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(({ children }, ref) => {
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);

    const scrollTo = useCallback((destination: number) => {
        "worklet";
        active.value = destination !== 0;
        translateY.value = withSpring(destination, { damping: 15 });
    }, []);

    const isActive = useCallback(() => {
        return active.value;
    }, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [scrollTo, isActive]);

    const context = useSharedValue({ y: 0 });
    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            translateY.value = event.translationY + context.value.y;
            translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
        })
        .onEnd(() => {
            if (translateY.value > -SCREEN_HEIGHT / 3) {
                scrollTo(0);
            } else {
                scrollTo(MAX_TRANSLATE_Y);
            }
        });

    const rBottomSheetStyle = useAnimatedStyle(() => {
        const borderRadius = interpolate(
            translateY.value,
            [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
            [25, 40],
            Extrapolate.CLAMP
        );

        return {
            borderRadius,
            transform: [{ translateY: translateY.value }],
        };
    });

    const rBackdropStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(active.value ? 1 : 0),
        };
    }, []);

    const rBackdropProps = useAnimatedStyle(() => {
        return {
            pointerEvents: active.value ? 'auto' : 'none',
        } as any;
    }, []);

    return (
        <>
            <Animated.View
                animatedProps={rBackdropProps}
                style={[
                    {
                        ...StyleSheet.absoluteFillObject,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    },
                    rBackdropStyle,
                ]}
            >
                <TouchableWithoutFeedback onPress={() => scrollTo(0)}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>
            </Animated.View>
            <GestureDetector gesture={gesture}>
                <Animated.View
                    style={[
                        styles.bottomSheetContainer,
                        rBottomSheetStyle,
                        { backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#18181b' }
                    ]}
                >
                    <BlurView
                        tint="dark"
                        intensity={95}
                        style={[StyleSheet.absoluteFillObject, { borderRadius: 40, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }]}
                    />
                    <View className="w-12 h-1.5 bg-white/20 self-center mt-3 rounded-full mb-6" />
                    {children}
                </Animated.View>
            </GestureDetector>
        </>
    );
});

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: SCREEN_HEIGHT,
        width: '100%',
        position: 'absolute',
        top: SCREEN_HEIGHT,
        zIndex: 1000,
    },
});

export default BottomSheet;
