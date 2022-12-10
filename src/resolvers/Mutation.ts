import { Context } from "../index";

interface PostCreateArgs {
  title: string;
  content: string;
}

export const Mutation = {
  postCreate: async (
    parent: any,
    { title, content }: PostCreateArgs,
    { prisma }: Context
  ) => {
    prisma.post.create({
      data: {
        title,
        content,
        authorId: Date.now(),
      },
    });
  },
};
