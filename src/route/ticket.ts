import {
  authRequired,
  NotFoundError,
  validateRequest,
} from "@mrticketing/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import Ticket from "../model/ticket";

const router = express.Router();

router.post(
  "/api/tickets/",
  [
    body("title").notEmpty().withMessage("Tile can not be empty"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be value greater than 0"),
    validateRequest,
  ],
  authRequired,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = await Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    }).save();
    return res.status(201).send(ticket);
  }
);

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const ticket = await Ticket.findById(id);
  if (!ticket) throw new NotFoundError();
  return res.send(ticket);
});

router.get("/api/tickets/", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});
  return res.send(tickets);
});

router.put(
  "/api/tickets/:id",
  [
    body("title").notEmpty().withMessage("Tile can not be empty"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be value greater than 0"),
    validateRequest,
  ],
  authRequired,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const id = req.params.id;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      console.log("throwing");
      throw new NotFoundError();
    }
    ticket.set({ title, price });
    await ticket.save();
    return res.status(200).send(ticket);
  }
);

export default router;
