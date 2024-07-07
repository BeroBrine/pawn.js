ALTER TABLE "move" ADD COLUMN "moves" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "move" ADD CONSTRAINT "move_moves_moveHistory_id_fk" FOREIGN KEY ("moves") REFERENCES "public"."moveHistory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
