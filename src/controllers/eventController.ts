import { Request, Response } from "express";
import { prisma } from "../config/prisma";

//pagination
const paginate = (page: number, limit: number) => ({
  skip: (page - 1) * limit,
  take: limit,
});

export class EventsController {
  // get all events
  async getEvents(req: Request, res: Response): Promise<any> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const location = (req.query.location as string) || "";

      const pagination = paginate(page, limit);

      const events = await prisma.event.findMany({
        where: {
          AND: [
            { name: { contains: search, mode: "insensitive" } },
            { location: { contains: location, mode: "insensitive" } },
          ],
        },
        ...pagination,
        orderBy: { date: "asc" },
      });

      const totalEvents = await prisma.event.count({
        where: {
          AND: [
            { name: { contains: search, mode: "insensitive" } },
            { location: { contains: location, mode: "insensitive" } },
          ],
        },
      });

      res.json({
        events,
        totalEvents,
        totalPages: Math.ceil(totalEvents / limit),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  //get event details
  async getEventDetails(req: Request, res: Response): Promise<any> {
    const eventId = parseInt(req.params.id);

    try {
      const event = await prisma.event.findUnique({
        where: { event_id: eventId },
        include: { organiser: true },
      });

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.json(event);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  //create event
  async createEvent(req: Request, res: Response): Promise<any> {
    const {
      name,
      description,
      price,
      date,
      time,
      location,
      availableSeats,
      organiserId,
    } = req.body;

    if (
      !name ||
      !date ||
      !time ||
      !location ||
      !availableSeats ||
      !organiserId
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const organiser = await prisma.user.findUnique({
        where: { id: organiserId },
      });

      if (!organiser) {
        return res.status(400).json({ error: "Organiser not found" });
      }

      if (organiser.role !== "ORGANIZER") {
        return res.status(403).json({ error: "User is not an organizer" });
      }
      const dateTime = new Date(`${date}T${time}.000Z`);
      if (isNaN(dateTime.getTime())) {
        return res.status(400).json({ error: "Invalid date or time format" });
      }
      const event = await prisma.event.create({
        data: {
          name,
          description,
          price,
          date: new Date(date),
          time: dateTime,
          location,
          availableSeats,
          organiserId,
        },
      });

      res.status(201).json(event);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create event" });
    }
  }
}
