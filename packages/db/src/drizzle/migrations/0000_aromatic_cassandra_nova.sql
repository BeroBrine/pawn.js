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
	"startingFen" text DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
	"currentFen" text NOT NULL,
	"startAt" timestamp with time zone DEFAULT now(),
	"result" "result" DEFAULT 'in_progress' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "move" (
	"id" serial NOT NULL,
	"gameId" uuid NOT NULL,
	CONSTRAINT "id" UNIQUE("id")
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
 ALTER TABLE "move" ADD CONSTRAINT "move_gameId_game_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gameStatus" ON "game" USING btree ("gameStatus");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "result" ON "game" USING btree ("result");
