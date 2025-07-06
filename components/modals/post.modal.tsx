import React from "react";
import Modal from "./modal";
import PostForm from "../forms/post.form";
import { MantineProvider } from "@mantine/core";
import { Post, Thumbnail } from "@prisma/client";

type Props = {
  post?: Post & {
    thumbnail?: Thumbnail;
  };
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  icon?: React.ReactNode;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "violet";
  size?: "default" | "sm" | "lg" | "icon";
};

const PostModal = ({
  isOpen,
  onOpenChange,
  post,
  onClose,
  icon,
  variant,
  size,
}: Props) => {
  return (
    <Modal
      icon={icon}
      variant={variant}
      size={size}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      prompt={!post ? "Create Post" : "Edit Post"}
      title={!post ? "Create Post" : "Edit Post"}
      description="Share your thoughts, stories, or updates with the community."
    >
      <MantineProvider>
        <PostForm post={post} onClose={onClose} />
      </MantineProvider>
    </Modal>
  );
};

export default PostModal;
