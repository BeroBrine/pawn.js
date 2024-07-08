ALTER TABLE "move" RENAME COLUMN "parentMoveTable" TO "gameId";--> statement-breakpoint
ALTER TABLE "move" DROP CONSTRAINT "move_parentMoveTable_game_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "move" ADD CONSTRAINT "move_gameId_game_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
