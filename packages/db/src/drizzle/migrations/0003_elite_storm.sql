ALTER TABLE "move" RENAME COLUMN "string" TO "lan";--> statement-breakpoint
ALTER TABLE "move" ADD COLUMN "before" text;--> statement-breakpoint
ALTER TABLE "move" ADD COLUMN "after" text;