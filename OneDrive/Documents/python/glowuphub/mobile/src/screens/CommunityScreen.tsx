import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Users } from 'lucide-react-native';

const stories = [
    {
        id: 1,
        name: "Priya K.",
        title: "Lost 15kg w/o giving up Rice",
        story: "I always thought I had to starve to lose weight. Sabita taught me how to balance my meals. I eat biryani on Sundays guilt-free!",
        image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=3087&auto=format&fit=crop",
        tags: ["Weight Loss", "Sustainable"],
    },
    {
        id: 2,
        name: "Anjali M.",
        title: "PCOD Symptoms Gone",
        story: "Irregular periods and acne were ruining my confidence. With seed cycling and gentle nutrition, my hormones are finally balanced.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=3088&auto=format&fit=crop",
        tags: ["PCOD", "Hormonal Health"],
    },
    {
        id: 3,
        name: "Suman T.",
        title: "More Energy for Kids",
        story: "I used to be exhausted by 2 PM. Now I have the energy to play with my children after work.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=3088&auto=format&fit=crop",
        tags: ["Energy"],
    },
];

export default function CommunityScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex-1 px-6 pt-4">
                <View className="mb-8">
                    <Text className="text-3xl font-bold text-foreground mb-2">
                        Community <Text className="text-primary italic">Stories</Text>
                    </Text>
                    <Text className="text-muted-foreground">
                        Real women, real victories.
                    </Text>
                </View>

                {/* Featured Story */}
                <View className="mb-8 bg-card rounded-3xl overflow-hidden border border-border shadow-sm">
                    <Image
                        source={{ uri: "https://images.unsplash.com/photo-1560963689-02e70246bb4b?q=80&w=3000&auto=format&fit=crop" }}
                        className="h-48 w-full"
                        resizeMode="cover"
                    />
                    <View className="p-6">
                        <View className="flex-row items-center gap-4 mb-4">
                            <View className="flex-row items-center gap-1">
                                <Users size={16} color="#E8B4B8" />
                                <Text className="text-xs text-muted-foreground">5k+ Members</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <Heart size={16} color="#E8B4B8" />
                                <Text className="text-xs text-muted-foreground">Supportive</Text>
                            </View>
                        </View>
                        <Text className="text-xl font-bold text-foreground mb-2">
                            "Self-love is the first step to healing"
                        </Text>
                        <Text className="text-muted-foreground text-sm leading-relaxed">
                            Join over 5,000 women who have transformed not just their bodies, but their mindsets.
                        </Text>
                    </View>
                </View>

                {/* List */}
                <View className="gap-6 pb-24">
                    {stories.map((story) => (
                        <View key={story.id} className="bg-card rounded-2xl p-4 flex-row gap-4 border border-border shadow-sm">
                            <Image
                                source={{ uri: story.image }}
                                className="w-20 h-24 rounded-xl"
                                resizeMode="cover"
                            />
                            <View className="flex-1 justify-between">
                                <View>
                                    <View className="flex-row flex-wrap gap-2 mb-1">
                                        {story.tags.map(tag => (
                                            <Text key={tag} className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-center">
                                                {tag}
                                            </Text>
                                        ))}
                                    </View>
                                    <Text className="font-bold text-foreground leading-tight mb-1">{story.title}</Text>
                                    <Text className="text-xs text-muted-foreground line-clamp-2">"{story.story}"</Text>
                                </View>
                                <View className="flex-row items-center gap-2 mt-2">
                                    <View className="w-6 h-6 rounded-full bg-primary/20 items-center justify-center">
                                        <Text className="text-[10px] font-bold text-primary">{story.name[0]}</Text>
                                    </View>
                                    <Text className="text-xs font-semibold text-foreground">{story.name}</Text>
                                </View>
                            </View>
                        </View>
                    ))}

                    <View className="h-8" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
