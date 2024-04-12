/*
  Warnings:

  - A unique constraint covering the columns `[team_name]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_team_name_key" ON "user"("team_name");