import { z } from "zod";
import { WheelSegmentPrizeType, WheelStatus } from "@/interfaces/wheel";

const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const wheelSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(80),
  description: z.string().optional(),
  status: z.enum(WheelStatus),
  spinCost: z.coerce.number().min(0),
  maxSpinsPerUser: z.coerce.number().min(1),
  backgroundColor: z.string().regex(hexRegex),
  borderColor: z.string().regex(hexRegex),

  segments: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().min(1, "Label is required"),
        color: z.string().regex(hexRegex, "Invalid hex color"),
        weight: z.coerce.number().min(1),
        prizeType: z.enum(WheelSegmentPrizeType),
        prizeAmount: z.coerce.number().min(0),
      }),
    )
    .superRefine((segments, ctx) => {
      if (segments.length < 2) {
        ctx.addIssue({
          code: "custom",
          message: "You must have at least 2 segments",
        });
        return;
      }

      let hasFieldErrors = false;
      segments.forEach((segment, index) => {
        if (!segment.label) {
          ctx.addIssue({
            code: "custom",
            message: "Label required",
            path: [index, "label"],
          });
          hasFieldErrors = true;
        }
      });

      if (hasFieldErrors) return;

      const total = segments.reduce(
        (sum, s) => sum + (Number(s.weight) || 0),
        0,
      );
      if (total !== 100) {
        ctx.addIssue({
          code: "custom",
          message: `Total weight must be 100 (Current: ${total})`,
        });
      }
    }),
});

export type Wheel = z.infer<typeof wheelSchema>;
