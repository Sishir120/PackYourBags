/**
 * Scientific Calculations Module
 * Implements Mifflin-St Jeor Equation and Activity Multipliers
 */

export type ActivityLevel = 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'ACTIVE' | 'ATHLETE';
export type Gender = 'M' | 'F';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
    SEDENTARY: 1.2,      // Little or no exercise
    LIGHT: 1.375,        // Light exercise/sports 1-3 days/week
    MODERATE: 1.55,      // Moderate exercise/sports 3-5 days/week
    ACTIVE: 1.725,       // Hard exercise/sports 6-7 days/week
    ATHLETE: 1.9         // Very hard exercise/physical job
};

export function calculateBMI(weightKg: number, heightCm: number): number {
    if (!weightKg || !heightCm) return 0;
    const heightM = heightCm / 100;
    return Number((weightKg / (heightM * heightM)).toFixed(1));
}

export function calculateBMR(weightKg: number, heightCm: number, age: number, gender: Gender): number {
    // Mifflin-St Jeor Equation
    // Men: (10 × weight) + (6.25 × height) - (5 × age) + 5
    // Women: (10 × weight) + (6.25 × height) - (5 × age) - 161

    if (!weightKg || !heightCm || !age) return 0;

    const base = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    return gender === 'M' ? Math.round(base + 5) : Math.round(base - 161);
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
    if (!bmr) return 0;
    return Math.round(bmr * (ACTIVITY_MULTIPLIERS[activityLevel] || 1.2));
}

export type Goal = 'LOSS' | 'MAINTENANCE' | 'RECOMPOSITION' | 'GAIN';

export function getCalorieTarget(tdee: number, goal: Goal): number {
    if (!tdee) return 0;

    switch (goal) {
        case 'LOSS':
            return Math.round(tdee - 500); // Sustainable deficit
        case 'RECOMPOSITION':
            return Math.round(tdee - 200); // Slight deficit + focus on protein
        case 'GAIN':
            return Math.round(tdee + 300); // Controlled surplus
        default:
            return tdee;
    }
}

export interface CalorieRange {
    min: number;
    max: number;
    target: number;
}

/**
 * Provides a +/- 100kcal range to lower psychological pressure
 */
export function getCalorieRange(tdee: number, goal: Goal): CalorieRange {
    const target = getCalorieTarget(tdee, goal);
    return {
        target,
        min: target - 100,
        max: target + 100
    };
}

export interface MacroSplit {
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
}

export function calculateMacros(calories: number, weightKg: number, goal: Goal): MacroSplit {
    // Protein Targets (Scientific Standards):
    // Loss/Recomp: 2.2g/kg (Muscle preservation)
    // Gain/Maintenance: 1.8-2.0g/kg
    let proteinGrams = (goal === 'LOSS' || goal === 'RECOMPOSITION') ? weightKg * 2.2 : weightKg * 2.0;

    // Fat Targets: 25-30% of calories (Hormonal health)
    let fatGrams = (calories * 0.28) / 9;

    let proteinCalories = proteinGrams * 4;
    let fatCalories = fatGrams * 9;

    // Carb Safety Check (Brain health & performance)
    const minCarbPercent = 0.20;
    const minCarbCalories = calories * minCarbPercent;

    if (calories - (proteinCalories + fatCalories) < minCarbCalories) {
        const remainingForPrFat = calories - minCarbCalories;
        const ratio = remainingForPrFat / (proteinCalories + fatCalories);
        proteinGrams *= ratio;
        fatGrams *= ratio;
        proteinCalories = proteinGrams * 4;
        fatCalories = fatGrams * 9;
    }

    const carbCalories = Math.max(minCarbCalories, calories - (proteinCalories + fatCalories));
    const carbGrams = carbCalories / 4;

    // Fiber: 14g per 1000kcal
    const fiberGrams = (calories / 1000) * 14;

    return {
        protein: Math.round(proteinGrams),
        fat: Math.round(fatGrams),
        carbs: Math.round(carbGrams),
        fiber: Math.round(fiberGrams)
    };
}

export function calculateHydration(weightKg: number, activityLevel: ActivityLevel): number {
    if (!weightKg) return 0;
    let base = weightKg * 35;
    const activityBoost: Record<ActivityLevel, number> = {
        SEDENTARY: 0,
        LIGHT: 500,
        MODERATE: 1000,
        ACTIVE: 1500,
        ATHLETE: 2500
    };
    return Math.round(base + (activityBoost[activityLevel] || 0));
}

/**
 * Consistency Framework Logic
 * Replaces "Cheat Days" with structured non-linear days.
 */
export function getFlexTarget(tdee: number): number {
    // A flex day allows for maintenance level calories if in a deficit
    return tdee;
}
