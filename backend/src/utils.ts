import { z } from "zod";
import { TRegisterRequest } from "./types";

export const NewUserSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 character long"),
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 character long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });

export const NewDirectorySchema = z.object({
  name: z.string().min(3, "Directory name must be at least 3 characters long"),
});

export const NewJobSchema = z.object({
  companyName: z.string().optional(),
  positionName: z.string().optional(),
  applicationUrl: z.string().url("Invalid URL format"),
  status: z.enum([
    "bookmarked",
    "applied",
    "rejected",
    "ghosted",
    "interviewing",
    "offered",
    "accepted",
  ]),
  location: z.string().optional(),
  description: z.string().optional(),
});

const toRegisterUser = (object: unknown): TRegisterRequest => {
  return NewUserSchema.parse(object);
};
export default toRegisterUser;
