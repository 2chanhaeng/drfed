CREATE TABLE "login_tokens" (
	"id" uuid PRIMARY KEY,
	"accountId" uuid NOT NULL,
	"tokenHash" varchar(64) NOT NULL UNIQUE,
	"codeHash" varchar(64) NOT NULL,
	"created" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"expires" timestamp with time zone DEFAULT CURRENT_TIMESTAMP + INTERVAL '15 minutes' NOT NULL,
	"consumed" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY,
	"accountId" uuid NOT NULL,
	"tokenHash" varchar(64) NOT NULL UNIQUE,
	"created" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"expires" timestamp with time zone DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 month' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "login_tokens" ADD CONSTRAINT "login_tokens_accountId_accounts_id_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_accountId_accounts_id_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE;