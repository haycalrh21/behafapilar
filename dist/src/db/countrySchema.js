import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
export const countryTable = pgTable("country", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    createdAt: timestamp({ precision: 6 }).notNull().defaultNow(),
});
