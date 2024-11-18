import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const userTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    name: varchar({ length: 255 }),
    role: varchar({ length: 255 }).notNull(),
});
export const insertUserSchema = createInsertSchema(userTable).omit({
    role: true, // abaikan kolom role
});
export const loginUserSchema = createInsertSchema(userTable).pick({
    email: true,
    password: true,
});
