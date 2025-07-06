import { Post, Thumbnail, Comment } from "@prisma/client";

export type PostType = Post & {
  thumbnail: Thumbnail | null;
};

export type CommentProps = Comment & {
  user: {
    id: string;
    username: string;
    image: string;
  };
  votes: {
    type: "UP" | "DOWN";
    userId: string;
  }[];
  _count: {
    votes: number;
  };
};

export type CommentType = CommentProps & {
  isAuthor: boolean;
};
