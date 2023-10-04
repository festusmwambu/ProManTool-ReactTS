import dotenv from "dotenv";


dotenv.config(); // Load environment variables from `.env` file

interface IOAuth {
    ENABLED: boolean,
    CLIENT_ID: string,
    STRATEGY: string,
};

// Use the `process.env` object to access environment variables in TypeScript
export const OAUTH_GITHUB: IOAuth = {
    ENABLED: true,
    CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID || "",
    STRATEGY: "GITHUB",
};

export const API_URL = process.env.API_BASE_PATH || "";
//example: "http://localhost:5000/api" or "https://example-domain.com/api"

export const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_PROJECT_ID || "";

export const RECAPTCHA_AVAILABLE = process.env.RECAPTCHA_AVAILABLE === "true";

export const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY || "";