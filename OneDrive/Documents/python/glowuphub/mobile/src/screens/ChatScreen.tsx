import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Mic, Camera, MoreVertical, Phone } from 'lucide-react-native';

const MOCK_MESSAGES = [
    { id: 1, text: "Hey! How is your hydration going today?", sender: 'coach', time: '10:00 AM' },
    { id: 2, text: "I'm hitting 2L so far, feeling good!", sender: 'user', time: '10:05 AM' },
    { id: 3, text: "Great job! Try to get another glass in before lunch.", sender: 'coach', time: '10:06 AM' },
];

export default function ChatScreen() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(MOCK_MESSAGES);

    const sendMessage = () => {
        if (!message.trim()) return;
        setMessages([...messages, {
            id: Date.now(),
            text: message,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setMessage('');
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            {/* Chat Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-border bg-card">
                <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center">
                        <Text className="text-primary font-bold">JD</Text>
                    </View>
                    <View>
                        <Text className="font-bold text-foreground">Jane Doe (Coach)</Text>
                        <Text className="text-xs text-green-500 font-medium">Online</Text>
                    </View>
                </View>
                <View className="flex-row gap-4">
                    <Phone size={20} color="#3D3D3D" />
                    <MoreVertical size={20} color="#3D3D3D" />
                </View>
            </View>

            {/* Messages */}
            <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ paddingBottom: 20 }}>
                {messages.map((msg) => (
                    <View
                        key={msg.id}
                        className={`mb-4 max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user'
                                ? 'bg-primary self-end rounded-br-none'
                                : 'bg-secondary self-start rounded-bl-none'
                            } `}
                    >
                        <Text className={`text-base ${msg.sender === 'user' ? 'text-primary-foreground' : 'text-foreground'} `}>
                            {msg.text}
                        </Text>
                        <Text className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'} `}>
                            {msg.time}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            {/* Input Area */}
            <View className="p-4 bg-card border-t border-border flex-row items-center gap-3">
                <TouchableOpacity>
                    <Camera size={24} color="#9A9A9A" />
                </TouchableOpacity>
                <View className="flex-1 bg-secondary rounded-full px-4 py-2 flex-row items-center justify-between">
                    <TextInput
                        placeholder="Message..."
                        placeholderTextColor="#9A9A9A"
                        className="flex-1 text-foreground h-10"
                        value={message}
                        onChangeText={setMessage}
                        onSubmitEditing={sendMessage}
                    />
                </View>
                <TouchableOpacity
                    onPress={message ? sendMessage : undefined}
                    className={`w-12 h-12 rounded-full items-center justify-center ${message ? 'bg-primary' : 'bg-secondary'} `}
                >
                    {message ? <Send size={20} color="#3D3D3D" /> : <Mic size={20} color="#9A9A9A" />}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
