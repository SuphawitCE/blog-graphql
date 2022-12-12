import { Context } from "..";
import { userLoader } from "../loaders/userLoader";

interface PostParentType {
  authorId: number;
}

export const Post = {
  user: async (parent: PostParentType, args: any, { prisma }: Context) => {
    return userLoader.load(parent.authorId);
  },
};
