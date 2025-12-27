"use client";

// Mock data suite for testing the "Humane" re-design
// This simulates 7 days of user activity

export const MOCK_ACTIVITIES = [
    { day: "Mon", type: "Walking", duration: 45, intensity: "Moderate", calories: 210 },
    { day: "Tue", type: "Yoga", duration: 30, intensity: "Low", calories: 120 },
    { day: "Wed", type: "Strength", duration: 60, intensity: "High", calories: 450 },
    { day: "Thu", type: "Cycling", duration: 40, intensity: "Moderate", calories: 320 },
    { day: "Fri", type: "Walking", duration: 50, intensity: "Moderate", calories: 240 },
    { day: "Sat", type: "Yoga", duration: 60, intensity: "Low", calories: 240 },
    { day: "Sun", type: "Rest", duration: 0, intensity: "None", calories: 0 },
];

export const MOCK_WEIGHT_HISTORY = [
    { date: "2023-12-16", weight: 79.5 },
    { date: "2023-12-17", weight: 79.2 },
    { date: "2023-12-18", weight: 79.0 },
    { date: "2023-12-19", weight: 78.8 },
    { date: "2023-12-20", weight: 78.7 },
    { date: "2023-12-21", weight: 78.5 },
    { date: "2023-12-22", weight: 78.4 },
];

export const MOCK_HABITS = [
    { name: "Movement", streak: 5, completed: true },
    { name: "Hydration", streak: 12, completed: true },
    { name: "Early Bed", streak: 3, completed: false },
    { name: "Mindfulness", streak: 8, completed: true },
];

export const MOCK_BIO_STATS = {
    hydration: 85,
    energy: 72,
    focus: 94,
    stress: 15,
    bmi: 24.2,
    goalWeight: 72.0,
    currentWeight: 78.4
};

export function getMockStreak() {
    return {
        count: 5,
        days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        activeDayIndex: 4
    };
}
