-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('REGULAR', 'VIP');

-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('PERCENTAGE', 'FLAT');

-- CreateTable
CREATE TABLE "Ticket" (
    "ticket_id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "ticketType" "TicketType" NOT NULL,
    "price" INTEGER NOT NULL,
    "available" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("ticket_id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "promotion_id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "type" "PromotionType" NOT NULL,
    "value" INTEGER NOT NULL,
    "promotionCode" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "maxUse" INTEGER NOT NULL,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("promotion_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_promotionCode_key" ON "Promotion"("promotionCode");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;
