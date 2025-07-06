"use client";

import React from "react";
import { toast } from "sonner";
import { CommentType } from "@/types";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2, X, Check } from "lucide-react";
import { editComment } from "@/lib/actions/comment";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentFormValues, CommentSchema } from "@/lib/validators/comment";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

type Props = {
  comment: CommentType;
  onClose: () => void;
  queryKey: string[];
};

const EditComment = ({ comment, onClose, queryKey }: Props) => {
  const queryClient = useQueryClient();

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      message: comment.message,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["edit-comment"],
    mutationFn: async (values: CommentFormValues) => {
      const res = await editComment({ commentId: comment.id, ...values });

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
              page.map((c: CommentType) =>
                c.id === comment.id
                  ? { ...c, message: form.getValues("message") }
                  : c
              )
            ),
          };
        }
      );

      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to edit comment");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  const handleCancel = () => {
    form.reset();

    onClose();
  };

  const onSubmit = async (values: CommentFormValues) => {
    mutate(values);
  };

  return (
    <div className="w-full space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Edit your comment..."
                    className="min-h-[120px] resize-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isPending}
              className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditComment;
