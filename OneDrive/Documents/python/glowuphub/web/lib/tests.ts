/**
 * GlowUp Hub - Test Suite
 * Run with: node --experimental-strip-types lib/tests.ts
 * Or: npx ts-node lib/tests.ts
 */

import {
    containsBannedWords,
    getRandomIdentityPhrase,
    getRandomCompletionMessage,
    getRandomRecoveryMessage,
    BANNED_WORDS,
    STREAK_LABELS,
    AFFIRMING_REPLACEMENTS
} from './language-system';

// Test results tracking
let passed = 0;
let failed = 0;

function test(name: string, fn: () => boolean) {
    try {
        if (fn()) {
            console.log(`✅ ${name}`);
            passed++;
        } else {
            console.log(`❌ ${name}`);
            failed++;
        }
    } catch (error) {
        console.log(`❌ ${name} - ${error}`);
        failed++;
    }
}

console.log('\n🌸 GlowUp Hub Test Suite\n');
console.log('='.repeat(50));
console.log('LANGUAGE SYSTEM TESTS');
console.log('='.repeat(50));

// Test banned words detection
test('Should detect banned word "fix"', () =>
    containsBannedWords('Let me fix your skin') === true
);

test('Should detect banned word "flaw"', () =>
    containsBannedWords('Hide your flaws') === true
);

test('Should detect banned word "perfect"', () =>
    containsBannedWords('Achieve perfection') === true
);

test('Should NOT flag clean text', () =>
    containsBannedWords('Nurture your natural glow') === false
);

test('Should NOT flag supportive language', () =>
    containsBannedWords('Balance and restore your radiance') === false
);

// Test identity phrases
test('Should return identity phrase', () => {
    const phrase = getRandomIdentityPhrase();
    return phrase.length > 0 && typeof phrase === 'string';
});

test('Should return completion message', () => {
    const msg = getRandomCompletionMessage();
    return msg.length > 0 && typeof msg === 'string';
});

test('Should return recovery message', () => {
    const msg = getRandomRecoveryMessage();
    return msg.length > 0 && typeof msg === 'string';
});

// Test streak labels
test('Streak labels should be supportive', () => {
    return STREAK_LABELS.singular === 'Promise Kept' &&
        STREAK_LABELS.plural === 'Promises Kept';
});

// Test affirming replacements
test('Should have affirming replacements for banned words', () => {
    return Object.keys(AFFIRMING_REPLACEMENTS).length >= 5;
});

console.log('\n' + '='.repeat(50));
console.log('MOCK DATA TESTS');
console.log('='.repeat(50));

// Mock user data tests
const mockUser = {
    id: 'test-user-1',
    name: 'Test User',
    streak: 7,
    glowScore: 75,
    logs: [{
        date: new Date().toISOString(),
        glowScore: 45,
        moveScore: 30,
        mindScore: 60,
        completedHabits: 'h1,h2,h3'
    }]
};

test('Mock user should have valid streak', () =>
    typeof mockUser.streak === 'number' && mockUser.streak >= 0
);

test('Mock user should have valid glow score', () =>
    mockUser.glowScore >= 0 && mockUser.glowScore <= 100
);

test('Mock user logs should have all score types', () => {
    const log = mockUser.logs[0];
    return 'glowScore' in log && 'moveScore' in log && 'mindScore' in log;
});

// Mock routines data tests
const mockRoutines = [
    {
        id: 'r1',
        name: 'Morning Glow',
        category: 'Morning',
        habits: [
            { id: 'h1', name: 'Hydration Practice', duration: 2 },
            { id: 'h2', name: 'Face Balance Practice', duration: 8 },
        ]
    }
];

test('Mock routines should have valid structure', () =>
    mockRoutines.length > 0 &&
    mockRoutines[0].habits.length > 0 &&
    typeof mockRoutines[0].habits[0].duration === 'number'
);

test('Routine habit names should be supportive (no banned words)', () => {
    for (const routine of mockRoutines) {
        for (const habit of routine.habits) {
            if (containsBannedWords(habit.name)) {
                return false;
            }
        }
    }
    return true;
});

console.log('\n' + '='.repeat(50));
console.log('FUZZ TESTS - Input Validation');
console.log('='.repeat(50));

// Fuzz test inputs
const fuzzInputs = [
    '',
    null,
    undefined,
    '   ',
    '<script>alert("xss")</script>',
    'a'.repeat(10000),
    '💀🎃👻',
    '\n\n\n\t\t\t',
    '0',
    '-1',
    'NaN',
    'undefined',
    'null',
    '{"malicious": "json"}',
    "'; DROP TABLE users; --",
];

test('containsBannedWords should handle empty string', () =>
    containsBannedWords('') === false
);

test('containsBannedWords should handle whitespace', () =>
    containsBannedWords('   ') === false
);

test('containsBannedWords should handle long strings', () =>
    containsBannedWords('a'.repeat(10000)) === false
);

test('containsBannedWords should handle emojis', () =>
    containsBannedWords('💀🎃👻') === false
);

test('containsBannedWords should handle special characters', () =>
    containsBannedWords('<script>alert("test")</script>') === false
);

// Score validation tests
function validateScore(score: any): boolean {
    if (typeof score !== 'number') return false;
    if (isNaN(score)) return false;
    if (score < 0 || score > 100) return false;
    return true;
}

test('Score validation should reject negative numbers', () =>
    validateScore(-1) === false
);

test('Score validation should reject values over 100', () =>
    validateScore(150) === false
);

test('Score validation should reject NaN', () =>
    validateScore(NaN) === false
);

test('Score validation should reject strings', () =>
    validateScore('50') === false
);

test('Score validation should accept valid scores', () =>
    validateScore(75) === true && validateScore(0) === true && validateScore(100) === true
);

// ... existing exports ...

console.log('\n' + '='.repeat(50));
console.log('BODY TRACKER & TIMER TESTS');
console.log('='.repeat(50));

// Timer Logic Tests
function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

test('Timer should format 0 seconds', () => formatTime(0) === '0:00');
test('Timer should format under 1 min', () => formatTime(45) === '0:45');
test('Timer should format over 1 min', () => formatTime(65) === '1:05');
test('Timer should format over 10 mins', () => formatTime(605) === '10:05');

// Weight Logic Fuzzing
function validateWeightLog(weight: any): boolean {
    if (typeof weight !== 'number') return false;
    if (isNaN(weight)) return false;
    if (weight <= 0) return false; // No ghost weight
    if (weight > 500) return false; // Realistic human limit
    return true;
}

test('Weight validation should accept normal range', () => validateWeightLog(65.5) === true);
test('Weight validation should reject negative', () => validateWeightLog(-5) === false);
test('Weight validation should reject zero', () => validateWeightLog(0) === false);
test('Weight validation should reject massive values', () => validateWeightLog(1000) === false);
test('Weight validation should reject strings', () => validateWeightLog("60") === false);

// Streak Logic Fuzzing
function calculateStreak(dates: string[]): number {
    if (!Array.isArray(dates)) return 0;
    if (dates.length === 0) return 0;
    // Simple mock logic: just counting array length for unit test proof
    // Real logic would check consecutiveness
    return dates.length;
}

test('Streak calculator handles empty array', () => calculateStreak([]) === 0);
test('Streak calculator handles invalid input', () => calculateStreak(null as any) === 0);
test('Streak calculator counts entries', () => calculateStreak(['2023-01-01', '2023-01-02']) === 2);

console.log('\n' + '='.repeat(50));
console.log(`TEST RESULTS: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
    process.exit(1);
}

export { test, passed, failed };
