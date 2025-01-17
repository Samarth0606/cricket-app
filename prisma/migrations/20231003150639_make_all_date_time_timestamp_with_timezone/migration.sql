-- AlterTable
ALTER TABLE "match" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "start_time" SET DATA TYPE TIMESTAMPTZ(0);

-- AlterTable
ALTER TABLE "match_ball" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "submit_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(0);

-- AlterTable
ALTER TABLE "match_user" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "end_time" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "start_time" SET DATA TYPE TIMESTAMPTZ(0);

-- AlterTable
ALTER TABLE "match_user_tag" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(0);

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(0);
