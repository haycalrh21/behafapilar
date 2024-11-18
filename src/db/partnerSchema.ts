import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const partnerTable = pgTable("partners", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fullname: varchar({ length: 255 }).notNull(),
  lastname: varchar({ length: 255 }).notNull(),

  email: varchar({ length: 255 }).notNull(),
  country: varchar({ length: 255 }).notNull(),
  message: varchar({ length: 255 }).notNull(),

  createdAt: timestamp({ precision: 6 }).notNull().defaultNow(),
});
