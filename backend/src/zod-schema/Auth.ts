import zod, { string } from "zod";

//signup
export const authZodSchema = zod.object({
  username: zod.string().min(1),
  password: zod.string().min(5),
});
