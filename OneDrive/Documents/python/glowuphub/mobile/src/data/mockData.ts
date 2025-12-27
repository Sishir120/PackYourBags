export const MOCK_USER = {
    id: 'mock-user-1',
    name: 'Beautiful',
    email: 'demo@glowup.com',
    streak: 12, // Realistic streak
    logs: [
        {
            date: new Date().toISOString(),
            glowScore: 82, // Strong self-care
            moveScore: 45, // Moderate movement (mid-day)
            mindScore: 90, // High mindfulness
        }
    ]
};

export const MOCK_ROUTINES = [
    {
        id: 'r1',
        name: 'Morning Glow',
        category: 'Morning',
        habits: [
            {
                id: 'h1',
                name: 'Hydration Practice',
                duration: 2,
                scientificRationale: "Evidence suggests that morning hydration triggers cellular activation and improves cognitive alertness post-sleep.",
                citations: ["https://pubmed.ncbi.nlm.nih.gov/24715487/"]
            },
            {
                id: 'h2',
                name: 'Face Balance Practice',
                duration: 8,
                scientificRationale: "Facial muscle stimulation (Face Yoga) increases blood circulation and promotes lymphatic drainage, reducing morning puffiness.",
                citations: ["https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5885810/"]
            },
            {
                id: 'h3',
                name: 'Gentle Breath Work',
                duration: 3,
                scientificRationale: "Controlled breathing activates the parasympathetic nervous system, lowering cortisol levels and reducing anxiety.",
                citations: ["https://www.nature.com/articles/s41598-019-54530-w"]
            },
            {
                id: 'h4',
                name: 'SPF Self-Care',
                duration: 2,
                scientificRationale: "Broad-spectrum SPF is clinically proven to prevent photoaging and reduce the risk of UV-induced DNA damage.",
                citations: ["https://www.jaad.org/article/S0190-9622(13)00412-2/fulltext"]
            },
        ]
    },
    {
        id: 'r2',
        name: 'Evening Unwind',
        category: 'Evening',
        habits: [
            {
                id: 'h5',
                name: 'Double Cleanse Practice',
                duration: 5,
                scientificRationale: "Two-step cleansing ensures the removal of lipid-based impurities and environmental pollutants that cause oxidative stress.",
                citations: ["https://www.skintherapyletter.com/dermatology/skin-cleansing-guidelines/"]
            },
            {
                id: 'h6',
                name: 'Lymphatic Face Massage',
                duration: 10,
                scientificRationale: "Targeted massage techniques aid in the removal of metabolic waste from tissues, enhancing skin clarity and tone.",
                citations: ["https://pubmed.ncbi.nlm.nih.gov/23746213/"]
            },
            {
                id: 'h7',
                name: 'Gratitude Reflection',
                duration: 5,
                scientificRationale: "Regular gratitude practices are linked to improved sleep quality and physiological markers of resilience.",
                citations: ["https://pubmed.ncbi.nlm.nih.gov/12585811/"]
            },
        ]
    }
];

// Identity reinforcement phrases
export const IDENTITY_PHRASES = [
    "I keep promises to myself.",
    "My consistency is my confidence.",
    "Small practices, lasting radiance.",
    "I honor my body with gentle care.",
    "Every day I choose myself.",
];

// Compassionate recovery messages
export const RECOVERY_MESSAGES = [
    "Rest is part of the practice. Your practice is always here when you return.",
    "Life flows differently some days. Pick up where you left off, with grace.",
    "Missing a day doesn't break your journey. It's just a pause in the rhythm.",
];

export const MOCK_UP_NEXT = ['Face Balance', 'Hydration Cue', 'Evening Reflection'];
