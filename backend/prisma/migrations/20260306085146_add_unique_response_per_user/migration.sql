/*
  Warnings:

  - A unique constraint covering the columns `[surveyId,userId]` on the table `responses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "responses_surveyId_userId_key" ON "responses"("surveyId", "userId");
