/*
  Warnings:

  - You are about to drop the column `voucherId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Voucher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_voucherId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "voucherId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "points";

-- DropTable
DROP TABLE "Voucher";

-- DropEnum
DROP TYPE "VoucherType";
