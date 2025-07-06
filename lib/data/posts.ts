"use server";

import prismadb from "../prisma-db";
import { getCurrentUser } from "./auth";
import { NUM_OF_RESULTS } from "../utils";

export const getPosts = async ({
  query,
  page,
}: {
  query: string;
  page: number;
}) => {
  let posts = [];

  if (query) {
    posts = await prismadb.post.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        thumbnail: true,
      },
      take: NUM_OF_RESULTS,
      skip: (page - 1) * NUM_OF_RESULTS,
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    posts = await prismadb.post.findMany({
      include: {
        thumbnail: true,
      },
      take: NUM_OF_RESULTS,
      skip: (page - 1) * NUM_OF_RESULTS,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return posts;
};

export const getPostDetail = async (id: string) => {
  const currentUser = await getCurrentUser();

  const post = await prismadb.post.findUnique({
    where: {
      id,
    },
    include: {
      thumbnail: true,
    },
  });

  return { ...post, isAuthor: currentUser?.id === post?.userId };
};
