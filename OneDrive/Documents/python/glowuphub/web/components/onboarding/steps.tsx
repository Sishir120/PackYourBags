import { motion } from 'framer-motion';
import { Ruler, Weight, User, Activity, Target } from 'lucide-react';

interface StepProps {
    data: any;
    update: (key: string, value: any) => void;
}

export function StepName({ data, update }: StepProps) {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-lavender">
                Welcome.
            </h1>
            <p className="text-foreground-muted text-lg">Let's get to know you. What should we call you?</p>
            <input
                type="text"
                value={data.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Your Name"
                className="w-full bg-transparent border-b-2 border-primary/50 text-3xl py-2 focus:outline-none focus:border-primary transition-all placeholder:text-white/20"
                autoFocus
            />
        </div>
    );
}

export function StepBiometrics({ data, update }: StepProps) {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-2">Basic Metrics</h2>
                <p className="text-foreground-muted">These help us calculate your baseline needs.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-primary">
                        <User size={16} /> Gender
                    </label>
                    <div className="flex bg-white/5 rounded-xl p-1">
                        {['F', 'M'].map(g => (
                            <button
                                key={g}
                                onClick={() => update('gender', g)}
                                className={`flex-1 py-3 rounded-lg text-lg font-bold transition-all ${data.gender === g ? 'bg-primary text-black' : 'text-foreground-muted hover:text-white'}`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-primary">Age</label>
                    <input
                        type="number"
                        value={data.age}
                        onChange={(e) => update('age', e.target.value)}
                        className="w-full bg-white/5 rounded-xl p-4 text-xl focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>
            </div>
        </div>
    );
}

export function StepIntention({ data, update }: any) {
    const intentions = [
        "More Energy",
        "Less Anxiety",
        "Better Sleep",
        "Self-Trust",
        "Skin Radiance"
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                How do you want to feel?
            </h2>
            <div className="grid grid-cols-2 gap-3">
                {intentions.map((intention) => (
                    <button
                        key={intention}
                        onClick={() => update('goal', intention)}
                        className={`p-4 rounded-2xl border text-left transition-all ${data.goal === intention
                                ? 'bg-primary text-black border-primary'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                    >
                        <span className="font-bold">{intention}</span>
                    </button>
                ))}
            </div>
            <p className="text-sm text-white/40 italic">We don't track numbers. We track feelings.</p>
        </div>
    );
}

export function StepActivity({ data, update }: StepProps) {
    const levels = [
        { id: 'SEDENTARY', label: 'Sedentary', desc: 'Little or no exercise' },
        { id: 'LIGHT', label: 'Lightly Active', desc: '1-3 days/week' },
        { id: 'MODERATE', label: 'Moderately Active', desc: '3-5 days/week' },
        { id: 'ACTIVE', label: 'Very Active', desc: '6-7 days/week' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Activity Level</h2>
                <p className="text-foreground-muted">Be honest. This determines your calorie burn.</p>
            </div>
            <div className="space-y-3">
                {levels.map(level => (
                    <button
                        key={level.id}
                        onClick={() => update('activityLevel', level.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${data.activityLevel === level.id ? 'bg-primary/20 border-primary text-white' : 'bg-white/5 border-white/5 text-foreground-muted hover:bg-white/10'}`}
                    >
                        <div className="font-bold text-lg">{level.label}</div>
                        <div className="text-sm opacity-70">{level.desc}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}

export function StepGoal({ data, update }: StepProps) {
    const goals = [
        { id: 'LOSS', label: 'Lose Fat', desc: 'Sustainable deficit' },
        { id: 'MAINTENANCE', label: 'Maintain', desc: 'Health & Balance' },
        { id: 'GAIN', label: 'Build Muscle', desc: 'Caloric surplus' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Primary Goal</h2>
                <p className="text-foreground-muted">What are we focusing on?</p>
            </div>
            <div className="space-y-3">
                {goals.map(g => (
                    <button
                        key={g.id}
                        onClick={() => update('goal', g.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${data.goal === g.id ? 'bg-coral/20 border-coral text-white' : 'bg-white/5 border-white/5 text-foreground-muted hover:bg-white/10'}`}
                    >
                        <div className="font-bold text-lg">{g.label}</div>
                        <div className="text-sm opacity-70">{g.desc}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
