/*
  Warnings:

  - Added the required column `title` to the `event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event" ADD COLUMN     "title" VARCHAR(255) NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
