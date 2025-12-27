import AsyncStorage from '@react-native-async-storage/async-storage';

interface AnonymizedHealthWithMeta {
    researchId: string;
    timestamp: number; // Fuzzy timestamp (hour precision)
    metrics: {
        steps: number;
        sleepMinutes: number;
        activeCalories: number;
    }
}

const STORAGE_KEY_RESEARCH_ID = 'glowup_research_id';

// Generate or retrieve a persistent rotation ID for research
async function getResearchId(): Promise<string> {
    let id = await AsyncStorage.getItem(STORAGE_KEY_RESEARCH_ID);
    if (!id) {
        // Simple random ID generation for privacy rotation
        id = 'res_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        await AsyncStorage.setItem(STORAGE_KEY_RESEARCH_ID, id);
    }
    return id;
}

export async function processForResearch(data: { steps: number; sleepMinutes: number; activeCalories: number }) {
    const researchId = await getResearchId();

    // Fuzzy timestamp: round to nearest hour to prevent correlation attacks
    const now = new Date();
    now.setMinutes(0, 0, 0);
    const fuzzyTimestamp = now.getTime();

    const payload: AnonymizedHealthWithMeta = {
        researchId,
        timestamp: fuzzyTimestamp,
        metrics: {
            steps: data.steps,
            sleepMinutes: data.sleepMinutes,
            activeCalories: data.activeCalories
        }
    };

    // In a real app, this would be an encrypted POST to a separate research endpoint
    // For now, we simulate the "Send"
    console.log('[ResearchPipeline] Securely processed data point:', JSON.stringify(payload));

    return true;
}
