import { z } from "zod";
import { CONTENT_LIMITS } from "../constants/contentLimits";

export const contentZodSchema = z
  .object({
    type: z.enum(["youtube", "x", "instagram", "notes", "web articles"]),
    link: z.string().trim().max(CONTENT_LIMITS.link).optional(),
    title: z.string().trim().max(CONTENT_LIMITS.title).optional(),
    desc: z.string().trim().max(CONTENT_LIMITS.desc).optional(),
    tags: z
      .array(z.string().trim().max(CONTENT_LIMITS.tag))
      .max(CONTENT_LIMITS.maxTags)
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type !== "notes") {
      if (!data.link) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Link is required unless type is 'notes'",
          path: ["link"],
        });
      } else {
        try {
          const parsed = new URL(data.link);
          if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            throw new Error("invalid protocol");
          }
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Link must be a valid http(s) URL",
            path: ["link"],
          });
        }
      }
    }

    if (data.type !== "web articles" && !data.title) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Title is required unless type is 'web articles'",
        path: ["title"],
      });
    }

    if (data.type === "notes" && !data.desc) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description is required for notes",
        path: ["desc"],
      });
    }
  });
