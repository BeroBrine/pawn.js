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
DO $$ BEGIN
 CREATE TYPE "public"."color" AS ENUM('white', 'black');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."result" AS ENUM('white', 'black', 'in_progress');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."stat" AS ENUM('GOING_ON', 'COMPLETED', 'ABANDON', 'PLAYER_LEFT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "game" (
	"id" uuid PRIMARY KEY NOT NULL,
	"player1id" uuid NOT NULL,
	"player2id" uuid NOT NULL,
	"gameStatus" "stat" NOT NULL,
	"moves" uuid[],
	"startingFen" text DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
	"currentFen" text NOT NULL,
	"startAt" timestamp with time zone DEFAULT now(),
	"result" "result" DEFAULT 'in_progress' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "move" (
	"id" uuid PRIMARY KEY NOT NULL,
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
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(40) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" text NOT NULL,
	"name" varchar(50),
	"gamesAsWhite" uuid[] NOT NULL,
	"gamesAsBlack" uuid[] NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"lastLogin" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game" ADD CONSTRAINT "game_player1id_users_id_fk" FOREIGN KEY ("player1id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game" ADD CONSTRAINT "game_player2id_users_id_fk" FOREIGN KEY ("player2id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "move" ADD CONSTRAINT "move_parentMoveTable_game_id_fk" FOREIGN KEY ("parentMoveTable") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gameStatus" ON "game" USING btree ("gameStatus");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "result" ON "game" USING btree ("result");