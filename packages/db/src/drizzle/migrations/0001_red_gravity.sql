DO $$ BEGIN
 CREATE TYPE "public"."PieceSymbol" AS ENUM('p', 'n', 'b', 'r', 'q', 'k');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."Square" AS ENUM('a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8', 'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7', 'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6', 'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5', 'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4', 'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3', 'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2', 'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "move" (
	"id" uuid  NOT NULL DEFAULT gen_random_uuid(),
	"gameId" uuid NOT NULL,
	CONSTRAINT "id" UNIQUE("id")
);

CREATE TABLE IF NOT EXISTS "moveHistory" (
	"id" serial PRIMARY KEY NOT NULL,
	"parentMoveTable" uuid,
	"color" "color",
	"from" "Square",
	"to" "Square",
	"piece" "PieceSymbol",
	"captured" "PieceSymbol",
	"promotion" "PieceSymbol",
	"flags" text,
	"string" text
);
--> statement-breakpoint
ALTER TABLE "move" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "move" ALTER COLUMN "id" SET DATA TYPE uuid USING id::uuid;--> statement-breakpoint
ALTER TABLE "move" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "moves" text[];--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moveHistory" ADD CONSTRAINT "moveHistory_parentMoveTable_move_id_fk" FOREIGN KEY ("parentMoveTable") REFERENCES "public"."move"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "move" DROP COLUMN IF EXISTS "from";--> statement-breakpoint
ALTER TABLE "move" DROP COLUMN IF EXISTS "to";--> statement-breakpoint
ALTER TABLE "move" DROP COLUMN IF EXISTS "playerColor";
