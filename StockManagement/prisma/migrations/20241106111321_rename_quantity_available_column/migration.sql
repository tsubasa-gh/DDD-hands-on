/*
  Warnings:

  - You are about to drop the column `quqntityAvailable` on the `Stock` table. All the data in the column will be lost.
  - Added the required column `quantityAvailable` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "quqntityAvailable",
ADD COLUMN     "quantityAvailable" INTEGER NOT NULL;
