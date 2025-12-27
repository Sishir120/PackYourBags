import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { ExternalLink, Info, CheckCircle } from 'lucide-react-native';
import { GlassCard } from './GlassCard';

interface ScientificRationaleProps {
    rationale: string;
    citations: string[];
}

export function ScientificRationale({ rationale, citations }: ScientificRationaleProps) {
    const handleOpenCitation = (url: string) => {
        Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
    };

    return (
        <GlassCard intensity={15} className="p-4 mt-3 border-sage/20">
            <View className="flex-row items-center gap-2 mb-2">
                <Info size={16} color="#A8C5A8" />
                <Text className="text-sage font-bold text-xs uppercase tracking-widest">Scientific Rationale</Text>
            </View>

            <Text className="text-zinc-300 text-sm leading-relaxed mb-4">
                {rationale}
            </Text>

            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1">
                    <CheckCircle size={14} color="#A8C5A8" />
                    <Text className="text-zinc-500 text-[10px]">Expert Verified Data</Text>
                </View>

                <View className="flex-row gap-2">
                    {citations.map((url, idx) => (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => handleOpenCitation(url)}
                            className="bg-zinc-800/50 p-1.5 rounded-lg flex-row items-center gap-1 border border-zinc-700"
                        >
                            <Text className="text-zinc-400 text-[10px]">Source {idx + 1}</Text>
                            <ExternalLink size={10} color="#71717a" />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </GlassCard>
    );
}
