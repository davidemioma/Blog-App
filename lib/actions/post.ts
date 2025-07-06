"use server";

import { v4 as uuidV4 } from "uuid";
import prismadb from "../prisma-db";
import { getCurrentUser } from "../data/auth";
import { deleteFileFromS3, uploadFileToS3 } from "../s3";

export const handleImageField = async ({
  imageField,
}: {
  imageField: FormDataEntryValue | null;
}) => {
  if (!imageField || typeof imageField === "string") return null;

  const file = imageField;

  const fileExt = file.name.split(".").pop();

  const key = `blog-posts/${uuidV4()}.${fileExt}`;

  const arrayBuffer = await file.arrayBuffer();

  //Upload to s3
  const url = await uploadFileToS3({
    key,
    file: Buffer.from(arrayBuffer),
    contentType: file.type,
  });

  if (!url) throw new Error("Unable to upload to s3!");

  return {
    key,
    url,
  };
};

export const createPost = async (values: FormData) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized, Youn need to sign in!");
    }

    // Get fields from FormData
    const title = values.get("title") as string;

    const content = values.get("content") as string;

    const image = values.get("file") as File | string;

    const file = await handleImageField({ imageField: image });

    const post = await prismadb.$transaction(async (tx) => {
      let thumbnail = null;

      if (file && file.key) {
        thumbnail = await tx.thumbnail.create({
          data: {
            key: file.key,
            url: file.url,
          },
        });
      }

      if (!thumbnail) {
        const post = await tx.post.create({
          data: {
            title,
            content,
            userId: currentUser.id,
          },
          select: {
            title: true,
          },
        });

        return post;
      }

      const post = await tx.post.create({
        data: {
          title,
          content,
          userId: currentUser.id,
          thumbnail: {
            connect: {
              id: thumbnail?.id,
            },
          },
        },
        select: {
          title: true,
        },
      });

      return post;
    });

    if (!post) {
      console.error("createPost transaction Err");

      throw new Error("Unable to create post! Internal server error.");
    }

    return {
      message: `Post '${post.title}' was created!`,
    };
  } catch (err) {
    console.error("createPost Err", err);

    throw new Error("Something went wrong! Internal server error.");
  }
};

export const updatePost = async ({
  values,
  postId,
  thumbnailId,
}: {
  values: FormData;
  postId: string;
  thumbnailId?: string;
}) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized, Youn need to sign in!");
    }

    // Get fields from FormData
    const title = values.get("title") as string;

    const content = values.get("content") as string;

    const image = values.get("file") as File | string;

    const file = await handleImageField({
      imageField: image,
    });

    const post = await prismadb.$transaction(async (tx) => {
      const thumbnail = await tx.thumbnail.findUnique({
        where: {
          id: thumbnailId,
          postId,
        },
      });

      if (file && file.key) {
        // Delete previous file from s3
        if (thumbnail) {
          const hasDeleted = await deleteFileFromS3(thumbnail.key);

          if (!hasDeleted) return null;
        }

        await tx.thumbnail.update({
          where: {
            id: thumbnail?.id,
            postId,
          },
          data: {
            key: file.key,
            url: file.url,
          },
        });
      }

      const post = await tx.post.update({
        where: {
          id: postId,
          userId: currentUser.id,
        },
        data: {
          title,
          content,
        },
        select: {
          title: true,
        },
      });

      return post;
    });

    if (!post) {
      console.error("updatePost transaction Err");

      throw new Error("Unable to update post! Internal server error.");
    }

    return {
      message: `Post '${post.title}' was updated!`,
    };
  } catch (err) {
    console.error("updatePost Err", err);

    throw new Error("Something went wrong! Internal server error.");
  }
};

export const deletePost = async ({
  postId,
  thumbnailId,
}: {
  postId: string;
  thumbnailId?: string;
}) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized, Youn need to sign in!");
    }

    const hasDeletedPost = await prismadb.$transaction(async (tx) => {
      // Check if post has thumbnail
      const thumbnail = await tx.thumbnail.findUnique({
        where: {
          id: thumbnailId,
          postId,
        },
      });

      if (thumbnail) {
        // Delete file from s3
        const hasDeleted = await deleteFileFromS3(thumbnail.key);

        if (!hasDeleted) return false;

        // Delete Thumbnail
        await tx.thumbnail
          .delete({
            where: {
              id: thumbnail.id,
              postId,
            },
          })
          .catch((err) => {
            console.error("delete thumbnail tx Err", err);

            return false;
          });
      }

      // Delete Post
      await tx.post
        .delete({
          where: {
            id: postId,
            userId: currentUser.id,
          },
        })
        .catch((err) => {
          console.error("deletePost tx Err", err);

          return false;
        });

      return true;
    });

    if (!hasDeletedPost) {
      console.error("deletePost transaction Err");

      throw new Error("Unable to delete post! Internal server error.");
    }

    return {
      message: `Post was deleted!`,
    };
  } catch (err) {
    console.error("deletePost Err", err);

    throw new Error("Something went wrong! Internal server error.");
  }
};
