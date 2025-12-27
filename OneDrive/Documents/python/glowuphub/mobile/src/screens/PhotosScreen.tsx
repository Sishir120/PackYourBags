import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'lucide-react-native';

const galleryImages = [
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=3270&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=3270&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=3270&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=3087&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=3270&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574680096141-9cbb80af459f?q=80&w=3269&auto=format&fit=crop",
];

export default function PhotosScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex-1 px-4 pt-4">
                <View className="items-center mb-8">
                    <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mb-3">
                        <Camera size={24} color="#E8B4B8" />
                    </View>
                    <Text className="text-2xl font-bold text-foreground mb-1">
                        Transformation <Text className="text-primary italic">Gallery</Text>
                    </Text>
                    <Text className="text-center text-muted-foreground text-sm px-8">
                        Real people. Real results. Snapshot proof of our community's success.
                    </Text>
                </View>

                <View className="flex-row flex-wrap justify-between pb-24">
                    {/* Mocking the TikTok photo content with high-quality placeholders since we can't embed web widgets directly here easily */}
                    {galleryImages.map((src, index) => (
                        <View
                            key={index}
                            className="w-[48%] mb-4 rounded-xl overflow-hidden bg-card border border-border"
                        >
                            <View className="aspect-[3/4]">
                                <Image
                                    source={{ uri: src }}
                                    className="flex-1 w-full h-full"
                                    resizeMode="cover"
                                />
                            </View>
                            <View className="p-2">
                                <Text className="text-[10px] font-bold text-primary uppercase mb-1">Success Story</Text>
                                <Text className="text-xs text-foreground italic" numberOfLines={2}>
                                    "This journey changed my life forever."
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
