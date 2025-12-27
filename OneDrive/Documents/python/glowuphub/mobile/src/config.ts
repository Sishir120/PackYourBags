const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error(
        "CRITICAL: EXPO_PUBLIC_API_URL is missing. The app cannot start without a valid API endpoint."
    );
}

export const API_URL = apiUrl;
