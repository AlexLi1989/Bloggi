import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";

async function createUser({ email, password, username }) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });
    return user;
  } catch (error) {
    //ensure no simultaneous user creation with same email
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("EmailAlreadyExists");
    }
    throw error;
  }
}

async function findUsername({ username }) {
  return (await prisma.user.findUnique({ where: { username: username } }))
    ? true
    : false;
}

async function findUserEmail({ email }) {
  return (await prisma.user.findUnique({ where: { email: email } }))
    ? true
    : false;
}

async function findUser({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) return null;
  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;
  return user;
}

export { createUser, findUsername, findUserEmail, findUser };
