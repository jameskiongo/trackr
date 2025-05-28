import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/db";
import { TLoginRequest, TRegisterRequest } from "../types";
import { usersTable } from "../db/schema";

import { config } from "dotenv";

config({ path: ".env" }); // or .env.local

const loginUser = async ({ email, password }: TLoginRequest) => {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (user.length === 0) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user[0].password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET_KEY!, {
    expiresIn: "1h",
  });
  if (!token) {
    throw new Error("Token generation failed");
  }
  return {
    id: user[0].id,
    email: user[0].email,
    name: user[0].name,
    token: token,
  };
};
const registerUser = async (data: TRegisterRequest) => {
  const { email, password, name } = data;
  try {
    const userExists = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (userExists.length > 0) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      email,
      password: hashedPassword,
      name,
    };
    const result = await db.insert(usersTable).values(newUser).returning();
    if (result.length === 0) {
      throw new Error("User registration failed");
    }
    return {
      id: result[0].id,
      name: result[0].name,
      email: result[0].email,
    };
  } catch (error) {
    throw new Error("Error registering user" + error);
  }
};

export default { loginUser, registerUser };
