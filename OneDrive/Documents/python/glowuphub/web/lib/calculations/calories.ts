/**
 * Metabolic Equivalent of Task (MET) values for scientific calorie estimation.
 * Formula: Calories = MET * weight (kg) * duration (hours)
 */
export const MET_VALUES: Record<string, number> = {
    // Movement & Cardio
    'walking': 3.5, // Brisk walk
    'running': 9.8, // 9.7 km/h pace
    'cycling': 7.5, // Moderate effort
    'swimming': 7.0,

    // Gym & Strength
    'weight-lifting': 5.0, // Vigorous
    'hiit': 8.0,
    'bodyweight': 4.5, // Calisthenics

    // Mind & Body
    'yoga': 3.0,
    'stretching': 2.3,
    'meditation': 1.0, // Resting metabolic rate
    'breathwork': 1.3,

    // Daily Habits
    'sunlight-exposure': 1.3, // Standing/sitting
    'hydration': 1.1,
    'digital-detox': 1.1,
};

/**
 * Calculates calorie burn based on MET, weight and duration.
 * @param activityId - The ID of the activity
 * @param weightKg - User's weight in kilograms
 * @param durationSeconds - Duration of the activity in seconds
 * @returns Estimated calories burned
 */
export function calculateCaloriesBurned(
    activityId: string,
    weightKg: number,
    durationSeconds: number
): number {
    const met = MET_VALUES[activityId.toLowerCase()] || 3.0; // Default to 3.0 (light activity)
    const durationHours = durationSeconds / 3600;

    // Calories = MET * weight (kg) * duration (hours)
    const calories = met * weightKg * durationHours;

    return Math.round(calories * 10) / 10;
}

/**
 * Live calorie burn rate (per second)
 */
export function getCalorieBurnRate(activityId: string, weightKg: number): number {
    if (!activityId) {
        return (3.0 * weightKg) / 3600; // Default MET value
    }
    const met = MET_VALUES[activityId.toLowerCase()] || 3.0;
    return (met * weightKg) / 3600;
}
