CREATE TABLE IF NOT EXISTS "partners" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "partners_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"fullname" varchar(255) NOT NULL,
	"lastname" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"country" varchar(255) NOT NULL,
	"message" varchar(255) NOT NULL,
	"createdAt" timestamp (6) DEFAULT now() NOT NULL
);
