import zod from "zod";

export const contentZodSchema = zod.object({
  link: zod.string().optional(),
  title: zod.string(),
  type: zod.enum(["youtube", "x", "article", "video"]).optional(),
  tags: zod.array(zod.string()).optional(),
});
