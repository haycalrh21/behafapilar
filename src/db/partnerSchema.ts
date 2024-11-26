import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const partnerTable = pgTable("partners", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  whatsapp: varchar({ length: 255 }).notNull(),
  companyName: varchar({ length: 255 }).notNull(),
  companyWebsite: varchar({ length: 255 }).notNull(),

  country: varchar({ length: 255 }).notNull(),
  message: varchar({ length: 255 }).notNull(),

  createdAt: timestamp({ precision: 6 }).notNull().defaultNow(),
});
