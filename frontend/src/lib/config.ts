/**
 * Centralized configuration for the application.
 * Ensures that environment variables are present and provides clear errors if they are missing.
 */

const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key];
    
    if (!value && !defaultValue) {
        // In development, we can use a fallback, but in production we want to know it's missing
        if (process.env.NODE_ENV === 'production') {
            console.error(`FATAL: Environment variable ${key} is missing in production build!`);
        }
        return defaultValue || '';
    }
    
    return value || defaultValue || '';
};

export const CONFIG = {
    API_URL: getEnv('NEXT_PUBLIC_API_URL', 'http://localhost:8000/api'),
    AI_API_URL: getEnv('NEXT_PUBLIC_AI_API_URL', 'http://localhost:8000/api'),
    GOOGLE_CLIENT_ID: getEnv('NEXT_PUBLIC_GOOGLE_CLIENT_ID'),
    STRIPE_PUBLISHABLE_KEY: getEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
    IS_PROD: process.env.NODE_ENV === 'production',
};

// Helper for building API paths
export const getApiUrl = (path: string) => {
    const base = CONFIG.API_URL.endsWith('/') ? CONFIG.API_URL.slice(0, -1) : CONFIG.API_URL;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
};
