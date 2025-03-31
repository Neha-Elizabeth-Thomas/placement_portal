import pg from "pg";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const db = new pg.Pool({
    connectionString: process.env.SUPABASE_DB_URL, // Use environment variable for security
    ssl: { rejectUnauthorized: false } // Required for secure connections to Supabase
});

// Handling unexpected errors
db.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
});

// Query function using the pool
export const query = (text, params) => db.query(text, params);
