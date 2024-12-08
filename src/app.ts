import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import responseHandler from "./utils/responseHandler";
import { EventRouter } from "./routers/eventRouter";
import { ReviewRouter } from "./routers/reviewRouter";
import { TicketRouter } from "./routers/ticketRouter";
import { PromotionRouter } from "./routers/promotionRouter";
const PORT = process.env.PORT || 8082;

class App {
  readonly app: Application;

  constructor() {
    this.app = express();
    this.configure(); // Running configure
    this.routes();
    this.errorHandler();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private routes(): void {
    const eventRouter = new EventRouter();
    this.app.get("/", (req: Request, res: Response): any => {
      return res.status(200).send("<h1>ORM API<h1>");
    });
    this.app.use("/events", eventRouter.getRouter());
    const reviewRouter = new ReviewRouter();
    this.app.use("/reviews", reviewRouter.getRouter());
    const ticketRouter = new TicketRouter();
    this.app.use("/tickets", ticketRouter.getRouter());
    const promotionRouter = new PromotionRouter();
    this.app.use("/promotions", promotionRouter.getRouter());
  }
  private errorHandler(): void {
    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        responseHandler.error(res, error.message, error.error, error.rc);
      }
    );
  }
  public start(): void {
    this.app.listen(PORT, () => {
      console.log("API RUNNING", PORT);
    });
  }
}

export default new App();
