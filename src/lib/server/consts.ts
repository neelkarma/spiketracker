/** The base url of the app. Changes depending on NODE_ENV. */
export const WEBSITE_URL =
  process.env.NODE_ENV === "production"
    ? "https://spiketracker.com" // Placeholder value for now
    : "http://localhost:5173";

/** The SBHS API base url. */
export const API_BASE = "https://student.sbhs.net.au/api";
