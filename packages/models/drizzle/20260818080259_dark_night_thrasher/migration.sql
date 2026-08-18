ALTER TABLE "local_instances" DROP CONSTRAINT "local_instances_id_instances_id_fkey";--> statement-breakpoint
ALTER TABLE "local_instances" DROP CONSTRAINT "local_instance_fk";--> statement-breakpoint
DROP TABLE "remote_instances";--> statement-breakpoint
ALTER TABLE "instances" DROP CONSTRAINT "instances_id_location_key";--> statement-breakpoint
ALTER TABLE "local_instances" DROP CONSTRAINT "local_check";--> statement-breakpoint
ALTER TABLE "instances" ADD COLUMN "localId" uuid;--> statement-breakpoint
ALTER TABLE "instances" ADD COLUMN "host" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "instances" ADD COLUMN "nodeInfoUrl" text;--> statement-breakpoint
ALTER TABLE "instances" ADD COLUMN "software" text;--> statement-breakpoint
ALTER TABLE "instances" ADD COLUMN "softwareVersion" text;--> statement-breakpoint
ALTER TABLE "instances" DROP COLUMN "location";--> statement-breakpoint
ALTER TABLE "local_instances" DROP COLUMN "location";--> statement-breakpoint
ALTER TABLE "instances" ADD CONSTRAINT "instances_host_key" UNIQUE("host");--> statement-breakpoint
ALTER TABLE "instances" ADD CONSTRAINT "instances_localId_local_instances_id_fkey" FOREIGN KEY ("localId") REFERENCES "local_instances"("id") ON DELETE CASCADE;--> statement-breakpoint
DROP TYPE "location";