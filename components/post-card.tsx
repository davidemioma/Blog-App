import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PostType } from "@/types";
import { formatDate } from "@/lib/utils";
import { getRandomImage } from "@/lib/data/seed";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  post: PostType;
};

const PostCard = ({ post }: Props) => {
  const imageUrl = post.thumbnail?.url || getRandomImage();

  const excerpt = post.content
    ? post.content.replace(/<[^>]+>/g, "").slice(0, 100) +
      (post.content.length > 100 ? "..." : "")
    : "No description available.";

  return (
    <Link href={`/posts/${post.id}`} className="block group h-full">
      <Card className="transition-all hover:shadow-xl hover:-translate-y-1 h-full flex flex-col cursor-pointer border border-muted/30 bg-background/80 backdrop-blur-md p-0">
        <div className="relative w-full aspect-[16/9] rounded-t-xl overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
        </div>

        <CardHeader className="flex-1 flex flex-col justify-between items-start gap-2 p-4">
          <CardTitle className="text-lg font-bold text-primary line-clamp-2">
            {post.title}
          </CardTitle>

          <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
            {excerpt}
          </p>

          <span className="text-xs text-muted-foreground mt-auto">
            {formatDate(post.createdAt as unknown as string)}
          </span>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default PostCard;
