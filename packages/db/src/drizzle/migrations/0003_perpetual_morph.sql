DROP TABLE "move";--> statement-breakpoint
ALTER TABLE "moveHistory" DROP CONSTRAINT "moveHistory_parentMoveTable_move_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moveHistory" ADD CONSTRAINT "moveHistory_parentMoveTable_game_id_fk" FOREIGN KEY ("parentMoveTable") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
