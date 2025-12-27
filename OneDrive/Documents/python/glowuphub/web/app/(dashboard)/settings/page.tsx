"use client";

import { useState, useEffect } from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { Toast, ToastType } from "@/components/ui/toast";
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Lock,
    Palette,
    Globe,
    LogOut,
    Save,
    Moon,
    Sun,
    Loader2,
    AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    bio?: string;
}

interface NotificationPrefs {
    email: boolean;
    push: boolean;
    habits: boolean;
    achievements: boolean;
}

export default function SettingsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    // Profile state
    const [profile, setProfile] = useState<UserProfile>({ id: "", name: "", email: "", bio: "" });
    const [originalProfile, setOriginalProfile] = useState<UserProfile>({ id: "", name: "", email: "", bio: "" });

    //Dark mode
    const [darkMode, setDarkMode] = useState(true);

    // Notifications
    const [notifications, setNotifications] = useState<NotificationPrefs>({
        email: true,
        push: true,
        habits: true,
        achievements: true
    });

    // Preferences
    const [language, setLanguage] = useState("English");
    const [timezone, setTimezone] = useState("UTC-5 (Eastern Time)");

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "privacy", label: "Privacy & Security", icon: Lock },
        { id: "appearance", label: "Appearance", icon: Palette },
        { id: "preferences", label: "Preferences", icon: Globe },
    ];

    // Fetch user data on mount
    useEffect(() => {
        fetchUserData();

        // Load dark mode from localStorage
        const savedDarkMode = localStorage.getItem("darkMode");
        if (savedDarkMode !== null) {
            setDarkMode(savedDarkMode === "true");
        }

        // Load other preferences
        const savedNotifications = localStorage.getItem("notifications");
        if (savedNotifications) {
            setNotifications(JSON.parse(savedNotifications));
        }

        const savedLanguage = localStorage.getItem("language");
        if (savedLanguage) setLanguage(savedLanguage);

        const savedTimezone = localStorage.getItem("timezone");
        if (savedTimezone) setTimezone(savedTimezone);
    }, []);

    async function fetchUserData() {
        try {
            setLoading(true);
            const response = await fetch("/api/user");
            if (!response.ok) throw new Error("Failed to fetch user");

            const userData = await response.json();
            const profileData = {
                id: userData.id,
                name: userData.name || "",
                email: userData.email || "",
                bio: userData.bio || ""
            };

            setProfile(profileData);
            setOriginalProfile(profileData);
        } catch (error) {
            showToast("Failed to load user data", "error");
        } finally {
            setLoading(false);
        }
    }

    async function saveProfile() {
        try {
            setSaving(true);
            const response = await fetch("/api/user", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: profile.name,
                    email: profile.email,
                    bio: profile.bio
                })
            });

            if (!response.ok) throw new Error("Failed to save profile");

            setOriginalProfile(profile);
            showToast("Profile updated successfully!", "success");
        } catch (error) {
            showToast("Failed to save profile changes", "error");
        } finally {
            setSaving(false);
        }
    }

    function saveNotifications() {
        localStorage.setItem("notifications", JSON.stringify(notifications));
        showToast("Notification preferences saved!", "success");
    }

    function toggleDarkMode() {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("darkMode", newMode.toString());
        showToast(`${newMode ? "Dark" : "Light"} mode enabled`, "success");

        // Apply to document (you may want to use a theme provider in production)
        if (newMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }

    function savePreferences() {
        localStorage.setItem("language", language);
        localStorage.setItem("timezone", timezone);
        showToast("Preferences saved!", "success");
    }

    async function handleSignOut() {
        try {
            // Clear any local storage
            localStorage.clear();
            sessionStorage.clear();

            // TODO: Call sign-out API endpoint when auth is fully implemented
            // await signOut({ callbackUrl: "/" });

            showToast("Signing out...", "info");
            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch (error) {
            showToast("Failed to sign out", "error");
        }
    }

    function showToast(message: string, type: ToastType) {
        setToast({ message, type });
    }

    const hasProfileChanges =
        profile.name !== originalProfile.name ||
        profile.email !== originalProfile.email ||
        profile.bio !== originalProfile.bio;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Header */}
            <FadeIn direction="down">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <SettingsIcon className="text-primary" size={24} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
                            <p className="text-foreground-muted">Manage your account and preferences</p>
                        </div>
                    </div>
                </div>
            </FadeIn>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-3">
                    <FadeIn direction="right">
                        <div className="glass-premium rounded-2xl p-4 border border-white/5 space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                        activeTab === tab.id
                                            ? "bg-primary/10 text-primary border border-primary/20"
                                            : "text-foreground-muted hover:text-foreground hover:bg-white/5"
                                    )}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </FadeIn>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9">
                    <FadeIn delay={0.1}>
                        <div className="glass-premium rounded-2xl p-8 border border-white/5 space-y-8">
                            {activeTab === "profile" && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold">Profile Settings</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-bold text-foreground-muted uppercase tracking-widest mb-2 block">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all text-foreground"
                                                placeholder="Enter your name"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-bold text-foreground-muted uppercase tracking-widest mb-2 block">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all text-foreground"
                                                placeholder="your@email.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-bold text-foreground-muted uppercase tracking-widest mb-2 block">
                                                Bio
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={profile.bio}
                                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all resize-none text-foreground"
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        onClick={saveProfile}
                                        disabled={!hasProfileChanges || saving}
                                        className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 size={16} className="mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} className="mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>

                                    {hasProfileChanges && (
                                        <p className="text-sm text-orange-400 flex items-center gap-2">
                                            <AlertTriangle size={14} />
                                            You have unsaved changes
                                        </p>
                                    )}
                                </div>
                            )}

                            {activeTab === "notifications" && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold">Notification Preferences</h2>

                                    <div className="space-y-4">
                                        {Object.entries(notifications).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                                <div>
                                                    <h4 className="font-bold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                                                    <p className="text-sm text-foreground-muted">Receive {key} notifications</p>
                                                </div>
                                                <button
                                                    onClick={() => setNotifications({ ...notifications, [key]: !value })}
                                                    className={cn(
                                                        "w-12 h-6 rounded-full transition-all relative",
                                                        value ? "bg-primary" : "bg-white/10"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                                                        value ? "right-1" : "left-1"
                                                    )} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        onClick={saveNotifications}
                                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                                    >
                                        <Save size={16} className="mr-2" />
                                        Save Preferences
                                    </Button>
                                </div>
                            )}

                            {activeTab === "privacy" && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold">Privacy & Security</h2>

                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <h4 className="font-bold mb-2">Change Password</h4>
                                            <p className="text-sm text-foreground-muted mb-4">Update your password regularly to keep your account secure</p>
                                            <Button variant="outline" onClick={() => showToast("Password change coming soon!", "info")}>
                                                Update Password
                                            </Button>
                                        </div>

                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <h4 className="font-bold mb-2">Two-Factor Authentication</h4>
                                            <p className="text-sm text-foreground-muted mb-4">Add an extra layer of security to your account</p>
                                            <Button variant="outline" onClick={() => showToast("2FA setup coming soon!", "info")}>
                                                Enable 2FA
                                            </Button>
                                        </div>

                                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                            <h4 className="font-bold mb-2 text-red-500">Delete Account</h4>
                                            <p className="text-sm text-foreground-muted mb-4">Permanently delete your account and all data</p>
                                            <Button
                                                variant="outline"
                                                className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                                                onClick={() => {
                                                    if (confirm("Are you sure? This action cannot be undone.")) {
                                                        showToast("Account deletion coming soon", "info");
                                                    }
                                                }}
                                            >
                                                Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "appearance" && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold">Appearance</h2>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div>
                                                <h4 className="font-bold">Dark Mode</h4>
                                                <p className="text-sm text-foreground-muted">Use dark theme across the app</p>
                                            </div>
                                            <button
                                                onClick={toggleDarkMode}
                                                className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                                            >
                                                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "preferences" && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold">Preferences</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-bold text-foreground-muted uppercase tracking-widest mb-2 block">
                                                Language
                                            </label>
                                            <select
                                                value={language}
                                                onChange={(e) => setLanguage(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all text-foreground"
                                            >
                                                <option className="bg-zinc-900 text-white">English</option>
                                                <option className="bg-zinc-900 text-white">Spanish</option>
                                                <option className="bg-zinc-900 text-white">French</option>
                                                <option className="bg-zinc-900 text-white">German</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-sm font-bold text-foreground-muted uppercase tracking-widest mb-2 block">
                                                Timezone
                                            </label>
                                            <select
                                                value={timezone}
                                                onChange={(e) => setTimezone(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all text-foreground"
                                            >
                                                <option>UTC-5 (Eastern Time)</option>
                                                <option>UTC-8 (Pacific Time)</option>
                                                <option>UTC+0 (GMT)</option>
                                                <option>UTC+1 (CET)</option>
                                                <option>UTC+5:45 (Nepal)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={savePreferences}
                                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                                    >
                                        <Save size={16} className="mr-2" />
                                        Save Preferences
                                    </Button>
                                </div>
                            )}
                        </div>
                    </FadeIn>

                    {/* Sign Out */}
                    <FadeIn delay={0.2}>
                        <div className="mt-6">
                            <Button
                                variant="outline"
                                className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10"
                                onClick={handleSignOut}
                            >
                                <LogOut size={16} className="mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* Toast Notifications */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
