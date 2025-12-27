import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Sun, Moon, Sparkles } from 'lucide-react-native';

import { MOCK_ROUTINES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import api from '../services/api';

export default function RoutinesScreen() {
    const { user: authUser } = useAuth();
    const [routines, setRoutines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [completedHabits, setCompletedHabits] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const res = await fetch(`${API_URL}/routines`);
                if (res.ok) {
                    const data = await res.json();
                    setRoutines(data);
                } else {
                    console.error('Failed to load routines');
                    setRoutines(MOCK_ROUTINES); // Fallback
                }
            } catch (err) {
                console.error('API Error', err);
                setRoutines(MOCK_ROUTINES); // Fallback
            } finally {
                setLoading(false);
            }
        };

        fetchRoutines();
    }, []);

    const toggleHabit = (habitId: string) => {
        // Optimistic UI Update
        setCompletedHabits(prev => {
            const next = new Set(prev);
            if (next.has(habitId)) {
                next.delete(habitId);
            } else {
                next.add(habitId);
            }
            return next;
        });

        // Fire-and-forget API call to persist this
        api.post('/log/habit', { habitId }).catch(err => console.error("Failed to sync habit", err));
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="mb-8">
                    <View className="flex-row items-center gap-2 mb-1">
                        <Sparkles size={12} color="#E8B4B8" />
                        <Text className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">Daily Rituals</Text>
                    </View>
                    <Text className="text-foreground text-3xl font-black">My Practice.</Text>
                </View>

                {routines.map((routine) => (
                    <View key={routine.id} className="mb-8">
                        <View className="flex-row items-center gap-3 mb-4">
                            <View className="p-2.5 rounded-2xl bg-secondary border border-border">
                                {routine.category === 'Morning' ? <Sun size={20} color="#F5C6AA" /> : <Moon size={20} color="#C9B8D9" />}
                            </View>
                            <Text className="text-xl font-bold text-foreground tracking-tight">{routine.name}</Text>
                        </View>

                        <View className="gap-3">
                            {routine.habits.map((habit: any) => {
                                const isDone = completedHabits.has(habit.id);
                                return (
                                    <TouchableOpacity
                                        key={habit.id}
                                        onPress={() => toggleHabit(habit.id)}
                                        className={`p-5 rounded-2xl border ${isDone ? 'bg-secondary border-primary' : 'bg-card border-border'} flex-row justify-between items-center`}
                                        activeOpacity={0.8}
                                    >
                                        <View>
                                            <Text className={`font-bold text-base ${isDone ? 'text-foreground line-through' : 'text-foreground'}`}>{habit.name}</Text>
                                            <Text className="text-muted-foreground text-xs mt-1">{habit.duration} mins</Text>
                                        </View>

                                        <View className={`w-8 h-8 rounded-full border-2 items-center justify-center ${isDone ? 'bg-primary border-primary' : 'border-border'}`}>
                                            {isDone && <Check size={16} color="white" strokeWidth={3} />}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                ))}

            </ScrollView>
        </SafeAreaView>
    );
}
