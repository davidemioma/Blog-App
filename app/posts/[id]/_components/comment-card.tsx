"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { CommentType } from "@/types";
import { formatDate } from "@/lib/utils";
import CommentVote from "./comment-vote";
import { getReplies } from "@/lib/data/comment";
import { Button } from "@/components/ui/button";
import { deleteComment } from "@/lib/actions/comment";
import CommentForm from "@/components/forms/comment.form";
import EditComment from "@/components/forms/edit-comment";
import DeleteModal from "@/components/modals/delete.modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit,
  Trash2,
  Reply,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  Loader2,
  MessageCircle,
} from "lucide-react";

interface CommentCardProps {
  comment: CommentType;
  queryKey: string[];
}

export default function CommentCard({ comment, queryKey }: CommentCardProps) {
  const queryClient = useQueryClient();

  const [showEditForm, setShowEditForm] = useState(false);

  const [showReplyForm, setShowReplyForm] = useState(false);

  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const [showReplies, setShowReplies] = useState(false);

  const {
    data: replies,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-replies", comment.id],
    queryFn: async () => {
      const results = await getReplies({
        postId: comment.postId,
        commentId: comment.id,
      });

      return results;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-comment"],
    mutationFn: async () => {
      const res = await deleteComment(comment.id);

      return res;
    },
    onSuccess: (res) => {
      toast.success(res.message);

      // Optimistic Updates
      queryClient.setQueryData(
        queryKey,
        (oldData: { pages: CommentType[][] } | undefined) => {
          if (!oldData?.pages) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: CommentType[]) =>
              page.filter((c: CommentType) => c.id !== comment.id)
            ),
          };
        }
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete comment");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  return (
    <div className="shadow-sm border-0 bg-background/60 backdrop-blur-sm hover:shadow-md transition-all duration-200">
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.user.image} />

            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-foreground truncate">
                {comment.user.username}
              </span>

              {comment.isAuthor && (
                <div className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                  Author
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />

              <span>{formatDate(comment.createdAt as unknown as string)}</span>
            </div>
          </div>
        </div>

        {/* Comment Message */}
        <div className="mb-4">
          {showEditForm ? (
            <EditComment
              comment={comment}
              queryKey={queryKey}
              onClose={() => setShowEditForm(false)}
            />
          ) : (
            <p className="text-sm text-foreground leading-relaxed">
              {comment.message}
            </p>
          )}
        </div>

        {/* Voting Section */}
        <CommentVote commentId={comment.id} />

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="h-8 px-3 text-muted-foreground hover:text-foreground"
          >
            <Reply className="h-4 w-4 mr-1" />
            Reply
          </Button>

          {comment.isAuthor && (
            <>
              {!showEditForm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowEditForm(true)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}

              <DeleteModal
                variant="ghost"
                size="sm"
                isOpen={showDeleteForm}
                prompt="Delete"
                title="Are you absolutely sure?"
                description="This action cannot be undone. This will permanently delete your comment."
                icon={<Trash2 className="h-4 w-4 mr-1" />}
                onOpenChange={setShowDeleteForm}
                onCancel={() => setShowDeleteForm(false)}
                onContinue={() => {
                  mutate();
                }}
                disabled={isPending}
              />
            </>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mb-4 pl-4 md:pl-6 border-l-2 border-muted">
            <CommentForm
              postId={comment.postId}
              commentId={comment.id}
              queryKey={queryKey}
              closeReply={() => setShowReplyForm(false)}
            />
          </div>
        )}

        {/* Replies */}
        {!isLoading && !isError && replies && replies.length > 0 && (
          <div className="border-t border-muted/50 pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplies(!showReplies)}
              className="h-8 px-3 text-muted-foreground hover:text-foreground"
            >
              {showReplies ? (
                <ChevronUp className="h-4 w-4 mr-1" />
              ) : (
                <ChevronDown className="h-4 w-4 mr-1" />
              )}
              {replies.length} {replies.length === 1 ? "reply" : "replies"}
            </Button>

            {showReplies && (
              <>
                {!isLoading && replies && replies.length > 0 && (
                  <div className="grid grid-cols-1 gap-4">
                    {replies.map((reply) => (
                      <CommentCard
                        key={reply.id}
                        comment={reply}
                        queryKey={["get-replies", comment.id]}
                      />
                    ))}
                  </div>
                )}

                {isLoading && (
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />

                      <p className="text-sm text-muted-foreground">
                        Loading replies...
                      </p>
                    </div>
                  </div>
                )}

                {isError && (
                  <div className="mt-3 pl-4 border-l-2 border-muted/30">
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />

                      <p className="text-sm">Error getting replies</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
