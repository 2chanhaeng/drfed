ALTER TABLE "accounts" ADD COLUMN "admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "instance_members" ADD COLUMN "admin" boolean DEFAULT false NOT NULL;