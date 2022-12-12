import { Context } from "..";

export const Query = {
  me: async (parent: any, args: any, { userInfo, prisma }: Context) => {
    if (!userInfo) return null;

    return prisma.user.findUnique({ where: { id: userInfo.userId } });
  },
  posts: async (parent: any, args: any, { prisma }: Context) => {
    const posts = await prisma.post.findMany({
      orderBy: [{ createdAt: "desc" }],
    });

    return posts;
  },
};
