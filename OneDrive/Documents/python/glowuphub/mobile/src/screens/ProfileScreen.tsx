import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, TrendingUp, Calendar, Ribbon, Sparkles, MessageCircle, ArrowRight, Camera } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const navigation = useNavigation<any>();

    const openTikTok = () => {
        Linking.openURL('https://www.tiktok.com/@sabu7916');
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 100 }}>

                <View className="mb-8">
                    <View className="flex-row items-center gap-2 mb-1">
                        <Sparkles size={12} color="#E8B4B8" />
                        <Text className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">Identity</Text>
                    </View>
                    <Text className="text-foreground text-3xl font-black">My Profile.</Text>
                </View>

                {/* Profile Card */}
                <View className="bg-card p-6 rounded-[2.5rem] border border-border mb-8 flex-row items-center gap-4">
                    <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center border border-primary/20">
                        <Text className="text-primary text-2xl font-black">{user?.name?.charAt(0) || 'U'}</Text>
                    </View>
                    <View>
                        <Text className="text-foreground text-xl font-black">{user?.name || 'User Name'}</Text>
                        <Text className="text-muted-foreground text-xs font-medium">{user?.email || 'user@email.com'}</Text>
                    </View>
                </View>

                {/* Photos / Gallery Link */}
                <TouchableOpacity
                    className="bg-card p-6 rounded-3xl border border-border mb-8 flex-row items-center justify-between"
                    onPress={() => navigation.navigate('Photos')}
                >
                    <View className="flex-row items-center gap-4">
                        <View className="w-12 h-12 rounded-2xl bg-primary/10 items-center justify-center">
                            <Camera size={24} color="#E8B4B8" />
                        </View>
                        <View>
                            <Text className="text-lg font-bold text-foreground">My Gallery</Text>
                            <Text className="text-xs text-muted-foreground">Progress visualizer</Text>
                        </View>
                    </View>
                    <ArrowRight size={20} color="#E8B4B8" />
                </TouchableOpacity>

                {/* Expert / Nutritionist Section */}
                <View className="mb-8">
                    <Text className="text-lg font-bold text-foreground mb-4">Your Expert</Text>
                    <View className="bg-card rounded-3xl border border-border overflow-hidden">
                        <View className="p-6">
                            <View className="flex-row items-center gap-4 mb-4">
                                <View className="w-16 h-16 rounded-full bg-secondary items-center justify-center overflow-hidden">
                                    {/* Placeholder for Expert Image if available in assets, else icon */}
                                    <MessageCircle size={32} color="#A8C5A8" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-foreground">Nutritionist Sabita Subedi</Text>
                                    <Text className="text-xs text-muted-foreground">8 Years Clinical Practice</Text>
                                </View>
                            </View>
                            <Text className="text-muted-foreground text-sm leading-relaxed mb-4">
                                "My goal is to help you heal your relationship with food without extreme diets."
                            </Text>
                            <TouchableOpacity
                                className="bg-black py-3 rounded-xl flex-row items-center justify-center gap-2"
                                onPress={openTikTok}
                            >
                                <Text className="text-white font-bold text-sm">Follow on TikTok</Text>
                                <ArrowRight size={14} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Logout */}
                <TouchableOpacity
                    onPress={signOut}
                    className="flex-row items-center justify-center bg-secondary py-4 rounded-xl mb-4"
                >
                    <Text className="text-foreground-muted font-bold">Sign Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
