ALTER TYPE "stat" ADD VALUE 'CUSTOM_GAME';--> statement-breakpoint
ALTER TABLE "game" ALTER COLUMN "player1id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "game" ALTER COLUMN "player2id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "game" ALTER COLUMN "gameStatus" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "game" ALTER COLUMN "currentFen" DROP NOT NULL;