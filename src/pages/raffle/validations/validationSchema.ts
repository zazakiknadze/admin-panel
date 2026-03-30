import { RaffleStatus } from "@/interfaces/raffle";
import { z } from "zod";

export const raffleSchema = z
  .object({
    name: z.string().min(3, "Name must be 3-80 characters").max(80),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    drawDate: z.string().min(1, "Draw date is required"),
    status: z.enum(RaffleStatus),
    ticketPrice: z.coerce
      .number()
      .positive("Ticket price must be a positive number"),
    totalTicketLimit: z
      .preprocess(
        (val) => (val === "" || val === null ? null : val),
        z.coerce.number().positive("Must be a positive number").nullable(),
      )
      .optional(),
    maxTicketsPerUser: z.coerce
      .number()
      .min(1, "Max tickets per user must be at least 1"),
    prizes: z
      .array(
        z.object({
          name: z.string().min(1, "Prize name required"),
          quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
        }),
      )
      .min(1, "At least one prize is required"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine((data) => new Date(data.drawDate) > new Date(data.endDate), {
    message: "Draw date must be after end date",
    path: ["drawDate"],
  });

export type Raffle = z.infer<typeof raffleSchema>;
