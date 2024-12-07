/*
  Warnings:

  - Made the column `country` on table `address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postal_code` on table `address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "address" ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "postal_code" SET NOT NULL;
