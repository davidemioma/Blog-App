"use client";

import React from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { VoteType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { getVoteDetails } from "@/lib/data/comment";
import { voteComment } from "@/lib/actions/comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Props = {
  commentId: string;
};

const CommentVote = ({ commentId }: Props) => {
  const { user } = useUser();

  const queryClient = useQueryClient();

  const {
    data: vote,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-vote-details", commentId],
    queryFn: async () => {
      const vote = await getVoteDetails(commentId);

      return vote;
    },
  });

  const isUpvoted = vote?.type === VoteType.UP;

  const isDownvoted = vote?.type === VoteType.DOWN;

  const displayScore =
    (vote?.comment.upvotes || 0) - (vote?.comment.downvotes || 0);

  const { mutate, isPending } = useMutation({
    mutationKey: ["vote-comment"],
    mutationFn: async (voteType: VoteType) => {
      const res = await voteComment({ commentId, voteType });

      return res;
    },
    onMutate: async (voteType) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["get-vote-details", commentId],
      });

      // Snapshot the previous value
      const previousVote = queryClient.getQueryData([
        "get-vote-details",
        commentId,
      ]);

      // Optimistically update the vote
      queryClient.setQueryData(
        ["get-vote-details", commentId],
        (
          oldData: {
            type: VoteType | null;
            comment: { upvotes: number; downvotes: number };
          } | null
        ) => {
          if (!oldData) return oldData;

          const currentUpvotes = oldData.comment.upvotes || 0;
          const currentDownvotes = oldData.comment.downvotes || 0;
          const currentVoteType = oldData.type;

          let newUpvotes = currentUpvotes;
          let newDownvotes = currentDownvotes;
          let newVoteType: VoteType | null = voteType;

          // Handle vote logic
          if (currentVoteType === voteType) {
            // Same vote - remove it
            if (voteType === VoteType.UP) {
              newUpvotes -= 1;
            } else {
              newDownvotes -= 1;
            }
            newVoteType = null;
          } else if (currentVoteType) {
            // Different vote - change it
            if (voteType === VoteType.UP) {
              newUpvotes += 1;
              newDownvotes -= 1;
            } else {
              newUpvotes -= 1;
              newDownvotes += 1;
            }
          } else {
            // No previous vote - add new vote
            if (voteType === VoteType.UP) {
              newUpvotes += 1;
            } else {
              newDownvotes += 1;
            }
          }

          return {
            ...oldData,
            type: newVoteType,
            comment: {
              ...oldData.comment,
              upvotes: newUpvotes,
              downvotes: newDownvotes,
            },
          };
        }
      );

      return { previousVote };
    },
    onError: (err, voteType, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousVote) {
        queryClient.setQueryData(
          ["get-vote-details", commentId],
          context.previousVote
        );
      }

      toast.error(err.message || "Failed to vote comment");
    },
    onSuccess: (res) => {
      toast.success(res.message);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache consistency
      queryClient.invalidateQueries({
        queryKey: ["get-vote-details", commentId],
      });
    },
  });

  const disabled = !user || isLoading || isPending || isError;

  const handleUpvote = () => {
    mutate("UP");
  };

  const handleDownvote = () => {
    mutate("DOWN");
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleUpvote}
        disabled={disabled}
        className={`h-8 px-2 ${
          isUpvoted
            ? "text-green-600 bg-green-50"
            : "text-muted-foreground hover:text-green-600"
        }`}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1 px-2">
        <span
          className={`text-sm font-medium ${
            displayScore > 0
              ? "text-green-600"
              : displayScore < 0
              ? "text-red-600"
              : "text-muted-foreground"
          }`}
        >
          {displayScore}
        </span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownvote}
        disabled={disabled}
        className={`h-8 px-2 ${
          isDownvoted
            ? "text-red-600 bg-red-50"
            : "text-muted-foreground hover:text-red-600"
        }`}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CommentVote;
