CREATE TABLE IF NOT EXISTS "candidates" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "candidates_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"fullname" varchar(255) NOT NULL,
	"lastname" varchar(255) NOT NULL,
	"dateOfBirth" varchar(255) NOT NULL,
	"gender" varchar(255) NOT NULL,
	"passportNumber" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phoneNumber" varchar(255) NOT NULL,
	"department" varchar(255) NOT NULL,
	"position" varchar(255) NOT NULL,
	"cv" varchar(255),
	"certificate" varchar(255),
	"createdAt" timestamp (6) DEFAULT now() NOT NULL
);
