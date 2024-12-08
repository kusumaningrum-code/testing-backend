import { Router, Request, Response, NextFunction } from "express";
import express from "express";
import { ReviewController } from "../controllers/reviewController";

export class ReviewRouter {
  private route: Router;
  private reviewController: ReviewController;

  constructor() {
    this.reviewController = new ReviewController();
    this.route = Router();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.route.get("/:eventId", this.reviewController.getEventReviews);
    this.route.post("/", this.reviewController.addReview);
    this.route.patch("/:id", this.reviewController.updateReview);
    this.route.delete("/:id", this.reviewController.deleteReview);
  }
  public getRouter(): Router {
    return this.route;
  }
}
