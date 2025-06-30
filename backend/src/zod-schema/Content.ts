import zod from "zod";

export const contentZodSchema = zod.object({
  link: zod.string().optional(),
  title: zod.string(),
  type: zod.enum(["image", "video", "article", "audio"]),
  tags: zod.array(zod.string()).optional(),
  userId: zod.string().optional(),
});
