import { defineConfig } from "drizzle-kit";
export default defineConfig({
    out: "./drizzle",
    schema: [
        "./src/db/userSchema.ts",
        "./src/db/candidateSchema.ts",
        "./src/db/countrySchema.ts",
        "./src/db/partnerSchema.ts",
    ],
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    verbose: true,
    strict: true,
});
