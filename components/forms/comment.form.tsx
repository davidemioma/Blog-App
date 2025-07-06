"use client";

import React from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { addComment } from "@/lib/actions/comment";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, MessageCircle, User } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentFormValues, CommentSchema } from "@/lib/validators/comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

type Props = {
  postId: string;
  commentId?: string;
  queryKey: string[];
  closeReply?: () => void;
};

export default function CommentForm({
  postId,
  commentId,
  closeReply,
  queryKey,
}: Props) {
  const { user } = useUser();

  const queryClient = useQueryClient();

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      message: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-comment"],
    mutationFn: async (values: CommentFormValues) => {
      const res = await addComment({ postId, commentId, ...values });

      return res;
    },
    onSuccess: (res) => {
      toast.success(res.message);

      form.reset();

      queryClient.invalidateQueries({
        queryKey,
      });

      queryClient.invalidateQueries({
        queryKey: ["get-replies", commentId],
      });

      if (closeReply) {
        closeReply();
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add comment");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  const onSubmit = async (data: CommentFormValues) => {
    mutate(data);
  };

  return (
    <div className="shadow-lg bg-background/80 backdrop-blur-sm rounded-lg border-0 p-6">
      <div className="mb-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <MessageCircle className="h-5 w-5" />
          Add a Comment
        </div>
      </div>

      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.imageUrl} />

                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {user?.username || `${user?.firstName} ${user?.lastName}`}
                  </span>
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Share your thoughts on this post..."
                          className="min-h-[120px] resize-none border-muted/50 focus:border-primary/50 transition-colors"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPending || form.formState.isSubmitting}
                className="gap-2 px-6"
              >
                {isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Add Comment
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-3 text-xs text-muted-foreground text-right">
          <span className="text-muted-foreground">
            Share your thoughts and engage with the community
          </span>
        </div>
      </div>
    </div>
  );
}
