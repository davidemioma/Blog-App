"use client";

import { Suspense, useEffect } from "react";
import { PostType } from "@/types";
import { getPosts } from "@/lib/data/posts";
import PostCard from "@/components/post-card";
import { Loader2, FileText } from "lucide-react";
import { useSearchParams } from "next/navigation";
import EmptyState from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import useUnlimitedScrolling from "@/hooks/use-unlimited-scrolling";

const PostSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-48 w-full rounded-lg" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <main className="w-full p-5">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  </main>
);

function HomeContent() {
  const searchParams = useSearchParams();

  const query = searchParams.get("query");

  const {
    ref,
    entry,
    data,
    isError,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useUnlimitedScrolling({
    key: ["get-posts", query as string],
    queryFn: async ({ pageParam = 1 }) => {
      const results = await getPosts({
        query: query as string,
        page: pageParam,
      });

      return results;
    },
  });

  const posts: PostType[] = data?.pages?.flatMap((page) => page) ?? [];

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!isLoading && posts && posts.length === 0) {
    return (
      <EmptyState
        title="No posts yet"
        description="Be the first to share your thoughts and stories with the community."
        icon={<FileText className="w-12 h-12" />}
      />
    );
  }

  return (
    <main className="w-full p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {posts.map((post, i) => {
          if (i === posts.length - 1) {
            return (
              <div ref={ref} key={post.id}>
                <PostCard post={post} />
              </div>
            );
          } else {
            return <PostCard key={post.id} post={post} />;
          }
        })}
      </div>

      {isFetchingNextPage && (
        <div className="py-5 w-full flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}

      {isError && (
        <div className="w-full flex items-center justify-center py-5">
          <span className="text-muted-foreground text-center">
            Unable to get posts!
          </span>
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
