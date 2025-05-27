import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "../db/db";
import { TLoginRequest, TRegisterRequest } from "../types";
import { usersTable } from "../db/schema";

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
  return {
    id: user[0].id,
    email: user[0].email,
    name: user[0].name,
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
