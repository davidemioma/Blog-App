"use client";

import React from "react";
import CommentCard from "./comment-card";
import CommentFilter from "./comment-filter";
import { useQuery } from "@tanstack/react-query";
import { getComments } from "@/lib/data/comment";
import { Loader2, MessageCircle } from "lucide-react";
import { useCommentFilter } from "@/hooks/use-comment-filter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  postId: string;
};

const CommentList = ({ postId }: Props) => {
  const { filter } = useCommentFilter();

  const {
    data: comments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-comments", postId, filter],
    queryFn: async () => {
      const results = await getComments({
        postId,
        sortBy: filter,
      });

      return results;
    },
  });

  const commentSize = comments?.length || 0;

  return (
    <div className="space-y-6">
      <CommentFilter commentCount={commentSize} />

      <Card className="shadow-lg border-0 bg-background/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments
            <span className="text-sm text-muted-foreground font-normal">
              ({commentSize})
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {!isLoading && comments && comments.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  queryKey={["get-comments", comment.postId, filter]}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-6xl mb-4">💭</div>

              <h3 className="text-xl font-semibold mb-2">No comments yet</h3>

              <p className="text-muted-foreground">
                Be the first to share your thoughts on this post!
              </p>
            </div>
          )}

          {isLoading && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />

                <p className="text-sm text-muted-foreground">
                  Loading comments...
                </p>
              </div>
            </div>
          )}

          {isError && (
            <div className="w-full flex items-center justify-center py-8">
              <span className="text-muted-foreground text-center">
                Unable to get posts!
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentList;
