import { Context } from "../../index";
import { Post, Prisma } from ".prisma/client";
import { canUserMutatePost } from "../../utils/canUserMutatePost";

interface PostArgs {
  post: {
    title?: string;
    content?: string;
  };
}

interface PostPayloadType {
  userErrors: {
    message: string;
  }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postResolvers = {
  postCreate: async (
    parent: any,
    { post }: PostArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [{ message: "Forbidden access (unauthenticated)" }],
        post: null,
      };
    }

    const { title, content } = post;
    if (!title || !content) {
      return {
        userErrors: [
          { message: "Must provide title and content to create a post" },
        ],
        post: null,
      };
    }

    const postCreate = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userInfo.userId,
      },
    });

    return {
      userErrors: [],
      post: postCreate,
    };
  },
  postUpdate: async (
    parent: any,
    { post, postId }: { postId: string; post: PostArgs["post"] },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [{ message: "Forbidden access (unauthenticated)" }],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: +postId,
      prisma,
    });

    if (error) {
      return error;
    }

    const { title, content } = post;

    if (!title || !content) {
      return {
        userErrors: [{ message: "Need to have at least one field to update" }],
        post: null,
      };
    }

    const existingPost = await prisma.post.findUnique({
      where: {
        id: +postId,
      },
    });

    if (!existingPost) {
      return {
        userErrors: [{ message: "Post does not exist" }],
        post: null,
      };
    }

    let payloadToUpdate = {
      title,
      content,
    };

    if (!title) delete payloadToUpdate.title;
    if (!content) delete payloadToUpdate.content;

    return {
      userErrors: [],
      post: prisma.post.update({
        data: {
          ...payloadToUpdate,
        },
        where: {
          id: +postId,
        },
      }),
    };
  },
  postDelete: async (
    parent: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [{ message: "Forbidden access (unauthenticated)" }],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: +postId,
      prisma,
    });

    if (error) {
      return error;
    }

    const post = await prisma.post.findUnique({
      where: {
        id: +postId,
      },
    });

    if (!post) {
      return {
        userErrors: [{ message: "Post does not exist" }],
        post: null,
      };
    }

    await prisma.post.delete({
      where: {
        id: +postId,
      },
    });

    return {
      userErrors: [],
      post,
    };
  },
};
