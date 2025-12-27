"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Footprints,
    Flame,
    Clock,
    Zap,
    ChevronRight,
    Check,
    Plus,
    Activity,
    Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActivityProtocol, ProtocolStep } from "./activity-protocol";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";

const ACTIVITY_TYPES = [
    { id: 'walking', name: 'Walking', icon: Footprints, caloriesPerMin: 4 },
    { id: 'yoga', name: 'Yoga', icon: Activity, caloriesPerMin: 3 },
    { id: 'home-workout', name: 'Home Workout', icon: Zap, caloriesPerMin: 6 },
    { id: 'cycling', name: 'Cycling', icon: Activity, caloriesPerMin: 8 },
];

const PROTOCOLS: Record<string, ProtocolStep[]> = {
    'walking': [
        {
            title: "Gear & Prep",
            description: "Ensure your shoes are laced tight and you have a bottle of water. Check your posture.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/walking_protocol_main_1766485275665.png",
            tip: "Head up, shoulders relaxed, and swing your arms naturally."
        },
        {
            title: "Paced Walk",
            description: "Maintain a steady, brisk pace. You should be breathe slightly faster but still able to talk.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/walking_protocol_main_1766485275665.png",
            duration: 1800,
            tip: "Land on your heel and roll through to your toes."
        },
        {
            title: "Cool Down",
            description: "Slow your pace gradually. End with some light calf and hamstring stretches.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/cooldown_protocol_common_1766485407095.png",
            duration: 300
        }
    ],
    'yoga': [
        {
            title: "Centering",
            description: "Find a quiet space and roll out your mat. Sit comfortably and focus on your breath.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/yoga_protocol_main_1766485293224.png",
            duration: 180,
            tip: "Inhale deeply through your nose, exhale slowly through your mouth."
        },
        {
            title: "Sun Salutations",
            description: "Begin a gentle flow to warm up the body. Focus on matching movement to breath.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/yoga_protocol_main_1766485293224.png",
            duration: 600
        },
        {
            title: "Main Practice",
            description: "Move into the Tree pose and Warrior series. Hold each pose for 5 deep breaths.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/yoga_protocol_main_1766485293224.png",
            duration: 900
        },
        {
            title: "Savasana",
            description: "Lie flat on your back, eyes closed. Let your body absorb the practice.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/cooldown_protocol_common_1766485407095.png",
            duration: 300
        }
    ],
    'home-workout': [
        {
            title: "Warmup",
            description: "Get the blood flowing with jumping jacks, arm circles, and high knees.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/home_workout_main_1766485319868.png",
            duration: 300
        },
        {
            title: "Power Circuit",
            description: "3 Rounds: 15 Squats, 10 Pushups, 20 Lunges. Minimize rest between exercises.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/home_workout_main_1766485319868.png",
            duration: 1200,
            tip: "Keep your core tight and maintain a flat back."
        },
        {
            title: "Cool Down",
            description: "Finish with a full body stretch, focusing on the muscles you worked most.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/cooldown_protocol_common_1766485407095.png",
            duration: 300
        }
    ],
    'cycling': [
        {
            title: "Safety Check",
            description: "Check your tires, brakes, and helmet. Adjust your seat height for optimal power.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/cycling_protocol_main_1766485336715.png",
            tip: "Your knee should have a slight bend at the bottom of the pedal stroke."
        },
        {
            title: "Interval Ride",
            description: "Alternate between 2 minutes of high intensity and 1 minute of recovery.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/cycling_protocol_main_1766485336715.png",
            duration: 1800
        },
        {
            title: "Gradual Cool Down",
            description: "Pedal easily with light resistance to bring your heart rate down.",
            image: "file:///C:/Users/sishi/.gemini/antigravity/brain/b4b67391-cbf1-42bb-8f79-da59d966d677/cooldown_protocol_common_1766485407095.png",
            duration: 300
        }
    ]
};

export function LifestyleTracker() {
    const [selectedType, setSelectedType] = useState(ACTIVITY_TYPES[0]);
    const [duration, setDuration] = useState(30);
    const [intensity, setIntensity] = useState(2); // 1: Low, 2: Moderate, 3: High
    const [isSaving, setIsSaving] = useState(false);
    const [lastLogged, setLastLogged] = useState<any>(null);
    const [isProtocolOpen, setIsProtocolOpen] = useState(false);
    const { playSuccess } = useSound();

    const calculatedCalories = Math.round(duration * selectedType.caloriesPerMin * (intensity * 0.5 + 0.5));

    const handleLog = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setLastLogged({
            type: selectedType.name,
            duration,
            calories: calculatedCalories,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        setIsSaving(false);
        playSuccess();
    };

    const handleProtocolComplete = (finalDuration: number) => {
        setDuration(finalDuration);
        setIsProtocolOpen(false);
        handleLog();
    };

    return (
        <div className="space-y-6">
            <ActivityProtocol
                isOpen={isProtocolOpen}
                onClose={() => setIsProtocolOpen(false)}
                title={selectedType.name}
                activityId={selectedType.id}
                steps={PROTOCOLS[selectedType.id] || []}
                onComplete={handleProtocolComplete}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ACTIVITY_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isActive = selectedType.id === type.id;
                    return (
                        <button
                            key={type.id}
                            onClick={() => setSelectedType(type)}
                            className={cn(
                                "p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 group",
                                isActive
                                    ? "bg-primary/10 border-primary/20 text-primary shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                                    : "bg-white/3 border-white/5 text-foreground-muted hover:border-white/10 hover:bg-white/5"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                isActive ? "bg-primary text-black" : "bg-white/5 group-hover:bg-white/10"
                            )}>
                                <Icon size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{type.name}</span>
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => setIsProtocolOpen(true)}
                    className="glass-premium rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-center gap-4 group hover:bg-white/5 transition-all text-center min-h-[240px]"
                >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                        <Play size={32} fill="currentColor" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold tracking-tight">Start Live Session</h3>
                        <p className="text-[10px] text-foreground-muted uppercase tracking-widest font-black opacity-40">Immersive Step-by-Step Guide</p>
                    </div>
                </button>

                <div className="glass-premium rounded-[2.5rem] p-6 border border-white/5 space-y-8 flex flex-col justify-center">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] opacity-40">Duration (Minutes)</label>
                                <span className="text-2xl font-mono font-black text-primary">{duration}</span>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max="120"
                                step="5"
                                value={duration}
                                onChange={(e) => setDuration(parseInt(e.target.value))}
                                className="w-full accent-primary h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] opacity-40">Intensity Level</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { val: 1, label: 'Low' },
                                    { val: 2, label: 'Moderate' },
                                    { val: 3, label: 'High' }
                                ].map((level) => (
                                    <button
                                        key={level.val}
                                        onClick={() => setIntensity(level.val)}
                                        className={cn(
                                            "py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                                            intensity === level.val
                                                ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                                : "bg-white/3 border-white/5 text-foreground-muted hover:border-white/10"
                                        )}
                                    >
                                        {level.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                                <Flame size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest opacity-40">Calories Burned</p>
                                <p className="grow font-mono text-2xl font-black text-white">{calculatedCalories} <span className="text-xs text-foreground-muted font-sans font-bold uppercase tracking-normal">kCal</span></p>
                            </div>
                        </div>

                        <Button
                            onClick={handleLog}
                            disabled={isSaving}
                            className="h-14 px-8 rounded-2xl bg-white/5 text-white border border-white/10 hover:bg-white/10 active:scale-95 transition-all font-black uppercase tracking-[0.2em] text-[10px]"
                        >
                            {isSaving ? "Saving..." : "Quick Log"}
                        </Button>
                    </div>
                </div>
            </div>

            {lastLogged && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                            <Check size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white">Logged {lastLogged.type}</p>
                            <p className="text-[10px] text-foreground-muted">{lastLogged.duration} mins • {lastLogged.calories} kCal • {lastLogged.timestamp}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest opacity-40">Undo</Button>
                </motion.div>
            )}
        </div>
    );
}
