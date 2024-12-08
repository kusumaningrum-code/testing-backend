import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export class ReviewController {
  //add review
  async addReview(req: Request, res: Response): Promise<any> {
    const { eventId, userId, rating, comment } = req.body;

    if (!eventId || !userId || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    try {
      const event = await prisma.event.findUnique({
        where: { event_id: eventId },
      });
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      //check if the user already review the event
      const existingReview = await prisma.review.findFirst({
        where: { eventId, userId },
      });

      if (existingReview) {
        return res
          .status(400)
          .json({ error: "User has already reviewed this event" });
      }
      const review = await prisma.review.create({
        data: { eventId, userId, rating, comment },
      });

      res.status(201).json(review);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add review" });
    }
  }

  //get reviews
  async getEventReviews(req: Request, res: Response): Promise<any> {
    const eventId = parseInt(req.params.eventId);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const reviews = await prisma.review.findMany({
        where: { eventId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { firstname: true, lastname: true, email: true } },
        },
      });

      const totalReviews = await prisma.review.count({ where: { eventId } });

      res.json({
        reviews,
        totalReviews,
        totalPages: Math.ceil(totalReviews / limit),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  }

  //update review
  async updateReview(req: Request, res: Response): Promise<any> {
    const reviewId = parseInt(req.params.id);
    const { rating, comment } = req.body;

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    try {
      const review = await prisma.review.findUnique({
        where: { id: reviewId },
      });

      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: {
          ...(rating !== undefined && { rating }),
          ...(comment !== undefined && { comment }),
        },
      });

      res.json(updatedReview);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update review" });
    }
  }

  //delete review
  async deleteReview(req: Request, res: Response): Promise<any> {
    const reviewId = parseInt(req.params.id);

    try {
      const review = await prisma.review.findUnique({
        where: { id: reviewId },
      });

      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      await prisma.review.delete({ where: { id: reviewId } });

      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete review" });
    }
  }
}
