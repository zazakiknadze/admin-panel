import { LeaderboardStatus } from "@/interfaces/leaderboard";
import { z } from "zod";

export const leaderboardSchema = z
  .object({
    title: z.string().min(3, "Title must be 3-100 characters").max(100),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    maxParticipants: z.coerce.number().int().min(2, "Minimum 2 participants"),
    status: z.enum(LeaderboardStatus),
    prizes: z
      .array(
        z.object({
          name: z.string().min(1, "Prize name required"),
          rank: z.coerce.number().min(1),
          amount: z.coerce.number().min(1, "Amount required"),
        }),
      )
      .min(1, "At least one prize is required"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type Leaderboard = z.infer<typeof leaderboardSchema>;
