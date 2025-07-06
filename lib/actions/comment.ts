"use server";

import prismadb from "../prisma-db";
import { VoteType } from "@prisma/client";
import { getCurrentUser } from "../data/auth";
import {
  calculateMainScore,
  calculateHotScore,
  calcTopScore,
  calcControversialScore,
} from "./filtering";

export const addComment = async ({
  postId,
  commentId,
  message,
}: {
  postId: string;
  commentId?: string;
  message: string;
}) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized, Youn need to sign in!");
    }

    const comment = await prismadb.comment
      .create({
        data: {
          postId,
          userId: currentUser.id,
          commentId: commentId || undefined,
          message,
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
      })
      .catch((err) => {
        console.error("Add comment prisma error", err);

        throw new Error("Something went wrong! Unable to add comment.");
      });

    return { comment, message: "Comment added!" };
  } catch (err) {
    console.error("addComment Err", err);

    throw new Error("Something went wrong! Internal server error.");
  }
};

export const voteComment = async ({
  commentId,
  voteType,
}: {
  commentId: string;
  voteType: VoteType;
}) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    const result = await prismadb.$transaction(async (tx) => {
      // Get current comment data
      const comment = await tx.comment.findUnique({
        where: { id: commentId },
        select: {
          id: true,
          upvotes: true,
          downvotes: true,
          createdAt: true,
        },
      });

      if (!comment) {
        throw new Error("Comment not found");
      }

      // Check if user already voted on this comment
      const existingVote = await tx.commentVote.findUnique({
        where: {
          userId_commentId: {
            userId: currentUser.id,
            commentId,
          },
        },
      });

      let newUpvotes = comment.upvotes;

      let newDownvotes = comment.downvotes;

      if (existingVote) {
        // User already voted - handle vote change or removal
        if (existingVote.type === voteType) {
          // Same vote type - remove the vote
          await tx.commentVote.delete({
            where: {
              userId_commentId: {
                userId: currentUser.id,
                commentId,
              },
            },
          });

          // Update comment scores
          if (voteType === VoteType.UP) {
            newUpvotes -= 1;
          } else {
            newDownvotes -= 1;
          }
        } else {
          // Different vote type - update the vote
          await tx.commentVote.update({
            where: {
              userId_commentId: {
                userId: currentUser.id,
                commentId,
              },
            },
            data: { type: voteType },
          });

          // Update comment scores
          if (voteType === VoteType.UP) {
            // Changed from DOWN to UP
            newUpvotes += 1;

            newDownvotes -= 1;
          } else {
            // Changed from UP to DOWN
            newUpvotes -= 1;

            newDownvotes += 1;
          }
        }
      } else {
        await tx.commentVote.create({
          data: {
            userId: currentUser.id,
            commentId,
            type: voteType,
          },
        });

        // Update comment scores
        if (voteType === VoteType.UP) {
          newUpvotes += 1;
        } else {
          newDownvotes += 1;
        }
      }

      // Update comment with new scores
      await tx.comment.update({
        where: { id: commentId },
        data: {
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          mainScore: calculateMainScore({
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            createdAt: comment.createdAt,
          }),
          hotScore: calculateHotScore({
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            createdAt: comment.createdAt,
          }),
          topScore: calcTopScore({
            upvotes: newUpvotes,
            downvotes: newDownvotes,
          }),
          controversialScore: calcControversialScore({
            upvotes: newUpvotes,
            downvotes: newDownvotes,
          }),
        },
      });

      return { message: "Vote updated successfully" };
    });

    return result;
  } catch (err) {
    console.error("voteComment Err", err);

    throw new Error("Something went wrong! Internal server error.");
  }
};

export const editComment = async ({
  commentId,
  message,
}: {
  commentId: string;
  message: string;
}) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized, You need to sign in!");
    }

    // Check if comment exists and user is the author
    const existingComment = await prismadb.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        userId: true,
        message: true,
      },
    });

    if (!existingComment) {
      throw new Error("Comment not found");
    }

    if (existingComment.userId !== currentUser.id) {
      throw new Error("Unauthorized, You can only edit your own comments!");
    }

    await prismadb.comment
      .update({
        where: { id: commentId },
        data: { message },
      })
      .catch((err) => {
        console.error("Edit comment prisma error", err);

        throw new Error("Something went wrong! Unable to edit comment.");
      });

    return { message: "Comment updated successfully!" };
  } catch (err) {
    console.error("editComment Err", err);

    throw new Error("Something went wrong! Internal server error.");
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized, You need to sign in!");
    }

    // Check if comment exists and user is the author
    const existingComment = await prismadb.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        userId: true,
        message: true,
      },
    });

    if (!existingComment) {
      throw new Error("Comment not found");
    }

    if (existingComment.userId !== currentUser.id) {
      throw new Error("Unauthorized, You can only delete your own comments!");
    }

    // Delete replies
    await prismadb.comment
      .deleteMany({
        where: {
          commentId,
        },
      })
      .catch((err) => {
        console.error("Delete comment replies prisma error", err);

        throw new Error("Something went wrong! Unable to delete replies.");
      });

    // Delete comments
    await prismadb.comment
      .delete({
        where: { id: commentId },
      })
      .catch((err) => {
        console.error("Delete comment prisma error", err);

        throw new Error("Something went wrong! Unable to delete comment.");
      });

    return { message: "Comment deleted successfully!" };
  } catch (err) {
    console.error("deleteComment Err", err);

    throw new Error("Something went wrong! Internal server error.");
  }
};
