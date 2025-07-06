"use server";

import prismadb from "../prisma-db";
import { currentUser } from "@clerk/nextjs/server";

export const onBoardUser = async () => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized, Youn need to sign in!");
    }

    const dbUser = await prismadb.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (dbUser) {
      return { user: dbUser, status: 200 };
    }

    const newUser = await prismadb.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        username: user.username || `${user.firstName} ${user.lastName}`,
        image: user.imageUrl,
      },
    });

    return { user: newUser, status: 201 };
  } catch (err) {
    console.error("OnBoard User", err);

    throw new Error("Something went wrong! Internal server error.");
  }
};
