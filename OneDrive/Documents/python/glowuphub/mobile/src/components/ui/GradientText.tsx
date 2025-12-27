import React from 'react';
import { Text, TextProps, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

interface GradientTextProps extends TextProps {
    colors?: readonly [string, string, ...string[]];
}

export const GradientText = ({ style, colors = ['#00fbff', '#22d3ee'], ...props }: GradientTextProps) => {
    return (
        <MaskedView
            maskElement={<Text {...props} style={[style, { opacity: 1 }]} />}
        >
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Text {...props} style={[style, { opacity: 0 }]} />
            </LinearGradient>
        </MaskedView>
    );
};
