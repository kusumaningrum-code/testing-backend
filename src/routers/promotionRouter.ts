import { Router, Request, Response, NextFunction } from "express";
import express from "express";
import { PromotionController } from "../controllers/promotionController";

export class PromotionRouter {
  private route: Router;
  private promotionController: PromotionController;

  constructor() {
    this.promotionController = new PromotionController();
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post("/", this.promotionController.addPromotion);
    this.route.get("/:eventId", this.promotionController.getPromotionsForEvent);
    this.route.patch("/:id", this.promotionController.updatePromotion);
    this.route.delete("/:id", this.promotionController.deletePromotion);
  }

  public getRouter(): Router {
    return this.route;
  }
}
