import zod from "zod";

export const contentZodSchema = zod.object({
  link: zod.string(),
  title: zod.string(),
  type: zod.enum(["youtube", "x", "instagram", "video"]),
  tags: zod.array(zod.string()).optional(),
});
