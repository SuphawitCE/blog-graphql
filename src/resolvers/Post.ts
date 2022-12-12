import { Context } from "..";

interface PostParentType {
  authorId: number;
}

export const Post = {
  user: async (parent: PostParentType, args: any, { prisma }: Context) => {
    return prisma.user.findUnique({ where: { id: parent.authorId } });
  },
};
