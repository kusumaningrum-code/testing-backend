import { Router } from "express";
import { TicketController } from "../controllers/ticketController";

export class TicketRouter {
  private route: Router;
  private ticketController: TicketController;

  constructor() {
    this.ticketController = new TicketController();
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post("/", this.ticketController.addTicket);
    this.route.get("/:eventId", this.ticketController.getTicketsForEvent);
    this.route.patch("/:id", this.ticketController.updateTicket);
    this.route.delete("/:id", this.ticketController.deleteTicket);
  }

  public getRouter(): Router {
    return this.route;
  }
}
