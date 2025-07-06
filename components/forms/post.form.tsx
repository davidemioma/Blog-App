"use client";

import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";

import React, { useTransition } from "react";
import { toast } from "sonner";
import FileUpload from "./file-upload";
import { useForm } from "react-hook-form";
import { useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Post, Thumbnail } from "@prisma/client";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { RichTextEditor, Link } from "@mantine/tiptap";
import Placeholder from "@tiptap/extension-placeholder";
import { createPost, updatePost } from "@/lib/actions/post";
import { PostFormValues, PostSchema } from "@/lib/validators/post";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useSearchParams } from "next/navigation";

type Props = {
  post?: Post & {
    thumbnail?: Thumbnail;
  };
  onClose: () => void;
};

const PostForm = ({ post, onClose }: Props) => {
  const searchParams = useSearchParams();

  const query = searchParams.get("query");

  const queryClient = useQueryClient();

  const [isPending, startTransition] = useTransition();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: post?.title || "",
      content: (post?.content as string) || "",
      image: post?.thumbnail?.url || "",
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Highlight,
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Write your post content..." }),
    ],
    content: (post?.content as string) || "",
    editable: !isPending,
    onUpdate: ({ editor }) => {
      form.setValue("content", editor.getHTML(), { shouldValidate: true });
    },
  });

  const onSubmit = async (values: PostFormValues) => {
    startTransition(async () => {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key === "image") {
          formData.append("file", value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      if (post) {
        await updatePost({
          values: formData,
          postId: post.id,
          thumbnailId: post.thumbnail?.id,
        })
          .then((res) => {
            toast.success(res.message);

            queryClient.invalidateQueries({
              queryKey: ["get-post-details", post.id],
            });

            onClose();
          })
          .catch((err) => {
            toast.error(err.message);
          });
      } else {
        await createPost(formData)
          .then((res) => {
            toast.success(res.message);

            form.reset();

            queryClient.invalidateQueries({
              queryKey: ["get-posts", query],
            });

            onClose();
          })
          .catch((err) => {
            toast.error(err.message);
          });
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-xl w-full mx-auto overflow-x-hidden p-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>

              <FormControl>
                <Input
                  placeholder="Enter post title"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail</FormLabel>

              <FormControl>
                <FileUpload
                  value={field.value}
                  setValue={field.onChange}
                  disabled={isPending}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2.5">
          <FormLabel>Content</FormLabel>

          <div className="rounded-md border w-full bg-background focus-within:ring-2 focus-within:ring-violet-400">
            <RichTextEditor editor={editor}>
              <RichTextEditor.Toolbar
                sticky
                stickyOffset="var(--docs-header-height)"
              >
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Underline />
                  <RichTextEditor.Strikethrough />
                  <RichTextEditor.ClearFormatting />
                  <RichTextEditor.Highlight />
                  <RichTextEditor.Code />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H1 />
                  <RichTextEditor.H2 />
                  <RichTextEditor.H3 />
                  <RichTextEditor.H4 />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Blockquote />
                  <RichTextEditor.Hr />
                  <RichTextEditor.BulletList />
                  <RichTextEditor.OrderedList />
                  <RichTextEditor.Subscript />
                  <RichTextEditor.Superscript />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Link />
                  <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.AlignLeft />
                  <RichTextEditor.AlignCenter />
                  <RichTextEditor.AlignJustify />
                  <RichTextEditor.AlignRight />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Undo />
                  <RichTextEditor.Redo />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>

              <RichTextEditor.Content className="h-40 max-h-60 overflow-y-auto" />
            </RichTextEditor>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button type="submit" variant="violet" disabled={isPending}>
            {isPending ? "Posting..." : post ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
