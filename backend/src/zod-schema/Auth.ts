import { z } from "zod";

/** Accepts either a username or an email (legacy accounts used emails). */
const usernameSchema = z
  .string()
  .trim()
  .min(3, "Must be at least 3 characters")
  .max(64, "Must be at most 64 characters")
  .refine(
    (value) => {
      const isUsername = /^[a-zA-Z0-9_]+$/.test(value);
      const isEmail = z.string().email().safeParse(value).success;
      return isUsername || isEmail;
    },
    {
      message: "Enter a username (letters, numbers, _) or a valid email",
    }
  );

export const signupZodSchema = z.object({
  username: usernameSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
});

/** Sign-in keeps a looser password check so legacy accounts can still log in. */
export const signinZodSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1).max(72),
});

export const refreshZodSchema = z.object({
  refreshToken: z.string().min(20).max(500),
});

/** @deprecated use signupZodSchema / signinZodSchema */
export const authZodSchema = signupZodSchema;
