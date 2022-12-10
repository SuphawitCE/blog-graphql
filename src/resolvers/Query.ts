export const Query = {
  posts: async (parent: any, args: any, { prisma }: Context) => {
    const posts = await prisma.post.findMany({
      orderBy: [{ createdAt: "desc" }],
    });

    return posts;
  },
};
