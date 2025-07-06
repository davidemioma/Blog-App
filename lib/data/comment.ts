"use server";

import prismadb from "../prisma-db";
import { getCurrentUser } from "./auth";
import { CommentFilterType } from "@/hooks/use-comment-filter";

export const getComments = async ({
  postId,
  sortBy,
}: {
  postId: string;
  sortBy: CommentFilterType;
}) => {
  const currentUser = await getCurrentUser();

  const getSortOrder = (sortBy: CommentFilterType) => {
    switch (sortBy) {
      case "new":
        return { createdAt: "desc" as const };
      case "top":
        return { topScore: "desc" as const };
      case "hot":
        return { hotScore: "desc" as const };
      case "controversial":
        return { controversialScore: "desc" as const };
      case "all":
      default:
        return { mainScore: "desc" as const };
    }
  };

  const comments = await prismadb.comment.findMany({
    where: {
      postId,
      commentId: null,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      votes: {
        select: {
          type: true,
          userId: true,
        },
      },
      _count: {
        select: {
          votes: true,
        },
      },
    },
    orderBy: getSortOrder(sortBy),
  });

  return Promise.all(
    comments.map(async (comment) => ({
      ...comment,
      isAuthor: currentUser?.id === comment.userId,
    }))
  );
};

export const getVoteDetails = async (commentId: string) => {
  const currentUser = await getCurrentUser();

  const vote = await prismadb.commentVote.findUnique({
    where: {
      userId_commentId: {
        userId: currentUser?.id as string,
        commentId,
      },
    },
    include: {
      comment: {
        select: {
          upvotes: true,
          downvotes: true,
        },
      },
    },
  });

  return vote;
};

export const getReplies = async ({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) => {
  const currentUser = await getCurrentUser();

  const comments = await prismadb.comment.findMany({
    where: {
      postId,
      commentId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      votes: {
        select: {
          type: true,
          userId: true,
        },
      },
      _count: {
        select: {
          votes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Promise.all(
    comments.map(async (comment) => ({
      ...comment,
      isAuthor: currentUser?.id === comment.userId,
    }))
  );
};
