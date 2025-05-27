import { z } from "zod";
import { NewUserSchema } from "./utils";

export interface TLoginRequest {
  email: string;
  password: string;
}
export interface TLoginResponse {
  id: number;
  email: string;
  name: string;
}
export type TRegisterRequest = z.infer<typeof NewUserSchema>;
export interface TRegisterResponse {
  id: number;
  name: string;
  email: string;
}
