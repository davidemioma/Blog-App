"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { useEditor } from "@tiptap/react";
import { useParams, useRouter } from "next/navigation";
import StarterKit from "@tiptap/starter-kit";
import { MantineProvider } from "@mantine/core";
import { Button } from "@/components/ui/button";
import { deletePost } from "@/lib/actions/post";
import { getPostDetail } from "@/lib/data/posts";
import { RichTextEditor } from "@mantine/tiptap";
import { getRandomImage } from "@/lib/data/seed";
import { Post, Thumbnail } from "@prisma/client";
import CommentList from "./_components/comment-list";
import PostModal from "@/components/modals/post.modal";
import CommentForm from "@/components/forms/comment.form";
import DeleteModal from "@/components/modals/delete.modal";
import { Calendar, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCommentFilter } from "@/hooks/use-comment-filter";

export default function PostDetailsPage() {
  const { id } = useParams();

  const router = useRouter();

  const queryClient = useQueryClient();

  const { filter } = useCommentFilter();

  const [openEdit, setOpenEdit] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-post-details", id],
    queryFn: async () => {
      const post = await getPostDetail(id as string);

      return post;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["edit-post", id],
    mutationFn: async () => {
      const res = await deletePost({
        postId: post?.id as string,
        thumbnailId: post?.thumbnail?.id,
      });

      return res;
    },
    onSuccess: (res) => {
      toast.success(res.message);

      queryClient.invalidateQueries({
        queryKey: ["get-posts"],
      });

      setOpenDelete(false);

      router.push("/");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: post?.content || "",
    editable: false,
  });

  useEffect(() => {
    if (post?.content && editor) {
      editor.commands.setContent(post.content);
    }
  }, [post?.content, editor]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mb-4" />

              <div className="h-96 bg-muted rounded-lg mb-6" />

              <div className="h-6 bg-muted rounded w-1/2 mb-2" />

              <div className="h-4 bg-muted rounded w-3/4 mb-4" />

              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-destructive text-6xl mb-4">⚠️</div>

            <h2 className="text-2xl font-bold mb-2">Error Loading Post</h2>

            <p className="text-muted-foreground mb-4">
              Something went wrong while loading this post.
            </p>

            <Button asChild>
              <Link href="/">Go Back Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-muted-foreground text-6xl mb-4">📄</div>

            <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>

            <p className="text-muted-foreground mb-4">
              The post you&apos;re looking for doesn&apos;t exist.
            </p>

            <Button asChild>
              <Link href="/">Go Back Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const imageUrl = post.thumbnail?.url || getRandomImage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Posts
              </Link>
            </Button>
          </div>

          <Card className="mb-8 shadow-lg border-0 bg-background/80 backdrop-blur-sm">
            <div className="relative w-full h-96 md:h-[500px] rounded-t-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt={post.title || "Thumbnail"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>

            <CardHeader className="px-6 pt-6">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.createdAt as unknown as string)}</span>
                </div>
              </div>

              <CardTitle className="text-3xl md:text-4xl font-bold text-primary leading-tight">
                {post.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              {post && post.isAuthor && (
                <div className="flex gap-3 mb-6">
                  <PostModal
                    icon={<Edit className="h-4 w-4" />}
                    variant="default"
                    isOpen={openEdit}
                    onOpenChange={setOpenEdit}
                    onClose={() => setOpenEdit(false)}
                    post={
                      post as Post & {
                        thumbnail?: Thumbnail;
                      }
                    }
                  />

                  <DeleteModal
                    title="Are you absolutely sure?"
                    description="This action cannot be undone. This will permanently delete your post"
                    prompt="Delete Post"
                    icon={<Trash2 className="h-4 w-4" />}
                    variant="destructive"
                    isOpen={openDelete}
                    onOpenChange={setOpenDelete}
                    onCancel={() => setOpenDelete(false)}
                    onContinue={() => {
                      mutate();
                    }}
                    disabled={isPending}
                  />
                </div>
              )}

              <MantineProvider>
                <div className="prose prose-lg max-w-none">
                  <RichTextEditor
                    editor={editor}
                    styles={{
                      root: {
                        border: "none",
                        backgroundColor: "transparent",
                      },
                      content: {
                        fontSize: "1.125rem",
                        lineHeight: "1.75",
                        color: "hsl(var(--foreground))",
                      },
                    }}
                  >
                    <RichTextEditor.Content />
                  </RichTextEditor>
                </div>
              </MantineProvider>
            </CardContent>
          </Card>

          <div className="border-t border-border my-8" />

          <CommentForm
            postId={post.id as string}
            queryKey={["get-comments", post.id as string, filter]}
          />

          <div className="border-t border-border my-8" />

          <CommentList postId={post.id as string} />
        </div>
      </div>
    </div>
  );
}
