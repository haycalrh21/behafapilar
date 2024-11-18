import {
  integer,
  pgTable,
  varchar,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const candidatesTable = pgTable("candidates", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fullname: varchar({ length: 255 }).notNull(),
  lastname: varchar({ length: 255 }).notNull(),
  dateOfBirth: varchar({ length: 255 }).notNull(),
  gender: varchar({ length: 255 }).notNull(),
  passportNumber: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  phoneNumber: varchar({ length: 255 }).notNull(),
  department: varchar({ length: 255 }).notNull(),
  position: varchar({ length: 255 }).notNull(),
  cv: text(), // Change to text to store base64 encoded PDF data
  certificate: text(), // Change to text to store base64 encoded PDF data
  createdAt: timestamp({ precision: 6 }).notNull().defaultNow(),
});
