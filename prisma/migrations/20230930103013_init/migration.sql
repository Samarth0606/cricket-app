-- CreateEnum
CREATE TYPE "match_user_tag_status" AS ENUM ('striker', 'non_striker', 'stands', 'out', 'retire_hurt');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "oneauth_id" INTEGER NOT NULL,
    "firstname" VARCHAR(255) NOT NULL,
    "lastname" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "photo" VARCHAR(255),
    "mobile" VARCHAR(255),
    "verifiedmobile" VARCHAR(255),
    "team_name" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "result" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags_blacklist_whitelist" (
    "id" SERIAL NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "days_till_blacklisted" INTEGER NOT NULL,

    CONSTRAINT "tags_blacklist_whitelist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_user" (
    "id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_user_tag" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "match_user_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "status" "match_user_tag_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_user_tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_oneauth_id_key" ON "user"("oneauth_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tags_blacklist_whitelist_tag_id_key" ON "tags_blacklist_whitelist"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "match_user_match_id_user_id_key" ON "match_user"("match_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "match_user_tag_match_user_id_tag_id_key" ON "match_user_tag"("match_user_id", "tag_id");

-- AddForeignKey
ALTER TABLE "match_user" ADD CONSTRAINT "match_user_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_user" ADD CONSTRAINT "match_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_user_tag" ADD CONSTRAINT "match_user_tag_match_user_id_fkey" FOREIGN KEY ("match_user_id") REFERENCES "match_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
