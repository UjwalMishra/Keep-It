import zod from "zod";

export const contentZodSchema = zod
  .object({
    type: zod.enum(["youtube", "x", "instagram", "notes", "web articles"]),
    link: zod.string().optional(),
    title: zod.string().optional(),
    desc: zod.string().optional(),
    tags: zod.array(zod.string()).optional(),
  })
  .refine((data) => data.type === "notes" || !!data.link, {
    message: "Link is required unless type is 'notes'",
    path: ["link"],
  })
  .refine((data) => data.type === "web articles" || !!data.title, {
    message: "Title is required unless type is 'web articles'",
    path: ["title"],
  });
