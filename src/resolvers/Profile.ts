import { Context } from "..";

interface ProfileParentType {
  id: number;
  bio: string;
  userId: number;
}

export const Profile = {
  user: async (
    parent: ProfileParentType,
    args: any,
    { userInfo, prisma }: Context
  ) => {
    return prisma.user.findUnique({ where: { id: parent.userId } });
  },
};
