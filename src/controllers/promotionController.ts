import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export class PromotionController {
  //create promotion
  async addPromotion(req: Request, res: Response): Promise<any> {
    const {
      eventId,
      type,
      value,
      promotionCode,
      startDate,
      expirationDate,
      maxUse,
    } = req.body;

    if (
      !eventId ||
      !type ||
      !value ||
      !promotionCode ||
      !startDate ||
      !expirationDate ||
      maxUse === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const event = await prisma.event.findUnique({
        where: { event_id: eventId },
      });

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const promotion = await prisma.promotion.create({
        data: {
          eventId,
          type,
          value,
          promotionCode,
          startDate: new Date(startDate),
          expirationDate: new Date(expirationDate),
          maxUse,
        },
      });

      res.status(201).json(promotion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create promotion" });
    }
  }

  //get promotions for event
  async getPromotionsForEvent(req: Request, res: Response): Promise<any> {
    const eventId = parseInt(req.params.eventId);

    try {
      const event = await prisma.event.findUnique({
        where: { event_id: eventId },
      });

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const promotions = await prisma.promotion.findMany({
        where: { eventId },
      });

      res.json(promotions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch promotions" });
    }
  }

  //update promotion
  async updatePromotion(req: Request, res: Response): Promise<any> {
    const promotionId = parseInt(req.params.id);
    const {
      type,
      value,
      promotionCode,
      startDate,
      expirationDate,
      maxUse,
      useCount,
    } = req.body;

    try {
      const promotion = await prisma.promotion.findUnique({
        where: { promotion_id: promotionId },
      });

      if (!promotion) {
        return res.status(404).json({ error: "Promotion not found" });
      }

      const updatedPromotion = await prisma.promotion.update({
        where: { promotion_id: promotionId },
        data: {
          ...(type !== undefined && { type }),
          ...(value !== undefined && { value }),
          ...(promotionCode !== undefined && { promotionCode }),
          ...(startDate !== undefined && { startDate: new Date(startDate) }),
          ...(expirationDate !== undefined && {
            expirationDate: new Date(expirationDate),
          }),
          ...(maxUse !== undefined && { maxUse }),
          ...(useCount !== undefined && { useCount }),
        },
      });

      res.json(updatedPromotion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update promotion" });
    }
  }

  //delete promotion
  async deletePromotion(req: Request, res: Response): Promise<any> {
    const promotionId = parseInt(req.params.id);

    try {
      const promotion = await prisma.promotion.findUnique({
        where: { promotion_id: promotionId },
      });

      if (!promotion) {
        return res.status(404).json({ error: "Promotion not found" });
      }

      await prisma.promotion.delete({
        where: { promotion_id: promotionId },
      });

      res.json({ message: "Promotion deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete promotion" });
    }
  }
}
