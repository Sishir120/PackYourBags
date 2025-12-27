/**
 * GlowUp Mobile - Logic Test Suite
 * Run with: npx tsx src/tests-mobile.ts
 */

import { MOCK_USER, MOCK_ROUTINES, IDENTITY_PHRASES, RECOVERY_MESSAGES } from './data/mockData';

// Test results tracking
let passed = 0;
let failed = 0;

function test(name: string, fn: () => boolean | any) {
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

console.log('\n🌸 GlowUp Mobile Logic Tests\n');

// 1. Verify User Data Structure
console.log('--- User Data Verification ---');
test('Mock user has required fields', () => {
    return MOCK_USER.id && MOCK_USER.name && MOCK_USER.streak >= 0;
});

test('Mock user has valid log entry', () => {
    const log = MOCK_USER.logs[0];
    return log.glowScore >= 0 && log.moveScore >= 0 && log.mindScore >= 0;
});

// 2. Verify Routines Data
console.log('\n--- Routines & Habits Verification ---');
test('Morning routine exists', () => {
    return MOCK_ROUTINES.some(r => r.category === 'Morning');
});

test('Evening routine exists', () => {
    return MOCK_ROUTINES.some(r => r.category === 'Evening');
});

test('Habits have valid durations', () => {
    return MOCK_ROUTINES.every(r => r.habits.every(h => h.duration > 0));
});

// 3. Verify Anti-Insecurity Language
console.log('\n--- Language System Verification ---');
const BANNED_WORDS = ['fix', 'flaw', 'perfect', 'defect', 'problem', 'wrong'];

function containsBanned(text: string): boolean {
    const lower = text.toLowerCase();
    return BANNED_WORDS.some(word => lower.includes(word));
}

test('Identity phrases should be clean', () => {
    return IDENTITY_PHRASES.every(phrase => !containsBanned(phrase));
});

test('Recovery messages should be clean', () => {
    return RECOVERY_MESSAGES.every(msg => !containsBanned(msg));
});

test('Habit names should be clean', () => {
    let allClean = true;
    MOCK_ROUTINES.forEach(r => {
        r.habits.forEach(h => {
            if (containsBanned(h.name)) {
                console.log(`   Found banned word in: "${h.name}"`);
                allClean = false;
            }
        });
    });
    return allClean;
});

// 4. Fuzz Testing Data Integrity
console.log('\n--- Data Integrity Fuzzing ---');

// Function to simulate random data corruption or unexpected inputs
function validateRoutine(routine: any): boolean {
    if (!routine.id || typeof routine.id !== 'string') return false;
    if (!Array.isArray(routine.habits)) return false;
    return true;
}

test('Should validate correct routine structure', () => {
    return validateRoutine(MOCK_ROUTINES[0]);
});

test('Should reject malformed routine (fuzz)', () => {
    const badRoutine = { id: 123, habits: 'not-array' }; // Invalid types
    return validateRoutine(badRoutine) === false;
});

test('Should not crash on empty data', () => {
    const emptyRoutine = {};
    return validateRoutine(emptyRoutine) === false;
});

console.log('\n' + '='.repeat(30));
console.log(`RESULTS: ${passed} passed, ${failed} failed`);
console.log('='.repeat(30));
