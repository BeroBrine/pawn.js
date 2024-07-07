-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
DO $$ BEGIN
 CREATE TYPE "public"."stat" AS ENUM('GOING_ON', 'COMPLETED', 'ABANDON', 'PLAYER_LEFT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."statusEnum" AS ENUM('COMPLETED', 'ABANDON', 'PLAYER_LEFT', 'GOING_ON');
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
	"startAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(40) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" text NOT NULL,
	"name" varchar(50),
	"gamesAsWhite" uuid[] DEFAULT 'RRAY[' NOT NULL,
	"gamesAsBlack" uuid[] DEFAULT 'RRAY[' NOT NULL,
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

