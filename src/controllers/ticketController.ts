import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export class TicketController {
  //create ticket
  async addTicket(req: Request, res: Response): Promise<any> {
    const { eventId, ticketType, price, available } = req.body;

    if (!eventId || !ticketType || !price || available === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const event = await prisma.event.findUnique({
        where: { event_id: eventId },
      });

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      const ticket = await prisma.ticket.create({
        data: { eventId, ticketType, price, available },
      });

      res.status(201).json(ticket);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add ticket" });
    }
  }

  //get all tickets
  async getTicketsForEvent(req: Request, res: Response): Promise<any> {
    const eventId = parseInt(req.params.eventId);

    try {
      const event = await prisma.event.findUnique({
        where: { event_id: eventId },
      });

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      const tickets = await prisma.ticket.findMany({
        where: { eventId },
      });

      res.json(tickets);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  }

  //update ticket
  async updateTicket(req: Request, res: Response): Promise<any> {
    const ticketId = parseInt(req.params.id);
    const { ticketType, price, available } = req.body;

    try {
      const ticket = await prisma.ticket.findUnique({
        where: { ticket_id: ticketId },
      });

      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      const updatedTicket = await prisma.ticket.update({
        where: { ticket_id: ticketId },
        data: {
          ...(ticketType !== undefined && { ticketType }),
          ...(price !== undefined && { price }),
          ...(available !== undefined && { available }),
        },
      });

      res.json(updatedTicket);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update ticket" });
    }
  }

  //delete ticket
  async deleteTicket(req: Request, res: Response): Promise<any> {
    const ticketId = parseInt(req.params.id);

    try {
      const ticket = await prisma.ticket.findUnique({
        where: { ticket_id: ticketId },
      });

      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }

      await prisma.ticket.delete({
        where: { ticket_id: ticketId },
      });

      res.json({ message: "Ticket deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete ticket" });
    }
  }
}
