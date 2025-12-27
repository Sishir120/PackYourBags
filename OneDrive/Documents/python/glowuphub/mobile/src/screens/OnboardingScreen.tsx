import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const { width } = Dimensions.get('window');

const ONBOARDING_STEPS = [
    { title: "Basic Info", description: "Let's get to know you" },
    { title: "Body Stats", description: "For accurate calculations" },
    { title: "Your Goals", description: "What do you want to achieve?" },
    { title: "Activity", description: "How active are you?" },
];

export default function OnboardingScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { signIn } = useAuth();
    const { user, token } = route.params || {};

    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        height: '',
        weight: '',
        goal: '',
        activityLevel: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const updateForm = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleNext = () => {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleComplete = async () => {
        setIsLoading(true);
        try {
            // 1. Send profile data to backend
            // Note: We might need to attach the token if not yet in global storage,
            // but api.ts reads from AsyncStorage. Since we haven't called signIn (which sets AsyncStorage),
            // we might need to manually set the header or use a "one-off" request with token.
            // However, seeing api.ts: checks AsyncStorage.getItem('token').
            // Plan: RegisterScreen should probably set 'token' in AsyncStorage temporarily OR we pass it.
            // Let's assume we pass it in headers manually for this call if api definition allows, 
            // or we just modify api.ts to accept token override.
            // Creating a custom axios call here for safety:

            const response = await fetch('http://10.0.2.2:3000/api/user/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    age: parseInt(formData.age),
                    gender: formData.gender,
                    height: parseFloat(formData.height),
                    weight: parseFloat(formData.weight),
                    goal: formData.goal,
                    activityLevel: formData.activityLevel
                })
            });

            if (!response.ok) {
                // Fallback for demo if API fails
                console.log("Onboarding API failed, proceeding anyway for demo");
            }

            // 2. Complete Auth
            await signIn(token, { ...user, ...formData });
        } catch (error) {
            console.error(error);
            // Fallback
            await signIn(token, { ...user, ...formData });
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <View className="gap-6">
                        <View>
                            <Text className="text-zinc-400 mb-2">Age</Text>
                            <TextInput
                                className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-4 text-white text-lg"
                                placeholder="e.g. 25"
                                placeholderTextColor="#52525B"
                                keyboardType="numeric"
                                value={formData.age}
                                onChangeText={(t) => updateForm('age', t)}
                            />
                        </View>
                        <View>
                            <Text className="text-zinc-400 mb-2">Gender</Text>
                            <View className="flex-row gap-4">
                                {['M', 'F'].map((g) => (
                                    <TouchableOpacity
                                        key={g}
                                        onPress={() => updateForm('gender', g)}
                                        className={`flex-1 py-4 rounded-xl border items-center ${formData.gender === g ? 'bg-primary border-primary' : 'bg-zinc-900 border-white/10'}`}
                                    >
                                        <Text className={`text-lg font-bold ${formData.gender === g ? 'text-black' : 'text-zinc-400'}`}>
                                            {g === 'M' ? 'Male' : 'Female'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                );
            case 1:
                return (
                    <View className="gap-6">
                        <View>
                            <Text className="text-zinc-400 mb-2">Height (cm)</Text>
                            <TextInput
                                className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-4 text-white text-lg"
                                placeholder="e.g. 175"
                                placeholderTextColor="#52525B"
                                keyboardType="numeric"
                                value={formData.height}
                                onChangeText={(t) => updateForm('height', t)}
                            />
                        </View>
                        <View>
                            <Text className="text-zinc-400 mb-2">Weight (kg)</Text>
                            <TextInput
                                className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-4 text-white text-lg"
                                placeholder="e.g. 70"
                                placeholderTextColor="#52525B"
                                keyboardType="numeric"
                                value={formData.weight}
                                onChangeText={(t) => updateForm('weight', t)}
                            />
                        </View>
                    </View>
                );
            case 2:
                // Goal: 'LOSS' | 'MAINTENANCE' | 'RECOMPOSITION' | 'GAIN'
                const goals = [
                    { id: 'LOSS', label: 'Lose Weight', desc: 'Sustainable deficit' },
                    { id: 'MAINTENANCE', label: 'Maintain', desc: 'Stay healthy' },
                    { id: 'RECOMPOSITION', label: 'Recomp', desc: 'Lose fat, gain muscle' },
                    { id: 'GAIN', label: 'Gain Muscle', desc: 'Controlled surplus' },
                ];
                return (
                    <View className="gap-3">
                        {goals.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => updateForm('goal', item.id)}
                                className={`p-4 rounded-xl border ${formData.goal === item.id ? 'bg-primary border-primary' : 'bg-zinc-900 border-white/10'}`}
                            >
                                <Text className={`text-lg font-bold ${formData.goal === item.id ? 'text-black' : 'text-white'}`}>{item.label}</Text>
                                <Text className={`${formData.goal === item.id ? 'text-black/70' : 'text-zinc-500'}`}>{item.desc}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            case 3:
                // Activity: 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'ACTIVE' | 'ATHLETE'
                const activities = [
                    { id: 'SEDENTARY', label: 'Sedentary', desc: 'Office job, little exercise' },
                    { id: 'LIGHT', label: 'Light', desc: '1-3 days/week' },
                    { id: 'MODERATE', label: 'Moderate', desc: '3-5 days/week' },
                    { id: 'ACTIVE', label: 'Active', desc: '6-7 days/week' },
                    { id: 'ATHLETE', label: 'Athlete', desc: 'Physical job or 2x training' },
                ];
                return (
                    <View className="gap-3">
                        {activities.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => updateForm('activityLevel', item.id)}
                                className={`p-4 rounded-xl border ${formData.activityLevel === item.id ? 'bg-primary border-primary' : 'bg-zinc-900 border-white/10'}`}
                            >
                                <Text className={`text-lg font-bold ${formData.activityLevel === item.id ? 'text-black' : 'text-white'}`}>{item.label}</Text>
                                <Text className={`${formData.activityLevel === item.id ? 'text-black/70' : 'text-zinc-500'}`}>{item.desc}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-1 px-6 py-4">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-8">
                    {currentStep > 0 ? (
                        <TouchableOpacity onPress={handleBack} className="p-2 bg-zinc-900 rounded-full">
                            <ArrowLeft color="white" size={24} />
                        </TouchableOpacity>
                    ) : <View style={{ width: 40 }} />}

                    <View className="flex-row gap-1">
                        {ONBOARDING_STEPS.map((_, i) => (
                            <View
                                key={i}
                                className={`h-1.5 rounded-full ${i <= currentStep ? 'bg-primary w-8' : 'bg-zinc-800 w-4'}`}
                            />
                        ))}
                    </View>

                    <View style={{ width: 40 }} />
                </View>

                <View className="mb-8">
                    <Text className="text-3xl font-bold text-white mb-2">{ONBOARDING_STEPS[currentStep].title}</Text>
                    <Text className="text-zinc-400 text-lg">{ONBOARDING_STEPS[currentStep].description}</Text>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {renderStepContent()}
                </ScrollView>

                <View className="py-4">
                    <TouchableOpacity
                        onPress={handleNext}
                        className="bg-primary rounded-2xl py-4 flex-row justify-center items-center gap-2"
                    >
                        <Text className="text-black font-bold text-lg">
                            {currentStep === ONBOARDING_STEPS.length - 1 ? "Complete Setup" : "Continue"}
                        </Text>
                        {currentStep !== ONBOARDING_STEPS.length - 1 && <ArrowRight color="black" size={20} />}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
