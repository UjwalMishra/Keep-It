import zod from "zod";

export const contentZodSchema = zod
  .object({
    type: zod.enum(["youtube", "x", "instagram", "notes"]),
    link: zod.string().optional(),
    title: zod.string(),
    desc: zod.string().optional(),
    tags: zod.array(zod.string()).optional(),
  })
  .refine(
    (data) => {
      // If type is not "notes", link must be present
      if (data.type !== "notes") {
        return !!data.link;
      }
      return true;
    },
    {
      message: "Link is required unless the content type is 'notes'.",
      path: ["link"],
    }
  );
