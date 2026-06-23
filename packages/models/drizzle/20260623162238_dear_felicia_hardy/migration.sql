ALTER TABLE "accounts" ADD COLUMN "name" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "instance_members" ADD COLUMN "accepted" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "instance_members_accountId_index" ON "instance_members" ("accountId") WHERE "accepted" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "instance_members_instanceId_index" ON "instance_members" ("instanceId") WHERE "accepted" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_name_check" CHECK (trim(both from "name") <> '');